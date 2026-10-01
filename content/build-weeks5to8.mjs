// Legger uke 5–8 inn i src/content/program.json (erstatter eventuelle eksisterende uke 5–8).
import fs from 'node:fs';
import { W5, W6, W7, buildW8 } from './weeks5to8.mjs';

const file = new URL('../src/content/program.json', import.meta.url);
const prog = JSON.parse(fs.readFileSync(file, 'utf8'));
const base = prog.weeks.slice(0, 4);
const W8 = buildW8(base[3], W5);
const add = [W5, W6, W7, W8].map((w, i) => ({ n: 5 + i, title: w.title, intro: w.intro, gym: w.gym, home: w.home }));

const errs = [];
for (const w of add) for (const tr of ['gym', 'home']) {
  if (w[tr].length !== 6) errs.push(`Uke ${w.n} ${tr}: ${w[tr].length} dager`);
  for (const d of w[tr]) {
    const id = `Uke ${w.n} ${tr} ${d.day}`;
    for (const k of ['short', 'day', 'name', 'dur', 'A', 'C', 'D']) if (d[k] === undefined) errs.push(`${id}: mangler ${k}`);
    for (const row of d.C.rows) if (row.length !== 6) errs.push(`${id}: rad «${row[0]}» har ${row.length} kolonner`);
    const T = d.C.timer;
    if (T.t === 'emom' && T.m % d.C.rows.length) errs.push(`${id}: EMOM ${T.m} går ikke opp med ${d.C.rows.length} rader`);
    if (T.t === 'every' && !(T.each > 0 && T.rounds > 0)) errs.push(`${id}: ugyldig every`);
  }
}
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
prog.weeks = base.concat(add);
fs.writeFileSync(file, JSON.stringify(prog, null, 1));
console.log(prog.weeks.map(w => `Uke ${w.n} ${w.title}: ${w.gym.map(d => d.name).join(', ')} | ${w.home.map(d => d.name).join(', ')}`).join('\n'));
