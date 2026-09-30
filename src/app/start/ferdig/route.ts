import { type NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin, ensureUser } from '@/lib/supabase/admin';
import { supabaseServer } from '@/lib/supabase/server';
import { saveSubscription } from '@/lib/subs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Stripe sender kunden hit etter betaling. Vi logger inn automatisk (én gang per økt).
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('session_id');
  if (!id || !id.startsWith('cs_')) redirect('/logg-inn');

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe().checkout.sessions.retrieve(id, { expand: ['subscription'] });
  } catch { redirect('/logg-inn?e=feil'); }

  const email = (session.customer_details?.email || session.customer_email || '').toLowerCase();
  const fresh = Date.now() / 1000 - session.created < 2 * 3600;
  if (session.status !== 'complete' || !email) redirect('/start?avbrutt=1');
  if (!fresh) redirect('/logg-inn?e=brukt');

  const admin = supabaseAdmin();
  const { error: dup } = await admin.from('checkout_logins').insert({ session_id: id });
  if (dup) redirect('/logg-inn?e=brukt');

  const userId = await ensureUser(email);
  const sub = session.subscription as Stripe.Subscription | null;
  if (sub && typeof sub === 'object') {
    await saveSubscription(userId, sub, { track: session.metadata?.track, consent_at: session.metadata?.consent_at });
  }

  const { data: link, error } = await admin.auth.admin.generateLink({ type: 'magiclink', email });
  if (error || !link?.properties?.hashed_token) redirect('/logg-inn?e=brukt');
  const sb = await supabaseServer();
  const { error: vErr } = await sb.auth.verifyOtp({ type: 'email', token_hash: link.properties.hashed_token });
  if (vErr) redirect('/logg-inn?e=brukt');
  redirect('/program?velkommen=1');
}
