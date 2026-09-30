'use client';
import Link from 'next/link';
import { useState } from 'react';

const MONTHS = ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'];
const fmt = (d: Date) => `${d.getDate()}. ${MONTHS[d.getMonth()]}`;

export default function StartForm({ initialPlan, initialTrack, initialEmail, lockedEmail }: {
  initialPlan: 'maaned' | 'aar'; initialTrack: 'gym' | 'hjemme'; initialEmail: string; lockedEmail: boolean;
}) {
  const [plan, setPlan] = useState(initialPlan);
  const [track, setTrack] = useState(initialTrack);
  const [email, setEmail] = useState(initialEmail);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ msg: string; login?: boolean } | null>(null);
  const [trial, setTrial] = useState(true);

  const annual = plan === 'aar';
  const priceTxt = annual ? '1 990 kr' : '199 kr';
  const d5 = new Date(Date.now() + 4 * 864e5), d8 = new Date(Date.now() + 7 * 864e5);

  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan, track, email: email.trim().toLowerCase(), consent: true }),
      });
      const j = await r.json();
      if (r.ok && j.url) { window.location.href = j.url; return; }
      if (j.noTrial) setTrial(false);
      setErr({ msg: j.error || 'Noe gikk galt. Prøv igjen.', login: j.login });
    } catch { setErr({ msg: 'Fikk ikke kontakt med serveren. Prøv igjen.' }); }
    setBusy(false);
  }

  return (
    <form className="wrap start" onSubmit={go}>
      <div className="start-main">
        <div>
          <div className="eyebrow">Start prøveperioden</div>
          <h1 style={{ marginTop: 12 }}>{trial ? <>7 dager gratis.<br />Så {annual ? '1 990 kr/år' : '199 kr/mnd'}.</> : <>Velkommen tilbake.<br />{annual ? '1 990 kr/år' : '199 kr/mnd'}.</>}</h1>
        </div>
        <div className="plans" role="group" aria-label="Plan">
          <button type="button" className="plan" aria-pressed={!annual} onClick={() => setPlan('maaned')}>
            <span className="label">Månedlig</span>
            <div className="cond">199 kr<small> /mnd</small></div>
            <div style={{ fontSize: 15, color: '#5E594F', marginTop: 6 }}>Avslutt når du vil</div>
          </button>
          <button type="button" className="plan" aria-pressed={annual} onClick={() => setPlan('aar')}>
            <span className="label" style={{ color: '#C2410C' }}>Årlig · spar 398 kr</span>
            <div className="cond">1 990 kr<small> /år</small></div>
            <div style={{ fontSize: 15, color: '#5E594F', marginTop: 6 }}>Tilsvarer 166 kr/mnd</div>
          </button>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 8 }}>Spor · du kan bytte når du vil</div>
          <div className="seg" role="group" aria-label="Spor" style={{ maxWidth: 420 }}>
            <button type="button" aria-pressed={track === 'gym'} onClick={() => setTrack('gym')}>Gym</button>
            <button type="button" aria-pressed={track === 'hjemme'} onClick={() => setTrack('hjemme')}>Hjemme</button>
          </div>
        </div>
        <div className="field" style={{ maxWidth: 520 }}>
          <label htmlFor="ckmail" className="label">E-post · brukes til innlogging</label>
          <input id="ckmail" className="input" type="email" autoComplete="email" required placeholder="navn@epost.no" value={email} readOnly={lockedEmail} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: '#5E594F' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E594F" strokeWidth="2" aria-hidden><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          Kortet legges inn hos Stripe i neste steg.{trial ? ' Det belastes ikke før prøveperioden er over.' : ''}
        </div>
        <label className="check" htmlFor="ckconsent">
          <input id="ckconsent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
          <span>Jeg vil at tilgangen starter med en gang, og vet at angreretten på 14 dager da faller bort. Jeg godtar <Link href="/vilkar" target="_blank">vilkårene</Link>.</span>
        </label>
        {err && <div className="err">{err.msg} {err.login && <Link href="/logg-inn">Logg inn her.</Link>}</div>}
        <button type="submit" className="btn btn-sig btn-block" style={{ height: 60, fontSize: 18, maxWidth: 520 }} disabled={!consent || busy}>
          {busy ? 'Sender deg til betaling …' : !consent ? 'Kryss av for samtykke for å fortsette' : trial ? 'Start 7 dager gratis · 0 kr i dag' : `Gå til betaling · ${priceTxt}`}
        </button>
      </div>
      <aside className="dark summary">
        <div className="eyebrow">Oppsummering</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="sumrow"><span>Plan</span><span>{annual ? 'Årlig' : 'Månedlig'}</span></div>
          <div className="sumrow"><span>Spor</span><span>{track === 'gym' ? 'Gym' : 'Hjemme'}</span></div>
          <div className="sumrow"><span>Nivå</span><span>Velg selv i hver økt</span></div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="cond" style={{ fontSize: 30 }}>Å betale i dag</span>
          <span className="cond" style={{ fontSize: 44, color: '#FF5A1F' }}>{trial ? '0 kr' : priceTxt}</span>
        </div>
        {trial && (
          <div className="dtl">
            <div><div className="mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', color: '#FF5A1F' }}>I DAG</div><div style={{ fontSize: 15, marginTop: 2 }}>Full tilgang til ukens program</div></div>
            <div><div className="mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', color: '#9A958B' }}>{fmt(d5).toUpperCase()}</div><div style={{ fontSize: 15, marginTop: 2 }}>Påminnelse på e-post</div></div>
            <div><div className="mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.12em', color: '#9A958B' }}>{fmt(d8).toUpperCase()}</div><div style={{ fontSize: 15, marginTop: 2 }}>Første trekk: {priceTxt}</div></div>
          </div>
        )}
        <div style={{ fontSize: 14, color: '#C9C4B9', lineHeight: 1.5 }}>Avslutt når som helst under Min side.{trial ? ` Avslutter du før ${fmt(d8)}, betaler du ingenting.` : ''}</div>
      </aside>
    </form>
  );
}
