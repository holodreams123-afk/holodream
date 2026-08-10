-- Guest feedback for holodream — errors and suggestions in separate tables.
-- Run once in Supabase SQL editor, then set GitHub / Cloudflare env:
--   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
--
-- anon: INSERT only (no public read). View in Table Editor:
--   feedback_reports | feedback_suggestions

create table if not exists public.feedback_reports (
  id uuid primary key default gen_random_uuid(),
  category text not null default '',
  context text not null default '',
  message text not null check (char_length(message) between 1 and 4000),
  contact text not null default '' check (char_length(contact) <= 120),
  locale text not null default '' check (char_length(locale) <= 16),
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_suggestions (
  id uuid primary key default gen_random_uuid(),
  category text not null default '',
  context text not null default '',
  message text not null check (char_length(message) between 1 and 4000),
  contact text not null default '' check (char_length(contact) <= 120),
  locale text not null default '' check (char_length(locale) <= 16),
  created_at timestamptz not null default now()
);

create index if not exists feedback_reports_created_at_idx
  on public.feedback_reports (created_at desc);

create index if not exists feedback_suggestions_created_at_idx
  on public.feedback_suggestions (created_at desc);

alter table public.feedback_reports enable row level security;
alter table public.feedback_suggestions enable row level security;

drop policy if exists "Public insert feedback reports" on public.feedback_reports;
create policy "Public insert feedback reports"
  on public.feedback_reports for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public insert feedback suggestions" on public.feedback_suggestions;
create policy "Public insert feedback suggestions"
  on public.feedback_suggestions for insert
  to anon, authenticated
  with check (true);

-- Remove legacy combined table (safe if empty or after backup)
drop table if exists public.feedback;
