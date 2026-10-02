# PÅ MINUTTET – plattform

Nettside, betaling og medlemsområde for PÅ MINUTTET. Next.js på Vercel, Supabase for innlogging og database (EU), Stripe for abonnement med 7 dagers prøveperiode.

## Arkitektur

| Del | Løsning | Ansvar |
|---|---|---|
| Nettside og API | Next.js 15 på Vercel (region Stockholm, `arn1`) | Forside, kasse, medlemsområde, webhook |
| Innlogging | Supabase Auth, engangslenke eller 6-sifret kode på e-post | Ingen passord |
| Database | Supabase Postgres (EU, Stockholm) | `profiles`, `subscriptions`, `leads`, `checkout_logins` |
| Betaling | Stripe Checkout + Billing + kundeportal | Kort, prøveperiode, fornyelse, oppsigelse, kvitteringer |
| E-post | Resend (SMTP for Supabase + API for påminnelse) | Innloggingslenker, påminnelse dag 5 |
| Innhold | `src/content/program.json` | 4 uker × Gym/Hjemme × 6 dager × 5 nivåer |

**Flyt for ny kunde:** `/start` (plan, spor, e-post, samtykke) → Stripe Checkout (kort, 0 kr i dag) → `/start/ferdig` (verifiserer betalingen, oppretter bruker, logger inn automatisk) → `/program`.

**Tilgang:** Stripe er fasit. Webhooken skriver status til `subscriptions`. `trialing`, `active` og `past_due` gir tilgang. Alt annet sender brukeren til `/betaling`.

**Uker:** Uke 1 slippes `PROGRAM_START` (søndag 4. oktober kl. 20). Ny uke hver søndag kl. 20. Medlemmer ser ukene som er sluppet i inneværende syklus. Når alle ukene i `program.json` er brukt, starter en ny syklus fra uke 1. Fremtidige uker sendes aldri til nettleseren.

**Sikkerhet:** Service role-nøkkelen brukes bare på serveren. Radnivåsikkerhet (RLS) er på for alle tabeller. Webhooken verifiserer Stripe-signaturen. Automatisk innlogging etter kjøp virker én gang per kjøp og bare de første 2 timene.

---

## Oppsett: fra null til live

Beregnet tid: 45–60 minutter. Gjør alt i **testmodus** i Stripe først.

### Du trenger

