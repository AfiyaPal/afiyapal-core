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

## Phase 3 admin layout foundation

Phase 3 turns the protected admin routes from plain placeholders into a reusable dashboard shell.

### Admin routes included

- `/admin`
- `/admin/users`
- `/admin/doctors`
- `/admin/symptom-checks`
- `/admin/ai-flags`
- `/admin/content`
- `/admin/consultations`
- `/admin/reports`
- `/admin/settings`

### Layout components added

- `features/admin/components/admin-shell.tsx`
- `features/admin/components/admin-sidebar.tsx`
- `features/admin/components/admin-topbar.tsx`
- `features/admin/components/admin-dashboard-card.tsx`
- `features/admin/components/admin-data-table.tsx`
- `features/admin/components/admin-filters.tsx`
- `features/admin/components/admin-status-badge.tsx`

### Reusable filters added

The admin UI now has reusable filter definitions for search, status, date, role, language, and urgency. The module pages use these filters as UI shells first. Later phases should connect them to query parameters, repository methods, and real data models.

### Logout/profile menu

The admin top bar now includes a profile menu with the authenticated admin's name, email, role label, and a logout action backed by the existing HTTP-only session cookie.

### Settings route

`/admin/settings` is now included as a Super Admin-only module. It is intended for Stage 2 platform safety settings such as supported languages, emergency guidance, AI disclaimers, doctor verification requirements, review intervals, and support contact settings.

## Phase 4 — Overview dashboard MVP

Phase 4 turns `/admin` into the operational overview dashboard. The page now reads real counts where data exists and safely returns `0` for Stage 2 tables before those workflows are populated.

Dashboard metrics included:

- Total registered users
- Active users today, this week, and this month
- Total symptom checks
- Consultation requests
- Pending doctor verifications
- Open/in-review flagged AI interactions
- Emergency-risk symptom interactions
- Published health articles

Recent activity feed included:

- New user registered
- Doctor applied
- Symptom check completed
- Consultation requested
- AI response flagged
- Blog published

New Stage 2 data models prepared in `server/db/schema.prisma`:

- `DoctorProfile`
- `SymptomCheckLog`
- `AiInteractionFlag`
- `ConsultationRequest`
- `SafetyReport`

After pulling this phase locally, run:

```bash
npx prisma db push
npx prisma generate
```

Then restart the dev server.

## Phase 5 update: user management

The users module is now implemented beyond the placeholder stage.

Included:

- `/admin/users` user list page.
- Search by username or email.
- Filters by role and account status.
- `/admin/users/[userId]` profile detail page.
- Profile fields: name, email, phone, preferred language, role, status, verification state, date joined, and last updated date.
- Admin actions: activate user, suspend user, change account status, and change role.
- Activity summary cards for blogs, comments, symptom checks, consultations, AI flags, and reports.

Privacy rule:

- The user profile shows activity counts only. Full symptom-check, mental-health, or AI conversation content is intentionally not exposed from the user management page by default.

Permission rule:

- Admin roles can only be assigned or removed by a `SUPER_ADMIN` through the existing `CREATE_ADMINS` permission helper.

## Phase 7 update: symptom checker logging

The symptom checker module is now implemented beyond the placeholder stage.

Included:

- Every chatbot/symptom-checker request is logged safely after an AI response is generated.
- Logs capture user ID when available, language, symptom summary, AI response summary, symptom category, risk level, recommended next step, escalation suggestion, status, created date, and updated date.
- Risk levels are standardized as `LOW`, `MEDIUM`, `HIGH`, and `EMERGENCY`.
- `/admin/symptom-checks` now shows a real table of symptom checker requests.
- Filters include risk level, language, start date, end date, escalation suggested, and status.
- `/admin/symptom-checks/[logId]` shows a privacy-safe detail summary.

Privacy rule:

- The admin view shows summarized health content and metadata. Full raw health conversations are intentionally not exposed by default.

Safety rule:

- `HIGH` and `EMERGENCY` risk logs automatically mark doctor escalation as suggested. Emergency logs recommend urgent local medical care.

## Phase 8 update: AI safety flags

The flagged AI interactions module is now implemented beyond the placeholder stage.

Included:

- `AiInteractionFlag` now stores reviewer assignment, admin notes, reviewer notes, resolution notes, trigger source, resolved timestamp, and linked escalation consultation ID.
- Automatic flags are created when symptom-check logs contain emergency symptoms, mental health crisis language, pregnancy/child high-risk symptoms, low-confidence AI wording, or repeated unresolved symptoms.
- User-reported wrong-answer flags are supported at the service layer for later UI/reporting integration.
- Flag statuses are standardized as `OPEN`, `IN_REVIEW`, `RESOLVED`, and `ESCALATED`.
- Flag priorities are standardized as `LOW`, `MEDIUM`, `HIGH`, and `CRITICAL`.
- `/admin/ai-flags` now shows a real table with filters for search, status, priority, category, trigger, and date range.
- `/admin/ai-flags/[flagId]` shows a privacy-safe review detail page.
- Medical reviewers can assign reviewers, update flag status, update priority, add admin/reviewer/resolution notes, and escalate flags into consultation requests.

