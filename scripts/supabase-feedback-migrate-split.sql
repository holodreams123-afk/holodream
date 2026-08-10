-- Already ran the old single `feedback` table? Run this once to split into two tables.
-- (Same end state as supabase-feedback.sql — use this if you only need migration.)

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

-- Optional: copy old rows before drop (if legacy table had data)
insert into public.feedback_reports (category, context, message, contact, locale, created_at)
select category, context, message, contact, locale, created_at
from public.feedback
where kind = 'report';

insert into public.feedback_suggestions (category, context, message, contact, locale, created_at)
select category, context, message, contact, locale, created_at
from public.feedback
where kind = 'suggest';

drop table if exists public.feedback;