- GitHub-repoet (dette)
- Konto hos [Vercel](https://vercel.com), [Supabase](https://supabase.com), [Stripe](https://stripe.com) og [Resend](https://resend.com)
- Et domene, for eksempel `paminuttet.no` (Domeneshop e.l.). Resend krever eget domene for å sende e-post, og uten egen e-postserver sender Supabase bare til deg selv.

### 1. Supabase (10 min)

1. **New project.** Region: *North EU (Stockholm)*. Lagre databasepassordet.
2. **SQL Editor → New query.** Lim inn hele `supabase/migrations/0001_init.sql` og trykk *Run*.
3. **Project Settings → API.** Kopier *Project URL*, *Publishable key* (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) og *Secret key* (`SUPABASE_SECRET_KEY`). Eldre navn (`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) fungerer også.
4. **Authentication → Sign In / Providers.** Email skal være på. Slå **av** *Allow new users to sign up* (brukere opprettes bare via betaling).
5. **Authentication → URL Configuration.**
   - Site URL: `https://paminuttet.no` (eller Vercel-adressen til å begynne med)
   - Redirect URLs: `https://paminuttet.no/**` og `http://localhost:3000/**`
6. **Authentication → Emails → Templates → Magic Link.**
   - Subject: `Logg inn på PÅ MINUTTET`
   - Body:
     ```html
     <h2>Logg inn på PÅ MINUTTET</h2>
     <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/program">Trykk her for å logge inn</a></p>
     <p>Eller skriv inn koden: <strong>{{ .Token }}</strong></p>
     <p>Lenken og koden virker i 1 time. Ba du ikke om dette, kan du se bort fra e-posten.</p>
     ```
7. **Authentication → Emails → SMTP Settings** (etter steg 2 under Resend):
   Host `smtp.resend.com`, port `465`, brukernavn `resend`, passord = Resend API-nøkkel, avsender `post@paminuttet.no`, navn `PÅ MINUTTET`.
8. **Authentication → Rate Limits.** Sett *emails sent per hour* til 100.

### 2. Resend (5 min)

1. **Domains → Add domain** `paminuttet.no`. Legg inn DNS-postene hos domeneleverandøren og vent til status er *Verified*.
2. **API Keys → Create.** Brukes både i Supabase (SMTP) og som `RESEND_API_KEY`.

### 3. Stripe (15 min)

1. **Developers → API keys.** Kopier *Secret key* (`sk_test_…`).
2. På egen maskin (Node 20+):
   ```bash
   npm install
   cp .env.example .env.local      # fyll inn Supabase- og Stripe-nøklene
   npm run stripe:setup
   ```
   Skriptet oppretter produkt, pris 199 kr/mnd og 1 990 kr/år, og kundeportalen (avslutt, bytt plan, bytt kort, kvitteringer). Det skriver ut `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL` og `STRIPE_PORTAL_CONFIG`. Lim dem inn i `.env.local`.
3. **Settings → Business → Customer emails:** slå på kvitteringer for vellykkede betalinger og refusjoner.
4. **Settings → Billing → Subscriptions and emails:** slå på *Smart Retries* og e-post ved feilet betaling og utløpende kort.
5. **Settings → Branding:** farge `#FF5A1F`, last opp `public/icon.svg` som ikon.
6. **MVA:** Under 50 000 kr i omsetning på 12 måneder trenger du ikke være MVA-registrert. La `STRIPE_AUTOMATIC_TAX=false`. Når du registreres: slå på Stripe Tax, legg inn norsk MVA-registrering og sett `STRIPE_AUTOMATIC_TAX=true`. Prisene er satt opp som inkludert MVA.

### 4. Vercel (10 min)

1. **Add New → Project → Import** `Sporg-no/paminuttet`. Rammeverk oppdages automatisk.
2. **Environment Variables:** legg inn alt fra `.env.local`, men med
   - `NEXT_PUBLIC_SITE_URL=https://paminuttet.no` (eller `https://<prosjekt>.vercel.app` inntil domenet er klart)
   - `PROGRAM_START=2026-10-04T18:00:00Z`
   - `RESEND_API_KEY` og `MAIL_FROM=PÅ MINUTTET <post@paminuttet.no>`
3. **Deploy.**
4. **Settings → Domains:** legg til `paminuttet.no` og `www.paminuttet.no`. Følg DNS-instruksjonene.
5. Vercel Hobby er ikke tillatt for kommersiell bruk. Oppgrader til **Pro** før første betalende kunde.

### 5. Webhook (2 min)

Når nettsiden svarer på https:

```bash
# i .env.local: NEXT_PUBLIC_SITE_URL=https://paminuttet.no
npm run stripe:setup -- --webhook
```

Skriptet oppretter webhook mot `/api/stripe/webhook` og skriver ut `STRIPE_WEBHOOK_SECRET`. Legg den inn i Vercel og trykk **Redeploy**.

Manuelt alternativ: Stripe → Developers → Webhooks → Add endpoint, URL `https://paminuttet.no/api/stripe/webhook`, hendelser: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`, `customer.subscription.trial_will_end`.

### 6. Test hele løpet (10 min)

Bruk testkort `4242 4242 4242 4242`, en fremtidig dato og valgfri CVC.

- [ ] Forsiden: klokka går, kalkulatoren oppdateres, videoene spiller, PDF-skjemaet lagrer e-post i `leads` og gir nedlasting
- [ ] `/start` → Stripe viser 0 kr i dag → tilbake til `/program`, innlogget, med banner om prøveperiode
- [ ] Rad i `subscriptions` med `status = trialing` (Supabase → Table Editor)
- [ ] Timeren: start, pause, nullstill, lyd de siste 3 sekundene, riktig rad lyser
- [ ] Logg ut → `/logg-inn` → lenke eller kode på e-post → inne igjen
- [ ] Min side → Administrer abonnement → avslutt → banneret sier når tilgangen slutter
- [ ] Samme e-post på `/start` igjen → ingen ny prøveperiode
- [ ] Prøveperiode-slutt: Stripe → Billing → **Test clocks**, lag en kunde og spol 8 dager frem. Påminnelse sendes dag 5, trekk dag 8.
- [ ] Mobil: gå gjennom alt på telefonen

### 7. Gå live

1. Aktiver Stripe-kontoen (ENK, org.nr., bankkonto).
2. Bytt til **live**-nøkkel i `.env.local` og kjør `npm run stripe:setup -- --webhook` igjen. Live har egne produkter, priser, portal og webhook.
3. Oppdater `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_ANNUAL` og `STRIPE_PORTAL_CONFIG` i Vercel. Redeploy.
4. Bytt ut `[ORG.NR]` og `[ADRESSE]` i `src/components/Footer.tsx`, `src/app/vilkar/page.tsx` og `src/app/personvern/page.tsx`.
5. Les gjennom vilkår og personvern. Teksten er et utkast, ikke juridisk rådgivning.

---

## Drift

**Slippe ny uke.** Nye uker vises ikke automatisk. `src/content/release.json` → `releasedThrough` er siste godkjente uke (talt fra programstart: 1, 2, 3 …). Øk tallet og push når uka er godkjent. Medlemmene får e-post samme kveld kl. 20.10 (cron hver kveld 18.10 UTC). Krever tabellen i `supabase/migrations/0002_app_state.sql`.

**Nye uker.** Uke 1–8 ligger inne (to sykluser). Uke 5–8 er skrevet i `content/weeks5to8.mjs` og bygges inn med `node content/build-weeks5to8.mjs`. Legg til uke 9, 10 … i `src/content/program.json` (samme struktur som ukene som finnes) og push til GitHub. Vercel publiserer automatisk. Gjør det før søndagen uka slippes. Uten nye uker starter programmet på uke 1 igjen.

Struktur per dag:
```json
{ "short": "Man", "day": "Mandag", "name": "Øktnavn", "dur": "40–45 min",
  "A": ["oppvarming …"], "B": { "t": "Knebøy", "l": ["…"] },
  "C": { "fmt": "24:00 EMOM · 6 runder", "timer": { "t": "emom", "m": 24 },
         "rows": [["1: Ro", "Nivå 4", "Nivå 3", "Nivå 2", "Nivå 1", "Grunnmur"]], "score": "…" },
  "D": ["finisher …"] }
```
Timertyper: `{ "t": "emom", "m": 24 }`, `{ "t": "amrap", "m": 12 }`, `{ "t": "every", "each": 180, "rounds": 5 }`, `{ "t": "up", "cap": 20 }` (0 = uten tidsgrense).

**E-postliste.** Supabase → Table Editor → `leads` → Export CSV. Importer i nyhetsbrevverktøyet ditt.

**Kunder.** Stripe Dashboard viser alle abonnement, betalinger og kvitteringer. Refusjon gjøres der.

**Slette en kunde.** Avslutt abonnementet i Stripe, og slett brukeren i Supabase → Authentication → Users (profil og abonnement slettes automatisk).

**Webhook gir 308.** Domenet i webhooken må være hovedadressen i Vercel. Videresending (f.eks. `paminuttet.no` → `www`) godtas ikke av Stripe. Sett hoveddomenet til *Production* og `www` til *Redirect* i Vercel → Settings → Domains.

**Feilsøking.** Vercel → Logs. Stripe → Developers → Webhooks viser hver hendelse og svaret fra serveren. Feilede hendelser sendes på nytt automatisk.

## Kostnader per måned

| Tjeneste | Pris |
|---|---|
| Vercel Pro | ca. 20 USD |
| Supabase Free (Pro 25 USD ved behov) | 0 |
| Resend Free (3 000 e-poster/mnd) | 0 |
| Stripe | kortgebyr + 0,7 % for Billing, se stripe.com/no/pricing |
| Domene | ca. 150 kr per år |

## Lokal utvikling

```bash
npm install
cp .env.example .env.local   # fyll inn testnøkler
npm run dev                  # http://localhost:3000
# webhook lokalt (Stripe CLI):
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Filer

```
src/app/page.tsx                 forside
src/app/start/                   kasse (plan, spor, samtykke) og automatisk innlogging etter kjøp
src/app/logg-inn/                innlogging med lenke eller kode
src/app/auth/                    mottak av innloggingslenker
src/app/program/                 ukens program med timer (krever medlemskap)
src/app/min-side/                status, kundeportal, logg ut
src/app/betaling/                betalingsmur når medlemskapet ikke er aktivt
src/app/api/checkout             oppretter Stripe Checkout
src/app/api/stripe/webhook       synker abonnement fra Stripe, sender påminnelse dag 5
src/app/api/portal               Stripe kundeportal
src/app/api/lead                 lagrer e-post fra PDF-skjemaet
src/content/program.json         alle øktene
supabase/migrations/0001_init.sql
scripts/stripe-setup.mjs         produkt, priser, portal og webhook i Stripe
```
