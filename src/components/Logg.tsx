'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';
import { LIFTS, e1rm, type LiftId, type Pr } from '@/lib/strength';

export type Resultat = { week_abs: number; track: string; day_idx: number; score: string; note: string | null; lvl: number | null };
export const rkey = (abs: number, track: string, day: number) => `${abs}-${track}-${day}`;

/** Henter og lagrer egne resultater og maks. Tabellene er beskyttet med RLS (bare egne rader). */
export function useLogg(absList: number[]) {
  const [results, setResults] = useState<Record<string, Resultat>>({});
  const [prs, setPrs] = useState<Partial<Record<LiftId, Pr>>>({});
  const [uid, setUid] = useState<string | null>(null);
  const absKey = absList.join(',');

  useEffect(() => {
    const sb = supabaseBrowser();
    let alive = true;
    (async () => {
      const { data: { user } } = await sb.auth.getUser();
      if (!user || !alive) return;
      setUid(user.id);
      const [r, p] = await Promise.all([
        sb.from('results').select('week_abs, track, day_idx, score, note, lvl').in('week_abs', absKey.split(',').map(Number)),
        sb.from('prs').select('lift, kg, reps'),
      ]);
      if (!alive) return;
      const rm: Record<string, Resultat> = {};
      (r.data ?? []).forEach(x => { rm[rkey(x.week_abs, x.track, x.day_idx)] = x as Resultat; });
      setResults(rm);
      const pm: Partial<Record<LiftId, Pr>> = {};
      (p.data ?? []).forEach(x => { pm[x.lift as LiftId] = { lift: x.lift as LiftId, kg: Number(x.kg), reps: x.reps }; });
      setPrs(pm);
    })();
    return () => { alive = false; };
  }, [absKey]);

  const saveResult = useCallback(async (abs: number, track: string, day: number, score: string, note: string, lvl: number) => {
    if (!uid) return 'Du må være logget inn.';
    const row = { user_id: uid, week_abs: abs, track, day_idx: day, score: score.trim().slice(0, 60), note: note.trim().slice(0, 300) || null, lvl, updated_at: new Date().toISOString() };
    const { error } = await supabaseBrowser().from('results').upsert(row, { onConflict: 'user_id,week_abs,track,day_idx' });
    if (error) return 'Kunne ikke lagre. Prøv igjen.';
    setResults(m => ({ ...m, [rkey(abs, track, day)]: row }));
    return null;
  }, [uid]);

  const savePr = useCallback(async (lift: LiftId, kg: number, reps: number) => {
    if (!uid) return 'Du må være logget inn.';
    const { error } = await supabaseBrowser().from('prs').upsert({ user_id: uid, lift, kg, reps, updated_at: new Date().toISOString() }, { onConflict: 'user_id,lift' });
    if (error) return 'Kunne ikke lagre. Sjekk tallene.';
    setPrs(m => ({ ...m, [lift]: { lift, kg, reps } }));
    return null;
  }, [uid]);

  const oneRm = useMemo(() => {
    const o: Partial<Record<LiftId, number>> = {};
    (Object.values(prs) as Pr[]).forEach(p => { o[p.lift] = e1rm(p.kg, p.reps); });
    return o;
  }, [prs]);

  return { results, saveResult, prs, savePr, oneRm };
}

/** Feltet under «Score» der man skriver inn resultatet sitt. */
export function ResultatBoks({ placeholder, saved, prev, prevLabel, onSave }: {
  placeholder: string; saved?: Resultat; prev?: Resultat; prevLabel?: string;
  onSave: (score: string, note: string) => Promise<string | null>;
}) {
  const [score, setScore] = useState(saved?.score ?? '');
  const [note, setNote] = useState(saved?.note ?? '');
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setScore(saved?.score ?? ''); setNote(saved?.note ?? ''); }, [saved?.score, saved?.note]);

  async function lagre(e: React.FormEvent) {
    e.preventDefault();
    if (!score.trim()) { setMsg({ ok: false, t: 'Skriv inn resultatet først.' }); return; }
    setBusy(true);
    const err = await onSave(score, note);
    setBusy(false);
    setMsg(err ? { ok: false, t: err } : { ok: true, t: 'Lagret. Du finner det igjen her og under Min side.' });
  }

  return (
    <form onSubmit={lagre} className="card logg">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span className="eyebrow">Ditt resultat</span>
        {prev && <span style={{ fontSize: 14, color: 'var(--muted2)' }}>{prevLabel}: <b style={{ color: 'var(--ink)' }}>{prev.score}</b></span>}
      </div>
      <div className="logg-row">
        <input className="input" value={score} onChange={e => setScore(e.target.value)} placeholder={placeholder} maxLength={60} aria-label="Resultat" />
        <button className="btn btn-ink" disabled={busy} style={{ height: 52 }}>{busy ? 'Lagrer …' : saved ? 'Oppdater' : 'Lagre'}</button>
      </div>
      <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Notat (valgfritt): vekt, skalering, dagsform" maxLength={300} aria-label="Notat" />
      {msg && <div className={msg.ok ? 'ok' : 'err'}>{msg.t}</div>}
    </form>
  );
}

/** «Dine maks»: 1RM eller tyngste sett per løft. Brukes til å regne ut vektene i styrkedelen. */
export function MaksPanel({ prs, oneRm, onSave }: {
  prs: Partial<Record<LiftId, Pr>>; oneRm: Partial<Record<LiftId, number>>;
  onSave: (lift: LiftId, kg: number, reps: number) => Promise<string | null>;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  async function lagre(lift: LiftId, form: HTMLFormElement) {
    const f = new FormData(form);
    const kg = Number(String(f.get('kg') ?? '').replace(',', '.'));
    const reps = Math.round(Number(f.get('reps') || 1));
    if (!(kg > 0 && kg < 500) || !(reps >= 1 && reps <= 10)) { setMsg('Skriv kg (f.eks. 82,5) og 1–10 reps.'); return; }
    const err = await onSave(lift, kg, reps);
    setMsg(err ?? 'Lagret. Vektene i styrkedelen er regnet ut.');
  }
  return (
    <details className="maks">
      <summary className="label">Dine maks · regner ut vektene</summary>
      <p style={{ margin: '8px 0', fontSize: 13, lineHeight: 1.5, color: 'var(--muted2)' }}>Skriv tyngste vekt og antall reps, f.eks. 100 kg × 3. Vi beregner 1RM og runder vektene til nærmeste 2,5 kg.</p>
      {LIFTS.map(l => (
        <form key={`${l.id}-${prs[l.id]?.kg ?? ''}-${prs[l.id]?.reps ?? ''}`} className="maks-row" onSubmit={e => { e.preventDefault(); lagre(l.id, e.currentTarget); }}>
          <span className="maks-navn">{l.label}{oneRm[l.id] ? <small> 1RM ≈ {Math.round(oneRm[l.id]!)}</small> : null}</span>
          <input name="kg" className="input" inputMode="decimal" placeholder="kg" defaultValue={prs[l.id] ? String(prs[l.id]!.kg).replace('.', ',') : ''} aria-label={`${l.label} kg`} />
          <span aria-hidden>×</span>
          <input name="reps" className="input" inputMode="numeric" placeholder="1" defaultValue={prs[l.id]?.reps ?? ''} aria-label={`${l.label} reps`} />
          <button className="btn btn-line" style={{ height: 40, padding: '0 12px' }}>Lagre</button>
        </form>
      ))}
      {msg && <div className="ok" style={{ marginTop: 8 }}>{msg}</div>}
    </details>
  );
}
