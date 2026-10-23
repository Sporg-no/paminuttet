import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/access';
import { MemberNav } from '@/components/MemberNav';
import { DarkFooter } from '@/components/Footer';
import { CONTACT } from '@/lib/env';
import SetPassword from '@/components/SetPassword';
import VervLenke from '@/components/VervLenke';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { siteUrl } from '@/lib/env';
import { WEEKS, calendarWeekForAbs } from '@/lib/program';
import { LIFTS, e1rm } from '@/lib/strength';

export const metadata: Metadata = { title: 'Min side' };
export const dynamic = 'force-dynamic';

const dato = (s: string | null) => s ? new Date(s).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo' }) : '–';

export default async function Page() {
  const { user, sub, active } = await getSession();
  if (!user) redirect('/logg-inn?neste=/min-side');

  // «Ta med en venn»: personlig lenke og antall vervede som har blitt betalende
  const admin = supabaseAdmin();
  const { data: prof } = await admin.from('profiles').select('ref_code').eq('id', user.id).maybeSingle();
  const { count: vervet } = await admin.from('subscriptions').select('user_id', { count: 'exact', head: true }).eq('referred_by', user.id).not('referral_rewarded_at', 'is', null);
  const vervUrl = prof?.ref_code ? `${siteUrl()}/?venn=${prof.ref_code}` : null;

  // Resultatlogg og maks
  const { data: res } = await admin.from('results').select('week_abs, track, day_idx, score, note, updated_at').eq('user_id', user.id).order('week_abs', { ascending: false }).order('day_idx', { ascending: true }).limit(60);
  const { data: maks } = await admin.from('prs').select('lift, kg, reps').eq('user_id', user.id);
  const logg = (res ?? []).map(r => {
    const w = WEEKS[(r.week_abs - 1) % WEEKS.length];
    const day = (r.track === 'gym' ? w?.gym : w?.home)?.[r.day_idx];
    return { uke: calendarWeekForAbs(r.week_abs), dag: day?.short ?? '', navn: day?.name ?? '', spor: r.track === 'gym' ? 'Gym' : 'Hjemme', score: r.score as string, note: (r.note as string | null) ?? '' };
  });

  let status = 'Ingen aktivt medlemskap';
  let detail = 'Start et medlemskap for å få tilgang til ukens program.';
  if (sub) {
    const plan = sub.interval === 'year' ? '1 990 kr per år' : '199 kr per måned';
    if (sub.status === 'owner') {
      status = 'Eier';
      detail = 'Full tilgang til programmet uten abonnement.';
    } else if (sub.status === 'trialing') {
      status = sub.cancel_at_period_end ? 'Prøveperiode, avsluttet' : 'Prøveperiode';
      detail = sub.cancel_at_period_end
        ? `Du har tilgang til ${dato(sub.trial_end)}. Ingenting blir trukket.`
        : `Gratis til ${dato(sub.trial_end)}. Deretter ${plan}.`;
    } else if (sub.status === 'active') {
      status = sub.cancel_at_period_end ? 'Aktiv, avsluttes' : 'Aktiv';
      detail = sub.cancel_at_period_end ? `Du har tilgang til ${dato(sub.current_period_end)}. Ingen flere trekk.` : `${plan}. Neste trekk ${dato(sub.current_period_end)}.`;
    } else if (sub.status === 'past_due') {
      status = 'Betaling feilet';
      detail = 'Oppdater kortet for å beholde tilgangen. Stripe prøver å trekke på nytt de neste dagene.';
    } else if (sub.status === 'canceled') {
      status = 'Avsluttet';
      detail = 'Medlemskapet ditt er avsluttet. Du kan starte igjen når du vil.';
    } else {
      status = 'Ikke aktivt';
      detail = 'Betalingen er ikke fullført.';
    }
  }

  return (
    <div className="page">
      <MemberNav email={user.email ?? ''} active="min-side" />
      <div className="wrap" style={{ paddingTop: 48 }}>
        <div className="eyebrow">Min side</div>
        <h1 className="h2" style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}>Medlemskap</h1>
      </div>
      <div className="wrap acct">
        <div className="card">
          <div className="label">Status</div>
          <div className="cond" style={{ fontSize: 44, lineHeight: 1, color: active ? 'var(--ink)' : 'var(--sig-text)' }}>{status}</div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: 'var(--body)' }}>{detail}</p>
          <div style={{ marginTop: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {sub?.stripe_customer_id && (
              <form action="/api/portal" method="post"><button className="btn btn-ink" type="submit">{sub.status === 'past_due' ? 'Oppdater kort' : 'Administrer abonnement'}</button></form>
            )}
            {!active && <Link href="/start" className="btn btn-sig">Start medlemskap</Link>}
            {active && <Link href="/program" className="btn btn-line">Til ukens program</Link>}
          </div>
          {sub?.stripe_customer_id && <p style={{ margin: 0, fontSize: 14, color: 'var(--muted2)' }}>Under «Administrer abonnement» kan du avslutte, bytte mellom måned og år, oppdatere kort og laste ned kvitteringer.</p>}
        </div>
        <div className="card">
          <div className="label">Konto</div>
          <div style={{ fontSize: 17 }}><span style={{ color: 'var(--muted2)' }}>E-post: </span><b>{user.email}</b></div>
          <div style={{ fontSize: 17 }}><span style={{ color: 'var(--muted2)' }}>Spor: </span><b>{sub?.track === 'gym' ? 'Gym' : 'Hjemme'}</b> <span style={{ color: 'var(--muted2)', fontSize: 15 }}>(bytt direkte i programmet)</span></div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--muted2)' }}>Du logger inn med Google eller e-post og passord, og forblir innlogget på enheten. Vil du bytte e-post eller slette kontoen, send en e-post til <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
          <div className="label" style={{ marginTop: 8 }}>{user.user_metadata?.has_password ? 'Bytt passord' : 'Lag passord'}</div>
          <SetPassword label={user.user_metadata?.has_password ? 'Lagre nytt passord' : 'Lag passord'} />
          <form action="/api/logout" method="post" style={{ marginTop: 'auto' }}><button className="btn btn-line" type="submit">Logg ut</button></form>
        </div>
        {(logg.length > 0 || (maks ?? []).length > 0) && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="label">Mine resultater</div>
            {(maks ?? []).length > 0 && (
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 15 }}>
                {LIFTS.filter(l => (maks ?? []).some(m => m.lift === l.id)).map(l => {
                  const m = (maks ?? []).find(x => x.lift === l.id)!;
                  return <span key={l.id}><span style={{ color: 'var(--muted2)' }}>{l.label}: </span><b>{String(m.kg).replace('.', ',')} kg × {m.reps}</b> <span style={{ color: 'var(--muted2)' }}>(1RM ≈ {Math.round(e1rm(Number(m.kg), m.reps))})</span></span>;
                })}
              </div>
            )}
            {logg.length > 0 ? (
              <div className="reslist">
                {logg.map((r, i) => (
                  <div key={i} className="resrow">
                    <span className="mono">UKE {r.uke} · {r.dag.toUpperCase()}</span>
                    <span>{r.navn} <span style={{ color: 'var(--muted2)' }}>· {r.spor}</span></span>
                    <b>{r.score}</b>
                    {r.note && <span className="resnote">{r.note}</span>}
                  </div>
                ))}
              </div>
            ) : <p style={{ margin: 0, fontSize: 15, color: 'var(--muted2)' }}>Ingen resultater ennå. Skriv inn resultatet under hver økt i programmet.</p>}
          </div>
        )}
        {active && vervUrl && (
          <div className="card">
            <div className="label">Ta med en venn</div>
            <div className="cond" style={{ fontSize: 44, lineHeight: 1 }}>Én gratis måned per venn</div>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: 'var(--body)' }}>Del lenken din. Vennen får 7 dager gratis som vanlig. Blir vennen betalende medlem, får du 199 kr i kreditt på neste betaling. Det er ingen grense.</p>
            <VervLenke url={vervUrl} />
            {!!vervet && <p style={{ margin: 0, fontSize: 15, color: 'var(--muted2)' }}>Vervet så langt: <b>{vervet}</b> {vervet === 1 ? 'venn' : 'venner'} som har blitt medlem.</p>}
          </div>
        )}
      </div>
      <DarkFooter />
    </div>
  );
}
