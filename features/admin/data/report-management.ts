export const SAFETY_REPORT_TYPES = [
  "AI_RESPONSE_REPORT",
  "DOCTOR_REPORT",
  "USER_REPORT",
  "CONTENT_REPORT",
  "PLATFORM_ISSUE",
  "SAFETY_INCIDENT"
] as const;

export type SafetyReportType = (typeof SAFETY_REPORT_TYPES)[number];

export const SAFETY_REPORT_STATUSES = ["OPEN", "IN_REVIEW", "RESOLVED", "DISMISSED"] as const;
export type SafetyReportStatus = (typeof SAFETY_REPORT_STATUSES)[number];

export const SAFETY_REPORT_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type SafetyReportPriority = (typeof SAFETY_REPORT_PRIORITIES)[number];

export const SAFETY_REPORT_ACTION_TYPES = [
  "CREATED",
  "STATUS_CHANGED",
  "PRIORITY_CHANGED",
  "ASSIGNED_ADMIN_CHANGED",
  "RESOLUTION_UPDATED",
  "NOTE_ADDED"
] as const;

export type SafetyReportActionType = (typeof SAFETY_REPORT_ACTION_TYPES)[number];

export function safetyReportTypeLabel(type: string | null | undefined) {
  switch (type) {
    case "AI_RESPONSE_REPORT":
      return "AI response report";
    case "DOCTOR_REPORT":
      return "Doctor report";
    case "USER_REPORT":
      return "User report";
    case "CONTENT_REPORT":
      return "Content report";
    case "PLATFORM_ISSUE":
      return "Platform issue";
    case "SAFETY_INCIDENT":
      return "Safety incident";
    default:
      return "Report";
  }
}

export function safetyReportStatusLabel(status: string | null | undefined) {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_REVIEW":
      return "In review";
    case "RESOLVED":
      return "Resolved";
    case "DISMISSED":
      return "Dismissed";
    default:
      return "Unknown";
  }
}

export function safetyReportPriorityLabel(priority: string | null | undefined) {
  switch (priority) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    case "CRITICAL":
      return "Critical";
    default:
      return "Unknown";
  }
}

export function safetyReportStatusTone(status: string | null | undefined) {
  switch (status) {
    case "RESOLVED":
      return "green" as const;
    case "DISMISSED":
      return "slate" as const;
    case "IN_REVIEW":
      return "blue" as const;
    case "OPEN":
    default:
      return "amber" as const;
  }
}

export function safetyReportPriorityTone(priority: string | null | undefined) {
  switch (priority) {
    case "CRITICAL":
    case "HIGH":
      return "red" as const;
    case "MEDIUM":
      return "amber" as const;
    case "LOW":
    default:
      return "green" as const;
  }
}
