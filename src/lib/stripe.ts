import 'server-only';
import Stripe from 'stripe';
import { env } from '@/lib/env';

let _s: Stripe | null = null;
export function stripe() {
  if (!_s) _s = new Stripe(env('STRIPE_SECRET_KEY'));
  return _s;
}

export type Plan = 'maaned' | 'aar';
export function priceFor(plan: Plan) {
  return plan === 'aar' ? env('STRIPE_PRICE_ANNUAL') : env('STRIPE_PRICE_MONTHLY');
}
