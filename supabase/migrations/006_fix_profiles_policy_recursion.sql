-- Fix infinite recursion in profiles RLS policies.
-- Root cause: policies on public.profiles queried public.profiles again.
-- Approach: centralize role lookup in a SECURITY DEFINER helper.

create schema if not exists private;

create or replace function private.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
  limit 1
$$;

revoke all on function private.current_user_role() from public;
grant execute on function private.current_user_role() to authenticated;

-- profiles policies (remove self-reference to public.profiles)
drop policy if exists "profiles_select_self_or_staff" on public.profiles;
create policy "profiles_select_self_or_staff"
on public.profiles for select
to authenticated
using (
  auth.uid() = id
  or private.current_user_role()::text in ('teacher', 'staff', 'admin')
);

drop policy if exists "profiles_manage_roles_by_staff_admin" on public.profiles;
create policy "profiles_manage_roles_by_staff_admin"
on public.profiles for update
to authenticated
using (
  private.current_user_role()::text in ('staff', 'admin')
)
with check (
  private.current_user_role()::text in ('staff', 'admin')
);

-- service_requests policies (replace role subqueries with helper function)
drop policy if exists "students_insert_requests" on public.service_requests;
create policy "students_insert_requests"
on public.service_requests for insert
to authenticated
with check (
  auth.uid() = user_id
  and private.current_user_role() = 'student'::public.user_role
);

drop policy if exists "students_select_own_requests" on public.service_requests;
create policy "students_select_own_requests"
on public.service_requests for select
to authenticated
using (
  auth.uid() = user_id
  or private.current_user_role()::text in ('teacher', 'staff', 'admin')
);

drop policy if exists "staff_admin_update_requests" on public.service_requests;
create policy "staff_admin_update_requests"
on public.service_requests for update
to authenticated
using (
  private.current_user_role()::text in ('teacher', 'staff', 'admin')
)
with check (
  private.current_user_role()::text in ('teacher', 'staff', 'admin')
);

-- request_updates policy (same role-check helper)
drop policy if exists "read_updates_for_related_request" on public.request_updates;
create policy "read_updates_for_related_request"
on public.request_updates for select
to authenticated
using (
  exists (
    select 1
    from public.service_requests sr
    where sr.id = request_id
      and (
        sr.user_id = auth.uid()
        or private.current_user_role()::text in ('teacher', 'staff', 'admin')
      )
  )
);
