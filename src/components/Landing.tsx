'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Dial } from './Dial';
import { track as trackEvent } from '@vercel/analytics';
import { Brand } from './Brand';
import { Footer } from './Footer';

const INK = 'var(--ink)', BONE = 'var(--bone)';
const WORDS = ['før ungene våkner', 'før jobb', 'i lunsjpausen', 'på hotellrommet', 'mens kaffen trekker'];
const TIMES = [{ l: '15 min', m: 15 }, { l: '25 min', m: 25 }, { l: '30 min', m: 30 }, { l: '45 min', m: 45 }];
const STARTS = [{ l: '05:30', m: 330 }, { l: '06:00', m: 360 }, { l: '06:30', m: 390 }, { l: '07:00', m: 420 }];
const EQS = ['Ingenting', 'Kettlebell/manualer', 'Fullt gym'];
const LVLS = ['Grunnmur', 'Nivå 1', 'Nivå 2', 'Nivå 3', 'Nivå 4'];
const SEG: Record<number, [string, string]> = { 15: ['3 min, uten styrke', '12 min'], 25: ['12 min', '13 min'], 30: ['14 min', '16 min'], 45: ['20 min', '25 min'] };
const HOME1 = { mv: 'luftknebøy', v: ['25', '22', '18', '15', '12'] };
const GYM1 = { mv: 'kal ro', v: ['15/12', '13/10', '11/9', '9/7', '7/5'] };
const EX = [
  { m: 'MIN 1', mv: 'Luftknebøy', v: ['25', '22', '18', '15', '12'] },
  { m: 'MIN 2', mv: 'Push-ups', v: ['15', '12', '10', '8 knær', '8 benk'] },
  { m: 'MIN 3', mv: 'Utfall bakover', v: ['24', '20', '16', '14', '12'] },
  { m: 'MIN 4', mv: 'Planke', v: ['45 s', '40 s', '30 s', '25 s', '20 s'] },
];
const FAQ = [
  { q: 'Hva trenger jeg av utstyr?', a: 'Hjemme-sporet: gulv, en stol og et solid bord. Kettlebell eller manualer er valgfritt. Gym-sporet: stang, stativ, manualer og romaskin eller sykkel.' },
  { q: 'Hvor lang tid tar en økt?', a: 'Hjemme tar 25–30 minutter og Gym 40–45 minutter. Finisheren på slutten er valgfri.' },
  { q: 'Hvordan fungerer prøveperioden?', a: 'Du får 7 dager gratis. Du får en påminnelse på e-post på dag 5, og kortet belastes først på dag 8. Avslutter du før det, betaler du ingenting. Starter du før første uke er sluppet, teller de 7 dagene fra slippet.' },
  { q: 'Kan jeg avslutte når jeg vil?', a: 'Ja. Du avslutter under Min side. Tilgangen varer ut perioden du har betalt for.' },
  { q: 'Hva med angreretten?', a: 'Du får tilgang med en gang. Ved kjøp samtykker du til at leveringen starter umiddelbart, og at 14 dagers angrerett da faller bort. Prøveperioden gir deg 7 dager til å bestemme deg.' },
];
const MQ = ['EMOM', 'Knebøy', 'Burpees', 'KB-sving', 'Push-ups', 'Roing', 'Wallballs', 'Utfall', 'Planke', 'Markløft', 'Thrusters', 'Step-ups'];
const VIDEOS = [
  { f: '01-kaffetrakteren', meta: 'ØKT 01 · 10 MIN · KROPPSVEKT', name: 'Kaffetrakteren' },
  { f: '09-svingen', meta: 'ØKT 09 · 10 MIN · KETTLEBELL', name: 'Svingen' },
  { f: '15-thrusteren', meta: 'ØKT 15 · 12 MIN · MANUALER', name: 'Thrusteren' },
  { f: '20-postkassa', meta: 'ØKT 20 · 12 MIN · UTENDØRS', name: 'Postkassa' },
];
const FEATURES = ['Ny økt hver dag', 'Gym og Hjemme', 'Fem nivåer', 'Innebygd EMOM-timer', 'Testuke hver 4. uke', 'Avslutt når du vil'];

