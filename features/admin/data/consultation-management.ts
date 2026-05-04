export const CONSULTATION_STATUSES = [
  "NEW",
  "AWAITING_ASSIGNMENT",
  "ASSIGNED",
  "ACCEPTED_BY_DOCTOR",
  "COMPLETED",
  "CANCELLED",
  "ESCALATED"
] as const;

export type ConsultationStatus = (typeof CONSULTATION_STATUSES)[number];

export const CONSULTATION_URGENCY_LEVELS = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;
export type ConsultationUrgencyLevel = (typeof CONSULTATION_URGENCY_LEVELS)[number];

export const CONSULTATION_SPECIALTIES = [
  "General clinician",
  "Mental health",
  "Maternal health",
  "Pediatrics",
  "Nutrition",
  "First aid",
  "Malaria care",
  "Other"
] as const;

export function labelFromKey(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function consultationStatusLabel(status: string) {
  if (status === "ACCEPTED_BY_DOCTOR") return "Accepted by doctor";
  return labelFromKey(status);
}

export function consultationUrgencyLabel(urgency: string) {
  return urgency === "EMERGENCY" ? "Emergency" : labelFromKey(urgency);
}

export function consultationStatusTone(status: string) {
  if (status === "ESCALATED") return "red" as const;
  if (status === "CANCELLED") return "slate" as const;
  if (status === "COMPLETED") return "green" as const;
  if (status === "ASSIGNED" || status === "ACCEPTED_BY_DOCTOR") return "blue" as const;
  return "amber" as const;
}

export function consultationUrgencyTone(urgency: string) {
  if (urgency === "EMERGENCY") return "red" as const;
  if (urgency === "HIGH") return "amber" as const;
  if (urgency === "MEDIUM") return "blue" as const;
  return "slate" as const;
}
