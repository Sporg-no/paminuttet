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
export function schedule(now = new Date()) {
  const L = WEEKS.length;
  const diff = now.getTime() - programStart().getTime();
  const beforeStart = diff < 0;
  const calendarAbs = beforeStart ? 1 : Math.floor(diff / WEEK_MS) + 1;
  const abs = Math.min(calendarAbs, RELEASED_THROUGH);
  const weekIdx = (abs - 1) % L;
  return { cycle: Math.floor((abs - 1) / L) + 1, weekIdx, visible: weekIdx + 1, beforeStart, abs, waiting: calendarAbs > RELEASED_THROUGH };
}
export function nextRelease(now = new Date()) {
  const s = programStart().getTime();
  if (now.getTime() < s) return new Date(s);
  const k = Math.floor((now.getTime() - s) / WEEK_MS) + 1;
  return new Date(s + k * WEEK_MS);
}
