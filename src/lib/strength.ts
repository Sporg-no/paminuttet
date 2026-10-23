// Utregning av arbeidsvekter fra personlige maks. Delt mellom server og nettleser.
export type LiftId = 'knebøy' | 'frontknebøy' | 'markløft' | 'benkpress' | 'press' | 'pushpress' | 'clean';
export const LIFTS: { id: LiftId; label: string }[] = [
  { id: 'knebøy', label: 'Knebøy' },
  { id: 'frontknebøy', label: 'Frontknebøy' },
  { id: 'markløft', label: 'Markløft' },
  { id: 'benkpress', label: 'Benkpress' },
  { id: 'press', label: 'Strict press' },
  { id: 'pushpress', label: 'Push press' },
  { id: 'clean', label: 'Power clean' },
];
export type Pr = { lift: LiftId; kg: number; reps: number };

/** Beregnet 1RM (Epley). 1 rep = selve vekten. */
export const e1rm = (kg: number, reps: number) => (reps <= 1 ? kg : kg * (1 + reps / 30));
const round25 = (x: number) => Math.round(x / 2.5) * 2.5;
const fmtKg = (x: number) => (Number.isInteger(x) ? String(x) : x.toFixed(1).replace('.', ','));

/** Hvilket løft en styrkelinje gjelder, ut fra linja og B-tittelen. */
export function liftOf(title: string, line: string): LiftId | null {
  const s = `${line} ${title}`.toLowerCase();
  if (/clean/.test(s)) return 'clean';
  if (/benkpress/.test(s)) return 'benkpress';
  if (/push press/.test(s)) return 'pushpress';
  if (/strict press/.test(s)) return 'press';
  if (/markløft/.test(s) && !/rumensk|kb-markløft/.test(s)) return 'markløft';
  if (/frontknebøy/.test(s)) return 'frontknebøy';
  if (/knebøy/.test(s) && !/goblet/.test(s)) return 'knebøy';
  return null;
}

/** Legger på «≈ X kg» etter hver prosent i linja. Grunnmur-linjer og «+10 %» berøres ikke. */
export function withKg(line: string, oneRm: number) {
  if (/^grunnmur/i.test(line.trim())) return line;
  return line.replace(/(^|[^+\d,])(\d+(?:,\d+)?)\s?%/g, (m, pre: string, num: string) => {
    const pct = Number(num.replace(',', '.'));
    if (!(pct > 0 && pct <= 110)) return m;
    return `${pre}${num} % (≈ ${fmtKg(round25((oneRm * pct) / 100))} kg)`;
  });
}
