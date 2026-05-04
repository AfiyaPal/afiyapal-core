export type AdminTestingStatus = "Required" | "Recommended" | "Regression";

export type AdminTestingChecklistItem = {
  id: string;
  title: string;
  status: AdminTestingStatus;
  setup: string;
  action: string;
  expectedResult: string;
  evidence: string;
};

export type AdminTestingChecklistGroup = {
  title: string;
  summary: string;
  items: readonly AdminTestingChecklistItem[];
};

export const adminTestingChecklistGroups = [
  {
    title: "Access control and account safety",
    summary: "Confirms only active authorized admins can use protected admin surfaces.",
    items: [
      {
        id: "QA-ADMIN-001",
        title: "Normal user cannot access /admin",
        status: "Required",
        setup: "Create or use an ACTIVE user with role USER.",
        action: "Log in as that user and open /admin.",
        expectedResult: "The user is redirected to /unauthorized and no admin shell or admin data is rendered.",
        evidence: "Screenshot of /unauthorized and browser URL after attempting /admin."
      },
      {
        id: "QA-ADMIN-002",
        title: "Suspended user cannot use protected services",
        status: "Required",
        setup: "Set a test account status to SUSPENDED, including an admin-role account for route testing.",
        action: "Try to log in and access /admin, then try a protected admin action route if still authenticated.",
        expectedResult: "The suspended user cannot access protected admin pages and cannot perform protected admin actions.",
        evidence: "Screenshot of blocked route plus database user status."
      },
      {
        id: "QA-ADMIN-003",
        title: "Sensitive health details are not exposed unnecessarily",
        status: "Required",
        setup: "Create or use a symptom check or AI flag with health summary context.",
        action: "Open list pages and detail pages as Support Admin, Medical Reviewer, and Super Admin.",
        expectedResult: "Tables show metadata/summaries only. Sensitive details require an allowed role, a reason, and an access grant.",
        evidence: "Screenshots of table, gated detail panel, and granted detail view."
      }
    ]
  },
  {
    title: "Doctor verification",
    summary: "Confirms provider visibility and doctor-management permissions stay safe.",
    items: [
      {
        id: "QA-DOCTOR-001",
        title: "Doctor cannot appear publicly before verification",
        status: "Required",
        setup: "Create a doctor profile/application with verificationStatus PENDING or REJECTED.",
        action: "Check any public doctor/provider surfaces and assignment lists.",
        expectedResult: "Only VERIFIED doctors are available for assignment or public doctor discovery surfaces.",
        evidence: "Screenshot of admin doctor status and absence from public/assignment surface."
      },
      {
        id: "QA-DOCTOR-002",
        title: "Doctor Manager can approve doctors",
        status: "Required",
        setup: "Create an ACTIVE account with role DOCTOR_MANAGER and a pending doctor profile.",
        action: "Log in as Doctor Manager and approve the pending doctor.",
        expectedResult: "Doctor status changes to VERIFIED, doctor receives an approval notification, and an audit log is created.",
        evidence: "Screenshot of verified status, notification, and audit log row."
      },
      {
        id: "QA-DOCTOR-003",
        title: "Content Manager cannot approve doctors",
        status: "Required",
        setup: "Create an ACTIVE account with role CONTENT_MANAGER and a pending doctor profile.",
        action: "Log in as Content Manager and attempt to access /admin/doctors or submit a doctor approval action.",
        expectedResult: "The Content Manager cannot access doctor approval workflow and cannot approve/reject doctors.",
        evidence: "Screenshot of denied route or missing doctor module from sidebar."
      }
    ]
  },
  {
    title: "AI safety and medical review",
    summary: "Confirms high-risk AI cases surface correctly and only qualified admins review them.",
    items: [
      {
        id: "QA-AI-001",
        title: "Medical Reviewer can review AI flags",
        status: "Required",
        setup: "Create an ACTIVE account with role MEDICAL_REVIEWER and at least one OPEN AI flag.",
        action: "Log in as Medical Reviewer, open /admin/ai-flags, and update review notes or status.",
        expectedResult: "Medical Reviewer can access the module, review the flag, add notes, and update valid review state.",
        evidence: "Screenshot of updated AI flag detail and audit/updated timestamp if applicable."
      },
      {
        id: "QA-AI-002",
        title: "Critical AI flag appears in admin dashboard",
        status: "Required",
        setup: "Submit an emergency-risk symptom check or create a CRITICAL AI flag.",
        action: "Open /admin and /admin/ai-flags.",
        expectedResult: "The overview dashboard reflects flagged/emergency counts, and the flag appears in the AI flags table with CRITICAL priority.",
        evidence: "Screenshots of overview cards and AI flag row."
      },
      {
        id: "QA-AI-003",
        title: "Audit logs are created for sensitive actions",
        status: "Required",
        setup: "Use a Super Admin or Medical Reviewer with permission to request sensitive summary access.",
        action: "Enter a reason, view sensitive health details, then open /admin/audit-logs as Super Admin.",
        expectedResult: "An audit log entry records SENSITIVE_HEALTH_DETAILS_VIEWED with admin user, target type, target ID, reason, and timestamp.",
        evidence: "Screenshot of sensitive access reason and matching audit log row."
      }
    ]
  },
  {
    title: "Consultations and support operations",
    summary: "Confirms support workflows route requests safely to verified doctors.",
    items: [
      {
        id: "QA-CONSULT-001",
        title: "Support Admin can manage consultation requests",
        status: "Required",
        setup: "Create an ACTIVE account with role SUPPORT_ADMIN and at least one NEW consultation request.",
        action: "Log in as Support Admin, open /admin/consultations, update notes or status.",
        expectedResult: "Support Admin can manage consultation workflow fields allowed by the module.",
        evidence: "Screenshot of consultation detail with updated status/notes."
      },
      {
        id: "QA-CONSULT-002",
        title: "Consultation can be assigned to verified doctor only",
        status: "Required",
        setup: "Create one VERIFIED doctor and one PENDING/SUSPENDED doctor profile.",
        action: "Open a consultation request and inspect/submit the doctor assignment control.",
        expectedResult: "Only the VERIFIED doctor can be selected/assigned; pending/rejected/suspended doctors are blocked.",
        evidence: "Screenshot of doctor assignment list and successful verified-doctor assignment."
      },
      {
        id: "QA-CONSULT-003",
        title: "Urgent consultation request notifies admins",
        status: "Recommended",
        setup: "Create a HIGH or EMERGENCY urgency consultation request.",
        action: "Open /admin/notifications and the overview dashboard.",
        expectedResult: "Admins receive an urgent consultation notification and the request appears in the consultation queue.",
        evidence: "Screenshot of notification and consultation row."
      }
    ]
  },
  {
    title: "Reports, content, and tables",
    summary: "Confirms operational dashboards remain usable as data grows.",
    items: [
      {
        id: "QA-REPORT-001",
        title: "Report resolved notification and audit log are created",
        status: "Required",
        setup: "Create an OPEN safety report linked to a reporter user.",
        action: "Resolve the report with resolution notes.",
        expectedResult: "Reporter receives a resolved notification and a report-resolved audit log is created.",
        evidence: "Screenshot of report detail, user notification row, and audit log row."
      },
      {
        id: "QA-CONTENT-001",
        title: "Content Manager can manage content but cannot approve doctor workflows",
        status: "Regression",
        setup: "Create an ACTIVE CONTENT_MANAGER account and a draft article.",
        action: "Create/edit/submit content, then attempt doctor approval workflow.",
        expectedResult: "Content management works; doctor approval remains inaccessible.",
        evidence: "Screenshots of content workflow and denied/missing doctor access."
      },
      {
        id: "QA-TABLE-001",
        title: "Admin tables paginate correctly",
        status: "Required",
        setup: "Create more records than one page for users, symptom checks, AI flags, consultations, reports, or audit logs.",
        action: "Use each list page and move through pages where pagination controls are available.",
        expectedResult: "Rows load consistently, no duplicates appear between pages, and filters preserve pagination behavior.",
        evidence: "Screenshots of page 1 and page 2 with active filters where applicable."
      },
      {
        id: "QA-FILTER-001",
        title: "Search and filters work",
        status: "Required",
        setup: "Ensure records exist across multiple roles, statuses, risk levels, languages, priorities, and dates.",
        action: "Apply search and filters on admin list pages.",
        expectedResult: "Each list returns only matching records and empty states render cleanly when no match exists.",
        evidence: "Screenshots of filtered results and an empty filtered state."
      }
    ]
  }
] as const satisfies readonly AdminTestingChecklistGroup[];

export const adminTestingSeedAccounts = [
  { role: "SUPER_ADMIN", purpose: "Full verification, audit logs, settings, and sensitive access governance." },
  { role: "SUPPORT_ADMIN", purpose: "User support, reports, and consultation workflow testing." },
  { role: "MEDICAL_REVIEWER", purpose: "AI safety flag and sensitive health review testing." },
  { role: "DOCTOR_MANAGER", purpose: "Doctor verification approval/rejection testing." },
  { role: "CONTENT_MANAGER", purpose: "Article creation, review submission, and content workflow testing." },
  { role: "USER", purpose: "Normal user access-denial and user-facing workflow testing." },
  { role: "DOCTOR", purpose: "Doctor notification and consultation assignment workflow testing." }
] as const;
