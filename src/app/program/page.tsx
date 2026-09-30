import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/access';
import { WEEKS, schedule, nextRelease } from '@/lib/program';
import { MemberNav } from '@/components/MemberNav';
import { DarkFooter } from '@/components/Footer';
import ProgramView from './ProgramView';

export const metadata: Metadata = { title: 'Ukens program' };
export const dynamic = 'force-dynamic';

const dato = (d: Date) => d.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', timeZone: 'Europe/Oslo' });

export default async function Page({ searchParams }: { searchParams: Promise<{ velkommen?: string }> }) {
  const sp = await searchParams;
  const { user, sub, active } = await getSession();
  if (!user) redirect('/logg-inn?neste=/program');
  if (!active || !sub) redirect('/betaling');

  const sch = schedule();
  const weeks = WEEKS.slice(0, sch.visible); // fremtidige uker sendes aldri til nettleseren

  let banner: { tone: 'info' | 'warn'; text: string } | null = null;
  if (sub.status === 'past_due') {
    banner = { tone: 'warn', text: 'Siste betaling feilet. Oppdater kortet under Min side for å beholde tilgangen.' };
  } else if (sub.cancel_at_period_end) {
    const end = sub.trial_end && sub.status === 'trialing' ? sub.trial_end : sub.current_period_end;
    banner = { tone: 'info', text: `Medlemskapet ditt er avsluttet og varer til ${end ? dato(new Date(end)) : 'periodeslutt'}. Du kan fortsette under Min side.` };
  } else if (sub.status === 'trialing' && sub.trial_end) {
    const end = new Date(sub.trial_end);
    const left = Math.max(0, Math.ceil((end.getTime() - Date.now()) / 864e5));
    banner = { tone: 'info', text: `Prøveperiode: ${left} ${left === 1 ? 'dag' : 'dager'} igjen. Første trekk ${dato(end)}. Avslutt når du vil under Min side.` };
  }
  const note = sch.beforeStart
    ? `Programmet starter ${dato(nextRelease())}. Du kan se og prøve uke 1 allerede nå.`
    : `Neste uke kommer søndag ${dato(nextRelease())} kl. 20.`;

  return (
    <div className="page">
      <MemberNav email={user.email ?? ''} active="program" />
      {banner && (
        <div className="banner wrap" style={banner.tone === 'warn' ? { background: '#121212', color: '#F3F0E8' } : undefined}>
          <span><span className="bdot" /><b>{banner.text.split('.')[0]}.</b>{banner.text.slice(banner.text.indexOf('.') + 1)}</span>
          <a href="/min-side" style={{ fontWeight: 600, color: 'inherit' }}>Min side</a>
        </div>
      )}
      <ProgramView weeks={weeks} currentIdx={sch.weekIdx} cycle={sch.cycle} note={note} initialTrack={sub.track} welcome={sp.velkommen === '1'} />
      <DarkFooter />
    </div>
  );
}
