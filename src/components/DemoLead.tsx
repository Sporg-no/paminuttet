'use client';
import { useState } from 'react';
import { track as trackEvent } from '@vercel/analytics';
import { emailTypo } from '@/lib/emailTypo';

/** Enkel e-postfanger på /dagens-okt: gratis PDF for dem som ikke er klare for prøveperioden. */
export default function DemoLead() {
  const [email, setEmail] = useState('');
  const [st, setSt] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSt('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source: 'dagens-okt' }) });
      setSt(r.ok ? 'done' : 'error');
      if (r.ok) trackEvent('PDF-lead', { kilde: 'dagens-okt' });
    } catch { setSt('error'); }
  }
  if (st === 'done') return (
    <div style={{ fontSize: 15, lineHeight: 1.5 }}>
      Sendt til {email}. <a href="/media/PA-MINUTTET-20-EMOM-er.pdf" download="PA-MINUTTET-20-EMOM-er.pdf">Last ned PDF-en nå</a>.
    </div>
  );
  return (
    <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--line, #ddd)', paddingTop: 16, marginTop: 4 }}>
      <div style={{ fontSize: 15, lineHeight: 1.5 }}><b>Ikke klar ennå?</b> Få 20 korte økter gratis som PDF på e-post.</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input className="input" type="email" required autoComplete="email" placeholder="navn@epost.no" value={email} onChange={e => setEmail(e.target.value)} aria-label="E-post" style={{ flex: '1 1 220px' }} />
        <button className="btn btn-ink" disabled={st === 'sending'} style={{ height: 52 }}>{st === 'sending' ? 'Sender …' : 'Send meg PDF-en'}</button>
      </div>
      {emailTypo(email) && <button type="button" className="linkbtn" style={{ textAlign: 'left' }} onClick={() => setEmail(emailTypo(email)!)}>Mente du <b>{emailTypo(email)}</b>? Trykk for å rette.</button>}
      {st === 'error' && <div className="err">Noe gikk galt. Prøv igjen.</div>}
    </form>
  );
}
