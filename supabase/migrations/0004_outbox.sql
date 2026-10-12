-- Utboks for enkeltmeldinger til kunder. Rader legges inn manuelt, /api/cron/outbox sender dem.
create table if not exists public.outbox (
  id bigserial primary key,
  to_email text not null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  error text
);
alter table public.outbox enable row level security;
