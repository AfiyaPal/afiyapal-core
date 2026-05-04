# AFIYAPAL Stage 2 Admin Scope

## Core admin user story

As an AFIYAPAL admin, I want to manage users, doctors, AI health interactions, health content, consultation requests, and safety reports so that the platform remains safe, trustworthy, and medically responsible.

## First admin roles

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

## Implementation note

Phase 1 defines the admin scope and makes it reusable in the codebase through `features/admin/data/admin-scope.ts`. The `/admin` page currently displays the agreed scope. Route protection, permissions, database-backed admin actions, and module-specific pages should be implemented in the next phases.
