import { NextResponse } from 'next/server';
import { stripe, resolvePrice } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Viser om oppsettet er riktig. Ingen hemmeligheter vises, bare ja/nei og feiltype.
const has = (n: string) => !!process.env[n];

export async function GET() {
  const envs = {
    NEXT_PUBLIC_SUPABASE_URL: has('NEXT_PUBLIC_SUPABASE_URL'),
    supabase_public_key: has('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') || has('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    supabase_secret_key: has('SUPABASE_SECRET_KEY') || has('SUPABASE_SERVICE_ROLE_KEY'),
    STRIPE_SECRET_KEY: has('STRIPE_SECRET_KEY'),
    stripe_key_mode: (process.env.STRIPE_SECRET_KEY || '').slice(0, 8).replace(/_[^_]*$/, '') || null,
    STRIPE_WEBHOOK_SECRET: has('STRIPE_WEBHOOK_SECRET'),
    STRIPE_PRICE_MONTHLY: has('STRIPE_PRICE_MONTHLY'),
    STRIPE_PRICE_ANNUAL: has('STRIPE_PRICE_ANNUAL'),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || null,
    PROGRAM_START: process.env.PROGRAM_START || null,
    RESEND_API_KEY: has('RESEND_API_KEY'),
    MAIL_FROM: process.env.MAIL_FROM || null,
    CRON_SECRET: has('CRON_SECRET'),
  };
  const checks: Record<string, string> = {};
  try {
    const { error } = await supabaseAdmin().from('subscriptions').select('user_id', { count: 'exact', head: true });
    checks.supabase = error ? `feil: ${error.message}` : 'ok';
  } catch (e) { checks.supabase = `feil: ${(e as Error).message}`; }
  for (const [k, n] of [['pris_maaned', 'STRIPE_PRICE_MONTHLY'], ['pris_aar', 'STRIPE_PRICE_ANNUAL']] as const) {
    try {
      const id = await resolvePrice(process.env[n] || 'mangler');
      const p = await stripe().prices.retrieve(id);
      checks[k] = `ok: ${(process.env[n] || '').startsWith('prod_') ? '(fra produkt) ' : ''}${(p.unit_amount ?? 0) / 100} ${p.currency.toUpperCase()} / ${p.recurring?.interval ?? 'engang'}${p.active ? '' : ' (INAKTIV)'}`;
    } catch (e) { checks[k] = `feil: ${(e as Error).message}`; }
  }
  return NextResponse.json({ envs, checks }, { headers: { 'cache-control': 'no-store' } });
}
