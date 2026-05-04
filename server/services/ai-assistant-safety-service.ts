import "server-only";

export const MEDICAL_DISCLAIMER =
  "AfiyaPal provides informational health guidance only and does not diagnose, treat, or replace a qualified clinician.";

export const EMERGENCY_GUIDANCE =
  "If this could be an emergency, seek urgent local medical care now, go to the nearest health facility, or contact local emergency services.";

const CRITICAL_HEALTH_TERMS = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "difficulty breathing",
  "severe bleeding",
  "unconscious",
  "seizure",
  "stroke",
  "paralysis",
  "poison",
  "overdose",
  "severe allergic",
  "anaphylaxis",
  "severe burn",
  "suicide",
  "self harm",
  "self-harm",
  "harm myself",
  "end my life",
  "kujiua",
  "kujiumiza",
  "kupumua kwa shida",
  "maumivu ya kifua",
  "damu nyingi"
] as const;

function containsAny(text: string, terms: readonly string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function shouldShowEmergencyGuidance(message: string, aiResponse?: string | null) {
  return containsAny(`${message} ${aiResponse ?? ""}`, CRITICAL_HEALTH_TERMS);
}

export function buildAssistantSafetyFooter(input: { emergencyGuidance: boolean }) {
  const lines = [MEDICAL_DISCLAIMER];
  if (input.emergencyGuidance) lines.push(EMERGENCY_GUIDANCE);
  return lines.join("\n");
}

export function ensureAssistantSafetyGuidance(input: { message: string; aiResponse: string }) {
  const emergencyGuidance = shouldShowEmergencyGuidance(input.message, input.aiResponse);
  const footer = buildAssistantSafetyFooter({ emergencyGuidance });
  const lower = input.aiResponse.toLowerCase();

  const alreadyHasDisclaimer = lower.includes("informational") && (lower.includes("not a diagnosis") || lower.includes("does not diagnose"));
  const alreadyHasEmergencyGuidance = !emergencyGuidance || lower.includes("nearest") || lower.includes("emergency");

  if (alreadyHasDisclaimer && alreadyHasEmergencyGuidance) return input.aiResponse;
  return `${input.aiResponse.trim()}\n\n${footer}`;
}
