import "server-only";
import { prisma } from "@/server/db/prisma";
import { createAutomaticAiSafetyFlagsForSymptomCheck } from "@/server/services/ai-safety-flag-service";

export const SYMPTOM_RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;
export type SymptomRiskLevel = (typeof SYMPTOM_RISK_LEVELS)[number];

const MAX_SYMPTOMS_SUMMARY_LENGTH = 700;
const MAX_AI_SUMMARY_LENGTH = 700;
const MAX_NEXT_STEP_LENGTH = 500;

function compact(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number) {
  const normalized = compact(value);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function containsAny(text: string, terms: readonly string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function inferSymptomLanguage(message: string, preferredLanguage?: string | null) {
  if (preferredLanguage === "sw") return "sw";
  if (containsAny(message, ["maumivu", "homa", "kichwa", "tumbo", "kikohozi", "kupumua", "dawa", "mgonjwa", "afya"])) return "sw";
  return "en";
}

export function inferSymptomCategory(message: string) {
  if (containsAny(message, ["sad", "anxious", "anxiety", "depressed", "stress", "panic", "hopeless", "mental", "msongo", "wasiwasi"])) return "Mental health";
  if (containsAny(message, ["pregnant", "pregnancy", "bleeding", "labor", "mimba", "mjamzito"])) return "Pregnancy or maternal health";
  if (containsAny(message, ["child", "baby", "infant", "newborn", "mtoto", "mchanga"])) return "Child health";
  if (containsAny(message, ["chest", "breath", "breathing", "cough", "asthma", "kikohozi", "kupumua"])) return "Respiratory or chest";
  if (containsAny(message, ["stomach", "vomit", "diarrhea", "nausea", "tumbo", "kutapika", "kuhara"])) return "Digestive";
  if (containsAny(message, ["fever", "malaria", "chills", "homa", "baridi"])) return "Fever or infection";
  if (containsAny(message, ["headache", "dizzy", "migraine", "kichwa", "kizunguzungu"])) return "Headache or neurological";
  return "General symptoms";
}

export function inferRiskLevel(message: string): SymptomRiskLevel {
  if (
    containsAny(message, [
      "can't breathe",
      "cannot breathe",
      "difficulty breathing",
      "shortness of breath",
      "severe chest pain",
      "chest pain",
      "unconscious",
      "fainted",
      "seizure",
      "stroke",
      "heavy bleeding",
      "suicide",
      "self harm",
      "overdose",
      "kupumua kwa shida",
      "maumivu makali ya kifua",
      "kuzimia"
    ])
  ) {
    return "EMERGENCY";
  }

  if (
    containsAny(message, [
      "severe",
      "worse",
      "worsening",
      "blood",
      "pregnant",
      "newborn",
      "infant",
      "high fever",
      "dehydrated",
      "confused",
      "maumivu makali",
      "damu",
      "mjamzito"
    ])
  ) {
    return "HIGH";
  }

  if (containsAny(message, ["fever", "pain", "vomit", "diarrhea", "cough", "rash", "homa", "maumivu", "kutapika", "kuhara"])) {
    return "MEDIUM";
  }

  return "LOW";
}

export function recommendedNextStepForRisk(riskLevel: SymptomRiskLevel) {
  if (riskLevel === "EMERGENCY") return "Seek urgent local medical care immediately or go to the nearest health facility.";
  if (riskLevel === "HIGH") return "Contact a qualified clinician as soon as possible and consider requesting a doctor consultation.";
  if (riskLevel === "MEDIUM") return "Monitor symptoms closely and consult a healthcare worker if symptoms persist or worsen.";
  return "Use the AI guidance as first-step information and seek professional care if symptoms change or continue.";
}

export async function logSymptomCheckRequest(input: {
  userId?: number | null;
  preferredLanguage?: string | null;
  message: string;
  aiResponse: string;
  status?: string;
}) {
  const symptomsSummary = truncate(input.message, MAX_SYMPTOMS_SUMMARY_LENGTH);
  const aiResponseSummary = truncate(input.aiResponse, MAX_AI_SUMMARY_LENGTH);
  const language = inferSymptomLanguage(input.message, input.preferredLanguage);
  const symptomCategory = inferSymptomCategory(input.message);
  const riskLevel = inferRiskLevel(input.message);
  const recommendedNextStep = truncate(recommendedNextStepForRisk(riskLevel), MAX_NEXT_STEP_LENGTH);
  const escalationSuggested = riskLevel === "HIGH" || riskLevel === "EMERGENCY";

  const log = await prisma.symptomCheckLog.create({
    data: {
      userId: input.userId ?? null,
      language,
      symptomsSummary,
      aiResponseSummary,
      symptomCategory,
      riskLevel,
      recommendedNextStep,
      escalationSuggested,
      status: input.status ?? "COMPLETED"
    }
  });

  await createAutomaticAiSafetyFlagsForSymptomCheck({
    id: log.id,
    userId: log.userId,
    symptomsSummary: log.symptomsSummary,
    aiResponseSummary: log.aiResponseSummary,
    symptomCategory: log.symptomCategory,
    riskLevel: log.riskLevel,
    recommendedNextStep: log.recommendedNextStep
  }).catch((error) => {
    console.error("Failed to create automatic AI safety flags", error);
  });

  return log;
}
