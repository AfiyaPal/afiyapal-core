import "server-only";
import { generateGeminiResponse } from "@/server/ai/gemini-client";
import { getCurrentUser } from "@/server/auth/session";
import { logMentalHealthInteraction, isMentalHealthCompanionMessage } from "@/server/services/mental-health-logging-service";
import { logSymptomCheckRequest } from "@/server/services/symptom-check-logging-service";
import { ensureAssistantSafetyGuidance } from "@/server/services/ai-assistant-safety-service";

const SYSTEM_PROMPT = `You are AfiyaPal, a careful AI health assistant serving underserved communities in Kenya.
Provide evidence-aware first-step guidance, explain when professional care is needed, and keep language clear.
Do not claim to diagnose. For emergency symptoms, advise the user to seek urgent local medical care immediately.
For emotional wellbeing support, be calm, practical, and encourage trusted human support or professional care when risk is high.
Always end with: "This is informational guidance. For medical emergencies, visit the nearest facility immediately."`;

export async function generateChatbotReply(userMessage: string) {
  const currentUser = await getCurrentUser();
  const rawReply = await generateGeminiResponse({ systemPrompt: SYSTEM_PROMPT, userMessage });
  const reply = ensureAssistantSafetyGuidance({ message: userMessage, aiResponse: rawReply });

  const logPayload = {
    userId: currentUser?.id ?? null,
    preferredLanguage: currentUser?.preferredLanguage ?? null,
    message: userMessage,
    aiResponse: reply,
    status: "COMPLETED"
  } as const;

  if (isMentalHealthCompanionMessage(userMessage)) {
    await logMentalHealthInteraction(logPayload).catch((error) => {
      console.error("Failed to log mental health companion interaction", error);
    });
  } else {
    await logSymptomCheckRequest(logPayload).catch((error) => {
      console.error("Failed to log symptom check request", error);
    });
  }

  return reply;
}
