# Checklist

## Phase 1: Define admin scope

- [ ] Decide the first admin roles:
  - Super Admin
  - Support Admin
  - Medical Reviewer
  - Doctor Manager
  - Content Manager

- [ ] Decide which dashboard modules are included in Stage 2 MVP:
  - Overview dashboard
  - User management
  - Doctor verification
  - Symptom checker logs
  - Flagged AI interactions
  - Blog/content management
  - Consultation requests
  - Reports/safety center

- [ ] Write the core admin user story:

> As an AFIYAPAL admin, I want to manage users, doctors, AI health interactions, health content, consultation requests, and safety reports so that the platform remains safe, trustworthy, and medically responsible.

## Phase 2: Add role-based access

- [ ] Add user roles to the system:
  - `USER`
  - `DOCTOR`
  - `ADMIN`
  - `SUPER_ADMIN`
  - `MEDICAL_REVIEWER`
  - `SUPPORT_ADMIN`
  - `CONTENT_MANAGER`

- [ ] Add admin-only route protection.

- [ ] Prevent normal users from accessing `/admin`.

- [ ] Add permission checks for each admin action.

- [ ] Create helper rules such as:
  - Only Super Admin can create other admins.
  - Medical Reviewer can review health flags and content.
  - Doctor Manager can approve/reject doctors.
  - Content Manager can manage blogs.
  - Support Admin can handle reports and consultation requests.

## Phase 3: Build admin layout

- [ ] Create admin route group:
  - `/admin`
  - `/admin/users`
  - `/admin/doctors`
  - `/admin/symptom-checks`
  - `/admin/ai-flags`
  - `/admin/content`
  - `/admin/consultations`
  - `/admin/reports`
  - `/admin/settings`

- [ ] Create admin sidebar.

- [ ] Create admin top bar.

- [ ] Add logout/profile menu.

- [ ] Add dashboard cards.

- [ ] Add reusable admin table component.

- [ ] Add reusable filters:
  - Search
  - Status
  - Date range
  - Role
  - Language
  - Urgency

## Phase 4: Overview dashboard MVP

- [ ] Show total registered users.

- [ ] Show active users today/week/month.

- [ ] Show total symptom checks.

- [ ] Show consultation requests.

- [ ] Show pending doctor verifications.

- [ ] Show flagged AI interactions.

- [ ] Show emergency-risk interactions.

- [ ] Show published articles.

- [ ] Add recent activity feed:
  - New user registered
  - Doctor applied
  - Symptom check completed
  - Consultation requested
  - AI response flagged
  - Blog published

## Phase 5: User management

- [ ] Create user list page.

- [ ] Add search by name/email.

- [ ] Add filter by role.

- [ ] Add filter by status.

- [ ] Add user profile detail page.

- [ ] Show basic profile:
  - Name
  - Email
  - Phone if available
  - Preferred language
  - Role
  - Account status
  - Date joined

- [ ] Add admin actions:
  - Activate user
  - Suspend user
  - Change role
  - View activity summary

- [ ] Avoid exposing full sensitive health conversations by default.

## Phase 6: Doctor verification

- [ ] Create doctor profile model/table.

- [ ] Add doctor application flow.

- [ ] Store doctor fields:
  - Full name
  - Email
  - Phone
  - Country
  - City/region
  - License number
  - Specialty
  - Languages spoken
  - Years of experience
  - Verification documents
  - Bio
  - Availability status

- [ ] Create `/admin/doctors`.

- [ ] Add doctor list.

- [ ] Add doctor verification statuses:
  - Pending
  - Verified
  - Rejected
  - Suspended

- [ ] Add doctor detail page.

- [ ] Add approve doctor action.

- [ ] Add reject doctor action with reason.

- [ ] Add suspend doctor action.

- [ ] Track:
  - Verified by
  - Verified on
  - Rejection reason
  - Suspension reason

## Phase 7: Symptom checker logging

- [ ] Store every symptom checker request safely.

- [ ] Log:
  - User ID
  - Language
  - Symptoms submitted
  - AI response summary
  - Risk level
  - Recommended next step
  - Whether doctor escalation was suggested
  - Created date

- [ ] Add risk levels:
  - Low
  - Medium
  - High
  - Emergency

- [ ] Create `/admin/symptom-checks`.

- [ ] Add table columns:
  - Date
  - User
  - Language
  - Symptom category
  - Risk level
  - Escalation suggested
  - Status

- [ ] Add filters:
  - Risk level
  - Language
  - Date range
  - Escalation suggested

- [ ] Add detail view with privacy-safe summary.

## Phase 8: AI safety flags

- [ ] Create AI flag model/table.

- [ ] Automatically flag risky conversations.

- [ ] Flag cases such as:
  - Emergency symptoms
  - Mental health crisis language
  - Pregnancy/child-related high-risk symptoms
  - User reports AI answer as wrong
  - AI gives low-confidence response
  - Repeated unresolved symptoms

- [ ] Create `/admin/ai-flags`.

- [ ] Add flag statuses:
  - Open
  - In review
  - Resolved
  - Escalated

- [ ] Add flag priority:
  - Low
  - Medium
  - High
  - Critical

- [ ] Add reviewer assignment.

- [ ] Add admin notes.

- [ ] Add resolution notes.

- [ ] Add escalation action to consultation request.

## Phase 9: Mental health companion oversight

