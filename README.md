# Smart Campus Service Portal

Production-ready semester project implementing:
- Role-based access (`student`, `staff`, `admin`)
- Complaint submission flow
- Document request flow
- Status tracking and history
- Administrative queue + status transitions
- Supabase auth + PostgreSQL + RLS policies
- Minimal dashboard UI using shadcn-style components
- Motion-enhanced icon interactions and a lightweight 3D campus hero

## Stack
- Next.js 16 (App Router)
- React 19 + TypeScript
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Tailwind CSS 4
- Framer Motion + Lucide icons
- Three.js (`@react-three/fiber`, `@react-three/drei`)

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure env:
```bash
cp .env.example .env.local
```
Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3. Apply SQL schema in Supabase:
- Run `supabase/migrations/001_smart_campus_init.sql` in SQL Editor.

4. Start dev server:
```bash
npm run dev
```

## Main Routes
- `/` Landing page
- `/login` Authentication
- `/register` Registration
- `/dashboard/student` Student overview + request submit
- `/dashboard/student/tracking` Student request tracking
- `/dashboard/staff` Staff queue
- `/dashboard/admin` Admin management queue

## Design / UI References Used
- [Animate UI Icons](https://animate-ui.com/docs/icons)
- [React Bits](https://reactbits.dev/)
- [React Bits Get Started](https://reactbits.dev/get-started/index)

## Notes
- RLS is enabled for `profiles`, `service_requests`, and `request_updates`.
- Role profile is auto-created via trigger on `auth.users`.
- `request_updates` stores status history and activity logs.
