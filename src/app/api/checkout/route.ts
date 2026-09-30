import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';
import { stripe, priceFor, type Plan } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';
import { ACTIVE } from '@/lib/access';
import { siteUrl } from '@/lib/env';

export const runtime = 'nodejs';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  let body: { plan?: string; track?: string; email?: string; consent?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Ugyldig forespørsel.' }, { status: 400 }); }
  const plan: Plan = body.plan === 'aar' ? 'aar' : 'maaned';
  const track = body.track === 'gym' ? 'gym' : 'hjemme';
  if (body.consent !== true) return NextResponse.json({ error: 'Du må samtykke for å fortsette.' }, { status: 400 });

  // Innlogget bruker bruker alltid sin egen e-post
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  const email = (user?.email ?? body.email ?? '').trim().toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ error: 'Skriv inn en gyldig e-postadresse.' }, { status: 400 });

  const admin = supabaseAdmin();
  const { data: prof } = await admin.from('profiles').select('id').eq('email', email).maybeSingle();
  let customer: string | undefined;
  let hadSub = false;
  if (prof?.id) {
    const { data: sub } = await admin.from('subscriptions').select('status, stripe_customer_id, stripe_subscription_id').eq('user_id', prof.id).maybeSingle();
    if (sub && ACTIVE.includes(sub.status)) {
      return NextResponse.json({ error: 'Denne e-posten har allerede et aktivt medlemskap.', login: true }, { status: 409 });
    }
    customer = sub?.stripe_customer_id ?? undefined;
    hadSub = !!sub?.stripe_subscription_id;
  }
  // Ekstra sjekk mot Stripe: tidligere abonnement på samme e-post gir ikke ny prøveperiode
  if (!hadSub) {
    const found = await stripe().customers.list({ email, limit: 3 });
    for (const c of found.data) {
      const subs = await stripe().subscriptions.list({ customer: c.id, status: 'all', limit: 1 });
      if (subs.data.length) { hadSub = true; customer = customer ?? c.id; break; }
    }
  }

  const now = new Date().toISOString();
  const tax = process.env.STRIPE_AUTOMATIC_TAX === 'true';
  const site = siteUrl();
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    line_items: [{ price: priceFor(plan), quantity: 1 }],
    locale: 'nb',
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    payment_method_collection: 'always',
    automatic_tax: { enabled: tax },
    client_reference_id: prof?.id,
    metadata: { consent: 'umiddelbar-levering-v1', consent_at: now, track, email },
    subscription_data: {
      metadata: { track, consent_at: now },
      ...(hadSub ? {} : { trial_period_days: 7, trial_settings: { end_behavior: { missing_payment_method: 'cancel' } } }),
    },
    custom_text: {
      submit: { message: hadSub
        ? 'Du får tilgang med en gang. Du har samtykket til at angreretten faller bort ved umiddelbar levering. Avslutt når du vil under Min side.'
        : 'Du får tilgang med en gang og betaler 0 kr i dag. Kortet belastes etter 7 dager hvis du ikke avslutter før. Avslutt når du vil under Min side.' },
    },
    success_url: `${site}/start/ferdig?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/start?avbrutt=1&plan=${plan}&spor=${track}`,
  };
  if (customer) {
    params.customer = customer;
    if (tax) params.customer_update = { address: 'auto', name: 'auto' };
  } else {
    params.customer_email = email;
  }
  try {
    const session = await stripe().checkout.sessions.create(params);
    return NextResponse.json({ url: session.url, trial: !hadSub });
  } catch (e) {
    console.error('[checkout]', e);
    return NextResponse.json({ error: 'Kunne ikke starte betalingen. Prøv igjen om litt.' }, { status: 500 });
  }
}
