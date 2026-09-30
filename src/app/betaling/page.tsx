import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/access';
import { WEEKS, schedule } from '@/lib/program';
import { MemberNav } from '@/components/MemberNav';
import { DarkFooter } from '@/components/Footer';

export const metadata: Metadata = { title: 'Medlemskap kreves' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { user, sub, active } = await getSession();
  if (!user) redirect('/logg-inn?neste=/program');
  if (active) redirect('/program');

  const week = WEEKS[schedule().weekIdx];
  const days = sub?.track === 'gym' ? week.gym : week.home;
  const failed = sub && ['unpaid', 'incomplete', 'incomplete_expired'].includes(sub.status);
  const title = !sub ? 'Du er nesten inne.' : failed ? 'Betalingen gikk ikke gjennom.' : 'Medlemskapet ditt er avsluttet.';
  const text = !sub
    ? 'Kontoen din har ikke et medlemskap ennå. Start prøveperioden for å åpne ukens program.'
    : failed ? 'Oppdater kortet, så åpnes programmet igjen med en gang.'
    : 'Start igjen for å få tilgang til ukens program. Fremgangen din og nivåvalgene ligger der fortsatt.';

  return (
    <div className="page">
      <MemberNav email={user.email ?? ''} active="betaling" />
      <div className="wrap start pay">
        <div className="start-main">
          <div className="eyebrow">Ukens program er låst</div>
          <h1>{title}</h1>
          <p className="lead" style={{ margin: 0, maxWidth: 560 }}>{text}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {failed && sub?.stripe_customer_id ? (
              <form action="/api/portal" method="post"><button className="btn btn-sig" type="submit" style={{ height: 60, fontSize: 18 }}>Oppdater kort</button></form>
            ) : (
              <Link href="/start" className="btn btn-sig" style={{ height: 60, fontSize: 18 }}>{sub ? 'Start igjen' : 'Start 7 dager gratis'}</Link>
            )}
            <Link href="/min-side" className="btn btn-line" style={{ height: 60 }}>Min side</Link>
          </div>
        </div>
        <div className="dark summary" aria-label="Denne uka">
          <div className="eyebrow">Uke {week.n} · {week.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {days.map(d => (
              <div key={d.day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 16px', border: '1px solid #333', borderRadius: 14 }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', color: '#9A958B' }}>{d.short.toUpperCase()} · {d.dur.toUpperCase()}</div>
                  <div className="cond" style={{ fontSize: 24, lineHeight: 1.1 }}>{d.name}</div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2" aria-label="Låst"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DarkFooter />
    </div>
  );
}
