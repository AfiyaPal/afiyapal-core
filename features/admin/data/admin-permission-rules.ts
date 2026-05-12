import { ADMIN_PERMISSIONS, type AdminPermission } from "@/server/auth/admin-permissions";
import type { AdminModuleKey } from "@/features/admin/data/admin-scope";

export const adminModulePermissions = {
  overview: [ADMIN_PERMISSIONS.VIEW_ADMIN_DASHBOARD],
  users: [ADMIN_PERMISSIONS.MANAGE_USERS],
  doctors: [ADMIN_PERMISSIONS.MANAGE_DOCTORS, ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS],
  facilities: [ADMIN_PERMISSIONS.MANAGE_FACILITIES, ADMIN_PERMISSIONS.APPROVE_REJECT_FACILITIES],
  "symptom-checks": [ADMIN_PERMISSIONS.VIEW_SYMPTOM_CHECKS],
  "ai-flags": [ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS],
  content: [ADMIN_PERMISSIONS.MANAGE_CONTENT, ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT],
  consultations: [ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS],
  reports: [ADMIN_PERMISSIONS.MANAGE_REPORTS],
  "audit-logs": [ADMIN_PERMISSIONS.VIEW_AUDIT_SENSITIVE_ADMIN_DATA],
  notifications: [ADMIN_PERMISSIONS.VIEW_NOTIFICATIONS],
  testing: [ADMIN_PERMISSIONS.VIEW_TESTING_CHECKLIST],
  settings: [ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS]
} as const satisfies Record<AdminModuleKey, readonly AdminPermission[]>;

export const adminActionRules = [
  {
    rule: "Only Super Admin can create or assign admin roles.",
    permission: ADMIN_PERMISSIONS.CREATE_ADMINS,
    allowedRoles: ["SUPER_ADMIN"]
  },
  {
    rule: "Medical Reviewer can review health flags and medically sensitive content.",
    permission: ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS,
    allowedRoles: ["SUPER_ADMIN", "MEDICAL_REVIEWER"]
  },
  {
    rule: "Doctor Manager can approve, reject, or suspend doctors.",
    permission: ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS,
    allowedRoles: ["SUPER_ADMIN", "DOCTOR_MANAGER"]
  },
  {
    rule: "Content Manager can manage blogs and health education content.",
    permission: ADMIN_PERMISSIONS.MANAGE_CONTENT,
    allowedRoles: ["SUPER_ADMIN", "CONTENT_MANAGER"]
  },
  {
    rule: "Support Admin can handle reports and consultation requests.",
    permission: ADMIN_PERMISSIONS.MANAGE_REPORTS,
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "SUPPORT_ADMIN"]
  }
] as const;
