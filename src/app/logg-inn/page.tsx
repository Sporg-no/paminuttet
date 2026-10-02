import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Brand } from '@/components/Brand';
import { DarkFooter } from '@/components/Footer';
import LoginForm from './LoginForm';
import { supabaseServer } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Logg inn' };

const MSG: Record<string, string> = {
  lenke: 'Lenken er brukt eller utløpt. Be om en ny under.',
  brukt: 'Kjøpet er registrert. Logg inn med e-posten du brukte i kassen.',
  feil: 'Noe gikk galt med innloggingen. Prøv igjen.',
  google: 'Fant ingen medlemskap for den Google-kontoen. Bruk samme e-post som da du startet prøveperioden, eller logg inn med e-post.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ neste?: string; e?: string }> }) {
  const sp = await searchParams;
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  const next = sp.neste && sp.neste.startsWith('/') && !sp.neste.startsWith('//') ? sp.neste : '/program';
  if (data.user) redirect(next);
  return (
    <div className="page">
      <nav className="nav wrap"><Brand /><div className="nav-right"><span className="hide-sm" style={{ color: 'var(--muted2)', fontSize: 15 }}>Ikke medlem ennå?</span><a href="/start" className="btn btn-sig btn-sm">Start 7 dager gratis</a></div></nav>
      <div className="formwrap">
        <div className="formcard">
          <div className="eyebrow">Logg inn</div>
          <h1>Ukens program venter.</h1>
          <p className="lead" style={{ margin: 0 }}>Logg inn med Google eller e-post og passord. Du forblir innlogget på denne enheten.</p>
          {sp.e && MSG[sp.e] && <div className="err">{MSG[sp.e]}</div>}
          <LoginForm next={next} />
        </div>
      </div>
      <DarkFooter />
    </div>
  );
}
