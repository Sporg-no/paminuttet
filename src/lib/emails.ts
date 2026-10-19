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
    text: `Velkommen!\n\nMedlemskapet ditt er i gang. Ukens program: ${site}/program\n\n${list.map(l => '- ' + l).join('\n')}\n\n${after.join('\n')}\n\nLag et passord inne på siden, eller logg inn med Google: ${site}/logg-inn\n\nHilsen PÅ MINUTTET`,
    html: layout({ eyebrow: 'Velkommen', title: 'Første minutt er ditt.', paragraphs, list, cta: { label: 'Åpne ukens program', href: `${site}/program` },
      after: [...after.map(esc), 'Lag et passord inne på siden, eller logg inn med Google. Du forblir innlogget på enheten.'] }),
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

/** Oppfølging av PDF-leads. Steg 1 to dager etter nedlasting, steg 2 tre dager senere. */
export function leadNurtureEmail(step: 1 | 2, o: { unsubUrl: string; promo: string | null }) {
  const site = siteUrl();
  const start = `${site}/start`;
  const unsubHtml = `Du får denne fordi du lastet ned gratis-PDF-en. <a href="${o.unsubUrl}" style="color:#6E695F">Meld deg av</a>.`;
  const unsubText = `Du får denne fordi du lastet ned gratis-PDF-en. Meld deg av: ${o.unsubUrl}`;
  if (step === 1) {
    const paragraphs = [
      'Hei! Erlend her, jeg lager PÅ MINUTTET. Du lastet ned PDF-en med 20 EMOM-er for noen dager siden.',
      'Har du testet en av øktene? Svar gjerne på denne e-posten og si hvilken. Jeg leser alle svar selv.',
      'Vil du slippe å velge økt selv, ligger det en ny økt klar hver dag i medlemskapet. Gym eller hjemme, fem nivåer, og en timer som teller minuttene for deg. De første 7 dagene er gratis, og du avslutter når du vil.',
      ...(o.promo ? [o.promo] : []),
    ];
    return {
      subject: 'Hvilken økt tok du?',
      text: `${paragraphs.join('\n\n')}\n\nPrøv 7 dager gratis: ${start}\n\nHilsen Erlend, PÅ MINUTTET\n\n${unsubText}`,
      html: layout({ eyebrow: 'Fra Erlend', title: 'Hvilken økt tok du?', paragraphs, cta: { label: 'Prøv 7 dager gratis', href: start }, after: [unsubHtml] }),
    };
  }
  const list = [
    'En ferdig økt hver dag, 25–45 minutter. Ingen planlegging.',
    'Fem nivåer, fra Grunnmur for nybegynnere til nivå 4 for de sprekeste.',
    'Trykk på en øvelse for forklaring og video.',
    'Timeren ligger i økta. Du følger raden som lyser.',
    'Hjemme-sporet trenger bare gulv, en stol og et bord.',
  ];
  const paragraphs = ['PDF-en har 20 økter. Medlemskapet har en ny hver dag, og et opplegg som bygger seg opp uke for uke.'];
  return {
    subject: 'Slik ser en uke i PÅ MINUTTET ut',
    text: `${paragraphs[0]}\n\n${list.map(l => '- ' + l).join('\n')}\n\n${o.promo ? o.promo + '\n\n' : ''}Prøv 7 dager gratis: ${start}\n\nHilsen Erlend, PÅ MINUTTET\n\n${unsubText}`,
    html: layout({ eyebrow: 'Slik fungerer det', title: 'Slik ser en uke ut.', paragraphs: [...paragraphs], list, cta: { label: 'Prøv 7 dager gratis', href: start },
      after: [...(o.promo ? [esc(o.promo)] : []), unsubHtml] }),
  };
}

/** Personlig melding fra utboksen: ren tekst, avsnitt adskilt med tom linje. */
export function personalEmail(body: string) {
  const paras = body.split(/\n{2,}/).map(t => `<p style="margin:0 0 14px;font:16px/1.55 Arial,Helvetica,sans-serif;color:#121212">${esc(t).replace(/\n/g, '<br>')}</p>`).join('');
  return `<!doctype html><html lang="nb"><body style="margin:0;background:#FFFFFF"><div style="max-width:560px;padding:20px 16px">${paras}
<p style="margin:24px 0 0;font:12px/1.5 Arial,Helvetica,sans-serif;color:#6E695F">PÅ MINUTTET · Erlend Namsvatn ENK · Org.nr 914 829 216 · <a href="mailto:${CONTACT}" style="color:#6E695F">${CONTACT}</a></p></div></body></html>`;
}

export function referralRewardEmail() {
  const site = siteUrl();
  return {
    subject: 'Vennen din ble medlem. Neste måned er gratis.',
    text: `Hei!\n\nEn venn du vervet har blitt betalende medlem i PÅ MINUTTET. Du har fått 199 kr i kreditt, som trekkes fra neste betaling.\n\nVerv flere fra Min side: ${site}/min-side\n\nHilsen PÅ MINUTTET`,
    html: layout({ eyebrow: 'Ta med en venn', title: 'Neste måned er gratis.',
      paragraphs: ['En venn du vervet har blitt betalende medlem. Du har fått 199 kr i kreditt, som trekkes fra neste betaling.', 'Det er ingen grense. Hver venn som blir medlem gir en ny gratis måned.'],
      cta: { label: 'Finn vervelenken din', href: `${site}/min-side` } }),
  };
}
