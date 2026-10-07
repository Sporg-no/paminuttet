'use client';
import type { ReactNode } from 'react';
import { OVELSE_RE, finnOvelse, type Ovelse } from '@/content/ovelser';

/** Gjør øvelsesnavn i en tekst trykkbare. */
export function ovelseTekst(tekst: string, velg: (o: Ovelse) => void): ReactNode {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of tekst.matchAll(OVELSE_RE)) {
    const o = finnOvelse(m[0]);
    if (!o || m.index === undefined) continue;
    if (m.index > last) out.push(tekst.slice(last, m.index));
    out.push(<button key={m.index} type="button" className="exlink" onClick={() => velg(o)}>{m[0]}</button>);
    last = m.index + m[0].length;
  }
  if (last === 0) return tekst;
  if (last < tekst.length) out.push(tekst.slice(last));
  return out;
}

export function OvelseArk({ o, lukk }: { o: Ovelse | null; lukk: () => void }) {
  if (!o) return null;
  const video = `https://www.youtube.com/results?search_query=${encodeURIComponent(o.video)}`;
  return (
    <div className="exsheet-bg" role="presentation" onClick={lukk}>
      <div className="exsheet card" role="dialog" aria-modal="true" aria-label={o.tittel} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <div className="eyebrow">Øvelse</div>
          <button type="button" className="linkbtn" onClick={lukk} style={{ fontSize: 14 }}>Lukk</button>
        </div>
        <div className="cond" style={{ fontSize: 34, lineHeight: 1, marginTop: 8 }}>{o.tittel}</div>
        <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: 1.55 }}>{o.slik}</p>
        {o.tips && <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: 'var(--body)' }}><b>Tips:</b> {o.tips}</p>}
        {o.lettere && <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.5, color: 'var(--body)' }}><b>Lettere:</b> {o.lettere}</p>}
        <a className="btn btn-line btn-block" href={video} target="_blank" rel="noopener noreferrer" style={{ marginTop: 18 }}>Se video på YouTube</a>
      </div>
    </div>
  );
}