Privacy rule:

- AI flag detail pages show summarized context and linked symptom-check summaries. Full raw private health conversations are not exposed by default.

Escalation rule:

- Escalating a flag creates a `ConsultationRequest`, links it to the flag, marks the flag as `ESCALATED`, and updates the related symptom-check log to `ESCALATED` when one exists.


## Phase 9 — Mental Health Companion Oversight

Implemented in this version:

- Mental health companion interactions are stored separately from normal symptom-check logs.
- Mental health logs keep privacy-safe summaries only by default:
  - user id when signed in
  - language
  - mood category
  - risk level
  - support resources shown
  - escalation suggested
  - created date
- High-risk mental health companion interactions automatically create AI safety flags in `/admin/ai-flags`.
- AI flag detail pages now show privacy-safe mental health context when a flag comes from the companion flow.
- Mental health support resource management is available at `/admin/settings/mental-health-resources`.
- Resource records include hotline name, country, phone, website, description, and active/inactive status.

Run after extracting:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

## Phase 10: Content management

The admin content module is now an operational CMS workflow for AFIYAPAL health education articles.

### Routes

- `/admin/content` — article list with filters and workflow actions.
- `/admin/content/new` — create a draft article.
- `/admin/content/[blogId]` — article detail, review metadata, action controls, and safe preview.
- `/admin/content/[blogId]/edit` — edit article content and metadata.

### Article workflow

Supported article statuses:

- `DRAFT`
- `PENDING_REVIEW`
- `PUBLISHED`
- `ARCHIVED`

Supported medical review statuses:

- `NOT_SUBMITTED`
- `PENDING`
- `APPROVED`
- `CHANGES_REQUESTED`
- `REJECTED`

### Categories and languages

Categories:

- Malaria
- Maternal health
- Nutrition
- Mental health
- First aid
- General wellness

Languages:

- English
- Swahili

### Governance rules

- Content Managers can create, edit, submit, publish, unpublish, and archive articles.
- Medical Reviewers can approve content for publishing or request changes.
- Published content edited later is moved back into review to protect medical quality.
- Published articles older than 6 months without a fresh review are marked as needing review.
- The public blog listing only shows published articles.

## Phase 11 update: consultation requests

The consultation requests module is now implemented beyond the placeholder stage.

Included:

- `/admin/consultations` real consultation request table.
- `/admin/consultations/[requestId]` privacy-safe consultation detail page.
- Consultation request fields: user, symptoms/reason summary, preferred language, country/region, urgency level, requested specialty, assigned doctor, status, admin notes, created date, and updated date.
- Consultation statuses: `NEW`, `AWAITING_ASSIGNMENT`, `ASSIGNED`, `ACCEPTED_BY_DOCTOR`, `COMPLETED`, `CANCELLED`, and `ESCALATED`.
- Filters for status, urgency, specialty, language, and assigned/unassigned state.
- Assign doctor action restricted to verified doctors.
- Change status action.
- Internal admin notes action.

Privacy rule:

- Consultation detail pages show summarized care-coordination context and basic user profile details only. Full raw AI or health conversations remain outside the default consultation view.

Care coordination rule:

- Assigning a verified doctor automatically moves the request to `ASSIGNED`. Clearing the assigned doctor moves the request to `AWAITING_ASSIGNMENT`.

## Phase 12: Reports and Safety Center

Phase 12 turns `/admin/reports` into a real safety operations area. It supports AI response reports, doctor reports, user reports, content reports, platform issues, and safety incidents. Each report has a status (`OPEN`, `IN_REVIEW`, `RESOLVED`, `DISMISSED`), priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), assigned admin, resolution notes, and action history.

The safety center is intentionally privacy-aware: the default report detail view shows summaries and operational metadata, not full private health conversations. Admin changes to status, priority, assignment, and resolution notes are recorded in `SafetyReportActionHistory` for traceability.

## Phase 13: Admin audit logs

Phase 13 adds a Super Admin-only audit trail at `/admin/audit-logs`.

### Stored audit fields

- Admin user
- Action type
- Target type
- Target ID
- Old value
- New value
- Reason
- Timestamp

### Logged governance actions

- User activated, suspended, status changed, or role changed
- Doctor approved, rejected, or suspended
- Article published, unpublished, or archived
- AI flag resolved or escalated
- Consultation assigned or status changed
- Safety report resolved

### Access rule

Only users with `VIEW_AUDIT_SENSITIVE_ADMIN_DATA` can view the audit log. In the current role map, this is effectively Super Admin-only.

### Privacy rule

Audit logs record operational deltas and summarized reasons. They do not store full raw health conversations by default.
