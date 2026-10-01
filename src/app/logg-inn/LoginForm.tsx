'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const sb = supabaseBrowser();
    const { error } = await sb.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}` },
    });
    setBusy(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes('signups not allowed') || m.includes('not found')) setErr('Vi fant ingen konto med den e-posten. Start prøveperioden, eller sjekk at du bruker samme e-post som i kassen.');
      else if (error.status === 429 || m.includes('rate')) setErr('Du har bedt om mange lenker på kort tid. Vent et minutt og prøv igjen.');
      else setErr(`Kunne ikke sende e-post akkurat nå. Feil fra innloggingstjenesten: ${error.message}`);
      return;
    }
    setStep('code');
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const sb = supabaseBrowser();
    const { error } = await sb.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (error) { setErr('Koden stemmer ikke eller er utløpt.'); return; }
    router.replace(next);
    router.refresh();
  }

  if (step === 'code') {
    return (
      <form onSubmit={verify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="ok">Sjekk innboksen for <b>{email}</b>. Trykk på lenken, eller skriv inn koden her.</div>
        <div className="field">
          <label htmlFor="code" className="label">Kode fra e-posten</label>
          <input id="code" className="input code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" maxLength={10} required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} />
        </div>
        {err && <div className="err">{err}</div>}
        <button className="btn btn-sig btn-block" disabled={busy || code.length < 6}>{busy ? 'Sjekker …' : 'Logg inn'}</button>
        <button type="button" className="linkbtn" onClick={() => { setStep('email'); setCode(''); setErr(''); }}>Bruk en annen e-post</button>
      </form>
    );
  }
  return (
    <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="field">
        <label htmlFor="email" className="label">E-post</label>
        <input id="email" className="input" type="email" autoComplete="email" required placeholder="navn@epost.no" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      {err && <div className="err">{err}</div>}
      <button className="btn btn-sig btn-block" disabled={busy}>{busy ? 'Sender …' : 'Send meg innloggingslenke'}</button>
    </form>
  );
}
