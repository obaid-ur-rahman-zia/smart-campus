-- Demo users + sample data for Smart Campus (run in Supabase SQL Editor)
-- Default password for ALL seeded accounts: Test1234!
--
-- After running, login at /login with:
--   student1@smartcampus.test / Test1234!
--   student2@smartcampus.test / Test1234!
--   teacher@smartcampus.test  / Test1234!
--   staff@smartcampus.test    / Test1234!
--   admin@smartcampus.test    / Test1234!
--
-- Your existing admin account is NOT removed.

create or replace function public.seed_auth_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_role public.user_role,
  p_roll_number text default null,
  p_department text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_user_id uuid;
  v_instance_id uuid;
begin
  if exists (select 1 from auth.users where lower(email) = lower(p_email)) then
    select id into v_user_id from auth.users where lower(email) = lower(p_email) limit 1;

    insert into public.profiles (id, full_name, role, roll_number, department)
    values (v_user_id, p_full_name, p_role, p_roll_number, p_department)
    on conflict (id) do update
      set full_name = excluded.full_name,
          role = excluded.role,
          roll_number = excluded.roll_number,
          department = excluded.department;

    return v_user_id;
  end if;

  v_user_id := gen_random_uuid();
  select id into v_instance_id from auth.instances limit 1;
  v_instance_id := coalesce(v_instance_id, '00000000-0000-0000-0000-000000000000'::uuid);

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_sso_user,
    is_anonymous
  )
  values (
    v_instance_id,
    v_user_id,
    'authenticated',
    'authenticated',
    lower(p_email),
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object(
      'full_name', p_full_name,
      'role', p_role::text,
      'roll_number', p_roll_number,
      'department', p_department
    ),
    now(),
    now(),
    false,
    false
  );

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    v_user_id,
    v_user_id,
    lower(p_email),
    jsonb_build_object('sub', v_user_id::text, 'email', lower(p_email)),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.profiles (id, full_name, role, roll_number, department)
  values (v_user_id, p_full_name, p_role, p_roll_number, p_department)
  on conflict (id) do update
    set full_name = excluded.full_name,
        role = excluded.role,
        roll_number = excluded.roll_number,
        department = excluded.department;

  return v_user_id;
end;
$$;

-- Students
select public.seed_auth_user(
  'student1@smartcampus.test',
  'Test1234!',
  'Ali Khan',
  'student',
  'BSCS-23-001',
  'Computer Science'
);

select public.seed_auth_user(
  'student2@smartcampus.test',
  'Test1234!',
  'Sara Ahmed',
  'student',
  'BSSE-22-014',
  'Software Engineering'
);

-- Teacher
select public.seed_auth_user(
  'teacher@smartcampus.test',
  'Test1234!',
  'Dr. Hassan Raza',
  'teacher',
  null,
  'Computer Science'
);

-- Staff
select public.seed_auth_user(
  'staff@smartcampus.test',
  'Test1234!',
  'Fatima Noor',
  'staff',
  null,
  'Student Affairs'
);

-- Extra admin (besides your own account)
select public.seed_auth_user(
  'admin@smartcampus.test',
  'Test1234!',
  'Campus Admin',
  'admin',
  null,
  'IT Services'
);

-- Sample service requests (only if none exist yet for these students)
do $$
declare
  v_student1 uuid;
  v_student2 uuid;
  v_staff uuid;
  v_req1 uuid;
  v_req2 uuid;
begin
  select id into v_student1 from public.profiles where full_name = 'Ali Khan' limit 1;
  select id into v_student2 from public.profiles where full_name = 'Sara Ahmed' limit 1;
  select id into v_staff from public.profiles where role = 'staff' order by created_at limit 1;

  if v_student1 is null or v_student2 is null then
    raise notice 'Skipping request seed: student profiles not found.';
    return;
  end if;

  if not exists (
    select 1 from public.service_requests
    where user_id = v_student1 and title = 'Hostel maintenance issue'
  ) then
    insert into public.service_requests (
      user_id, request_type, title, description, category, status, priority, assigned_to
    )
    values (
      v_student1,
      'complaint',
      'Hostel maintenance issue',
      'Water leakage reported in Block B room 204.',
      'Hostel',
      'pending',
      'high',
      v_staff
    )
    returning id into v_req1;

    insert into public.request_updates (request_id, actor_id, message, status)
    values (v_req1, v_student1, 'Complaint submitted by student.', 'pending');
  end if;

  if not exists (
    select 1 from public.service_requests
    where user_id = v_student2 and title = 'Official transcript request'
  ) then
    insert into public.service_requests (
      user_id, request_type, title, description, category, status, priority
    )
    values (
      v_student2,
      'document',
      'Official transcript request',
      'Need attested transcript for internship application.',
      'Academic Records',
      'in_review',
      'medium'
    )
    returning id into v_req2;

    insert into public.request_updates (request_id, actor_id, message, status)
    values
      (v_req2, v_student2, 'Document request submitted.', 'pending'),
      (v_req2, coalesce(v_staff, v_student2), 'Request moved to review by staff.', 'in_review');
  end if;
end $$;

-- Verify seeded users
select
  u.email,
  p.full_name,
  p.role,
  p.roll_number,
  p.department
from auth.users u
join public.profiles p on p.id = u.id
order by p.role, u.email;
