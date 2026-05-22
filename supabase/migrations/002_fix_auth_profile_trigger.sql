-- Make signup trigger robust so auth user creation never fails.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role_text text;
  safe_role public.user_role := 'student';
begin
  requested_role_text := new.raw_user_meta_data ->> 'role';

  if requested_role_text in ('student', 'staff', 'admin') then
    safe_role := requested_role_text::public.user_role;
  end if;

  begin
    insert into public.profiles (id, full_name, role)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'full_name', 'Unknown User'),
      safe_role
    )
    on conflict (id) do update
      set full_name = excluded.full_name;
  exception
    when undefined_table or undefined_column or datatype_mismatch then
      -- Do not block auth signup on profile side-effects.
      raise warning 'Skipping profile sync for user % due to schema mismatch: %', new.id, sqlerrm;
    when others then
      raise warning 'Unexpected profile sync warning for user %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
