import "server-only";
import { type UserRole, isAdminRole } from "@/server/auth/roles";

export const ADMIN_PERMISSIONS = {
  VIEW_ADMIN_DASHBOARD: "VIEW_ADMIN_DASHBOARD",
  MANAGE_USERS: "MANAGE_USERS",
  CREATE_ADMINS: "CREATE_ADMINS",
  MANAGE_DOCTORS: "MANAGE_DOCTORS",
  APPROVE_REJECT_DOCTORS: "APPROVE_REJECT_DOCTORS",
  MANAGE_FACILITIES: "MANAGE_FACILITIES",
  APPROVE_REJECT_FACILITIES: "APPROVE_REJECT_FACILITIES",
  VIEW_SYMPTOM_CHECKS: "VIEW_SYMPTOM_CHECKS",
  REVIEW_HEALTH_FLAGS: "REVIEW_HEALTH_FLAGS",
  REVIEW_MEDICAL_CONTENT: "REVIEW_MEDICAL_CONTENT",
  MANAGE_CONTENT: "MANAGE_CONTENT",
  MANAGE_CONSULTATIONS: "MANAGE_CONSULTATIONS",
  MANAGE_REPORTS: "MANAGE_REPORTS",
  VIEW_AUDIT_SENSITIVE_ADMIN_DATA: "VIEW_AUDIT_SENSITIVE_ADMIN_DATA",
  VIEW_SENSITIVE_HEALTH_DETAILS: "VIEW_SENSITIVE_HEALTH_DETAILS",
  MANAGE_ADMIN_SETTINGS: "MANAGE_ADMIN_SETTINGS",
  VIEW_NOTIFICATIONS: "VIEW_NOTIFICATIONS",
  VIEW_TESTING_CHECKLIST: "VIEW_TESTING_CHECKLIST"
} as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];

const ALL_ADMIN_PERMISSIONS = Object.values(ADMIN_PERMISSIONS) as AdminPermission[];

export const rolePermissions: Record<UserRole, readonly AdminPermission[]> = {
  USER: [],
  DOCTOR: [],
  FACILITY_ADMIN: [],
  ADMIN: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    ADMIN_PERMISSIONS.VIEW_NOTIFICATIONS,
    ADMIN_PERMISSIONS.MANAGE_USERS,
    ADMIN_PERMISSIONS.VIEW_SYMPTOM_CHECKS,
    ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS,
    ADMIN_PERMISSIONS.MANAGE_REPORTS
  ],
  SUPER_ADMIN: ALL_ADMIN_PERMISSIONS,
  MEDICAL_REVIEWER: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    ADMIN_PERMISSIONS.VIEW_NOTIFICATIONS,
    ADMIN_PERMISSIONS.VIEW_SYMPTOM_CHECKS,
    ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS,
    ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT,
    ADMIN_PERMISSIONS.VIEW_SENSITIVE_HEALTH_DETAILS
  ],
  SUPPORT_ADMIN: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    ADMIN_PERMISSIONS.VIEW_NOTIFICATIONS,
    ADMIN_PERMISSIONS.MANAGE_USERS,
    ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS,
    ADMIN_PERMISSIONS.MANAGE_REPORTS
  ],
  DOCTOR_MANAGER: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    ADMIN_PERMISSIONS.VIEW_NOTIFICATIONS,
    ADMIN_PERMISSIONS.MANAGE_DOCTORS,
    ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS,
    ADMIN_PERMISSIONS.MANAGE_FACILITIES,
    ADMIN_PERMISSIONS.APPROVE_REJECT_FACILITIES,
    ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS
  ],
  CONTENT_MANAGER: [
    ADMIN_PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    ADMIN_PERMISSIONS.VIEW_NOTIFICATIONS,
    ADMIN_PERMISSIONS.MANAGE_CONTENT
  ]
};

export function hasAdminPermission(role: UserRole | string | null | undefined, permission: AdminPermission) {
  if (!role || !isAdminRole(role)) return false;
  return rolePermissions[role].includes(permission);
}

export function hasAnyAdminPermission(role: UserRole | string | null | undefined, permissions: readonly AdminPermission[]) {
  return permissions.some((permission) => hasAdminPermission(role, permission));
}

export function canCreateAdmin(actorRole: UserRole | string | null | undefined) {
  return hasAdminPermission(actorRole, ADMIN_PERMISSIONS.CREATE_ADMINS);
}

export function canApproveOrRejectDoctors(actorRole: UserRole | string | null | undefined) {
  return hasAdminPermission(actorRole, ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS);
}

export function canReviewHealthFlags(actorRole: UserRole | string | null | undefined) {
  return hasAdminPermission(actorRole, ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS);
}

export function canReviewMedicalContent(actorRole: UserRole | string | null | undefined) {
  return hasAdminPermission(actorRole, ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT);
}

export function canManageBlogs(actorRole: UserRole | string | null | undefined) {
  return hasAdminPermission(actorRole, ADMIN_PERMISSIONS.MANAGE_CONTENT);
}

export function canHandleReportsAndConsultations(actorRole: UserRole | string | null | undefined) {
  return (
    hasAdminPermission(actorRole, ADMIN_PERMISSIONS.MANAGE_REPORTS) &&
    hasAdminPermission(actorRole, ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS)
  );
}
