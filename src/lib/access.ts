import 'server-only';
import { supabaseServer } from '@/lib/supabase/server';

export const ACTIVE = ['trialing', 'active', 'past_due'];

export type Sub = {
  status: string;
  interval: string | null;
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  track: 'gym' | 'hjemme';
  stripe_customer_id: string | null;
};

export async function getSession() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { sb, user: null, sub: null as Sub | null, active: false };
  const { data } = await sb.from('subscriptions')
    .select('status, interval, trial_end, current_period_end, cancel_at_period_end, track, stripe_customer_id')
    .eq('user_id', user.id).maybeSingle();
  const sub = (data as Sub | null) ?? null;
  return { sb, user, sub, active: !!sub && ACTIVE.includes(sub.status) };
}
