import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

export function supabaseAdmin() {
  const key = process.env.SUPABASE_SECRET_KEY || env('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(env('NEXT_PUBLIC_SUPABASE_URL'), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Finn bruker-id for e-post, opprett bruker hvis den ikke finnes. */
export async function ensureUser(email: string): Promise<string> {
  const admin = supabaseAdmin();
  const e = email.trim().toLowerCase();
  const { data: prof } = await admin.from('profiles').select('id').eq('email', e).maybeSingle();
  if (prof?.id) return prof.id as string;
  const { data, error } = await admin.auth.admin.createUser({ email: e, email_confirm: true });
  if (data?.user) return data.user.id;
  // Finnes allerede i auth men mangler profil (skal ikke skje, men håndteres)
  if (error) {
    const { data: again } = await admin.from('profiles').select('id').eq('email', e).maybeSingle();
    if (again?.id) return again.id as string;
    throw error;
  }
  throw new Error('Kunne ikke opprette bruker');
}
