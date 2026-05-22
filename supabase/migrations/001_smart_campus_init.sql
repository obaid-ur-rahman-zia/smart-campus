-- Smart Campus Service Portal schema (Supabase Postgres)
create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('student', 'staff', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'request_type') then
    create type public.request_type as enum ('complaint', 'document');
  end if;
  if not exists (select 1 from pg_type where typname = 'request_status') then
    create type public.request_status as enum ('pending', 'in_review', 'approved', 'rejected', 'resolved');
  end if;
end$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  request_type public.request_type not null,
  title text not null,
  description text not null,
  category text not null,
  status public.request_status not null default 'pending',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  admin_note text,
  assigned_to uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.request_updates (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  actor_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  status public.request_status not null,
  created_at timestamptz not null default now()
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_service_requests_updated_at on public.service_requests;
create trigger trg_service_requests_updated_at
before update on public.service_requests
for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Unknown User'),
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.service_requests enable row level security;
alter table public.request_updates enable row level security;

-- profiles policies
drop policy if exists "profiles_select_self_or_staff" on public.profiles;
create policy "profiles_select_self_or_staff"
on public.profiles for select
to authenticated
using (
  auth.uid() = id
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('staff', 'admin')
  )
);

-- requests policies
drop policy if exists "students_insert_requests" on public.service_requests;
create policy "students_insert_requests"
on public.service_requests for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'student')
);

drop policy if exists "students_select_own_requests" on public.service_requests;
create policy "students_select_own_requests"
on public.service_requests for select
to authenticated
using (
  auth.uid() = user_id
  or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff', 'admin')
  )
);

drop policy if exists "staff_admin_update_requests" on public.service_requests;
create policy "staff_admin_update_requests"
on public.service_requests for update
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff', 'admin'))
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff', 'admin'))
);

-- updates policies
drop policy if exists "insert_updates_by_owner_or_staff" on public.request_updates;
create policy "insert_updates_by_owner_or_staff"
on public.request_updates for insert
to authenticated
with check (
  actor_id = auth.uid()
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
          select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff', 'admin')
        )
      )
  )
);
