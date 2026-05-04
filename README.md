# AfiyaPal Next.js Migration Starter

This zip is a production-oriented Next.js App Router starter generated from the Django project structure.

## Architecture

```txt
app/        = thin routes, layouts, route handlers, loading/error/not-found states
features/   = feature-based UI, schemas, actions, feature queries/types
server/     = server-only sensitive logic: Prisma, repositories, services, AI clients
components/ = reusable layout, UI, and shared presentation components
lib/        = shared config, env validation, routes, utilities
public/     = migrated static images from Django static/img
styles/     = optional extra global styles
```

## Start

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

For database-backed auth/blogs, set `DATABASE_URL` in `.env.local`, then run:

```bash
npx prisma migrate dev --name init
```

## Migration notes

- Django `templates/base.html` became `app/layout.tsx` + `components/layout/*`.
- Django `frontend/templates/frontend/index.html` became `features/home/components/home-page.tsx`.
- Django chatbot views became `features/chatbot/*`, `app/api/chatbot/route.ts`, and `server/ai/gemini-client.ts`.
- Django `users/models.py` was mapped to `server/db/schema.prisma`.
- Django static images were copied to `public/images/*`.

No secrets are included. Rotate any previously exposed API keys before deploying.

## Stage 2 admin scope

AFIYAPAL Stage 2 introduces an admin scope for keeping the platform safe, trustworthy, and medically responsible.

Core admin user story:

> As an AFIYAPAL admin, I want to manage users, doctors, AI health interactions, health content, consultation requests, and safety reports so that the platform remains safe, trustworthy, and medically responsible.

The first admin roles are Super Admin, Support Admin, Medical Reviewer, Doctor Manager, and Content Manager. The Stage 2 MVP dashboard modules are Overview Dashboard, User Management, Doctor Verification, Symptom Checker Logs, Flagged AI Interactions, Blog / Content Management, Consultation Requests, and Reports / Safety Center.

The source of truth for this scope lives in `features/admin/data/admin-scope.ts`, with a human-readable copy in `docs/ADMIN_SCOPE.md`. The `/admin` route currently renders the scope definition and will be expanded in later phases with route protection, permissions, and database-backed workflows.


## Stage 2 Admin Access

The admin area is available at `/admin` and is protected by role-based access. New users register as `USER`; promote a trusted test account to `SUPER_ADMIN` in the database for local admin testing. See `docs/ADMIN_SCOPE.md` for the current role and permission map.

## Stage 2 Phase 3 Admin Layout

Phase 3 adds the reusable admin dashboard shell used by all protected admin routes.

Included admin routes:

- `/admin`
- `/admin/users`
- `/admin/doctors`
- `/admin/symptom-checks`
- `/admin/ai-flags`
- `/admin/content`
- `/admin/consultations`
- `/admin/reports`
- `/admin/settings`

Reusable admin UI components live in `features/admin/components` and include the sidebar, top bar, dashboard cards, table shell, status badge, and filter shell.

The admin top bar includes a profile/logout menu. The logout action clears the signed HTTP-only session cookie and redirects to `/login`.

## Stage 2 Admin — Phase 4 Overview Dashboard

Phase 4 connects `/admin` to a real overview dashboard with user counts, activity windows, symptom-check totals, consultation requests, pending doctor verification counts, AI safety flags, emergency-risk interactions, published articles, and a recent activity feed.

Run after extracting this phase:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

The new Stage 2 tables will start at `0` until the corresponding workflows are implemented and populated in later phases.


### Phase 5: User management

The admin users module now supports:

- User list at `/admin/users`.
- Search by username/email.
- Filters by role and account status.
- User detail pages at `/admin/users/[userId]`.
- Activate/suspend account actions.
- Role changes with Super Admin protection for admin-level roles.
- Privacy-safe activity summaries that avoid exposing raw health conversations by default.

After updating from Phase 4, run:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

### Phase 7: Symptom checker logging

The admin symptom checker module now supports:

- Safe logging of chatbot/symptom-checker requests.
- User ID capture when the user is signed in.
- Language detection using the user's preferred language and simple Swahili/English heuristics.
- Symptom category inference.
- Risk levels: `LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`.
- Recommended next step and doctor-escalation suggestion.
- `/admin/symptom-checks` with filters for risk level, language, date range, escalation suggested, and status.
- `/admin/symptom-checks/[logId]` with a privacy-safe summary detail view.

After updating from Phase 5, run:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

### Phase 8: AI safety flags

The admin AI safety module now supports:

- Automatic AI safety flags from symptom-check logs.
- Flag categories for emergency symptoms, mental health crisis language, pregnancy/child high-risk symptoms, user-reported wrong answers, low-confidence AI responses, and repeated unresolved symptoms.
- Flag statuses: `OPEN`, `IN_REVIEW`, `RESOLVED`, `ESCALATED`.
- Flag priorities: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- `/admin/ai-flags` with filters for search, status, priority, category, trigger, and date range.
- `/admin/ai-flags/[flagId]` with a privacy-safe review page.
- Reviewer assignment.
- Admin, reviewer, and resolution notes.
- Escalation action that creates a consultation request and links it back to the flag.

After updating from Phase 7, run:

```bash
npx prisma db push
npx prisma generate
npm run dev
```
