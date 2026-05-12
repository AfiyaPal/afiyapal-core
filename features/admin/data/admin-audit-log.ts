export const ADMIN_AUDIT_ACTIONS = [
  "USER_ACTIVATED",
  "USER_SUSPENDED",
  "USER_STATUS_CHANGED",
  "USER_ROLE_CHANGED",
  "DOCTOR_APPROVED",
  "DOCTOR_REJECTED",
  "DOCTOR_SUSPENDED",
  "FACILITY_APPROVED",
  "FACILITY_REJECTED",
  "FACILITY_SUSPENDED",
  "ARTICLE_PUBLISHED",
  "ARTICLE_UNPUBLISHED",
  "ARTICLE_ARCHIVED",
  "AI_FLAG_RESOLVED",
  "AI_FLAG_ESCALATED",
  "CONSULTATION_ASSIGNED",
  "CONSULTATION_STATUS_CHANGED",
  "REPORT_RESOLVED",
  "SENSITIVE_HEALTH_DETAILS_VIEWED",
  "PLATFORM_SETTINGS_UPDATED",
  "HEALTH_RESOURCE_CREATED",
  "HEALTH_RESOURCE_UPDATED",
  "HEALTH_RESOURCE_STATUS_CHANGED"
] as const;

export type AdminAuditAction = (typeof ADMIN_AUDIT_ACTIONS)[number];

export const ADMIN_AUDIT_TARGET_TYPES = [
  "User",
  "DoctorProfile",
  "Blog",
  "AiInteractionFlag",
  "ConsultationRequest",
  "SafetyReport",
  "SymptomCheckLog",
  "MentalHealthInteraction",
  "PlatformSetting",
  "HealthResource",
  "Facility"
] as const;

export type AdminAuditTargetType = (typeof ADMIN_AUDIT_TARGET_TYPES)[number];

export const adminAuditActionLabels: Record<AdminAuditAction, string> = {
  USER_ACTIVATED: "User activated",
  USER_SUSPENDED: "User suspended",
  USER_STATUS_CHANGED: "User status changed",
  USER_ROLE_CHANGED: "User role changed",
  DOCTOR_APPROVED: "Doctor approved",
  DOCTOR_REJECTED: "Doctor rejected",
  DOCTOR_SUSPENDED: "Doctor suspended",
  ARTICLE_PUBLISHED: "Article published",
  ARTICLE_UNPUBLISHED: "Article unpublished",
  ARTICLE_ARCHIVED: "Article archived",
  AI_FLAG_RESOLVED: "AI flag resolved",
  AI_FLAG_ESCALATED: "AI flag escalated",
  CONSULTATION_ASSIGNED: "Consultation assigned",
  CONSULTATION_STATUS_CHANGED: "Consultation status changed",
  REPORT_RESOLVED: "Report resolved",
  SENSITIVE_HEALTH_DETAILS_VIEWED: "Sensitive health details viewed",
  PLATFORM_SETTINGS_UPDATED: "Platform settings updated",
  HEALTH_RESOURCE_CREATED: "Health resource created",
  HEALTH_RESOURCE_UPDATED: "Health resource updated",
  HEALTH_RESOURCE_STATUS_CHANGED: "Health resource status changed",
  FACILITY_APPROVED: "Facility approved",
  FACILITY_REJECTED: "Facility rejected",
  FACILITY_SUSPENDED: "Facility suspended"
};

export const adminAuditTargetLabels: Record<AdminAuditTargetType, string> = {
  User: "User",
  DoctorProfile: "Doctor profile",
  Blog: "Article",
  AiInteractionFlag: "AI safety flag",
  ConsultationRequest: "Consultation request",
  SafetyReport: "Safety report",
  SymptomCheckLog: "Symptom check log",
  MentalHealthInteraction: "Mental health interaction",
  PlatformSetting: "Platform setting",
  HealthResource: "Health resource",
  Facility: "Facility"
};
