import { type NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

// Google-innlogging (og reserve for e-postmaler med ?code=)
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const n = sp.get('next') || '/program';
  const next = n.startsWith('/') && !n.startsWith('//') ? n : '/program';
  if (sp.get('error')) {
    console.warn('[auth/callback]', sp.get('error'), sp.get('error_description'));
    redirect('/logg-inn?e=google');
  }
  const code = sp.get('code');
  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
  }
  redirect('/logg-inn?e=lenke');
}
