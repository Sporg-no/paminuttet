'use client';
import { useState } from 'react';

/** Vervelenke med kopier- og del-knapp. */
export default function VervLenke({ url }: { url: string }) {
  const [msg, setMsg] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(url); setMsg('Lenken er kopiert.'); } catch { setMsg('Marker lenken og kopier den manuelt.'); }
  }
  async function share() {
    const text = 'Jeg trener med PÅ MINUTTET: ny økt hver dag, hjemme eller på gym. Første 7 dager er gratis.';
    if (navigator.share) { try { await navigator.share({ title: 'PÅ MINUTTET', text, url }); } catch { /* avbrutt */ } }
    else copy();
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input className="input" readOnly value={url} onFocus={e => e.currentTarget.select()} aria-label="Din vervelenke" />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-sig" onClick={share}>Del lenken</button>
        <button type="button" className="btn btn-line" onClick={copy}>Kopier</button>
      </div>
      {msg && <div className="ok">{msg}</div>}
    </div>
  );
}
