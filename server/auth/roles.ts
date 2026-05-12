import "server-only";

export const USER_ROLES = [
  "USER",
  "DOCTOR",
  "FACILITY_ADMIN",
  "ADMIN",
  "SUPER_ADMIN",
  "MEDICAL_REVIEWER",
  "SUPPORT_ADMIN",
  "DOCTOR_MANAGER",
  "CONTENT_MANAGER"
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ADMIN_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
  "MEDICAL_REVIEWER",
  "SUPPORT_ADMIN",
  "DOCTOR_MANAGER",
  "CONTENT_MANAGER"
] as const satisfies readonly UserRole[];

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "SUSPENDED", "DELETED"] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export function isUserRole(value: string | null | undefined): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

export function isAdminRole(value: string | null | undefined): value is AdminRole {
  return ADMIN_ROLES.includes(value as AdminRole);
}

export function isActiveUserStatus(value: string | null | undefined) {
  return value === "ACTIVE";
}

export function getRoleLabel(role: UserRole | string) {
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
