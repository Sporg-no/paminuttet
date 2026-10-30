'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Week } from '@/lib/program';
import { timerState, mmss, pad2 } from '@/lib/timer';
import { Dial } from '@/components/Dial';
import SetPassword from '@/components/SetPassword';
import { ovelseTekst, OvelseArk } from '@/components/OvelseTekst';
import type { Ovelse } from '@/content/ovelser';
import { useLogg, ResultatBoks, MaksPanel, rkey } from '@/components/Logg';
import { liftOf, withKg } from '@/lib/strength';
import DemoLead from '@/components/DemoLead';
import { track as trackEvent } from '@vercel/analytics';

const LVLS = ['Grunnmur', 'Nivå 1', 'Nivå 2', 'Nivå 3', 'Nivå 4'];
const HEAD = ['Bevegelse', 'Nivå 4', 'Nivå 3', 'Nivå 2', 'Nivå 1', 'Grunnmur'];
const BONE = 'var(--bone)';

function load(key: string, fallback: number) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : Number(v); } catch { return fallback; }
}
function save(key: string, v: string | number) { try { localStorage.setItem(key, String(v)); } catch { /* ignorer */ } }

function todayIdx() {
  const d = new Date().getDay(); // 0 = søndag
  return d === 0 ? 0 : Math.min(5, d - 1);
}

type CycleWeek = { title: string; intro: string; label: number };

