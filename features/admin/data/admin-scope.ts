export const ADMIN_USER_STORY =
  "As an AFIYAPAL admin, I want to manage users, doctors, AI health interactions, health content, consultation requests, and safety reports so that the platform remains safe, trustworthy, and medically responsible.";

export const systemUserRoles = [
  { key: "USER", name: "User", summary: "Default patient/community role with no admin access." },
  { key: "DOCTOR", name: "Doctor", summary: "Healthcare provider role; admin access is not granted unless a separate admin role is assigned." },
  { key: "ADMIN", name: "Admin", summary: "General operations admin with limited access to users, reports, consultations, and privacy-safe symptom logs." },
  { key: "SUPER_ADMIN", name: "Super Admin", summary: "Full platform authority including admin creation and sensitive governance actions." },
  { key: "MEDICAL_REVIEWER", name: "Medical Reviewer", summary: "Health safety reviewer for AI flags, symptom logs, and medical content review." },
  { key: "SUPPORT_ADMIN", name: "Support Admin", summary: "Support role for user issues, reports, and consultation queues." },
  { key: "DOCTOR_MANAGER", name: "Doctor Manager", summary: "Provider operations role for doctor verification and suspension workflows." },
  { key: "CONTENT_MANAGER", name: "Content Manager", summary: "Publishing operations role for blogs, translations, and content freshness." }
] as const;

export const adminRoles = [
  { key: "ADMIN", name: "Admin", summary: "General operations admin with limited access to users, reports, consultations, and privacy-safe symptom logs.", responsibilities: ["View the admin overview dashboard", "Manage basic user support operations", "Handle reports and consultation queues", "View privacy-safe symptom-check logs"] },
  { key: "SUPER_ADMIN", name: "Super Admin", summary: "Owns platform-level administration, permissions, settings, and final escalation decisions.", responsibilities: ["Manage admin access and role assignments", "View audit-sensitive platform operations", "Configure platform safety and health governance settings", "Handle critical escalations that require full authority"] },
  { key: "SUPPORT_ADMIN", name: "Support Admin", summary: "Handles user support, account issues, consultation queues, and general safety reports.", responsibilities: ["Review user reports and support tickets", "Manage consultation request status updates", "Suspend or reactivate users when policy requires it", "Escalate medical or AI safety issues to qualified reviewers"] },
  { key: "MEDICAL_REVIEWER", name: "Medical Reviewer", summary: "Reviews health-sensitive AI outputs, symptom-check patterns, and medical content quality.", responsibilities: ["Review flagged AI health interactions", "Approve or reject medical content before publication", "Add safety notes to symptom-check reviews", "Recommend escalation to verified doctors where needed"] },
  { key: "DOCTOR_MANAGER", name: "Doctor Manager", summary: "Manages provider onboarding, verification, suspension, and doctor profile quality.", responsibilities: ["Review doctor applications and documents", "Approve, reject, or suspend provider profiles", "Maintain specialty, language, and availability metadata", "Ensure only verified doctors are assignable to consultations"] },
  { key: "CONTENT_MANAGER", name: "Content Manager", summary: "Manages health articles, categories, translations, publishing workflow, and content freshness.", responsibilities: ["Create and edit health education content", "Manage English and Swahili article versions", "Submit content for medical review", "Archive outdated or low-quality content"] }
] as const;

export const adminModules = [
  { key: "overview", name: "Overview Dashboard", route: "/admin", summary: "A platform health snapshot for adoption, safety, pending actions, and recent activity.", mvpIncludes: ["Total users and active users", "Symptom-check activity", "Pending doctor verifications", "Open consultation requests", "Flagged AI interactions", "Recent safety and content activity"] },
  { key: "users", name: "User Management", route: "/admin/users", summary: "Search, review, activate, suspend, and role-manage user accounts.", mvpIncludes: ["User list and filters", "Basic profile summary", "Account status actions", "Role assignment workflow", "Privacy-safe activity summary"] },
  { key: "doctors", name: "Doctor Verification", route: "/admin/doctors", summary: "Review and manage healthcare provider applications before they can serve patients.", mvpIncludes: ["Doctor application list", "Verification document review", "Approve, reject, and suspend actions", "Specialty, location, and language metadata", "Verified-by and reviewed-on tracking"] },
  { key: "symptom-checks", name: "Symptom Checker Logs", route: "/admin/symptom-checks", summary: "Audit AI symptom-check usage with risk level, language, category, and recommended next step.", mvpIncludes: ["Symptom-check log table", "Risk-level filters", "Language filters", "Escalation suggested indicator", "Privacy-safe detail summaries"] },
  { key: "ai-flags", name: "Flagged AI Interactions", route: "/admin/ai-flags", summary: "Review AI interactions that may need human or medical oversight.", mvpIncludes: ["Emergency-risk flags", "Mental-health safety flags", "User-reported AI issues", "Priority and status workflow", "Reviewer notes and escalation action"] },
  { key: "content", name: "Blog / Content Management", route: "/admin/content", summary: "Manage health education content, review status, publishing, translation, and freshness.", mvpIncludes: ["Article list and editor entry points", "Draft, review, published, archived statuses", "English and Swahili content support", "Medical review metadata", "Publish, unpublish, and archive actions"] },
  { key: "consultations", name: "Consultation Requests", route: "/admin/consultations", summary: "Coordinate user requests for care and assign them to verified doctors.", mvpIncludes: ["Consultation request queue", "Urgency and status filters", "Verified doctor assignment", "Internal admin notes", "Completion and escalation status"] },
  { key: "reports", name: "Reports / Safety Center", route: "/admin/reports", summary: "Handle user reports, doctor reports, content reports, AI reports, and safety incidents.", mvpIncludes: ["Report list and detail view", "Priority and status workflow", "Assigned admin tracking", "Resolution notes", "Safety incident categorization"] },
  { key: "notifications", name: "Notifications", route: "/admin/notifications", summary: "Review admin alerts for doctor applications, critical AI flags, urgent consultations, reports, and pending content.", mvpIncludes: ["Role-routed admin alerts", "Unread/read workflow", "Critical and urgent priority labels", "Privacy-safe notification summaries", "Links to related operational targets"] },
  { key: "audit-logs", name: "Admin Audit Logs", route: "/admin/audit-logs", summary: "Trace sensitive admin actions across users, doctors, articles, AI flags, consultations, and reports.", mvpIncludes: ["Admin user and action type", "Target type and target ID", "Old and new values", "Reason or note", "Timestamped governance history"] },
  { key: "settings", name: "Admin Settings", route: "/admin/settings", summary: "Configure Stage 2 platform safety defaults, supported languages, disclaimers, and escalation rules.", mvpIncludes: ["Supported language settings", "Emergency guidance text", "AI disclaimer defaults", "Mental health support resources", "Doctor verification requirements", "Content review intervals", "Support contact settings"] }
] as const;

export type AdminRoleKey = (typeof adminRoles)[number]["key"];
export type AdminModuleKey = (typeof adminModules)[number]["key"];

export const adminScopeSummary = {
  stage: "Stage 2 MVP",
  purpose: "Turn AFIYAPAL from a hackathon-winning demo into a safer, more trustworthy health platform with clear admin responsibilities.",
  systemRoles: systemUserRoles,
  roles: adminRoles,
  modules: adminModules,
  userStory: ADMIN_USER_STORY
} as const;
