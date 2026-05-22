-- Fix login bounce: allow users to create/update their own profile
-- and backfill missing profile records for already-created auth users.

-- 1) Allow authenticated users to insert their own profile row.
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- 2) Allow authenticated users to update only their own profile row.
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 3) Backfill missing profiles for users created before trigger fixes.
insert into public.profiles (id, full_name, role)
select
  u.id,
  coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1), 'Student User') as full_name,
  case
    when (u.raw_user_meta_data ->> 'role') in ('student', 'staff', 'admin')
      then (u.raw_user_meta_data ->> 'role')::public.user_role
    else 'student'::public.user_role
  end as role
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
