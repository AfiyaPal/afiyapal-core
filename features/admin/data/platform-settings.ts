export const PLATFORM_SETTING_KEYS = {
  SUPPORTED_LANGUAGES: "supportedLanguages",
  EMERGENCY_MESSAGE_TEXT: "emergencyMessageText",
  DOCTOR_VERIFICATION_REQUIREMENTS: "doctorVerificationRequirements",
  AI_DISCLAIMER_TEXT: "aiDisclaimerText",
  DEFAULT_CONSULTATION_URGENCY_RULES: "defaultConsultationUrgencyRules",
  CONTENT_REVIEW_INTERVAL_MONTHS: "contentReviewIntervalMonths",
  SUPPORT_EMAIL: "supportEmail"
} as const;

export type PlatformSettingKey = (typeof PLATFORM_SETTING_KEYS)[keyof typeof PLATFORM_SETTING_KEYS];

export const defaultPlatformSettings: Record<PlatformSettingKey, string> = {
  supportedLanguages: "English, Swahili",
  emergencyMessageText:
    "If you may be experiencing a medical emergency, seek urgent help immediately from local emergency services, a nearby clinic, or a trusted healthcare professional.",
  doctorVerificationRequirements:
    "Verify identity, medical license or registration number, specialty, country/region, contact details, and supporting documents before approving a provider.",
  aiDisclaimerText:
    "AFIYAPAL provides general health information and first-step guidance. It is not a medical diagnosis and does not replace a qualified healthcare professional.",
  defaultConsultationUrgencyRules:
    "Emergency symptoms should be escalated immediately. High-risk symptoms should be prioritized for doctor review. Medium-risk symptoms should be reviewed when capacity allows. Low-risk requests may follow standard queue order.",
  contentReviewIntervalMonths: "6",
  supportEmail: "support@afiyapal.local"
};

export const platformSettingLabels: Record<PlatformSettingKey, { label: string; description: string }> = {
  supportedLanguages: {
    label: "Supported languages",
    description: "Languages currently supported by patient-facing and admin-managed health flows."
  },
  emergencyMessageText: {
    label: "Emergency message text",
    description: "Safety guidance shown when AI or admin workflows identify critical risk."
  },
  doctorVerificationRequirements: {
    label: "Doctor verification requirements",
    description: "Provider onboarding rules used by doctor managers before approval."
  },
  aiDisclaimerText: {
    label: "AI disclaimer text",
    description: "Default disclaimer shown across AI assistant experiences."
  },
  defaultConsultationUrgencyRules: {
    label: "Default consultation urgency rules",
    description: "Internal triage guidance for routing consultation requests."
  },
  contentReviewIntervalMonths: {
    label: "Content review interval",
    description: "Number of months before published health content should be reviewed again."
  },
  supportEmail: {
    label: "Contact/support email",
    description: "Public or operational support email for AFIYAPAL."
  }
};

export const healthResourceTypes = [
  { value: "CLINIC", label: "Clinic" },
  { value: "HOTLINE", label: "Hotline" },
  { value: "EMERGENCY_CONTACT", label: "Emergency contact" },
  { value: "COUNTRY_RESOURCE", label: "Country-specific resource" }
] as const;

export type HealthResourceType = (typeof healthResourceTypes)[number]["value"];

export const healthResourceTypeLabels: Record<HealthResourceType, string> = {
  CLINIC: "Clinic",
  HOTLINE: "Hotline",
  EMERGENCY_CONTACT: "Emergency contact",
  COUNTRY_RESOURCE: "Country-specific resource"
};
