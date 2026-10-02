'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

/** Lar en innlogget bruker lage eller bytte passord. */
export default function SetPassword({ label = 'Lag passord', onDone, compact = false }: { label?: string; onDone?: () => void; compact?: boolean }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) { setMsg({ ok: false, t: 'Passordet må ha minst 8 tegn.' }); return; }
    if (pw !== pw2) { setMsg({ ok: false, t: 'Passordene er ikke like.' }); return; }
    setBusy(true); setMsg(null);
    const { error } = await supabaseBrowser().auth.updateUser({ password: pw, data: { has_password: true } });
    setBusy(false);
    if (error) {
      setMsg({ ok: false, t: error.message.toLowerCase().includes('different') ? 'Velg et annet passord enn det du har nå.' : `Kunne ikke lagre: ${error.message}` });
      return;
    }
    setPw(''); setPw2('');
    setMsg({ ok: true, t: 'Passordet er lagret. Neste gang logger du inn med e-post og passord.' });
    onDone?.();
  }

  return (
    <form onSubmit={save} style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', flexWrap: 'wrap', gap: 12, alignItems: compact ? 'flex-end' : 'stretch' }}>
      <div className="field" style={{ flex: compact ? '1 1 180px' : undefined }}>
        <label className="label" htmlFor="newpw">Nytt passord</label>
        <input id="newpw" className="input" type="password" autoComplete="new-password" minLength={8} required value={pw} onChange={e => setPw(e.target.value)} />
      </div>
      <div className="field" style={{ flex: compact ? '1 1 180px' : undefined }}>
        <label className="label" htmlFor="newpw2">Gjenta passord</label>
        <input id="newpw2" className="input" type="password" autoComplete="new-password" minLength={8} required value={pw2} onChange={e => setPw2(e.target.value)} />
      </div>
      <button className="btn btn-sig" disabled={busy} style={{ height: 56 }}>{busy ? 'Lagrer …' : label}</button>
      {msg && <div className={msg.ok ? 'ok' : 'err'} style={{ flexBasis: '100%' }}>{msg.t}</div>}
    </form>
  );
}
