import data from '@/content/program.json';

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
/**
 * Kalender: ny uke slippes hver søndag kl. 20 (PROGRAM_START + n uker).
 * Når alle ukene i program.json er brukt, starter en ny syklus fra uke 1.
 */
export function schedule(now = new Date()) {
  const L = WEEKS.length;
  const diff = now.getTime() - programStart().getTime();
  if (diff < 0) return { cycle: 1, weekIdx: 0, visible: 1, beforeStart: true };
  const k = Math.floor(diff / WEEK_MS);
  const weekIdx = k % L;
  return { cycle: Math.floor(k / L) + 1, weekIdx, visible: weekIdx + 1, beforeStart: false };
}
export function nextRelease(now = new Date()) {
  const s = programStart().getTime();
  if (now.getTime() < s) return new Date(s);
  const k = Math.floor((now.getTime() - s) / WEEK_MS) + 1;
  return new Date(s + k * WEEK_MS);
}
