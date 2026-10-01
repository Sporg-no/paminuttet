import 'server-only';
import Stripe from 'stripe';
import { env } from '@/lib/env';

let _s: Stripe | null = null;
export function stripe() {
  if (!_s) _s = new Stripe(env('STRIPE_SECRET_KEY'));
  return _s;
}

export type Plan = 'maaned' | 'aar';

const cache = new Map<string, string>();
/** Godtar både pris-ID (price_…) og produkt-ID (prod_…). Produkt-ID gir produktets standardpris. */
export async function resolvePrice(id: string): Promise<string> {
  if (!id.startsWith('prod_')) return id;
  const hit = cache.get(id);
  if (hit) return hit;
  const p = await stripe().products.retrieve(id);
  let pid = typeof p.default_price === 'string' ? p.default_price : p.default_price?.id;
  if (!pid) {
    const list = await stripe().prices.list({ product: id, active: true, limit: 1 });
    pid = list.data[0]?.id;
  }
  if (!pid) throw new Error(`Produktet ${id} har ingen aktiv pris`);
  cache.set(id, pid);
  return pid;
}

export function priceFor(plan: Plan) {
  return resolvePrice(plan === 'aar' ? env('STRIPE_PRICE_ANNUAL') : env('STRIPE_PRICE_MONTHLY'));
}
