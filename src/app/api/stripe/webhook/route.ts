import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, ensureUser } from '@/lib/supabase/admin';
import { saveSubscription } from '@/lib/subs';
import { sendMail } from '@/lib/mail';
import { welcomeEmail, trialEndingEmail } from '@/lib/emails';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function userForSubscription(sub: Stripe.Subscription): Promise<{ id: string; email: string | null }> {
  const admin = supabaseAdmin();
  const cust = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  const { data } = await admin.from('subscriptions').select('user_id').or(`stripe_subscription_id.eq.${sub.id},stripe_customer_id.eq.${cust}`).limit(1).maybeSingle();
  const c = await stripe().customers.retrieve(cust);
  const email = !('deleted' in c && c.deleted) ? (c as Stripe.Customer).email?.toLowerCase() ?? null : null;
  if (data?.user_id) return { id: data.user_id as string, email };
  if (!email) throw new Error(`Fant ikke e-post for kunde ${cust}`);
  return { id: await ensureUser(email), email };
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig ?? '', env('STRIPE_WEBHOOK_SECRET'));
  } catch (e) {
    console.error('[webhook] signatur', (e as Error).message);
    return NextResponse.json({ error: 'bad signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.mode !== 'subscription' || !s.subscription) break;
        const email = (s.customer_details?.email || s.customer_email || '').toLowerCase();
        if (!email) break;
        const userId = await ensureUser(email);
        const sub = await stripe().subscriptions.retrieve(typeof s.subscription === 'string' ? s.subscription : s.subscription.id);
        await saveSubscription(userId, sub, { track: s.metadata?.track, consent_at: s.metadata?.consent_at });
        const price = sub.items.data[0]?.price?.recurring?.interval === 'year' ? '1 990 kr' : '199 kr';
        const w = welcomeEmail({ trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null, price });
        await sendMail(email, w.subject, w.text, { html: w.html, idempotencyKey: `velkommen-${s.id}` });
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed': {
        const sub = event.data.object as Stripe.Subscription;
        const u = await userForSubscription(sub);
        // Hent ferskeste versjon for å tåle hendelser i feil rekkefølge
        const fresh = await stripe().subscriptions.retrieve(sub.id);
        await saveSubscription(u.id, fresh);
        break;
      }
      case 'customer.subscription.trial_will_end': {
        const sub = event.data.object as Stripe.Subscription;
        if (sub.status !== 'trialing' || sub.cancel_at_period_end) break;
        const u = await userForSubscription(sub);
        if (!u.email) break;
        const end = sub.trial_end ? new Date(sub.trial_end * 1000) : null;
        const dato = end ? end.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', timeZone: 'Europe/Oslo' }) : 'snart';
        const pris = sub.items.data[0]?.price?.recurring?.interval === 'year' ? '1 990 kr' : '199 kr';
        const m = trialEndingEmail({ dato, price: pris });
        await sendMail(u.email, m.subject, m.text, { html: m.html, idempotencyKey: `provetid-${sub.id}-${sub.trial_end}` });
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('[webhook]', event.type, e);
    return NextResponse.json({ error: 'handler failed' }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
