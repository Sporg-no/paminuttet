import type { Metadata } from 'next';
import Link from 'next/link';
import { Brand } from '@/components/Brand';
import { DarkFooter } from '@/components/Footer';
import { WEEKS, schedule, calendarWeekForAbs } from '@/lib/program';
import ProgramView from '../program/ProgramView';

export const metadata: Metadata = {
  title: 'Dagens økt · gratis',
  description: 'Prøv dagens EMOM-økt fra PÅ MINUTTET med timer og fem nivåer. Gym eller hjemme.',
};
export const dynamic = 'force-dynamic';

/** Offentlig prøveøkt: bare dagens økt fra uka som er sluppet, ingen innlogging. */
export default function Page() {
  const sch = schedule();
  const week = WEEKS[sch.weekIdx];
  const oslo = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Oslo' }));
  const wd = oslo.getDay(); // 0 = søndag
  const i = wd === 0 ? 0 : Math.min(5, wd - 1);
  const one = { ...week, gym: [week.gym[i]], home: [week.home[i]] };
  return (
    <div className="page">
      <nav className="nav wrap"><Brand /><div className="nav-right"><Link href="/logg-inn" className="btn btn-line btn-sm">Logg inn</Link><Link href="/start" className="btn btn-sig btn-sm">7 dager gratis</Link></div></nav>
      <ProgramView demo weeks={[one]} labels={[calendarWeekForAbs(sch.abs)]} absList={[]} cycle={[]} currentIdx={0} note="Medlemmer ser hele uka og neste uke kommer søndag kl. 20." initialTrack="hjemme" welcome={false} needsPassword={false} />
      <DarkFooter />
    </div>
  );
}
