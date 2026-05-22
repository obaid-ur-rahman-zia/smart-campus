-- Extend profiles for richer student customization.
alter table public.profiles
  add column if not exists roll_number text,
  add column if not exists department text,
  add column if not exists bio text,
  add column if not exists avatar_url text;
