-- Feedback screenshot attachments (run once if feedback tables already exist).
-- Also create Storage bucket + policies. Requires Supabase Storage enabled.
--
-- After running:
--   1. Confirm bucket "feedback-images" appears (public read).
--   2. VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY already set for the app.

alter table public.feedback_reports
  add column if not exists image_urls text[] not null default '{}';

alter table public.feedback_suggestions
  add column if not exists image_urls text[] not null default '{}';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'feedback-images',
  'feedback-images',
  true,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anon upload feedback images" on storage.objects;
create policy "Anon upload feedback images"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'feedback-images'
    and (storage.foldername(name))[1] in ('report', 'suggest')
  );

drop policy if exists "Public read feedback images" on storage.objects;
create policy "Public read feedback images"
  on storage.objects for select
  to public
  using (bucket_id = 'feedback-images');
