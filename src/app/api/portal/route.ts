import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSession } from '@/lib/access';
import { siteUrl } from '@/lib/env';

export const runtime = 'nodejs';

export async function POST() {
  const { user, sub } = await getSession();
  const site = siteUrl();
  if (!user) return NextResponse.redirect(`${site}/logg-inn`, 303);
  if (!sub?.stripe_customer_id) return NextResponse.redirect(`${site}/start`, 303);
  const s = await stripe().billingPortal.sessions.create({ customer: sub.stripe_customer_id, return_url: `${site}/min-side`, locale: 'nb',
    ...(process.env.STRIPE_PORTAL_CONFIG ? { configuration: process.env.STRIPE_PORTAL_CONFIG } : {}),
  });
  return NextResponse.redirect(s.url, 303);
}
