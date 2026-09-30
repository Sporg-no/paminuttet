import { type NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { supabaseServer } from '@/lib/supabase/server';

// Lenke fra e-postmalen: /auth/confirm?token_hash=...&type=email&next=/program
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const token_hash = sp.get('token_hash');
  const type = (sp.get('type') || 'email') as EmailOtpType;
  const n = sp.get('next') || '/program';
  const next = n.startsWith('/') && !n.startsWith('//') ? n : '/program';
  if (token_hash) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.verifyOtp({ type, token_hash });
    if (!error) redirect(next);
  }
  redirect('/logg-inn?e=lenke');
}
