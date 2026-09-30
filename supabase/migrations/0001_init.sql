-- PÅ MINUTTET – databaseoppsett. Kjør i Supabase → SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profil: les egen" on public.profiles;
create policy "profil: les egen" on public.profiles for select using (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, lower(new.email))
  on conflict (id) do update set email = excluded.email;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Eksisterende brukere (hvis noen) får profil
insert into public.profiles (id, email)
select id, lower(email) from auth.users where email is not null
on conflict (id) do nothing;

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'incomplete',
  price_id text,
  interval text,
  trial_end timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  track text not null default 'hjemme' check (track in ('gym','hjemme')),
  consent_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
drop policy if exists "abonnement: les eget" on public.subscriptions;
create policy "abonnement: les eget" on public.subscriptions for select using (auth.uid() = user_id);

-- Engangsbruk av Stripe checkout-økter for automatisk innlogging
create table if not exists public.checkout_logins (
  session_id text primary key,
  used_at timestamptz not null default now()
);
alter table public.checkout_logins enable row level security;

create table if not exists public.leads (
  id bigint generated always as identity primary key,
  email text not null,
  source text,
  created_at timestamptz not null default now()
);
create unique index if not exists leads_email_uq on public.leads (lower(email));
alter table public.leads enable row level security;
