-- Add teacher role and role-management policies/functions.

do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'user_role' and e.enumlabel = 'teacher'
  ) then
    alter type public.user_role add value 'teacher' after 'student';
  end if;
end $$;

-- Expand request-management permissions to teacher/staff/admin.
drop policy if exists "students_select_own_requests" on public.service_requests;
create policy "students_select_own_requests"
on public.service_requests for select
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('teacher', 'staff', 'admin')
  )
);

drop policy if exists "staff_admin_update_requests" on public.service_requests;
create policy "staff_admin_update_requests"
on public.service_requests for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('teacher', 'staff', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('teacher', 'staff', 'admin')
  )
);

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
        or exists (
          select 1
          from public.profiles p
          where p.id = auth.uid()
            and p.role::text in ('teacher', 'staff', 'admin')
        )
      )
  )
);

-- Allow staff/admin to manage roles; teachers can view but not edit roles.
drop policy if exists "profiles_select_self_or_staff" on public.profiles;
create policy "profiles_select_self_or_staff"
on public.profiles for select
to authenticated
using (
  auth.uid() = id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('teacher', 'staff', 'admin')
  )
);

drop policy if exists "profiles_manage_roles_by_staff_admin" on public.profiles;
create policy "profiles_manage_roles_by_staff_admin"
on public.profiles for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('staff', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('staff', 'admin')
  )
);
