// Oppretter produkt, priser, kundeportal og (valgfritt) webhook i Stripe.
// Bruk:  npm run stripe:setup                 (priser + portal)
//        npm run stripe:setup -- --webhook    (også webhook mot NEXT_PUBLIC_SITE_URL, må være https)
// Leser STRIPE_SECRET_KEY og NEXT_PUBLIC_SITE_URL fra miljøet eller .env.local. Trygt å kjøre flere ganger.
import fs from 'node:fs';
import Stripe from 'stripe';

for (const f of ['.env.local', '.env']) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const key = process.env.STRIPE_SECRET_KEY;
if (!key || !key.startsWith('sk_')) { console.error('Sett STRIPE_SECRET_KEY i .env.local først.'); process.exit(1); }
const site = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');
const stripe = new Stripe(key);
const mode = key.startsWith('sk_live_') ? 'LIVE' : 'TEST';
console.log(`Stripe-modus: ${mode}\n`);

// 1. Produkt
const products = await stripe.products.list({ limit: 100, active: true });
let product = products.data.find(p => p.metadata?.app === 'paminuttet');
if (!product) {
  product = await stripe.products.create({
    name: 'PÅ MINUTTET – medlemskap',
    description: 'Ny EMOM-økt hver dag. Gym og Hjemme, fem nivåer.',
    metadata: { app: 'paminuttet' },
    tax_code: 'txcd_10000000', // elektronisk tjeneste
  });
  console.log('Opprettet produkt', product.id);
} else console.log('Fant produkt', product.id);

// 2. Priser (inkl. MVA hvis du blir MVA-registrert)
async function price(lookup, amount, interval) {
  const found = await stripe.prices.list({ lookup_keys: [lookup], active: true, limit: 1 });
  if (found.data[0]) { console.log('Fant pris', lookup, found.data[0].id); return found.data[0]; }
  const p = await stripe.prices.create({
    product: product.id, currency: 'nok', unit_amount: amount, lookup_key: lookup,
    recurring: { interval }, tax_behavior: 'inclusive', nickname: lookup,
  });
  console.log('Opprettet pris', lookup, p.id);
  return p;
}
const monthly = await price('paminuttet_maaned', 19900, 'month');
const annual = await price('paminuttet_aar', 199000, 'year');

// 3. Kundeportal (avslutt, bytt plan, bytt kort, kvitteringer)
const https = site.startsWith('https://');
const portalFeatures = {
  invoice_history: { enabled: true },
  payment_method_update: { enabled: true },
  customer_update: { enabled: true, allowed_updates: ['address', 'name'] },
  subscription_cancel: { enabled: true, mode: 'at_period_end', cancellation_reason: { enabled: true, options: ['too_expensive', 'unused', 'too_complex', 'other'] } },
  subscription_update: { enabled: true, default_allowed_updates: ['price'], proration_behavior: 'create_prorations', products: [{ product: product.id, prices: [monthly.id, annual.id] }] },
};
const portalBusiness = { headline: 'PÅ MINUTTET – medlemskap', ...(https ? { privacy_policy_url: `${site}/personvern`, terms_of_service_url: `${site}/vilkar` } : {}) };
const configs = await stripe.billingPortal.configurations.list({ limit: 20 });
let portal = configs.data.find(c => c.metadata?.app === 'paminuttet');
const portalArgs = { features: portalFeatures, business_profile: portalBusiness, ...(https ? { default_return_url: `${site}/min-side` } : {}) };
if (portal) { portal = await stripe.billingPortal.configurations.update(portal.id, portalArgs); console.log('Oppdaterte kundeportal', portal.id); }
else { portal = await stripe.billingPortal.configurations.create({ ...portalArgs, metadata: { app: 'paminuttet' } }); console.log('Opprettet kundeportal', portal.id); }

// 4. Webhook
let whSecret = null;
if (process.argv.includes('--webhook')) {
  if (!https) { console.error('\n--webhook krever at NEXT_PUBLIC_SITE_URL er en https-adresse.'); process.exit(1); }
  const url = `${site}/api/stripe/webhook`;
  const events = ['checkout.session.completed', 'customer.subscription.created', 'customer.subscription.updated', 'customer.subscription.deleted', 'customer.subscription.paused', 'customer.subscription.resumed', 'customer.subscription.trial_will_end'];
  const eps = await stripe.webhookEndpoints.list({ limit: 100 });
  const old = eps.data.find(e => e.url === url);
  if (old) {
    await stripe.webhookEndpoints.update(old.id, { enabled_events: events });
    console.log(`\nWebhook finnes allerede (${old.id}). Hemmeligheten vises bare ved oppretting: hent den i Stripe → Developers → Webhooks → ${url} → Signing secret.`);
  } else {
    const ep = await stripe.webhookEndpoints.create({ url, enabled_events: events, description: 'PÅ MINUTTET' });
    whSecret = ep.secret;
    console.log('Opprettet webhook', ep.id, url);
  }
}

console.log('\nLim inn i .env.local og i Vercel → Settings → Environment Variables:\n');
console.log(`STRIPE_PRICE_MONTHLY=${monthly.id}`);
console.log(`STRIPE_PRICE_ANNUAL=${annual.id}`);
console.log(`STRIPE_PORTAL_CONFIG=${portal.id}`);
if (whSecret) console.log(`STRIPE_WEBHOOK_SECRET=${whSecret}`);
