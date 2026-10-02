// Gjør tekstene kalender-nøytrale: «uke 1/4/5/8» i øktene blir relative («forrige uke», «testuka om tre uker» …),
// fordi medlemmene ser kalenderuker (uke 41, 42 …), ikke programuker.
import fs from 'node:fs';

export function relabel(s) {
  return s
    .replace(/tyngre enn uke \d/g, 'tyngre enn forrige uke')
    .replace(/fra uke \d hvis/g, 'fra forrige uke hvis')
    .replace(/der uke \d føltes/g, 'der forrige uke føltes')
    .replace(/Gjentas i uke \d/g, 'Gjentas i testuka om tre uker')
    .replace(/samme nivå som uke \d/g, 'samme nivå som for tre uker siden')
    .replace(/Sammenlign med uke 4/g, 'Sammenlign med forrige testuke')
    .replace(/Sammenlign med uke \d/g, 'Sammenlign med økta for tre uker siden')
    .replace(/endte på i uke \d/g, 'endte på i forrige testuke')
    .replace(/Gjenta testene fra uke 4 og øktene fra uke 5\./g, 'Gjenta testene fra forrige testuke og øktene fra for tre uker siden.');
}

if (process.argv[1].endsWith('relabel-weeks.mjs')) {
  for (const f of ['src/content/program.json', 'content/weeks5to8.mjs']) {
    const before = fs.readFileSync(f, 'utf8');
    const after = relabel(before);
    fs.writeFileSync(f, after);
    console.log(f, before === after ? 'uendret' : 'oppdatert');
  }
}
