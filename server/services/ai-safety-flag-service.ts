import "server-only";
import { prisma } from "@/server/db/prisma";
import { type SymptomRiskLevel } from "@/server/services/symptom-check-logging-service";

export const AI_FLAG_STATUSES = ["OPEN", "IN_REVIEW", "RESOLVED", "ESCALATED"] as const;
export type AiFlagStatus = (typeof AI_FLAG_STATUSES)[number];

export const AI_FLAG_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type AiFlagPriority = (typeof AI_FLAG_PRIORITIES)[number];

export const AI_FLAG_CATEGORIES = [
  "EMERGENCY_SYMPTOMS",
  "MENTAL_HEALTH_CRISIS",
  "PREGNANCY_OR_CHILD_HIGH_RISK",
  "USER_REPORTED_WRONG_ANSWER",
  "LOW_CONFIDENCE_AI_RESPONSE",
  "REPEATED_UNRESOLVED_SYMPTOMS"
] as const;
export type AiFlagCategory = (typeof AI_FLAG_CATEGORIES)[number];

export const AI_FLAG_TRIGGERS = ["AUTOMATIC_RISK_RULE", "USER_REPORT", "REVIEWER_CREATED"] as const;
export type AiFlagTrigger = (typeof AI_FLAG_TRIGGERS)[number];

const MAX_FLAG_SUMMARY_LENGTH = 900;

