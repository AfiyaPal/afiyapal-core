export const FACILITY_TYPES = [
  { value: "HOSPITAL", label: "Hospital" },
  { value: "CLINIC", label: "Clinic" },
  { value: "PHARMACY", label: "Pharmacy" },
  { value: "LAB", label: "Laboratory" },
  { value: "MATERNITY", label: "Maternity center" },
  { value: "OTHER", label: "Other" }
] as const;

export const FACILITY_VERIFICATION_STATUSES = ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"] as const;

export const EVENT_TYPES = [
  { value: "FREE_CHECKUP", label: "Free checkup" },
  { value: "HEALTH_TALK", label: "Health talk" },
  { value: "VACCINATION_DRIVE", label: "Vaccination drive" },
  { value: "SCREENING", label: "Health screening" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "OTHER", label: "Other" }
] as const;

export const EVENT_STATUSES = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"] as const;

export const PROFESSIONAL_ROLES = [
  { value: "STAFF_DOCTOR", label: "Staff doctor" },
  { value: "SPECIALIST", label: "Specialist" },
  { value: "NURSE", label: "Nurse" },
  { value: "MIDWIFE", label: "Midwife" },
  { value: "LAB_TECHNICIAN", label: "Lab technician" },
  { value: "PHARMACIST", label: "Pharmacist" },
  { value: "ADMIN_STAFF", label: "Administrative staff" },
  { value: "DIRECTOR", label: "Director" }
] as const;
