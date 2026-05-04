# AFIYAPAL Stage 2 Admin Testing Checklist

This checklist verifies the Stage 2 admin dashboard before release. Run it after database schema sync and Prisma client generation:

```bash
npx prisma db push
npx prisma generate
npm run dev
```

The in-app checklist is available to Super Admins at:

```txt
/admin/testing
```

## Recommended local QA accounts

Create normal users through `/register`, then promote them in Prisma Studio for local testing:

- `SUPER_ADMIN` — full verification, audit logs, settings, and sensitive access governance.
- `SUPPORT_ADMIN` — user support, reports, and consultation workflow testing.
- `MEDICAL_REVIEWER` — AI safety flag and sensitive health review testing.
- `DOCTOR_MANAGER` — doctor verification approval/rejection testing.
- `CONTENT_MANAGER` — article creation, review submission, and content workflow testing.
- `USER` — normal user access-denial and user-facing workflow testing.
- `DOCTOR` — doctor notification and consultation assignment workflow testing.

Do not ship shared default production passwords.

## Required release checks

### Access control

- [ ] Normal user cannot access `/admin`.
  - Setup: active `USER` account.
  - Expected: redirect to `/unauthorized`; admin shell and admin data do not render.

- [ ] Suspended user cannot use protected services.
  - Setup: set account status to `SUSPENDED`.
  - Expected: protected admin pages/actions are blocked.

- [ ] Sensitive health details are not exposed unnecessarily.
  - Setup: use symptom check or AI flag with health context.
  - Expected: list pages show metadata/summaries only; sensitive details require allowed role, reason, and access grant.

### Doctor verification

- [ ] Doctor cannot appear publicly before verification.
  - Setup: doctor profile with `PENDING`, `REJECTED`, or `SUSPENDED` status.
  - Expected: only `VERIFIED` doctors are public/assignable.

- [ ] Doctor Manager can approve doctors.
  - Setup: active `DOCTOR_MANAGER` and pending doctor profile.
  - Expected: doctor becomes `VERIFIED`, doctor notification is created, and audit log is created.

- [ ] Content Manager cannot approve doctors.
  - Setup: active `CONTENT_MANAGER`.
  - Expected: doctor approval UI/action is inaccessible.

### AI safety and medical review

- [ ] Medical Reviewer can review AI flags.
  - Setup: active `MEDICAL_REVIEWER` and open AI flag.
  - Expected: reviewer can access `/admin/ai-flags` and update review fields.

- [ ] Critical AI flag appears in admin dashboard.
  - Setup: emergency-risk symptom check or critical flag.
  - Expected: overview counts update and `/admin/ai-flags` shows a `CRITICAL` row.

- [ ] Audit logs are created for sensitive actions.
  - Setup: request sensitive health detail access with a reason.
  - Expected: `/admin/audit-logs` includes `SENSITIVE_HEALTH_DETAILS_VIEWED` with actor, target, reason, and timestamp.

### Consultations and support

- [ ] Support Admin can manage consultation requests.
  - Setup: active `SUPPORT_ADMIN` and new consultation request.
  - Expected: support admin can update consultation status/notes.

- [ ] Consultation can be assigned to verified doctor only.
  - Setup: one verified doctor and one pending/rejected/suspended doctor.
  - Expected: only verified doctor can be selected/assigned.

### Reports, tables, and filters

- [ ] Report resolved notification and audit log are created.
  - Setup: open safety report linked to reporter.
  - Expected: reporter notification and report-resolved audit log exist.

- [ ] Admin tables paginate correctly.
  - Setup: create more records than one page.
  - Expected: page navigation is stable, no duplicate rows across pages, filters preserve behavior.

- [ ] Search and filters work.
  - Setup: records across roles, statuses, risk levels, languages, priorities, and dates.
  - Expected: filtered results match selected criteria and empty states render cleanly.

## Evidence to capture

For each check, capture at least one of:

- Screenshot of the relevant UI state.
- Database row before/after action.
- Audit log row.
- Notification row.
- Browser URL after redirect.

## Privacy acceptance criteria

A check fails if any admin list page exposes full raw private health conversations by default. Admins should see summaries first. Sensitive health detail access must be restricted to `SUPER_ADMIN` or `MEDICAL_REVIEWER`, must require a reason, and must create an audit log entry.