const pad2 = (n: number) => (n < 10 ? '0' : '') + n;
const hhmm = (m: number) => pad2(Math.floor(m / 60) % 24) + ':' + pad2(m % 60);

function Dots({ n }: { n: number }) {
  return <span className="dots" aria-hidden>{[0, 1, 2, 3, 4].map(k => <i key={k} className={k < n ? 'on' : ''} />)}</span>;
}
function Check({ c = 'var(--sig)', s = 20 }: { c?: string; s?: number }) {
  return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="2.4" aria-hidden><path d="M4 10.5l4 4 8-9" /></svg>;
}

export default function Landing({ loggedIn }: { loggedIn: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  const [wi, setWi] = useState(0);
  const [t, setT] = useState(2);
  const [st, setSt] = useState(1);
  const [eq, setEq] = useState(0);
  const [lvl, setLvl] = useState(2);
  const [ex, setEx] = useState(2);
  const [annual, setAnnual] = useState(false);
  const [faq, setFaq] = useState(2);
  const [email, setEmail] = useState('');
  const [lead, setLead] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const vids = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(new Date());
    const a = setInterval(() => setNow(new Date()), 1000);
    const b = setInterval(() => setWi(w => (w + 1) % WORDS.length), 2400);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  // Spill videoene bare når de er synlige (sparer data på mobil)
  useEffect(() => {
    const root = vids.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) { v.muted = true; v.play().catch(() => {}); } else v.pause();
      });
    }, { threshold: 0.25 });
    root.querySelectorAll('video').forEach(v => io.observe(v));
    return () => io.disconnect();
  }, []);

  const sec = now ? now.getSeconds() : 0;
  const remain = now ? String(60 - sec) : '–';
  const gym = eq === 2;
  const lvIdx = 4 - lvl;
  const tm = TIMES[t].m;
  const seg = SEG[tm];
  const first = gym ? GYM1 : HOME1;
  const sporLong = gym ? (tm < 30 ? 'Gym, kortversjon' : 'Gym') : eq === 1 ? 'Hjemme med vekt' : 'Hjemme';
  const startHref = `/start?plan=${annual ? 'aar' : 'maaned'}&spor=${gym ? 'gym' : 'hjemme'}`;

  async function sendLead(e: React.FormEvent) {
    e.preventDefault();
    setLead('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source: 'forside-pdf' }) });
      setLead(r.ok ? 'done' : 'error');
      if (r.ok) trackEvent('PDF-lead');
    } catch { setLead('error'); }
  }

  return (
    <div id="top">
      <nav className="nav wrap" aria-label="Hovedmeny">
        <Brand />
        <div className="nav-links">
          <a href="#slik">Slik funker det</a>
          <a href="#nivaer">Nivåer</a>
          <a href="#priser">Priser</a>
          <a href="#pdf">Gratis PDF</a>
        </div>
        <div className="nav-right">
          {loggedIn ? (
            <Link href="/program" className="btn btn-sig btn-sm">Til ukens program</Link>
          ) : (
            <>
              <Link href="/logg-inn" className="btn btn-line btn-sm">Logg inn</Link>
              <Link href={startHref} className="btn btn-sig btn-sm"><span className="hide-sm">Start 7 dager gratis</span><span className="show-sm">Prøv gratis</span></Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="dark wrap hero">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow">EMOM-trening på norsk · hjemme eller gym</div>
          <h1>Trening<br />som holder<br />tiden.</h1>
          <div className="rot">
            <span>30 minutter</span>
            <span className="rot-box" aria-live="off">
              {WORDS.map((w, i) => {
                const tr = i === wi ? 'translateY(0)' : i === (wi + WORDS.length - 1) % WORDS.length ? 'translateY(-110%)' : 'translateY(110%)';
                return <span key={w} className="word" style={{ transform: tr, opacity: i === wi ? 1 : 0 }} aria-hidden={i !== wi}>{w}</span>;
              })}
            </span>
          </div>
          <div className="row-btns">
            <Link href={startHref} className="btn btn-sig" style={{ height: 60, fontSize: 18 }}>Start 7 dager gratis</Link>
            <a href="#nivaer" className="btn btn-line" style={{ height: 60, fontSize: 18 }}>Se en økt</a>
          </div>
          <div className="clockrow">
            <Dial size={150} lit={now ? sec : -1} hand={now ? sec : null} on={BONE} off="#3A3A3A">
              <span className="cond" style={{ fontSize: 52, color: BONE }}>{now ? pad2(sec) : '00'}</span>
            </Dial>
            <div>
              <div className="mono" style={{ fontSize: 13, letterSpacing: '.14em', color: 'var(--dim)', fontWeight: 700 }}>KLOKKA ER {now ? `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(sec)}` : '--:--:--'}</div>
              <div style={{ marginTop: 10, fontSize: 21, fontWeight: 600, lineHeight: 1.4 }}>Neste minutt starter om <span style={{ color: 'var(--sig)' }}>{remain} sekunder</span>.<br />Hvert minutt har en jobb.</div>
            </div>
          </div>
        </div>

        <div className="calc">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div className="cond" style={{ fontSize: 36, lineHeight: 1 }}>Finn dagens økt</div>
            <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '.14em', color: 'var(--sig-text)' }}><span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sig)', display: 'inline-block' }} />OPPDATERES MENS DU VELGER</div>
          </div>
          <div className="calc-2">
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Tiden jeg har</div>
              <div className="opts">{TIMES.map((o, i) => <button key={o.l} type="button" className="pill" aria-pressed={i === t} onClick={() => setT(i)}>{o.l}</button>)}</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Jeg starter kl.</div>
              <div className="opts">{STARTS.map((o, i) => <button key={o.l} type="button" className="pill" aria-pressed={i === st} onClick={() => setSt(i)}>{o.l}</button>)}</div>
            </div>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Utstyr</div>
            <div className="opts">{EQS.map((l, i) => <button key={l} type="button" className="pill" aria-pressed={i === eq} onClick={() => setEq(i)}>{l}</button>)}</div>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 8 }}>Nivå</div>
            <div className="opts lv">{LVLS.map((l, i) => <button key={l} type="button" className="pill" aria-pressed={i === lvl} onClick={() => setLvl(i)}><span>{l}</span><Dots n={i + 1} /></button>)}</div>
          </div>
          <div className="tl">
            <div className="tl-row"><span className="k">Spor</span><span className="v">{sporLong}</span></div>
            <div className="tl-row"><span className="k">Oppvarming og styrke</span><span className="v">{seg[0]}</span></div>
            <div className="tl-row"><span className="k">Kondisjon</span><span className="v">{seg[1]}</span></div>
            <div className="tl-row strong"><span className="k">Ferdig kl.</span><span className="v">{hhmm(STARTS[st].m + tm)}</span></div>
          </div>
          <div className="first">
            <div>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '.14em', fontWeight: 700, color: 'var(--sig)' }}>DITT FØRSTE MINUTT</div>
              <div className="cond" style={{ fontSize: 42, lineHeight: 1, marginTop: 6 }}>{first.v[lvIdx]} <span style={{ color: 'var(--dim)' }}>{first.mv}</span></div>
            </div>
            <div className="mono" style={{ fontSize: 13, color: 'var(--dim)', textAlign: 'right', lineHeight: 1.5, whiteSpace: 'nowrap' }}>{gym ? 'GYM' : 'HJEMME'}<br />{LVLS[lvl].toUpperCase()}</div>
          </div>
          <Link href={startHref} className="btn btn-sig btn-block" style={{ height: 58, fontSize: 18 }}>Start denne økta gratis</Link>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee" aria-hidden>
        <div className="mq">
          {MQ.concat(MQ).map((m, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 56 }}><span className="cond">{m}</span><i /></div>)}
        </div>
      </section>

      {/* FAKTA */}
      <section className="wrap facts">
        <div className="rv"><div className="cond">5</div><p>nivåer i hver økt</p></div>
        <div className="rv"><div className="cond">25–45</div><p>minutter per økt</p></div>
        <div className="rv"><div className="cond">2 spor</div><p>Gym og Hjemme, samme pris</p></div>
        <div className="rv"><div className="cond" style={{ color: 'var(--sig-text)' }}>7 dager</div><p>gratis før første trekk</p></div>
      </section>

      {/* SLIK */}
      <section id="slik" className="wrap section bt">
        <div className="rv"><div className="eyebrow">Slik funker det</div><h2 className="h2">Tre steg. Hver morgen.</h2></div>
        <div className="grid3">
          <div className="card lift rv step">
            <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: 'var(--sig-text)' }}>01</div>
            <div className="cond">Velg spor og nivå</div>
            <p>Gym eller Hjemme. Fem nivåer i hver økt, fra Grunnmur til Nivå 4. Du bytter når du vil.</p>
            <div className="foot" style={{ display: 'flex', gap: 8 }}>{[1, 1, 1, 0, 0].map((o, i) => <span key={i} style={{ width: 44, height: 14, background: o ? 'var(--sig)' : 'var(--line)', display: 'block' }} />)}</div>
          </div>
          <div className="card lift rv step">
            <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: 'var(--sig-text)' }}>02</div>
            <div className="cond">Start klokka</div>
            <p>Timeren ligger i økta. Den viser hvilket minutt du er på, og hva du skal gjøre på ditt nivå.</p>
            <div className="foot mono" style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 14, background: INK, color: BONE, borderRadius: 12, padding: '12px 16px', fontSize: 15, fontWeight: 700 }}><span style={{ color: 'var(--sig)' }}>MIN 3</span><span>20 UTFALL</span><span style={{ color: 'var(--dim)' }}>0:42</span></div>
          </div>
          <div className="card lift rv step">
            <div className="mono" style={{ fontSize: 16, fontWeight: 800, color: 'var(--sig-text)' }}>03</div>
            <div className="cond">Test deg hver 4. uke</div>
            <p>Hver fjerde uke er testuke. Samme tester, samme nivå, og du ser fremgangen svart på hvitt.</p>
            <div className="foot" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span className="mono" style={{ fontSize: 12, fontWeight: 700, width: 58 }}>UKE 41</span><span style={{ height: 12, width: '80%', maxWidth: 260, background: 'var(--line2)', display: 'block' }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span className="mono" style={{ fontSize: 12, fontWeight: 700, width: 58 }}>UKE 44</span><span style={{ height: 12, width: '63%', maxWidth: 205, background: 'var(--sig)', display: 'block' }} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEOER */}
      <section className="dark wrap section">
        <div className="rv vids-head">
          <div><div className="eyebrow">Se øktene</div><h2 className="h2">Fire økter. Tre nivåer i hver.</h2></div>
          <p style={{ margin: 0, maxWidth: 360, fontSize: 18, lineHeight: 1.5, color: 'var(--dim2)' }}>Hver video viser minutt for minutt hva du gjør på ditt nivå. Alle fire ligger i gratis-PDF-en.</p>
        </div>
        <div className="vids" ref={vids}>
          {VIDEOS.map(v => (
            <div key={v.f} className="lift rv" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <video src={`/media/${v.f}.mp4`} poster={`/media/${v.f}-cover.jpg`} muted loop playsInline preload="none" aria-label={`Video: ${v.name}`} />
              <div>
                <div className="mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: 'var(--sig)' }}>{v.meta}</div>
                <div className="cond" style={{ fontSize: 30, marginTop: 4 }}>{v.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NIVÅER */}
      <section id="nivaer" className="wrap section levels">
        <div className="rv">
          <div className="eyebrow">Nivåer</div>
          <h2 className="h2">Én økt.<br />Fem nivåer.</h2>
          <p className="lead" style={{ margin: '24px 0 0', maxWidth: 520 }}>Alle får samme økt. Tallene tilpasses deg. Velg nivået som gir deg 15–20 sekunder hvile hvert minutt.</p>
          <div className="lvl-pills">{LVLS.map((l, i) => <button key={l} type="button" className="pill" aria-pressed={i === ex} onClick={() => setEx(i)}><span>{l}</span><Dots n={i + 1} /></button>)}</div>
          <p style={{ margin: '24px 0 0', fontSize: 16, color: 'var(--muted2)' }}>Rekker du ikke minuttet to ganger på rad: gå ned ett nivå.</p>
        </div>
        <div className="rv dark excard">
          <div className="eyebrow">Hjemme · mandag · uke 41</div>
          <div className="cond" style={{ fontSize: 'clamp(34px, 3.5vw, 50px)', marginTop: 8, lineHeight: 1 }}>Stuegulvet-minuttet</div>
          <div className="mono" style={{ fontSize: 14, color: 'var(--dim)', marginTop: 8 }}>20:00 EMOM · 5 RUNDER · {LVLS[ex].toUpperCase()}</div>
          <div style={{ marginTop: 20 }}>
            {EX.map(r => (
              <div key={r.m} className="exrow">
                <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--sig)' }}>{r.m}</span>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{r.mv}</span>
                <span className="cond">{r.v[4 - ex]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPOR */}
      <section className="wrap section bt">
        <div className="rv"><div className="eyebrow">To spor</div><h2 className="h2">Gym eller hjemme. Samme pris.</h2></div>
        <div className="tracks">
          <div className="lift rv dark trackcard">
            <div className="top"><div className="cond">Gym</div><div className="cond" style={{ color: 'var(--sig)' }}>40–45 min</div></div>
            <ul>{['Stang, stativ, manualer og ergometre', 'Styrke med prosent av maks', 'Kondisjon i EMOM, AMRAP og intervaller', 'Testuke hver 4. uke'].map(x => <li key={x}><span className="sq" />{x}</li>)}</ul>
          </div>
          <div className="lift rv trackcard" style={{ background: 'var(--sig)' }}>
            <div className="top"><div className="cond">Hjemme</div><div className="cond">25–30 min</div></div>
            <ul style={{ fontWeight: 500 }}>{['Gulv, en stol og et solid bord', 'Kettlebell eller manualer er valgfritt', 'Stille-bytter for alle hopp', 'Testuke hver 4. uke'].map(x => <li key={x}><span className="sq" style={{ background: INK }} />{x}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* PRISER */}
      <section id="priser" className="dark wrap section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="rv" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="eyebrow">Priser</div>
          <h2 className="h2">Én pris. Begge sporene.</h2>
          <div className="seg" role="group" aria-label="Betalingsperiode" style={{ marginTop: 28 }}>
            <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)}>Månedlig</button>
            <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)}>Årlig · 2 mnd gratis</button>
          </div>
        </div>
        <div className="prices" style={{ width: '100%' }}>
          <div className="rv pcard" style={{ border: '1.5px solid #3A3A3A' }}>
            <div className="cond" style={{ fontSize: 40 }}>Gratis</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}><span className="cond big">0</span><span style={{ fontSize: 20, color: 'var(--dim)' }}>kr</span></div>
            <div style={{ margin: '28px 0 32px', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 17 }}>
              {['20 EMOM-er som PDF', 'Nyhetsbrev fra coachen', 'Ingen kort, ingen binding'].map(x => <div key={x} className="tick"><Check />{x}</div>)}
            </div>
            <a href="#pdf" className="btn btn-line btn-block" style={{ marginTop: 'auto' }}>Hent PDF-en</a>
          </div>
          <div className="rv pcard" style={{ background: BONE, color: INK }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div className="cond" style={{ fontSize: 40 }}>Dagsøkta</div>
              <span className="mono" style={{ fontSize: 12, fontWeight: 800, letterSpacing: '.12em', background: 'var(--sig)', borderRadius: 999, padding: '8px 14px' }}>7 DAGER GRATIS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}><span className="cond big">{annual ? '1 990' : '199'}</span><span style={{ fontSize: 20, color: 'var(--muted2)' }}>{annual ? 'kr/år' : 'kr/mnd'}</span></div>
            <div className="tl" style={{ marginTop: 24 }}>
              <div className="tl-row"><span className="k">I dag</span><span className="v">0 kr</span></div>
              <div className="tl-row"><span className="k">Dag 5</span><span className="v">Påminnelse på e-post</span></div>
              <div className="tl-row"><span className="k">Dag 8</span><span className="v">Første trekk: {annual ? '1 990 kr' : '199 kr'}</span></div>
              <div className="tl-row strong"><span className="k">Per økt</span><span className="v">{annual ? 'ca. 8 kr' : 'ca. 9 kr'}</span></div>
            </div>
            <div className="feat">{FEATURES.map(f => <div key={f} className="tick" style={{ gap: 10 }}><Check c="var(--sig-text)" s={18} />{f}</div>)}</div>
            <Link href={startHref} className="btn btn-sig btn-block" style={{ marginTop: 32, height: 60, fontSize: 18 }}>Start 7 dager gratis</Link>
          </div>
        </div>
      </section>

      {/* PDF */}
      <section id="pdf" className="wrap section pdf">
        <div className="rv"><img src="/media/pdf-forside.png" alt="Forsiden av PDF-en 20 EMOM-er du rekker før ungene våkner" width={300} height={424} /></div>
        <div className="rv">
          <div className="eyebrow">Gratis PDF</div>
          <h2 className="h2" style={{ fontSize: 'clamp(40px, 4.7vw, 68px)' }}>20 EMOM-er du rekker før ungene våkner</h2>
          <p className="lead" style={{ margin: '20px 0 0', maxWidth: 620 }}>10–20 minutter hver. Kroppsvekt, én kettlebell eller to manualer. Tre nivåer i hver økt, og de fleste er stille nok til at ingen våkner.</p>
          {lead !== 'done' ? (
            <form className="pdf-form" onSubmit={sendLead}>
              <div className="field">
                <label htmlFor="pdfmail" className="label">E-post</label>
                <input id="pdfmail" className="input" type="email" required autoComplete="email" placeholder="navn@epost.no" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-ink" style={{ height: 56 }} disabled={lead === 'sending'}>{lead === 'sending' ? 'Sender …' : 'Send meg PDF-en'}</button>
              {lead === 'error' && <div className="err" style={{ width: '100%' }}>Noe gikk galt. Prøv igjen, eller last ned direkte <a href="/media/PA-MINUTTET-20-EMOM-er.pdf" download>her</a>.</div>}
            </form>
          ) : (
            <div className="dark" style={{ marginTop: 28, borderRadius: 20, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, maxWidth: 640, flexWrap: 'wrap' }}>
              <div>
                <div className="cond" style={{ fontSize: 32 }}>Den er din.</div>
                <div style={{ fontSize: 15, color: 'var(--dim2)', marginTop: 4 }}>Vi har sendt den til {email}. Du kan også laste den ned nå.</div>
              </div>
              <a href="/media/PA-MINUTTET-20-EMOM-er.pdf" download="PA-MINUTTET-20-EMOM-er.pdf" className="btn btn-sig">Last ned nå</a>
            </div>
          )}
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 14 }}>Vi sender deg nyhetsbrev. Du kan melde deg av når som helst. Se <Link href="/personvern">personvern</Link>.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap section bt faq">
        <div className="rv"><div className="eyebrow">Spørsmål</div><h2 className="h2">Det folk lurer på</h2></div>
        <div>
          {FAQ.map((f, i) => {
            const open = faq === i;
            return (
              <div key={f.q} className="faq-item">
                <button type="button" aria-expanded={open} onClick={() => setFaq(open ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="mono" style={{ fontSize: 26, color: 'var(--sig-text)', width: 28, textAlign: 'center' }}>{open ? '−' : '+'}</span>
                </button>
                {open && <p className="fade">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA + FOOTER */}
      <section className="dark wrap cta">
        <h2>Neste minutt<br />starter om <span style={{ color: 'var(--sig)' }}>{remain} s.</span></h2>
        <div className="row-btns">
          <Link href={startHref} className="btn btn-sig" style={{ height: 60, fontSize: 18 }}>Start 7 dager gratis</Link>
          <Link href="/logg-inn" className="btn btn-line" style={{ height: 60, fontSize: 18 }}>Logg inn</Link>
        </div>
        <Footer />
      </section>
    </div>
  );
}
