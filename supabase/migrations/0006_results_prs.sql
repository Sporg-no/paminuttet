-- Resultatlogg per økt og personlige maks (1RM) for utregning av vekter. Kun egne rader (RLS).
create table if not exists public.results (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  week_abs int not null,
  track text not null check (track in ('gym','hjemme')),
  day_idx int not null check (day_idx between 0 and 6),
  lvl int,
  score text not null check (char_length(score) between 1 and 60),
  note text check (note is null or char_length(note) <= 300),
  updated_at timestamptz not null default now(),
  unique (user_id, week_abs, track, day_idx)
);
alter table public.results enable row level security;
create policy "egne resultater lese" on public.results for select using (auth.uid() = user_id);
create policy "egne resultater skrive" on public.results for insert with check (auth.uid() = user_id);
create policy "egne resultater endre" on public.results for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "egne resultater slette" on public.results for delete using (auth.uid() = user_id);

create table if not exists public.prs (
  user_id uuid not null references auth.users(id) on delete cascade,
  lift text not null check (lift in ('knebøy','markløft','benkpress','press','clean')),
  kg numeric(6,2) not null check (kg > 0 and kg < 500),
  reps int not null default 1 check (reps between 1 and 10),
  updated_at timestamptz not null default now(),
  primary key (user_id, lift)
);
alter table public.prs enable row level security;
create policy "egne maks lese" on public.prs for select using (auth.uid() = user_id);
create policy "egne maks skrive" on public.prs for insert with check (auth.uid() = user_id);
create policy "egne maks endre" on public.prs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "egne maks slette" on public.prs for delete using (auth.uid() = user_id);

-- 0007: flere løft (frontknebøy og push press brukes i blokk 2)
alter table public.prs drop constraint if exists prs_lift_check;
alter table public.prs add constraint prs_lift_check check (lift in ('knebøy','frontknebøy','markløft','benkpress','press','pushpress','clean'));
