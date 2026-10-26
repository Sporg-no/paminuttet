import data from '@/content/program.json';
import release from '@/content/release.json';

export type Timer =
  | { t: 'emom'; m: number }
  | { t: 'amrap'; m: number }
  | { t: 'every'; each: number; rounds: number }
  | { t: 'up'; cap: number };
export type Row = [string, string, string, string, string, string];
export type Day = {
  short: string; day: string; name: string; dur: string;
  optional?: boolean; benchmark?: boolean;
  A: string[];
  B: { t: string; l: string[] } | null;
  C: { fmt: string; timer: Timer; rows: Row[]; score: string };
  D: string[];
};
export type Week = { n: number; title: string; intro: string; gym: Day[]; home: Day[] };

export const WEEKS = (data as unknown as { weeks: Week[] }).weeks;
export const LEVELS = ['Grunnmur', 'Nivå 1', 'Nivå 2', 'Nivå 3', 'Nivå 4'];

const WEEK_MS = 7 * 24 * 3600 * 1000;
export function programStart() {
  return new Date(process.env.PROGRAM_START || '2026-10-04T18:00:00Z');
}
/** Siste godkjente uke, talt fra programstart (1, 2, 3 …). Nye uker vises først når denne økes. */
export const RELEASED_THROUGH = Math.max(1, Number((release as { releasedThrough: number }).releasedThrough) || 1);

/**
 * Kalender: ny uke kan slippes hver søndag kl. 20 (PROGRAM_START + n uker), men bare hvis den er godkjent
 * i src/content/release.json. Når alle ukene i program.json er brukt, starter en ny syklus fra uke 1.
 * abs = løpenummer på uka siden start (1 = første uke).
 */
/** UTC-forskyvning i minutter for norsk tid på et gitt tidspunkt (60 om vinteren, 120 om sommeren). */
function osloOffsetMin(d: Date) {
  const s = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Oslo', timeZoneName: 'shortOffset' }).formatToParts(d)
    .find(p => p.type === 'timeZoneName')?.value ?? 'GMT+1';
  const m = s.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) : 60;
}
/** Slipptidspunktet for programuke nr. k+1 (k = 0 er første uke): søndag kl. 20 norsk tid, også etter skifte mellom sommer- og vintertid. */
export function releaseAt(k: number) {
  const s = programStart();
  const naive = new Date(s.getTime() + k * WEEK_MS);
  return new Date(naive.getTime() + (osloOffsetMin(s) - osloOffsetMin(naive)) * 60000);
}

export function schedule(now = new Date()) {
  const L = WEEKS.length;
  const diff = now.getTime() - programStart().getTime();
  const beforeStart = diff < 0;
  let calendarAbs = beforeStart ? 1 : Math.floor(diff / WEEK_MS) + 1;
  // Ved vintertid kommer slippet en time senere i UTC enn den naive utregningen
  if (!beforeStart && calendarAbs > 1 && now < releaseAt(calendarAbs - 1)) calendarAbs -= 1;
  const abs = Math.min(calendarAbs, RELEASED_THROUGH);
  const weekIdx = (abs - 1) % L;
  return { cycle: Math.floor((abs - 1) / L) + 1, weekIdx, visible: weekIdx + 1, beforeStart, abs, waiting: calendarAbs > RELEASED_THROUGH };
}
export function nextRelease(now = new Date()) {
  const s = programStart().getTime();
  if (now.getTime() < s) return new Date(s);
  let k = Math.floor((now.getTime() - s) / WEEK_MS) + 1;
  if (k > 1 && now < releaseAt(k - 1)) k -= 1;
  return releaseAt(k);
}

/** ISO-ukenummer (norsk ukenummer) for en dato. */
export function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - y0.getTime()) / 864e5 + 1) / 7);
}
/** Kalenderuka (uke 41, 42 …) som programuke nr. abs (1 = første) gjelder for. Uka slippes søndag kveld og gjelder mandag–lørdag. */
export function calendarWeekForAbs(abs: number) {
  return isoWeek(new Date(programStart().getTime() + (abs - 1) * WEEK_MS + 864e5));
}
