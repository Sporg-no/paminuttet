import 'server-only';
import { siteUrl, CONTACT } from '@/lib/env';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Enkel e-postmal i merkevarens stil. Tabeller og inline-stil for at den skal se lik ut i alle e-postprogrammer. */
export function layout(o: { eyebrow: string; title: string; paragraphs: string[]; cta?: { label: string; href: string }; list?: string[]; after?: string[] }) {
  const p = o.paragraphs.map(t => `<p style="margin:0 0 14px;font:16px/1.55 Arial,Helvetica,sans-serif;color:#3F3B35">${esc(t)}</p>`).join('');
  const list = o.list?.length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 18px">${o.list.map(l => `<tr><td style="padding:4px 10px 4px 0;vertical-align:top"><div style="width:8px;height:8px;background:#FF5A1F;margin-top:6px"></div></td><td style="font:15px/1.5 Arial,Helvetica,sans-serif;color:#121212">${esc(l)}</td></tr>`).join('')}</table>` : '';
  const cta = o.cta ? `<a href="${o.cta.href}" style="display:inline-block;background:#FF5A1F;color:#121212;font:bold 16px Arial,Helvetica,sans-serif;text-decoration:none;padding:14px 26px;border-radius:999px;margin:6px 0 10px">${esc(o.cta.label)}</a>` : '';
  const after = (o.after ?? []).map(t => `<p style="margin:14px 0 0;font:14px/1.5 Arial,Helvetica,sans-serif;color:#5E594F">${t}</p>`).join('');
  return `<!doctype html><html lang="nb"><body style="margin:0;background:#F3F0E8">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F0E8"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="background:#121212;padding:18px 24px;border-radius:18px 18px 0 0"><span style="font:800 22px Arial Narrow,Arial,sans-serif;letter-spacing:.04em;color:#F3F0E8">PÅ <span style="color:#FF5A1F">MINUTTET</span></span></td></tr>
<tr><td style="background:#FBF9F4;padding:28px 24px;border:1px solid #D8D2C4;border-top:0;border-radius:0 0 18px 18px">
<div style="font:bold 12px Courier New,monospace;letter-spacing:.14em;color:#C2410C;text-transform:uppercase;margin-bottom:8px">${esc(o.eyebrow)}</div>
<h1 style="margin:0 0 16px;font:800 30px/1.05 Arial Narrow,Arial,sans-serif;text-transform:uppercase;color:#121212">${esc(o.title)}</h1>
${p}${list}${cta}${after}
</td></tr>
<tr><td style="padding:16px 8px;font:12px/1.5 Arial,Helvetica,sans-serif;color:#6E695F">PÅ MINUTTET · Erlend Namsvatn ENK · Org.nr 914 829 216 · Kvernbakken 175, 4355 Kverneland · <a href="mailto:${CONTACT}" style="color:#6E695F">${CONTACT}</a></td></tr>
</table></td></tr></table></body></html>`;
}

export function welcomeEmail(o: { trialEnd: Date | null; price: string }) {
  const site = siteUrl();
  const dato = o.trialEnd ? o.trialEnd.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', timeZone: 'Europe/Oslo' }) : null;
  const paragraphs = [
    'Medlemskapet ditt er i gang. Ukens program ligger klart, med fem nivåer og innebygd timer.',
    'Slik kommer du i gang:',
  ];
  const list = [
    'Velg Gym eller Hjemme øverst i programmet. Du kan bytte når du vil.',
    'Velg nivået som gir deg 15–20 sekunder hvile hvert minutt.',
    'Trykk Start klokka og følg raden som lyser.',
    'Ny uke kommer hver søndag kveld.',
  ];
  const after = dato
    ? [`Prøveperioden varer til ${dato}. Da trekkes ${o.price}, med mindre du avslutter under Min side før det. Du får en påminnelse på e-post på forhånd.`]
    : [];
  return {
    subject: 'Velkommen til PÅ MINUTTET',
    text: `Velkommen!\n\nMedlemskapet ditt er i gang. Ukens program: ${site}/program\n\n${list.map(l => '- ' + l).join('\n')}\n\n${after.join('\n')}\n\nDu logger inn med e-posten din på ${site}/logg-inn. Ingen passord.\n\nHilsen PÅ MINUTTET`,
    html: layout({ eyebrow: 'Velkommen', title: 'Første minutt er ditt.', paragraphs, list, cta: { label: 'Åpne ukens program', href: `${site}/program` },
      after: [...after.map(esc), 'Du logger inn med e-posten din. Ingen passord.'] }),
  };
}

export function trialEndingEmail(o: { dato: string; price: string }) {
  const site = siteUrl();
  return {
    subject: `Prøveperioden din slutter ${o.dato}`,
    text: `Hei!\n\nPrøveperioden din hos PÅ MINUTTET slutter ${o.dato}. Da trekkes ${o.price} fra kortet ditt, og medlemskapet fortsetter.\n\nVil du ikke fortsette, avslutter du under Min side før ${o.dato}: ${site}/min-side\n\nHilsen PÅ MINUTTET`,
    html: layout({
      eyebrow: 'Påminnelse', title: `Prøveperioden slutter ${o.dato}.`,
      paragraphs: [`Da trekkes ${o.price} fra kortet ditt, og medlemskapet fortsetter som før.`, `Vil du ikke fortsette, avslutter du under Min side før ${o.dato}. Da trekkes ingenting.`],
      cta: { label: 'Gå til Min side', href: `${site}/min-side` },
    }),
  };
}

export function leadEmail() {
  const site = siteUrl();
  const pdf = `${site}/media/PA-MINUTTET-20-EMOM-er.pdf`;
  return {
    subject: '20 EMOM-er du rekker før ungene våkner',
    text: `Her er PDF-en: ${pdf}\n\n10–20 minutter hver. Kroppsvekt, én kettlebell eller to manualer. Tre nivåer i hver økt.\n\nVil du ha en ny økt hver dag, med timer og fem nivåer? Prøv 7 dager gratis: ${site}/start\n\nHilsen PÅ MINUTTET`,
    html: layout({
      eyebrow: 'Gratis PDF', title: '20 EMOM-er. Klare til bruk.',
      paragraphs: ['10–20 minutter hver. Kroppsvekt, én kettlebell eller to manualer. Tre nivåer i hver økt, og de fleste er stille nok til at ingen våkner.'],
      cta: { label: 'Last ned PDF-en', href: pdf },
      after: [`Vil du ha en ny økt hver dag, med timer og fem nivåer? <a href="${site}/start" style="color:#C2410C">Prøv 7 dager gratis</a>.`],
    }),
  };
}

export function newWeekEmail(o: { weekN: number; title: string; intro: string; days: string[] }) {
  const site = siteUrl();
  return {
    subject: `Uke ${o.weekN} er klar: ${o.title}`,
    text: `Uke ${o.weekN} · ${o.title}\n\n${o.intro}\n\n${o.days.map(d => '- ' + d).join('\n')}\n\nÅpne programmet: ${site}/program\n\nHilsen PÅ MINUTTET`,
    html: layout({ eyebrow: `Uke ${o.weekN} · ${o.title}`, title: 'Ny uke er klar.', paragraphs: [o.intro], list: o.days, cta: { label: 'Se ukens program', href: `${site}/program` } }),
  };
}
