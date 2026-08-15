# Public Professional Directory — Shipped Scope & Open Proposals

Status: for dev team and stakeholder discussion. Contact exposure and a facilities
directory are intentionally **not** shipped yet — see the proposals below.

## What shipped (privacy-safe)

- Public directory at `/professionals` and profile pages at `/professionals/{id}`.
- Only **VERIFIED + AVAILABLE** professionals appear anywhere public (directory,
  profile pages, sitemap, chatbot referrals) — a profile page is a 404 otherwise.
- Public data projection (`features/professionals/queries/get-public-professionals.ts`):
  - `fullName`, `specialty`, `languagesSpoken`, `yearsOfExperience`, `country`,
    `cityRegion`, `bio`, `availabilityStatus`
  - their **published blog articles** (links to `/blogs/{slug}`)
  - their **affiliated facilities** (name, city, country)
- **Never exposed publicly:** `phone`, `email`, `licenseNumber`, `userId`, any
  verification/rejection/suspension fields.
- The chatbot (Gemini) never queries the database. Server-only code
  (`chatbot-context-service.ts`) selects the public projection and sends the LLM a
  plain-text summary of up to 3 matching professionals with `/professionals/{id}` links.
  Chat replies render those links clickable, but the bot has no direct table access.

## Proposal 1 — Contact exposure (NOT built)

Broad topic; needs product + privacy + legal input before any data is public.

- **Professional-controlled public number**: a separate opt-in `publicPhone` field,
  distinct from the private `phone` used for verification. A professional decides
  whether it exists at all.
- **Show-in-directory opt-in**: a `showInDirectory` flag controlling presence in
  `/professionals` and chatbot referral results (and query results generally).
- **Contact preference**: allow choosing which channel is shown (phone / email / none)
  rather than always exposing both.
- **Anti-abuse**: options to consider — contact-reveal tap instead of plain render,
  rate limiting, `rel="nofollow"`, email obfuscation.
- **Schema impact**: would add public-facing columns or a small settings model on
  `DoctorProfile`. Private fields stay server-only; only explicit opt-in projections
  would ever be public.

## Proposal 2 — Facilities directory (NOT built)

- Public facility pages listing their **ACTIVE / VERIFIED** professionals.
- Prioritise surfacing facilities with **1+ active professionals** (they already have
  a pool on the platform) over facilities with none.
- Facility-controlled listing: whether the facility appears publicly and which of its
  professionals are listed, with the same privacy principles as Proposal 1.
- Today facilities only surface publicly through **events** (public events are gated to
  VERIFIED facilities).

## Architecture principles

1. Private fields stay server-only. Any new public exposure is an explicit, opt-in
   public projection — never a re-share of the private record.
2. No denormalised "public copy" tables: projections are computed at read time from
   `DoctorProfile`, keeping availability/name changes fresh and avoiding sync bugs.
3. The LLM only ever sees formatted text assembled server-side; it cannot query or
   read beyond what the projection selects.
