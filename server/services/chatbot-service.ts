import "server-only";
import { generateGeminiResponse } from "@/server/ai/gemini-client";
import { getCurrentUser } from "@/server/auth/session";
import { logMentalHealthInteraction, isMentalHealthCompanionMessage } from "@/server/services/mental-health-logging-service";
import { logSymptomCheckRequest } from "@/server/services/symptom-check-logging-service";
import { ensureAssistantSafetyGuidance } from "@/server/services/ai-assistant-safety-service";
import { retrieveChatbotContext, formatContextForPrompt } from "@/server/services/chatbot-context-service";

const SYSTEM_PROMPT = `You are AfiyaPal, a careful AI health assistant serving underserved communities in Kenya and across Africa.
Provide evidence-aware first-step guidance, explain when professional care is needed, and keep language clear.
Do not claim to diagnose. For emergency symptoms, advise the user to seek urgent local medical care immediately.
For emotional wellbeing support, be calm, practical, and encourage trusted human support or professional care when risk is high.

When relevant context is provided (health articles and/or upcoming events), reference them naturally in your response.
If a health article matches the user's question, briefly summarise the relevant point and say "You can read more here:" with the link.
If an upcoming medical camp, free checkup, or health event matches what the user needs, tell them about it and the location.
Always direct users to read the full article or check the event for complete details.

If no relevant context is available, simply answer the question without mentioning that no articles were found.
Always end with: "This is informational guidance. For medical emergencies, visit the nearest facility immediately."`;

const MATERNAL_EMERGENCY_PROMPT = `You are an emergency obstetric assistant on AfiyaPal. A pregnant mother has triggered a maternal emergency alert and help is on the way.
Provide immediate, calming, step-by-step first-aid instructions for her reported symptoms. Stay brief and clear.
Do not ask diagnostic questions — focus on what she can do right now while waiting for help.
Always prioritise: (1) keeping the mother calm, (2) positioning for safety, (3) recognising danger signs (heavy bleeding, loss of consciousness, severe pain).
End every response with: "Help is on the way. Stay calm and follow the steps above."`;

const MEDICAL_EMERGENCY_PROMPT = `You are an emergency first-aid assistant on AfiyaPal. The user has triggered a medical emergency alert and help is on the way.
Provide immediate, calming, step-by-step first-aid instructions for their reported symptoms. Stay brief and clear.
Do not ask diagnostic questions — focus on what they can do right now while waiting for help.
End every response with: "Help is on the way. Stay calm and follow the steps above."`;

export async function generateChatbotReply(
  userMessage: string,
  emergency?: { active: true; type: "maternal" | "medical" },
) {
  const currentUser = await getCurrentUser();

  let systemPrompt = SYSTEM_PROMPT;
  if (emergency?.active) {
    systemPrompt = emergency.type === "maternal" ? MATERNAL_EMERGENCY_PROMPT : MEDICAL_EMERGENCY_PROMPT;
  }

  const context = await retrieveChatbotContext(userMessage);
  const contextStr = formatContextForPrompt(context);
  const rawReply = await generateGeminiResponse({ systemPrompt, userMessage, context: contextStr });
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
