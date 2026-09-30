import 'server-only';
import type Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

const iso = (s?: number | null) => (s ? new Date(s * 1000).toISOString() : null);

/** Skriv Stripe-abonnementet til databasen. */
export async function saveSubscription(userId: string, sub: Stripe.Subscription, extra: { track?: string; consent_at?: string } = {}) {
  const item = sub.items?.data?.[0];
  // Nyere API-versjoner har periodeslutt på item, eldre på abonnementet
  const periodEnd = (item as unknown as { current_period_end?: number })?.current_period_end
    ?? (sub as unknown as { current_period_end?: number }).current_period_end;
  const row: Record<string, unknown> = {
    user_id: userId,
    stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    stripe_subscription_id: sub.id,
    status: sub.status,
    price_id: item?.price?.id ?? null,
    interval: item?.price?.recurring?.interval ?? null,
    trial_end: iso(sub.trial_end),
    current_period_end: iso(periodEnd),
    cancel_at_period_end: !!sub.cancel_at_period_end || !!sub.cancel_at,
    updated_at: new Date().toISOString(),
  };
  const track = extra.track ?? sub.metadata?.track;
  if (track === 'gym' || track === 'hjemme') row.track = track;
  if (extra.consent_at) row.consent_at = extra.consent_at;
  const { error } = await supabaseAdmin().from('subscriptions').upsert(row, { onConflict: 'user_id' });
  if (error) throw error;
}
