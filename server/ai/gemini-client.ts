import "server-only";
import { env } from "@/lib/env";

export async function generateGeminiResponse(input: { systemPrompt: string; userMessage: string }) {
  if (!env.GEMINI_API_KEY) {
    return "AI unavailable: GEMINI_API_KEY is not configured on the server.";
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${input.systemPrompt}\n\nUser: ${input.userMessage}` }]
          }
        ]
      })
    });

    if (!res.ok) {
      return "Sorry, I am having trouble connecting right now. Please try again later.";
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text).filter(Boolean).join("\n");
    return text?.trim() || "Sorry, I could not generate a response right now.";
  } catch {
    return "Sorry, I am having trouble connecting right now. Please try again later.";
  }
}
