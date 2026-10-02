import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { Brand } from '@/components/Brand';
import { DarkFooter } from '@/components/Footer';
import SetPassword from '@/components/SetPassword';

export const metadata: Metadata = { title: 'Nytt passord' };
export const dynamic = 'force-dynamic';

export default async function Page() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/logg-inn?e=lenke');
  return (
    <div className="page">
      <nav className="nav wrap"><Brand /></nav>
      <div className="formwrap">
        <div className="formcard">
          <div className="eyebrow">Nytt passord</div>
          <h1>Velg et passord.</h1>
          <p className="lead" style={{ margin: 0 }}>For {user.email}. Minst 8 tegn.</p>
          <SetPassword label="Lagre passord" />
          <Link href="/program" className="btn btn-line btn-block">Til ukens program</Link>
        </div>
      </div>
      <DarkFooter />
    </div>
  );
}
