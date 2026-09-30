import { type NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { supabaseServer } from '@/lib/supabase/server';

// Egen e-postmal: /auth/confirm?token_hash=...&type=email&next=/program
// Standardmal fra Supabase: /auth/confirm?next=/program&code=...
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const token_hash = sp.get('token_hash');
  const code = sp.get('code');
  const type = (sp.get('type') || 'email') as EmailOtpType;
  const n = sp.get('next') || '/program';
  const next = n.startsWith('/') && !n.startsWith('//') ? n : '/program';
  const sb = await supabaseServer();
  if (token_hash) {
    const { error } = await sb.auth.verifyOtp({ type, token_hash });
    if (!error) redirect(next);
  } else if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
  }
  redirect('/logg-inn?e=lenke');
}