function compact(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string | null | undefined, maxLength = MAX_FLAG_SUMMARY_LENGTH) {
  if (!value) return null;
  const normalized = compact(value);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function containsAny(text: string, terms: readonly string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function titleForCategory(category: AiFlagCategory) {
  const labels: Record<AiFlagCategory, string> = {
    EMERGENCY_SYMPTOMS: "Emergency symptoms detected",
    MENTAL_HEALTH_CRISIS: "Mental health crisis language detected",
    PREGNANCY_OR_CHILD_HIGH_RISK: "Pregnancy or child high-risk symptoms detected",
    USER_REPORTED_WRONG_ANSWER: "User reported AI answer as wrong",
    LOW_CONFIDENCE_AI_RESPONSE: "Low-confidence AI response detected",
    REPEATED_UNRESOLVED_SYMPTOMS: "Repeated unresolved symptoms detected"
  };
  return labels[category];
}

function priorityForCategory(category: AiFlagCategory, riskLevel?: SymptomRiskLevel | string | null): AiFlagPriority {
  if (category === "EMERGENCY_SYMPTOMS" || category === "MENTAL_HEALTH_CRISIS") return "CRITICAL";
  if (category === "PREGNANCY_OR_CHILD_HIGH_RISK") return "HIGH";
  if (riskLevel === "EMERGENCY") return "CRITICAL";
  if (riskLevel === "HIGH") return "HIGH";
  if (category === "REPEATED_UNRESOLVED_SYMPTOMS") return "HIGH";
  if (category === "LOW_CONFIDENCE_AI_RESPONSE" || category === "USER_REPORTED_WRONG_ANSWER") return "MEDIUM";
  return "LOW";
}

function buildFlagSummary(input: {
  symptomsSummary: string;
  aiResponseSummary?: string | null;
  symptomCategory?: string | null;
  riskLevel: string;
  recommendedNextStep?: string | null;
}) {
  return truncate([
    `Symptoms: ${input.symptomsSummary}`,
    input.symptomCategory ? `Category: ${input.symptomCategory}` : null,
    `Risk level: ${input.riskLevel}`,
    input.recommendedNextStep ? `Recommended next step: ${input.recommendedNextStep}` : null,
    input.aiResponseSummary ? `AI summary: ${input.aiResponseSummary}` : null
  ].filter(Boolean).join(" | "));
}

function inferAutomaticCategories(input: {
  symptomsSummary: string;
  aiResponseSummary?: string | null;
  symptomCategory?: string | null;
  riskLevel: string;
}) {
  const text = `${input.symptomsSummary} ${input.aiResponseSummary ?? ""}`;
  const categories = new Set<AiFlagCategory>();

  if (input.riskLevel === "EMERGENCY") categories.add("EMERGENCY_SYMPTOMS");

  if (
    containsAny(text, [
      "suicide",
      "self harm",
      "self-harm",
      "kill myself",
      "end my life",
      "overdose",
      "hopeless",
      "mental crisis",
      "panic attack",
      "kujiumiza",
      "kujiua"
    ])
  ) {
    categories.add("MENTAL_HEALTH_CRISIS");
  }

  if (
    input.riskLevel === "HIGH" || input.riskLevel === "EMERGENCY"
  ) {
    if (
      containsAny(text, [
        "pregnant",
        "pregnancy",
        "mimba",
        "mjamzito",
        "child",
        "baby",
        "infant",
        "newborn",
        "mtoto",
        "mchanga"
      ]) ||
      input.symptomCategory === "Pregnancy or maternal health" ||
      input.symptomCategory === "Child health"
    ) {
      categories.add("PREGNANCY_OR_CHILD_HIGH_RISK");
    }
  }

  if (
    containsAny(input.aiResponseSummary ?? "", [
      "i am not sure",
      "i'm not sure",
      "unclear",
      "cannot determine",
      "not enough information",
      "insufficient information",
      "low confidence",
      "unable to assess"
    ])
  ) {
    categories.add("LOW_CONFIDENCE_AI_RESPONSE");
  }

  return Array.from(categories);
}

async function hasRecentRepeatedSymptoms(input: { userId?: number | null; symptomCategory?: string | null; currentLogId: number }) {
  if (!input.userId || !input.symptomCategory) return false;

  const since = new Date();
  since.setDate(since.getDate() - 14);

  const count = await prisma.symptomCheckLog.count({
    where: {
      id: { not: input.currentLogId },
      userId: input.userId,
      symptomCategory: input.symptomCategory,
      status: { notIn: ["REVIEWED", "ESCALATED"] },
      createdAt: { gte: since }
    }
  });

  return count >= 2;
}

async function createFlagIfMissing(input: {
  symptomCheckLogId?: number | null;
  userId?: number | null;
  category: AiFlagCategory;
  trigger?: AiFlagTrigger;
  riskLevel?: string | null;
  summary?: string | null;
}) {
  const existing = input.symptomCheckLogId
    ? await prisma.aiInteractionFlag.findFirst({
        where: {
          symptomCheckLogId: input.symptomCheckLogId,
          category: input.category,
          status: { in: ["OPEN", "IN_REVIEW", "ESCALATED"] }
        },
        select: { id: true }
      })
    : null;

  if (existing) return existing;

  return prisma.aiInteractionFlag.create({
    data: {
      symptomCheckLogId: input.symptomCheckLogId ?? null,
      userId: input.userId ?? null,
      title: titleForCategory(input.category),
      summary: truncate(input.summary),
      category: input.category,
      trigger: input.trigger ?? "AUTOMATIC_RISK_RULE",
      priority: priorityForCategory(input.category, input.riskLevel),
      status: "OPEN"
    }
  });
}

export async function createAutomaticAiSafetyFlagsForSymptomCheck(input: {
  id: number;
  userId?: number | null;
  symptomsSummary: string;
  aiResponseSummary?: string | null;
  symptomCategory?: string | null;
  riskLevel: SymptomRiskLevel | string;
  recommendedNextStep?: string | null;
}) {
  const summary = buildFlagSummary(input);
  const categories = inferAutomaticCategories(input);

  if (await hasRecentRepeatedSymptoms({ userId: input.userId, symptomCategory: input.symptomCategory, currentLogId: input.id })) {
    categories.push("REPEATED_UNRESOLVED_SYMPTOMS");
  }

  const uniqueCategories = Array.from(new Set(categories));
  if (uniqueCategories.length === 0) return [];

  return Promise.all(
    uniqueCategories.map((category) =>
      createFlagIfMissing({
        symptomCheckLogId: input.id,
        userId: input.userId ?? null,
        category,
        trigger: "AUTOMATIC_RISK_RULE",
        riskLevel: input.riskLevel,
        summary
      })
    )
  );
}

export async function createUserReportedWrongAnswerFlag(input: {
  symptomCheckLogId?: number | null;
  userId?: number | null;
  summary?: string | null;
}) {
  return createFlagIfMissing({
    symptomCheckLogId: input.symptomCheckLogId ?? null,
    userId: input.userId ?? null,
    category: "USER_REPORTED_WRONG_ANSWER",
    trigger: "USER_REPORT",
    riskLevel: "MEDIUM",
    summary: input.summary ?? "A user reported that an AI health response may be wrong or unsafe."
  });
}
