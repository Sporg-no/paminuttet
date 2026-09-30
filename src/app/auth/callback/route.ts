import { type NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

// Reserve: standard Supabase-mal med ?code=
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const n = req.nextUrl.searchParams.get('next') || '/program';
  const next = n.startsWith('/') && !n.startsWith('//') ? n : '/program';
  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
  }
  redirect('/logg-inn?e=lenke');
}
