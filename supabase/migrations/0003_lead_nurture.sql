-- Oppfølging av PDF-leads: to e-poster etter nedlasting, med avmelding
alter table public.leads
  add column if not exists nurture_step int not null default 0,
  add column if not exists nurture_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists unsub_token uuid not null default gen_random_uuid();

create unique index if not exists leads_unsub_token_idx on public.leads (unsub_token);