- [ ] Store mental health interactions separately from normal symptom checks.

- [ ] Avoid showing private raw messages unless required by safety review.

- [ ] Log:
  - Mood category
  - Language
  - Risk level
  - Support resources shown
  - Escalation suggested
  - Created date

- [ ] Add high-risk mental health flags to `/admin/ai-flags`.

- [ ] Add mental health resource management:
  - Hotline name
  - Country
  - Phone
  - Website
  - Description
  - Active/inactive

## Phase 10: Content management

- [ ] Create content admin page:
  - `/admin/content`

- [ ] Add blog/article list.

- [ ] Add article statuses:
  - Draft
  - Pending Review
  - Published
  - Archived

- [ ] Add article categories:
  - Malaria
  - Maternal health
  - Nutrition
  - Mental health
  - First aid
  - General wellness

- [ ] Add language support:
  - English
  - Swahili

- [ ] Add medical review fields:
  - Reviewed by
  - Reviewed on
  - Review status
  - Review notes

- [ ] Add content actions:
  - Create article
  - Edit article
  - Submit for review
  - Approve for publishing
  - Publish
  - Unpublish
  - Archive

- [ ] Add outdated content reminder:
  - Mark articles older than 6–12 months for review.

## Phase 11: Consultation requests

- [ ] Create consultation request model/table.

- [ ] Store:
  - User
  - Symptoms or reason summary
  - Preferred language
  - Country/region
  - Urgency level
  - Requested specialty
  - Assigned doctor
  - Status
  - Admin notes
  - Created date

- [ ] Add consultation statuses:
  - New
  - Awaiting assignment
  - Assigned
  - Accepted by doctor
  - Completed
  - Cancelled
  - Escalated

- [ ] Create `/admin/consultations`.

- [ ] Add consultation request table.

- [ ] Add filters:
  - Status
  - Urgency
  - Specialty
  - Language
  - Assigned/unassigned

- [ ] Add assign doctor action.

- [ ] Add change status action.

- [ ] Add internal notes.

## Phase 12: Reports and safety center

- [ ] Create report model/table.

- [ ] Support report types:
  - AI response report
  - Doctor report
  - User report
  - Content report
  - Platform issue
  - Safety incident

- [ ] Add report statuses:
  - Open
  - In review
  - Resolved
  - Dismissed

- [ ] Create `/admin/reports`.

- [ ] Add report list.

- [ ] Add report detail page.

- [ ] Add priority level.

- [ ] Add assigned admin.

- [ ] Add action history.

- [ ] Add resolution notes.

## Phase 13: Admin audit logs

- [ ] Create audit log model/table.

- [ ] Log important admin actions:
  - User suspended
  - Role changed
  - Doctor approved
  - Doctor rejected
  - Article published
  - AI flag resolved
  - Consultation assigned
  - Report resolved

- [ ] Store:
  - Admin user
  - Action type
  - Target type
  - Target ID
  - Old value
  - New value
  - Reason
  - Timestamp

- [ ] Add `/admin/audit-logs` for Super Admin only.

## Phase 14: Privacy and safety rules

- [ ] Add medical disclaimer across AI assistant flows.

- [ ] Add emergency guidance when risk is critical.

- [ ] Minimize health data visible in admin tables.

- [ ] Show summaries first, not raw conversations.

- [ ] Restrict raw conversation access to Medical Reviewer or Super Admin.

- [ ] Add reason requirement before viewing sensitive details.

- [ ] Add audit log entry when sensitive details are viewed.

- [ ] Avoid storing unnecessary personal health data.

## Phase 15: Admin settings

- [ ] Add `/admin/settings`.

- [ ] Add platform settings:
  - Supported languages
  - Emergency message text
  - Doctor verification requirements
  - AI disclaimer text
  - Default consultation urgency rules
  - Content review interval
  - Contact/support email

- [ ] Add health resource settings:
  - Clinics
  - Hotlines
  - Emergency contacts
  - Country-specific resources

## Phase 16: Notifications

- [ ] Notify admins when:
  - Doctor applies
  - AI flag is critical
  - Consultation request is urgent
  - User reports AI response
  - Content is pending review

- [ ] Notify doctors when:
  - They are approved
  - They are assigned a consultation
  - Their verification is rejected

- [ ] Notify users when:
  - Consultation request is assigned
  - Doctor responds
  - Report is resolved

## Phase 17: Testing checklist

- [ ] Normal user cannot access `/admin`.

- [ ] Suspended user cannot use protected services.

- [ ] Doctor cannot appear publicly before verification.

- [ ] Doctor Manager can approve doctors.

- [ ] Content Manager cannot approve doctors.

- [ ] Medical Reviewer can review AI flags.

- [ ] Support Admin can manage consultation requests.

- [ ] Critical AI flag appears in admin dashboard.

- [ ] Consultation can be assigned to verified doctor only.

- [ ] Audit logs are created for sensitive actions.

- [ ] Admin tables paginate correctly.

- [ ] Search and filters work.

- [ ] Sensitive health details are not exposed unnecessarily.

## Recommended build order

Start with this exact order:

1. Role-based access
2. Admin layout
3. Overview dashboard
4. User management
5. Doctor verification
6. Consultation requests
7. Symptom checker logs
8. AI safety flags
9. Content management
10. Reports/safety center
11. Audit logs
12. Admin settings

This gives you a strong Stage 2 admin system without overbuilding too early.
