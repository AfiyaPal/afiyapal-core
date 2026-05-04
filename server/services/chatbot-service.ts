import "server-only";
import { generateGeminiResponse } from "@/server/ai/gemini-client";
import { getCurrentUser } from "@/server/auth/session";
import { logSymptomCheckRequest } from "@/server/services/symptom-check-logging-service";

const SYSTEM_PROMPT = `You are AfiyaPal, a careful AI health assistant serving underserved communities in Kenya.
Provide evidence-aware first-step guidance, explain when professional care is needed, and keep language clear.
Do not claim to diagnose. For emergency symptoms, advise the user to seek urgent local medical care immediately.
Always end with: "This is informational guidance. For medical emergencies, visit the nearest facility immediately."`;

export async function generateChatbotReply(userMessage: string) {
  const currentUser = await getCurrentUser();
  const reply = await generateGeminiResponse({ systemPrompt: SYSTEM_PROMPT, userMessage });

  await logSymptomCheckRequest({
    userId: currentUser?.id ?? null,
    preferredLanguage: currentUser?.preferredLanguage ?? null,
    message: userMessage,
    aiResponse: reply,
    status: "COMPLETED"
  }).catch((error) => {
    console.error("Failed to log symptom check request", error);
  });

  return reply;
}
