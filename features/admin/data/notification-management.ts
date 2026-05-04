export const NOTIFICATION_STATUS_OPTIONS = ["UNREAD", "READ"] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUS_OPTIONS)[number];

export const notificationPriorityLabels: Record<string, string> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  CRITICAL: "Critical"
};

export const notificationTypeLabels: Record<string, string> = {
  DOCTOR_APPLICATION_SUBMITTED: "Doctor application",
  DOCTOR_APPROVED: "Doctor approved",
  DOCTOR_REJECTED: "Doctor rejected",
  AI_FLAG_CRITICAL: "Critical AI flag",
  CONSULTATION_URGENT: "Urgent consultation",
  CONSULTATION_ASSIGNED: "Consultation assigned",
  DOCTOR_RESPONDED: "Doctor responded",
  AI_RESPONSE_REPORTED: "AI response reported",
  CONTENT_PENDING_REVIEW: "Content pending review",
  REPORT_RESOLVED: "Report resolved",
  SAFETY_REPORT_SUBMITTED: "Safety report submitted"
};
