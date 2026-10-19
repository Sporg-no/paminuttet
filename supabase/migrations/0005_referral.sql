-- «Ta med en venn»: personlig vervekode per profil, og hvem et abonnement ble vervet av
alter table public.profiles add column if not exists ref_code text not null default substr(replace(gen_random_uuid()::text,'-',''),1,8);
create unique index if not exists profiles_ref_code_idx on public.profiles (ref_code);
alter table public.subscriptions add column if not exists referred_by uuid references public.profiles(id) on delete set null;
alter table public.subscriptions add column if not exists referral_rewarded_at timestamptz;
