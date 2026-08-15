import "server-only";
import { z } from "zod";
import { env } from "@/lib/env";

export const chatLogAnalysisSchema = z.object({
  sentiment: z.enum(["POSITIVE", "NEUTRAL", "NEGATIVE", "MIXED"]),
  sentimentConfidence: z.number().min(0).max(1).optional(),
  topicSlug: z.string().min(1).max(80),
  topicLabel: z.string().min(1).max(120),
  summary: z.string().min(1).max(240).optional(),
  urgencyKeywords: z.array(z.string().min(1).max(60)).max(10).default([])
});

export type ChatLogAnalysisResult = z.infer<typeof chatLogAnalysisSchema>;

type AnalyzeInput = {
  message: string;
  language: string;
};

const ANALYSIS_SYSTEM_PROMPT = `You are a public-health data analyst. You classify a single anonymised user message written to an AI health chatbot.

Return ONLY JSON matching this exact shape:
{
  "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "MIXED",
  "sentimentConfidence": 0.0 to 1.0,
  "topicSlug": "short kebab-case machine label, e.g. malaria-fever, low-mood",
  "topicLabel": "short human label for dashboards, e.g. Malaria & fever",
  "summary": "one-line, non-identifying summary of the concern",
  "urgencyKeywords": ["array of flags such as emergency, severe pain, suicide, heavy bleeding"]
}

Rules:
- Sentiment reflects the tone of the message itself, not the medical severity.
- The message may be in English or Swahili; infer from content.
- Never include names, locations, ages, or any identifying detail in the summary.
- Never include the user's own words verbatim in the summary; paraphrase only.
- If the message is off-topic or gibberish, use topicSlug "other" and topicLabel "Other".`;

const responseSchema = {
  type: "OBJECT",
  properties: {
    sentiment: { type: "STRING", enum: ["POSITIVE", "NEUTRAL", "NEGATIVE", "MIXED"] },
    sentimentConfidence: { type: "NUMBER" },
    topicSlug: { type: "STRING" },
    topicLabel: { type: "STRING" },
    summary: { type: "STRING" },
    urgencyKeywords: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["sentiment", "topicSlug", "topicLabel"]
};

const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 1000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function analyzeChatMessageStructured(input: AnalyzeInput): Promise<ChatLogAnalysisResult> {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const body = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [{ text: `${ANALYSIS_SYSTEM_PROMPT}\n\nLanguage: ${input.language}\nMessage: ${input.message}` }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.6,
      maxOutputTokens: 400
    }
  });

  let lastError: Error = new Error("Gemini analysis failed");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_ANALYSIS_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text)
        .filter(Boolean)
        .join("\n");

      if (!text) {
        throw new Error("Gemini analysis returned no content.");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("Gemini analysis returned malformed JSON.");
      }

      const result = chatLogAnalysisSchema.safeParse(parsed);

      if (!result.success) {
        throw new Error(`Gemini analysis returned invalid structured output: ${result.error.message}`);
      }

      return result.data;
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Gemini analysis request failed with status ${response.status}`);
    }

    lastError = new Error(`Gemini analysis request failed with status ${response.status}`);
    if (attempt < MAX_ATTEMPTS) {
      await sleep(BASE_BACKOFF_MS * 2 ** attempt);
    }
  }

  throw lastError;
}
