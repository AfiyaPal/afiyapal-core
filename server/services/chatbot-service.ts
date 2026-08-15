import "server-only";
import { generateGeminiResponse } from "@/server/ai/gemini-client";
import { getCurrentUser } from "@/server/auth/session";
import { logMentalHealthInteraction, isMentalHealthCompanionMessage } from "@/server/services/mental-health-logging-service";
import { logSymptomCheckRequest } from "@/server/services/symptom-check-logging-service";
import { ensureAssistantSafetyGuidance } from "@/server/services/ai-assistant-safety-service";
import { retrieveChatbotContext, formatContextForPrompt, type ChatbotContext } from "@/server/services/chatbot-context-service";

export type ChatbotReference = {
  kind: "blog" | "professional";
  href: string;
  title: string;
  excerpt: string | null;
};

const SYSTEM_PROMPT = `You are AfiyaPal, a careful AI health assistant serving underserved communities in Kenya and across Africa.
Provide evidence-aware first-step guidance, explain when professional care is needed, and keep language clear.
Do not claim to diagnose. For emergency symptoms, advise the user to seek urgent local medical care immediately.
For emotional wellbeing support, be calm, practical, and encourage trusted human support or professional care when risk is high.
Be concise. Make every reply about 10% briefer than you naturally would: short sentences, tight bullet lists, no repeated points.

When relevant context is provided (health articles and/or upcoming events), reference them naturally in your response.
If a health article matches the user's question, briefly summarise the relevant point and say "You can read more here:" with the link.
If an upcoming medical camp, free checkup, or health event matches what the user needs, tell them about it and the location.
If a verified professional matches what the user needs, mention their name and specialty and say "View their profile here:" with the link.
Professionals are not on live chat — their profile shows their articles and affiliated facilities only, so do not claim they can be contacted directly or booked through AfiyaPal.
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
): Promise<{ text: string; references: ChatbotReference[] }> {
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

  return { text: reply, references: buildReferences(reply, context) };
}

function buildReferences(reply: string, context: ChatbotContext): ChatbotReference[] {
  const refs: ChatbotReference[] = [];
  const seen = new Set<string>();
  const blogBySlug = new Map(context.blogs.map((blog) => [blog.slug, blog]));
  const professionalById = new Map(context.professionals.map((professional) => [String(professional.id), professional]));

  const blogPattern = /\/blogs\/([a-zA-Z0-9-]+)/g;
  let match: RegExpExecArray | null;
  while ((match = blogPattern.exec(reply)) !== null) {
    const blog = blogBySlug.get(match[1]);
    if (!blog || seen.has(blog.slug)) continue;
    seen.add(blog.slug);
    refs.push({ kind: "blog", href: `/blogs/${blog.slug}`, title: blog.title, excerpt: blog.excerpt });
  }

  const professionalPattern = /\/professionals\/([a-zA-Z0-9]+)/g;
  while ((match = professionalPattern.exec(reply)) !== null) {
    const professional = professionalById.get(match[1]);
    if (!professional || seen.has(String(professional.id))) continue;
    seen.add(String(professional.id));
    const location = [professional.cityRegion, professional.country].filter(Boolean).join(", ");
    const excerpt = [professional.specialty, location].filter(Boolean).join(" · ") || null;
    refs.push({
      kind: "professional",
      href: `/professionals/${professional.id}`,
      title: professional.fullName,
      excerpt
    });
  }

  return refs;
}
