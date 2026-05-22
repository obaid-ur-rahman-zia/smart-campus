-- Bootstrap helper: promote an existing auth user to staff/admin/teacher by email.
-- Run once in Supabase SQL editor, for example:
-- select public.bootstrap_role_by_email('youremail@example.com', 'staff');

create or replace function public.bootstrap_role_by_email(
  target_email text,
  target_role public.user_role default 'staff'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user_id uuid;
begin
  select id into target_user_id
  from auth.users
  where email = target_email
  limit 1;

  if target_user_id is null then
    raise exception 'No auth user found for email: %', target_email;
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    target_user_id,
    coalesce((select raw_user_meta_data ->> 'full_name' from auth.users where id = target_user_id), split_part(target_email, '@', 1)),
    target_role
  )
  on conflict (id) do update
    set role = excluded.role;

  return target_user_id;
end;
$$;
