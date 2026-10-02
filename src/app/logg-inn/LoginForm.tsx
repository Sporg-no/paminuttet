'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

type Mode = 'passord' | 'kode' | 'kode-sendt' | 'glemt' | 'glemt-sendt';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export default function LoginForm({ next }: { next: string }) {
  const [mode, setMode] = useState<Mode>('passord');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();
  const mail = () => email.trim().toLowerCase();
  const go = () => { router.replace(next); router.refresh(); };
  const switchTo = (m: Mode) => { setMode(m); setErr(''); setCode(''); };

  async function withPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: mail(), password });
    setBusy(false);
    if (error) {
      setErr(error.message.toLowerCase().includes('invalid')
        ? 'Feil e-post eller passord. Har du ikke laget passord ennå? Logg inn med kode på e-post under, så kan du lage et passord inne på siden.'
        : `Innloggingen feilet: ${error.message}`);
      return;
    }
    go();
  }

  async function withGoogle() {
    setErr('');
    const { error } = await supabaseBrowser().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`, queryParams: { prompt: 'select_account' } },
    });
    if (error) setErr('Google-innlogging er ikke tilgjengelig akkurat nå. Bruk e-post og passord.');
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email: mail(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}` },
    });
    setBusy(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes('signups not allowed') || m.includes('not found')) setErr('Vi fant ingen konto med den e-posten. Start prøveperioden, eller sjekk at du bruker samme e-post som i kassen.');
      else if (error.status === 429 || m.includes('rate')) setErr('Du har bedt om mange koder på kort tid. Vent et minutt og prøv igjen.');
      else setErr(`Kunne ikke sende e-post akkurat nå: ${error.message}`);
      return;
    }
    setMode('kode-sendt');
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error } = await supabaseBrowser().auth.verifyOtp({ email: mail(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (error) { setErr('Koden stemmer ikke eller er utløpt.'); return; }
    go();
  }

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(mail(), {
      redirectTo: `${window.location.origin}/auth/confirm?next=/nytt-passord`,
    });
    setBusy(false);
    if (error && (error.status === 429 || error.message.toLowerCase().includes('rate'))) { setErr('Vent et minutt og prøv igjen.'); return; }
    setMode('glemt-sendt'); // Samme svar uansett om kontoen finnes
  }

  const emailField = (
    <div className="field">
      <label htmlFor="email" className="label">E-post</label>
      <input id="email" className="input" type="email" autoComplete="email" required placeholder="navn@epost.no" value={email} onChange={e => setEmail(e.target.value)} />
    </div>
  );
  const google = (
    <>
      <button type="button" className="btn btn-line btn-block" onClick={withGoogle} style={{ gap: 12 }}><GoogleIcon />Fortsett med Google</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--muted)', fontSize: 13 }}>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />eller<span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>
    </>
  );
  const col = { display: 'flex', flexDirection: 'column' as const, gap: 16 };

  if (mode === 'kode-sendt') {
    return (
      <form onSubmit={verifyCode} style={col}>
        <div className="ok">Sjekk innboksen for <b>{email}</b>. Skriv inn koden her, eller trykk på lenken i e-posten.</div>
        <div className="field">
          <label htmlFor="code" className="label">Kode fra e-posten</label>
          <input id="code" className="input code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" maxLength={10} required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} />
        </div>
        {err && <div className="err">{err}</div>}
        <button className="btn btn-sig btn-block" disabled={busy || code.length < 6}>{busy ? 'Sjekker …' : 'Logg inn'}</button>
        <button type="button" className="linkbtn" onClick={() => switchTo('passord')}>Tilbake</button>
      </form>
    );
  }
  if (mode === 'kode') {
    return (
      <form onSubmit={sendCode} style={col}>
        {emailField}
        {err && <div className="err">{err}</div>}
        <button className="btn btn-sig btn-block" disabled={busy}>{busy ? 'Sender …' : 'Send meg en kode'}</button>
        <button type="button" className="linkbtn" onClick={() => switchTo('passord')}>Logg inn med passord i stedet</button>
      </form>
    );
  }
  if (mode === 'glemt' || mode === 'glemt-sendt') {
    return (
      <form onSubmit={sendReset} style={col}>
        {mode === 'glemt-sendt'
          ? <div className="ok">Finnes kontoen, har vi sendt en lenke til <b>{email}</b>. Åpne den for å lage nytt passord.</div>
          : <p style={{ margin: 0, fontSize: 15, color: 'var(--body)' }}>Skriv inn e-posten din, så sender vi en lenke for å lage nytt passord.</p>}
        {emailField}
        {err && <div className="err">{err}</div>}
        {mode === 'glemt' && <button className="btn btn-sig btn-block" disabled={busy}>{busy ? 'Sender …' : 'Send lenke'}</button>}
        <button type="button" className="linkbtn" onClick={() => switchTo('passord')}>Tilbake til innlogging</button>
      </form>
    );
  }
  return (
    <form onSubmit={withPassword} style={col}>
      {google}
      {emailField}
      <div className="field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label htmlFor="pw" className="label">Passord</label>
          <button type="button" className="linkbtn" style={{ fontSize: 13 }} onClick={() => switchTo('glemt')}>Glemt passord?</button>
        </div>
        <input id="pw" className="input" type="password" autoComplete="current-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {err && <div className="err">{err}</div>}
      <button className="btn btn-sig btn-block" disabled={busy}>{busy ? 'Logger inn …' : 'Logg inn'}</button>
      <button type="button" className="linkbtn" onClick={() => switchTo('kode')}>Ikke laget passord ennå? Få en kode på e-post</button>
    </form>
  );
}
