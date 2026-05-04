import "server-only";
import { prisma } from "@/server/db/prisma";
import { createAutomaticAiSafetyFlagsForMentalHealthInteraction } from "@/server/services/ai-safety-flag-service";

export const MENTAL_HEALTH_RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;
export type MentalHealthRiskLevel = (typeof MENTAL_HEALTH_RISK_LEVELS)[number];

export const MENTAL_HEALTH_MOOD_CATEGORIES = [
  "GENERAL_SUPPORT",
  "STRESS",
  "ANXIETY",
  "LOW_MOOD",
  "OVERWHELMED",
  "GRIEF",
  "CRISIS_SUPPORT_NEEDED"
] as const;
export type MentalHealthMoodCategory = (typeof MENTAL_HEALTH_MOOD_CATEGORIES)[number];

const MAX_INTERACTION_SUMMARY_LENGTH = 900;
const MAX_AI_SUMMARY_LENGTH = 900;
const MAX_RESOURCE_SUMMARY_LENGTH = 900;

function compact(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string | null | undefined, maxLength: number) {
  if (!value) return null;
  const normalized = compact(value);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function containsAny(text: string, terms: readonly string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function isMentalHealthCompanionMessage(message: string) {
  return containsAny(message, [
    "mental",
    "stress",
    "stressed",
    "anxious",
    "anxiety",
    "panic",
    "depressed",
    "sad",
    "overwhelmed",
    "lonely",
    "grief",
    "trauma",
    "hopeless",
    "mindfulness",
    "breathing exercise",
    "msongo",
    "wasiwasi",
    "huzuni",
    "upweke"
  ]);
}

export function inferMentalHealthLanguage(message: string, preferredLanguage?: string | null) {
  if (preferredLanguage === "sw") return "sw";
  if (containsAny(message, ["msongo", "wasiwasi", "huzuni", "upweke", "afya ya akili", "tulia"])) return "sw";
  return "en";
}

export function inferMoodCategory(message: string): MentalHealthMoodCategory {
  if (containsAny(message, ["crisis", "unsafe", "harm", "hopeless", "sijisikii salama"])) return "CRISIS_SUPPORT_NEEDED";
  if (containsAny(message, ["panic", "anxious", "anxiety", "wasiwasi"])) return "ANXIETY";
  if (containsAny(message, ["stress", "stressed", "pressure", "msongo"])) return "STRESS";
  if (containsAny(message, ["sad", "depressed", "low", "huzuni"])) return "LOW_MOOD";
  if (containsAny(message, ["overwhelmed", "too much", "burnout", "exhausted"])) return "OVERWHELMED";
  if (containsAny(message, ["grief", "loss", "died", "bereaved", "maombolezo"])) return "GRIEF";
  return "GENERAL_SUPPORT";
}

export function inferMentalHealthRiskLevel(message: string): MentalHealthRiskLevel {
  if (containsAny(message, ["crisis", "unsafe", "harm myself", "end my life", "overdose", "kujiua", "kujiumiza"])) return "EMERGENCY";
  if (containsAny(message, ["hopeless", "can't cope", "cannot cope", "panic attack", "not safe", "sijisikii salama"])) return "HIGH";
  if (containsAny(message, ["anxiety", "anxious", "depressed", "sad", "stress", "stressed", "overwhelmed", "wasiwasi", "huzuni", "msongo"])) return "MEDIUM";
  return "LOW";
}

function defaultResourceSummary(language: string, riskLevel: MentalHealthRiskLevel) {
  if (riskLevel === "EMERGENCY" || riskLevel === "HIGH") {
    return language === "sw"
      ? "Shown: guidance to contact trusted local support, a nearby health facility, or emergency services if immediate safety support is needed."
      : "Shown: guidance to contact trusted local support, a nearby health facility, or emergency services if immediate safety support is needed.";
  }

  return language === "sw"
    ? "Shown: grounding, breathing, rest, trusted-person support, and gentle follow-up guidance."
    : "Shown: grounding, breathing, rest, trusted-person support, and gentle follow-up guidance.";
}

export async function getActiveMentalHealthResourcesSummary(country = "Kenya") {
  const resources = await prisma.mentalHealthResource.findMany({
    where: { isActive: true, country: { contains: country } },
    orderBy: [{ hotlineName: "asc" }],
    take: 5,
    select: { hotlineName: true, country: true, phone: true, website: true }
  });

  if (resources.length === 0) return null;

  return resources
    .map((resource) => [resource.hotlineName, resource.country, resource.phone, resource.website].filter(Boolean).join(" · "))
    .join(" | ");
}

export async function logMentalHealthInteraction(input: {
  userId?: number | null;
  preferredLanguage?: string | null;
  message: string;
  aiResponse: string;
  status?: string;
}) {
  const language = inferMentalHealthLanguage(input.message, input.preferredLanguage);
  const moodCategory = inferMoodCategory(input.message);
  const riskLevel = inferMentalHealthRiskLevel(input.message);
  const interactionSummary = truncate(input.message, MAX_INTERACTION_SUMMARY_LENGTH) ?? "Mental health companion interaction";
  const aiResponseSummary = truncate(input.aiResponse, MAX_AI_SUMMARY_LENGTH);
  const activeResourcesSummary = await getActiveMentalHealthResourcesSummary().catch(() => null);
  const supportResourcesShown = truncate(activeResourcesSummary ?? defaultResourceSummary(language, riskLevel), MAX_RESOURCE_SUMMARY_LENGTH);
  const escalationSuggested = riskLevel === "HIGH" || riskLevel === "EMERGENCY";

  const log = await prisma.mentalHealthInteraction.create({
    data: {
      userId: input.userId ?? null,
      language,
      moodCategory,
      riskLevel,
      interactionSummary,
      aiResponseSummary,
      supportResourcesShown,
      escalationSuggested,
      status: input.status ?? "COMPLETED"
    }
  });

  await createAutomaticAiSafetyFlagsForMentalHealthInteraction({
    id: log.id,
    userId: log.userId,
    moodCategory: log.moodCategory,
    language: log.language,
    riskLevel: log.riskLevel,
    interactionSummary: log.interactionSummary,
    aiResponseSummary: log.aiResponseSummary,
    supportResourcesShown: log.supportResourcesShown,
    escalationSuggested: log.escalationSuggested
  }).catch((error) => {
    console.error("Failed to create automatic mental health AI safety flags", error);
  });

  return log;
}
