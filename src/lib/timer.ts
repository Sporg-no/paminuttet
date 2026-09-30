import type { Day } from './program';

export const pad2 = (n: number) => (n < 10 ? '0' : '') + n;
export const mmss = (x: number) => Math.floor(x / 60) + ':' + pad2(x % 60);

export type TimerState = { big: string; label: string; task: string; taskVal: string; activeRow: number; done: boolean; e: number; total: number };

/** col = 5 − nivåindeks (Grunnmur=0 → kolonne 5) */
export function timerState(C: Day['C'], col: number, e0: number): TimerState {
  const T = C.timer;
  let e = e0;
  const out: TimerState = { big: '0:00', label: '', task: '', taskVal: '', activeRow: -1, done: false, e, total: 0 };
  if (T.t === 'emom') {
    const total = T.m * 60; out.total = total;
    if (e >= total) { out.done = true; e = total; }
    const mi = Math.floor(e / 60), sim = e % 60;
    out.big = out.done ? '0:00' : mmss(60 - sim);
    out.label = out.done ? `FERDIG · ${T.m} MINUTTER` : `MINUTT ${mi + 1} AV ${T.m}`;
    if (!out.done) {
      out.activeRow = mi % C.rows.length;
      out.task = C.rows[out.activeRow][0].replace(/^\d+:\s*/, '');
      out.taskVal = C.rows[out.activeRow][col];
    }
  } else if (T.t === 'amrap') {
    const tot = T.m * 60; out.total = tot;
    if (e >= tot) { out.done = true; e = tot; }
    out.big = mmss(tot - e);
    out.label = out.done ? 'FERDIG · LOGG RUNDER + REPS' : `AMRAP · ${T.m} MINUTTER`;
    out.task = 'Så mange runder som mulig';
  } else if (T.t === 'every') {
    const tt = T.each * T.rounds; out.total = tt;
    if (e >= tt) { out.done = true; e = tt; }
    const ri = Math.min(T.rounds - 1, Math.floor(e / T.each)), inR = e % T.each;
    out.big = out.done ? '0:00' : mmss(T.each - inR);
    out.label = out.done ? `FERDIG · ${T.rounds} RUNDER` : `RUNDE ${ri + 1} AV ${T.rounds}`;
    out.task = 'Ny runde starter når klokka når 0:00';
  } else {
    const cap = T.cap ? T.cap * 60 : 0; out.total = cap;
    if (cap && e >= cap) { out.done = true; e = cap; }
    out.big = mmss(e);
    out.label = out.done ? 'TIDSGRENSEN ER NÅDD' : cap ? `FOR TID · TIDSGRENSE ${T.cap}:00` : 'STOPPEKLOKKE';
    out.task = 'Stopp klokka når du er ferdig';
  }
  out.e = e;
  return out;
}
