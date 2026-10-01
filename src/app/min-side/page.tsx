import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/access';
import { MemberNav } from '@/components/MemberNav';
import { DarkFooter } from '@/components/Footer';
import { CONTACT } from '@/lib/env';

export const metadata: Metadata = { title: 'Min side' };
export const dynamic = 'force-dynamic';

const dato = (s: string | null) => s ? new Date(s).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo' }) : '–';

export default async function Page() {
  const { user, sub, active } = await getSession();
  if (!user) redirect('/logg-inn?neste=/min-side');

  let status = 'Ingen aktivt medlemskap';
  let detail = 'Start et medlemskap for å få tilgang til ukens program.';
  if (sub) {
    const plan = sub.interval === 'year' ? '1 990 kr per år' : '199 kr per måned';
    if (sub.status === 'trialing') {
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
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--muted2)' }}>Du logger inn med en lenke eller kode på e-post. Vil du bytte e-post eller slette kontoen, send en e-post til <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
          <form action="/api/logout" method="post" style={{ marginTop: 'auto' }}><button className="btn btn-line" type="submit">Logg ut</button></form>
        </div>
      </div>
      <DarkFooter />
    </div>
  );
}
