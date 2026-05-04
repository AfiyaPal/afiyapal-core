export const ARTICLE_STATUSES = ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const ARTICLE_CATEGORIES = [
  { value: "MALARIA", label: "Malaria" },
  { value: "MATERNAL_HEALTH", label: "Maternal health" },
  { value: "NUTRITION", label: "Nutrition" },
  { value: "MENTAL_HEALTH", label: "Mental health" },
  { value: "FIRST_AID", label: "First aid" },
  { value: "GENERAL_WELLNESS", label: "General wellness" }
] as const;
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]["value"];

export const ARTICLE_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "sw", label: "Swahili" }
] as const;
export type ArticleLanguage = (typeof ARTICLE_LANGUAGES)[number]["value"];

export const MEDICAL_REVIEW_STATUSES = ["NOT_SUBMITTED", "PENDING", "APPROVED", "CHANGES_REQUESTED", "REJECTED"] as const;
export type MedicalReviewStatus = (typeof MEDICAL_REVIEW_STATUSES)[number];

export function articleStatusLabel(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "PENDING_REVIEW") return "Pending Review";
  return normalized
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function articleCategoryLabel(category: string | null | undefined) {
  return ARTICLE_CATEGORIES.find((item) => item.value === category)?.label ?? "General wellness";
}

export function articleLanguageLabel(language: string | null | undefined) {
  return ARTICLE_LANGUAGES.find((item) => item.value === language)?.label ?? "English";
}

export function medicalReviewStatusLabel(status: string | null | undefined) {
  return articleStatusLabel(status ?? "NOT_SUBMITTED");
}

export function isOutdatedContent(updatedAt: Date, reviewedAt: Date | null | undefined, status: string) {
  if (status.toUpperCase() !== "PUBLISHED") return false;
  const reference = reviewedAt ?? updatedAt;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return reference < sixMonthsAgo;
}
