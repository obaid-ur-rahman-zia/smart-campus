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
- Globe.gl (landing page 3D globe)

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

3. Apply SQL schema in Supabase (SQL Editor, in order):
- Run all files in `supabase/migrations/` (`001` through `008` for demo users).
- Demo logins after `008_seed_demo_users.sql`: see [Demo accounts](#demo-accounts) below.

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

## Demo accounts

After running `008_seed_demo_users.sql`, use password **`Test1234!`** for:

| Role | Email |
|------|--------|
| Student | `student1@smartcampus.test` |
| Student | `student2@smartcampus.test` |
| Teacher | `teacher@smartcampus.test` |
| Staff | `staff@smartcampus.test` |
| Admin | `admin@smartcampus.test` |

## Notes
- RLS is enabled for `profiles`, `service_requests`, and `request_updates`.
- Role profile is auto-created via trigger on `auth.users`.
- `request_updates` stores status history and activity logs.

---

## Reflection Report — Vibe Coding Experience

**Course:** Web Engineering · **Project:** Smart Campus Service Portal · **Author:** Obaid Ur Rahman Zia

### How AI helped in the final coding weeks

During the last two weeks of development, AI assistants (primarily Cursor) acted less like a code generator and more like a focused pair programmer. After completing the SRS and design documents, I entered implementation with partial features already in place: authentication scaffolding, Supabase migrations, and dashboard routes. AI accelerated the gaps—wiring server actions for login and registration, refactoring the landing page globe with **globe.gl**, fixing TypeScript build errors that blocked Vercel deployment, and drafting a SQL seed script for demo users across student, teacher, staff, and admin roles.

The highest-value prompts were specific and contextual. Instead of asking “build my app,” I pasted compiler errors, named the file, and described expected behaviour. For example, when `useSpring` broke the production build under Framer Motion v12, the assistant replaced the animation approach with `animate()` and fixed follow-on ESLint issues. When the Supabase hostname failed DNS resolution, AI helped distinguish an environment misconfiguration from an application bug—a distinction that saved hours of blind debugging. For repetitive work—Zod schemas, form validation patterns, README setup notes—AI produced usable drafts that I edited to match project conventions.

### Most challenging AI-related issue

The hardest problem was not syntax but **trust and verification**. AI confidently suggested APIs that matched older documentation. The `CountUp` component used `useSpring(MotionValue)` in a way that compiled locally in some cases but failed strict checks on Vercel; the fix required understanding the library’s v12 contract, not copy-pasting the first answer. Similarly, early Supabase setup used a project URL that did not resolve (`ENOTFOUND`), and no amount of frontend prompting would fix invalid infrastructure. I learned to treat AI output on security-sensitive areas—RLS policies, auth flows, role escalation—with extra scrutiny. When recursive RLS policies appeared in migrations, I relied on SQL migrations and Supabase logs rather than letting the model invent policies from memory.

Debugging with AI worked best when I supplied the **full error log** and reproduction steps. Weaker prompts (“login doesn’t work”) produced generic answers. Stronger prompts included the terminal stack trace, `.env` variable names (never values), and the route being tested. That pattern mirrors how senior engineers triage issues and became my default vibe-coding habit.

### Verifying code quality and security

I did not accept generated code without checks. Verification included: running `npm run build` and `npm run lint` before pushes; manual flows through register, login, student request submission, and staff status updates; reviewing Supabase RLS rules so students could not read arbitrary profiles; and confirming that new registrations default to the **student** role while staff/admin promotion requires explicit SQL or admin action. Server actions were preferred over client-side Supabase calls for auth to keep secrets off the browser surface. I avoided committing `.env` files and rotated keys when URLs were exposed in conversation or logs.

What I would improve: automated tests (unit + E2E) were still incomplete relative to assignment targets—AI can draft Vitest and Playwright specs, but I should have requested them earlier instead of focusing only on visible UI. A continuous prompt log (`AI_PROMPTS.md`) should have been updated daily; reconstructing prompts at the end is harder and weaker for academic integrity documentation.

### What I would do differently from day one

If I started over, I would (1) provision Supabase and verify DNS before any UI work, (2) keep a running markdown log of every significant prompt and what I changed in the response, (3) align README and deployment env vars with the first successful production build, and (4) define a minimal test suite before adding visual features like the 3D globe. I would also ask AI for smaller diffs per task—one feature, one review—rather than large multi-file generations that are tedious to audit.

### One key lesson about vibe coding

**Vibe coding is effective when the human remains the integrator.** AI speed does not remove responsibility; it shifts it to review, architecture, and deployment discipline. The sustainable workflow is: prompt with context → apply a small change → run build/lint → test the real flow → document the prompt. Models are strong at scaffolding CRUD, forms, and migrations; they are unreliable as single sources of truth for security, version-specific APIs, and infrastructure. Treating AI as a fast junior developer—whose work you always verify—made this project shippable without surrendering ownership of the codebase.

**Word count:** ~720
