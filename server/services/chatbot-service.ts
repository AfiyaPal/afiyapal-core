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

export async function generateChatbotReply(userMessage: string) {
  const currentUser = await getCurrentUser();
  const context = await retrieveChatbotContext(userMessage);
  const contextStr = formatContextForPrompt(context);
  const rawReply = await generateGeminiResponse({ systemPrompt: SYSTEM_PROMPT, userMessage, context: contextStr });
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
