# AFIYAPAL Stage 2 Admin Scope

## Core admin user story

As an AFIYAPAL admin, I want to manage users, doctors, AI health interactions, health content, consultation requests, and safety reports so that the platform remains safe, trustworthy, and medically responsible.

## System user roles

The system now recognizes these role keys:

- `USER`
- `DOCTOR`
- `ADMIN`
- `SUPER_ADMIN`
- `MEDICAL_REVIEWER`
- `SUPPORT_ADMIN`
- `DOCTOR_MANAGER`
- `CONTENT_MANAGER`

`USER` and `DOCTOR` are not admin roles by default. Admin route access is limited to active users whose role is one of:

- `ADMIN`
- `SUPER_ADMIN`
- `MEDICAL_REVIEWER`
- `SUPPORT_ADMIN`
- `DOCTOR_MANAGER`
- `CONTENT_MANAGER`

## First admin roles

- Admin
- Super Admin
- Support Admin
- Medical Reviewer
- Doctor Manager
- Content Manager

## Stage 2 MVP dashboard modules

1. Overview Dashboard
2. User Management
3. Doctor Verification
4. Symptom Checker Logs
5. Flagged AI Interactions
6. Blog / Content Management
7. Consultation Requests
8. Reports / Safety Center

## Phase 2 role-based access implementation

Phase 2 adds the role and permission foundation for the admin area.

Implemented files:

- `server/auth/roles.ts`
- `server/auth/admin-permissions.ts`
- `server/auth/session.ts`
- `server/auth/admin-guard.ts`
- `features/admin/data/admin-permission-rules.ts`
- `app/admin/layout.tsx`
- `app/unauthorized/page.tsx`
- `proxy.ts`

## Permission rules

The current helper rules are:

- Only `SUPER_ADMIN` can create or assign admin roles.
- `MEDICAL_REVIEWER` can review health flags and medically sensitive content.
- `DOCTOR_MANAGER` can approve, reject, or suspend doctors.
- `CONTENT_MANAGER` can manage blogs and health education content.
- `SUPPORT_ADMIN` can handle reports and consultation requests.

## Route protection behavior

- `/admin` and all nested admin routes are protected.
- Users without a session are redirected to `/login?next=/admin` or the requested admin path.
- Users with a session but without an active admin role are redirected to `/unauthorized`.
- Each admin module page also checks its required permission before rendering.

## Session note

This phase keeps the existing custom auth direction and adds a signed, HTTP-only `afiyapal_session` cookie on successful login. The server-side admin guard validates the signed session and then loads the user from the database before allowing admin access.

Set `AUTH_SECRET` in `.env` to a long random value before using this beyond local development.

## Local admin setup note

Newly registered users are created with:

- `role = "USER"`
- `status = "ACTIVE"`

Until a Super Admin management screen exists, promote a trusted local test account directly in the database, for example by setting its `role` to `SUPER_ADMIN`.
