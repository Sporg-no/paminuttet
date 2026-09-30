import type { Metadata } from 'next';
import Link from 'next/link';
import { Brand } from '@/components/Brand';
import { DarkFooter } from '@/components/Footer';
import StartForm from './StartForm';
import { getSession } from '@/lib/access';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Start prøveperioden' };

export default async function Page({ searchParams }: { searchParams: Promise<{ plan?: string; spor?: string; avbrutt?: string }> }) {
  const sp = await searchParams;
  let email = '';
  try {
    const s = await getSession();
    if (s.active) redirect('/program');
    if (s.user) email = s.user.email ?? '';
  } catch (e) {
    if ((e as { digest?: string })?.digest?.startsWith('NEXT_REDIRECT')) throw e;
  }
  return (
    <div className="page">
      <nav className="nav wrap"><Brand /><div className="nav-right"><span className="hide-sm" style={{ color: '#5E594F', fontSize: 15 }}>Allerede medlem?</span><Link href="/logg-inn" className="btn btn-line btn-sm">Logg inn</Link></div></nav>
      {sp.avbrutt && <div className="banner wrap"><span><span className="bdot" />Betalingen ble avbrutt. Ingenting er trukket. Du kan prøve igjen under.</span></div>}
      <StartForm initialPlan={sp.plan === 'aar' ? 'aar' : 'maaned'} initialTrack={sp.spor === 'gym' ? 'gym' : 'hjemme'} initialEmail={email} lockedEmail={!!email} />
      <DarkFooter />
    </div>
  );
}