export default function ProgramView({ demo = false, weeks, labels, absList, cycle, currentIdx, note, initialTrack, welcome, needsPassword }: {
  demo?: boolean; weeks: Week[]; labels: number[]; absList: number[]; cycle: CycleWeek[]; currentIdx: number; note: string; initialTrack: 'gym' | 'hjemme'; welcome: boolean; needsPassword: boolean;
}) {
  const [showCycle, setShowCycle] = useState(false);
  const logg = useLogg(absList);
  const [wk, setWk] = useState(currentIdx);
  const [track, setTrack] = useState<'gym' | 'hjemme'>(initialTrack);
  const [day, setDay] = useState(0);
  const [lvl, setLvl] = useState(2);
  const [ov, setOv] = useState<Ovelse | null>(null);
  const T = (x: string) => ovelseTekst(x, setOv);
  const [running, setRunning] = useState(false);
  const [acc, setAcc] = useState(0);
  const [t0, setT0] = useState(0);
  const [now, setNow] = useState(0);
  const [sound, setSound] = useState(true);
  const [showWelcome, setShowWelcome] = useState(welcome);
  const [showPw, setShowPw] = useState(needsPassword);
  const audio = useRef<AudioContext | null>(null);
  const lastE = useRef(-1);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);

  useEffect(() => {
    setLvl(load('pm-lvl', 2));
    setSound(load('pm-lyd', 1) === 1);
    setDay(todayIdx());
    setShowCycle(load('pm-syklus', 0) === 1);
    if (welcome) window.history.replaceState(null, '', '/program');
  }, [welcome]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(iv);
  }, [running]);

  // Hold skjermen våken mens klokka går
  useEffect(() => {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    if (running && nav.wakeLock) nav.wakeLock.request('screen').then(l => { wake.current = l; }).catch(() => {});
    if (!running && wake.current) { wake.current.release().catch(() => {}); wake.current = null; }
  }, [running]);

  const week = weeks[wk];
  const list = track === 'gym' ? week.gym : week.home;
  const d = list[Math.min(day, list.length - 1)];
  const C = d.C;
  const col = 5 - lvl;
  const eRaw = Math.floor((acc + (running ? Math.max(0, now - t0) : 0)) / 1000);
  const ts = timerState(C, col, eRaw);
  const started = eRaw > 0 || running;
  const sec = ts.e % 60;

  // Lyd: pip de tre siste sekundene før nytt minutt / runde / slutt
  useEffect(() => {
    if (!running || !sound || eRaw === lastE.current) return;
    lastE.current = eRaw;
    const T = C.timer;
    let toBoundary = -1;
    if (T.t === 'emom') toBoundary = 60 - (eRaw % 60);
    else if (T.t === 'every') toBoundary = T.each - (eRaw % T.each);
    else if (T.t === 'amrap') toBoundary = T.m * 60 - eRaw;
    else if (T.cap) toBoundary = T.cap * 60 - eRaw;
    const boundaryNow = eRaw > 0 && ((T.t === 'emom' && eRaw % 60 === 0) || (T.t === 'every' && eRaw % T.each === 0) || ts.done);
    if (boundaryNow) beep(880, 0.45);
    else if (toBoundary >= 1 && toBoundary <= 3) beep(660, 0.12);
    if (ts.done) { setRunning(false); setAcc(ts.total * 1000); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eRaw, running]);

  function beep(freq: number, dur: number) {
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq; o.type = 'square';
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch { /* ingen lyd */ }
  }

  function reset() { setRunning(false); setAcc(0); setT0(0); setNow(Date.now()); lastE.current = -1; }
  function toggle() {
    if (!audio.current) { try { audio.current = new AudioContext(); } catch { /* */ } }
    audio.current?.resume?.();
    const n = Date.now();
    if (running) { setRunning(false); setAcc(a => a + (n - t0)); setNow(n); }
    else if (ts.done) { lastE.current = -1; setAcc(0); setT0(n); setNow(n); setRunning(true); }
    else { setT0(n); setNow(n); setRunning(true); if (demo && eRaw === 0) trackEvent('Dagens økt startet', { spor: track }); }
  }
  function pickTrack(t: 'gym' | 'hjemme') {
    setTrack(t); reset();
    fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ track: t }) }).catch(() => {});
  }
  function pickLvl(i: number) { setLvl(i); save('pm-lvl', i); }

  const idle = C.timer.t === 'emom' ? '1:00' : C.timer.t === 'amrap' ? mmss(C.timer.m * 60) : C.timer.t === 'every' ? mmss(C.timer.each) : '0:00';
  const progress = ts.total ? Math.min(100, (ts.e / ts.total) * 100) : 0;
  const runLabel = running ? 'Pause' : ts.done ? 'Start på nytt' : eRaw > 0 ? 'Fortsett' : 'Start klokka';
  const isCurrent = wk === currentIdx;
  const weekNo = labels[wk] ?? week.n;
  const weekLabel = `UKE ${weekNo} · ${week.title.toUpperCase()}`;

  const rows = useMemo(() => C.rows, [C]);

  return (
    <div className="wrap prog">
      <aside className="side">
        <div className="eyebrow">{weekLabel}</div>
        {weeks.length > 1 && (
          <div className="weeks" role="group" aria-label="Uke">
            {weeks.map((w, i) => (
              <button key={w.n} type="button" className="pill on-card" aria-pressed={i === wk} onClick={() => { setWk(i); setDay(i === currentIdx ? todayIdx() : 0); reset(); }}>Uke {labels[i] ?? w.n}</button>
            ))}
          </div>
        )}
        <div className="seg" role="group" aria-label="Spor">
          <button type="button" aria-pressed={track === 'gym'} onClick={() => pickTrack('gym')}>Gym</button>
          <button type="button" aria-pressed={track === 'hjemme'} onClick={() => pickTrack('hjemme')}>Hjemme</button>
        </div>
        <div className="label" style={{ marginTop: 12 }}>Dag</div>
        <div className="days">
          {list.map((x, i) => (
            <button key={x.day} type="button" className="pill on-card" aria-pressed={i === day} onClick={() => { setDay(i); reset(); }}>
              <span className="mono">{x.short.toUpperCase()} · {x.optional ? 'VALGFRI' : x.dur.toUpperCase()}{isCurrent && i === todayIdx() ? ' · I DAG' : ''}</span>
              <span className="cond">{x.name}</span>
            </button>
          ))}
        </div>
        <div className="label" style={{ marginTop: 12 }}>Nivå</div>
        <div className="lvls">
          {LVLS.map((l, i) => (
            <button key={l} type="button" className="pill on-card" aria-pressed={i === lvl} onClick={() => pickLvl(i)}>
              <span>{l}</span>
              <span className="dots" aria-hidden>{[0, 1, 2, 3, 4].map(k => <i key={k} className={k <= i ? 'on' : ''} />)}</span>
            </button>
          ))}
        </div>
        <p className="hint" style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--muted2)' }}>Rekker du ikke minuttet to ganger på rad: gå ned ett nivå.</p>
        {lvl === 4 && (
          <p className="hint" style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--muted2)' }}>
            <b>For lett? Nivå 4+:</b>{' '}
            {track === 'gym'
              ? 'konkurransevekter (wallball 14/9 kg, KB 32/24 kg, DB 30/22,5 kg, stang +10 %) og vanskeligste gymnastikk: chest-to-bar i stedet for pull-ups, bar muscle-ups i stedet for C2B, HSPU i stedet for pike push-ups.'
              : 'vektvest 10/6 kg, hoppvarianten av hver øvelse og 10 % flere reps.'}
          </p>
        )}
        {!demo && track === 'gym' && <MaksPanel prs={logg.prs} oneRm={logg.oneRm} onSave={logg.savePr} />}
        <p className="hint" style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--muted2)' }}>{note}</p>
      </aside>

      <main>
        {showWelcome && !showPw && (
          <div className="ok fade" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span><b>Velkommen.</b> Du er logget inn og forblir innlogget på denne enheten.</span>
            <button type="button" className="linkbtn" style={{ color: BONE }} onClick={() => setShowWelcome(false)}>Lukk</button>
          </div>
        )}
        {showPw && (
          <div className="card fade" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <div className="eyebrow">{welcome ? 'Velkommen · ett steg til' : 'Raskere innlogging'}</div>
              <button type="button" className="linkbtn" style={{ fontSize: 13 }} onClick={() => setShowPw(false)}>Senere</button>
            </div>
            <div style={{ fontSize: 16, lineHeight: 1.5 }}>Lag et passord, så logger du inn med e-post og passord neste gang, uten kode. Du forblir innlogget på denne enheten.</div>
            <SetPassword compact onDone={() => setTimeout(() => setShowPw(false), 2500)} />
            <div style={{ fontSize: 13, color: 'var(--muted2)' }}>Tips: legg siden til på Hjem-skjermen (Del → Legg til på Hjem-skjerm), så åpnes den som en app.</div>
          </div>
        )}
        {demo && (
          <div className="card demo-cta">
            <div className="eyebrow">Gratis prøveøkt · i dag</div>
            <div style={{ fontSize: 16, lineHeight: 1.5 }}>Dette er dagens økt fra ukens program, med samme timer og fem nivåer som medlemmene bruker. Velg Gym eller Hjemme og nivået ditt, og trykk Start klokka.</div>
            <a href="/start" className="btn btn-sig" style={{ alignSelf: 'flex-start' }}>Få en ny økt hver dag · 7 dager gratis</a>
          </div>
        )}
        {!demo && (
        <section className="card cycle" aria-label="Syklusen">
          <div className="cyc-head">
            <span className="eyebrow">Syklusen · uke {currentIdx + 1} av {cycle.length}</span>
            <button type="button" className="linkbtn" style={{ fontSize: 13 }} aria-expanded={showCycle} onClick={() => { const v = !showCycle; setShowCycle(v); save('pm-syklus', v ? 1 : 0); }}>{showCycle ? 'Skjul planen' : 'Vis hele planen'}</button>
          </div>
          <div className="cyc-bar">
            {cycle.map((c, i) => {
              const state = i < currentIdx ? 'done' : i === currentIdx ? 'now' : 'next';
              const open = i < weeks.length;
              return (
                <button key={i} type="button" className={`cyc ${state}${i === wk ? ' sel' : ''}`} disabled={!open}
                  onClick={() => { if (open) { setWk(i); setDay(i === currentIdx ? todayIdx() : 0); reset(); } }}
                  aria-label={`Uke ${c.label}: ${c.title}${state === 'now' ? ', denne uka' : ''}`}>
                  <span className="mono">UKE {c.label}</span>
                  <span className="cond">{c.title}</span>
                </button>
              );
            })}
          </div>
          {showCycle && (
            <div className="cyc-list fade">
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--body)' }}>Programmet går i blokker på fire uker: grunnlag, mer volum, tyngste uke og test. I testukene tar du de samme øktene som tre uker før, så du ser fremgangen. Neste blokk starter der du endte.</p>
              <ol>
                {cycle.map((c, i) => (
                  <li key={i} className={i === currentIdx ? 'now' : ''}>
                    <span className="mono">UKE {c.label}{i === currentIdx ? ' · NÅ' : ''}</span>
                    <b>{c.title}</b>
                    <span>{c.intro}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
        )}

        <div className="fade" key={`${wk}-${track}-${day}`}>
          <div className="eyebrow">{d.day} · {track === 'gym' ? 'Gym' : 'Hjemme'} · uke {weekNo}{d.optional ? ' · valgfri' : ''}{d.benchmark ? ' · test' : ''}</div>
          <h1>{d.name}</h1>
          {day === 0 && <p style={{ margin: '10px 0 0', fontSize: 16, color: 'var(--body)' }}>{week.intro}</p>}
          {/gjentak/i.test(d.name) && wk >= 3 && (
            <button type="button" className="linkbtn" style={{ marginTop: 10 }} onClick={() => { setWk(wk - 3); reset(); }}>
              Gjentak av økta i uke {labels[wk - 3]}. Se den og sammenlign resultatet →
            </button>
          )}
        </div>

        <section aria-label="Timer" className="dark timer">
          <Dial size={168} lit={started ? sec : -1} hand={started ? sec : 0} on={BONE} off="#333333">
            <span className="cond" style={{ fontSize: 48 }}>{pad2(sec)}</span>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '.16em', color: 'var(--dim)', fontWeight: 700, marginTop: 4 }}>SEKUNDER</span>
          </Dial>
          <div style={{ minWidth: 0 }} aria-live="polite" aria-atomic="true">
            <div className="eyebrow">{started ? ts.label : `KLAR · ${C.fmt.toUpperCase()}`}</div>
            <div className="tbig">{started ? ts.big : idle}</div>
            <div className="ttask">{started ? <><span style={{ color: 'var(--sig)' }}>{ts.taskVal}</span> {ts.task}</> : 'Trykk start når du er klar'}</div>
            <div className="progress" aria-hidden><div style={{ width: `${progress}%` }} /></div>
          </div>
          <div className="tbtns">
            <button type="button" className="btn btn-sig" style={{ height: 60, fontSize: 18 }} onClick={toggle}>{runLabel}</button>
            <button type="button" className="btn btn-line" style={{ height: 52, color: BONE }} onClick={reset}>Nullstill</button>
            <button type="button" className="linkbtn" style={{ color: 'var(--dim)', fontSize: 13, textAlign: 'center', fontFamily: 'var(--f-mono)', letterSpacing: '.1em', textDecoration: 'none' }} onClick={() => { const v = !sound; setSound(v); save('pm-lyd', v ? 1 : 0); }} aria-pressed={sound}>
              {LVLS[lvl].toUpperCase()} · LYD {sound ? 'PÅ' : 'AV'}
            </button>
          </div>
        </section>

        <div className="blocks">
          <div className="card block">
            <div className="eyebrow">A · Oppvarming</div>
            <ul>{(d.A ?? []).map(x => <li key={x}><span>{T(x)}</span></li>)}</ul>
          </div>
          <div className="card block">
            <div className="eyebrow">B · Styrke{d.B ? <> · {T(d.B.t)}</> : ''}</div>
            <ul>{(d.B ? d.B.l : ['Ingen styrke i dag. Bruk tiden på oppvarming og mobilitet.']).map(x => {
              const lift = track === 'gym' && d.B ? liftOf(d.B.t, x) : null;
              const rm = lift ? logg.oneRm[lift] : undefined;
              return <li key={x}><span>{T(rm && /%/.test(x) ? withKg(x, rm) : x)}</span></li>;
            })}</ul>
            {track === 'gym' && d.B && d.B.l.some(x => /%/.test(x) && !/^grunnmur/i.test(x) && liftOf(d.B!.t, x) && !logg.oneRm[liftOf(d.B!.t, x)!]) && (
              <p style={{ margin: 0, fontSize: 13, color: 'var(--muted2)' }}>Legg inn maks under «Dine maks», så regnes vektene ut for deg.</p>
            )}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
              <span className="eyebrow">C · Kondisjon</span>
              <span className="cond" style={{ fontSize: 30 }}>{C.fmt}</span>
            </div>
            <span className="hint" style={{ fontSize: 14, color: 'var(--muted2)' }}>Nivået ditt er uthevet. Trykk på en øvelse for forklaring og video.</span>
          </div>
          <div className="ctable" role="table" aria-label="Kondisjonsdel per nivå">
            <div className="tr th" role="row">{HEAD.map((h, i) => <div key={h} role="columnheader" className={i === col ? 'col' : ''}>{h}</div>)}</div>
            {rows.map((r, ri) => (
              <div key={ri} role="row" className={`tr${started && !ts.done && ri === ts.activeRow ? ' active' : ''}`}>
                {r.map((c, ci) => <div key={ci} role="cell" className={`td${ci === 0 ? ' mv' : ''}${ci === col ? ' col' : ''}`}>{T(c)}</div>)}
              </div>
            ))}
          </div>
          <div className="clist">
            {rows.map((r, ri) => (
              <div key={ri} className={`ci${started && !ts.done && ri === ts.activeRow ? ' active' : ''}`}><span>{T(r[0])}</span><b>{T(r[col])}</b></div>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.5 }}><span className="eyebrow" style={{ paddingTop: 2 }}>Score</span><span>{C.score}</span></div>
        </div>

        {demo ? (
          <div className="card demo-cta">
            <div className="eyebrow">Likte du økta?</div>
            <div className="cond" style={{ fontSize: 40, lineHeight: .95 }}>Ny økt hver dag. Ferdig planlagt.</div>
            <div style={{ fontSize: 16, lineHeight: 1.5 }}>Medlemmer får seks økter i uka i blokker på fire uker, med testuker som viser fremgangen, resultatlogg og utregnede vekter. 199 kr i måneden, og de første 7 dagene er gratis.</div>
            <a href="/start" className="btn btn-sig" style={{ alignSelf: 'flex-start' }}>Start 7 dager gratis</a>
            <DemoLead />
          </div>
        ) : (() => {
          const abs = absList[wk];
          const tr = track;
          const di = Math.min(day, list.length - 1);
          const prevIdx = /gjentak/i.test(d.name) && wk >= 3 ? wk - 3 : -1;
          const ph = C.timer.t === 'emom' || C.timer.t === 'every' ? 'F.eks. 28 minutter eller 1:42' : C.timer.t === 'amrap' ? 'F.eks. 6 runder + 12 reps' : 'F.eks. 14:32';
          return (
            <ResultatBoks
              key={rkey(abs, tr, di)}
              placeholder={ph}
              saved={logg.results[rkey(abs, tr, di)]}
              prev={prevIdx >= 0 ? logg.results[rkey(absList[prevIdx], tr, di)] : undefined}
              prevLabel={prevIdx >= 0 ? `Uke ${labels[prevIdx]}` : undefined}
              onSave={(sc, no) => logg.saveResult(abs, tr, di, sc, no, lvl)}
            />
          );
        })()}

        {(d.D ?? []).length > 0 && (
          <div className="card block" style={{ display: 'flex', gap: 20, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div className="eyebrow" style={{ whiteSpace: 'nowrap' }}>D · Finisher (valgfri)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{(d.D ?? []).map(x => <div key={x} style={{ fontSize: 15 }}>{T(x)}</div>)}</div>
          </div>
        )}
      </main>
      <OvelseArk o={ov} lukk={() => setOv(null)} />
    </div>
  );
}
