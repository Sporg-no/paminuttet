import 'server-only';
import { supabaseServer } from '@/lib/supabase/server';

export const ACTIVE = ['trialing', 'active', 'past_due'];
const GRACE_MS = 6 * 3600e3;

/** Aktiv status, men ikke et abonnement som er sagt opp og har passert periodeslutt (sikring hvis en webhook uteblir). */
export function hasAccess(sub: Pick<Sub, 'status' | 'cancel_at_period_end' | 'current_period_end'> | null) {
  if (!sub || !ACTIVE.includes(sub.status)) return false;
  if (sub.cancel_at_period_end && sub.current_period_end && Date.parse(sub.current_period_end) + GRACE_MS < Date.now()) return false;
  return true;
}

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
  return { sb, user, sub, active: hasAccess(sub) };
}
