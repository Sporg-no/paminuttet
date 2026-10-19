import 'server-only';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendMail } from '@/lib/mail';
import { referralRewardEmail } from '@/lib/emails';

const CREDIT_ORE = 19900; // én måned (199 kr) i kreditt per vervet venn som blir betalende

/**
 * «Ta med en venn»: når et vervet abonnement går over til betalt (active), får den som vervet
 * 199 kr i kreditt på neste faktura. Kjøres fra webhooken, maks én gang per vervet abonnement.
 */
export async function rewardReferrer(sub: Stripe.Subscription) {
  const referrer = sub.metadata?.referrer;
  if (!referrer || sub.status !== 'active') return;
  const admin = supabaseAdmin();
  // Krev belønningen atomisk, så en webhook som kommer to ganger ikke gir dobbel kreditt
  const { data: claimed } = await admin.from('subscriptions')
    .update({ referral_rewarded_at: new Date().toISOString() })
    .eq('stripe_subscription_id', sub.id).is('referral_rewarded_at', null)
    .select('user_id');
  if (!claimed?.length) return;

  const { data: ref } = await admin.from('subscriptions').select('stripe_customer_id, status').eq('user_id', referrer).maybeSingle();
  if (!ref?.stripe_customer_id || !['active', 'trialing', 'past_due'].includes(ref.status)) return;
  await stripe().customers.createBalanceTransaction(ref.stripe_customer_id, {
    amount: -CREDIT_ORE, currency: sub.currency || 'nok', description: 'Ta med en venn: én måned gratis',
  }, { idempotencyKey: `venn-kreditt-${sub.id}` });

  const { data: prof } = await admin.from('profiles').select('email').eq('id', referrer).maybeSingle();
  if (prof?.email) {
    const m = referralRewardEmail();
    await sendMail(prof.email, m.subject, m.text, { html: m.html, idempotencyKey: `venn-epost-${sub.id}` });
  }
}
