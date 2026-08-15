import "server-only";
import { prisma } from "@/server/db/prisma";
import { analyzeChatMessageStructured } from "@/server/ai/gemini-structured";
import { env } from "@/lib/env";

const BATCH_LIMIT = 100;
const CONCURRENCY = 5;
const MAX_ERROR_LENGTH = 500;

export type AnalyzeResult = {
  processed: number;
  failed: number;
  analyzedLogIds: number[];
};

async function processWithConcurrency<T>(items: T[], worker: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    await Promise.all(items.slice(i, i + CONCURRENCY).map(worker));
  }
}

export async function analyzeUnprocessedChatLogs(): Promise<AnalyzeResult> {
  const [analyzedSymptom, analyzedMental] = await Promise.all([
    prisma.chatLogAnalysis.findMany({
      where: { symptomCheckLogId: { not: null } },
      select: { symptomCheckLogId: true }
    }),
    prisma.chatLogAnalysis.findMany({
      where: { mentalHealthInteractionId: { not: null } },
      select: { mentalHealthInteractionId: true }
    })
  ]);

  const analyzedSymptomIds = analyzedSymptom
    .map((entry) => entry.symptomCheckLogId)
    .filter((id): id is number => id !== null);
  const analyzedMentalIds = analyzedMental
    .map((entry) => entry.mentalHealthInteractionId)
    .filter((id): id is number => id !== null);

  const [symptomLogs, mentalLogs] = await Promise.all([
    prisma.symptomCheckLog.findMany({
      where: { id: { notIn: analyzedSymptomIds } },
      orderBy: { createdAt: "asc" },
      take: BATCH_LIMIT,
      select: { id: true, language: true, symptomsSummary: true }
    }),
    prisma.mentalHealthInteraction.findMany({
      where: { id: { notIn: analyzedMentalIds } },
      orderBy: { createdAt: "asc" },
      take: BATCH_LIMIT,
      select: { id: true, language: true, interactionSummary: true }
    })
  ]);

  let processed = 0;
  let failed = 0;
  const analyzedLogIds: number[] = [];

  await processWithConcurrency(symptomLogs, async (log) => {
    try {
      const result = await analyzeChatMessageStructured({
        message: log.symptomsSummary,
        language: log.language
      });
      await prisma.chatLogAnalysis.create({
        data: {
          symptomCheckLogId: log.id,
          sentiment: result.sentiment,
          sentimentConfidence: result.sentimentConfidence ?? null,
          topicSlug: result.topicSlug,
          topicLabel: result.topicLabel,
          summary: result.summary ?? null,
          urgencyKeywords: result.urgencyKeywords.length > 0 ? JSON.stringify(result.urgencyKeywords) : null,
          model: env.GEMINI_ANALYSIS_MODEL,
          status: "ANALYZED",
          analyzedAt: new Date()
        }
      });
      analyzedLogIds.push(log.id);
      processed += 1;
    } catch (error) {
      failed += 1;
      await prisma.chatLogAnalysis.create({
        data: {
          symptomCheckLogId: log.id,
          sentiment: "NEUTRAL",
          topicSlug: "unknown",
          topicLabel: "Unknown",
          model: env.GEMINI_ANALYSIS_MODEL,
          status: "FAILED",
          error: (error instanceof Error ? error.message : String(error)).slice(0, MAX_ERROR_LENGTH),
          analyzedAt: new Date()
        }
      });
    }
  });

  await processWithConcurrency(mentalLogs, async (log) => {
    try {
      const result = await analyzeChatMessageStructured({
        message: log.interactionSummary,
        language: log.language
      });
      await prisma.chatLogAnalysis.create({
        data: {
          mentalHealthInteractionId: log.id,
          sentiment: result.sentiment,
          sentimentConfidence: result.sentimentConfidence ?? null,
          topicSlug: result.topicSlug,
          topicLabel: result.topicLabel,
          summary: result.summary ?? null,
          urgencyKeywords: result.urgencyKeywords.length > 0 ? JSON.stringify(result.urgencyKeywords) : null,
          model: env.GEMINI_ANALYSIS_MODEL,
          status: "ANALYZED",
          analyzedAt: new Date()
        }
      });
      analyzedLogIds.push(log.id);
      processed += 1;
    } catch (error) {
      failed += 1;
      await prisma.chatLogAnalysis.create({
        data: {
          mentalHealthInteractionId: log.id,
          sentiment: "NEUTRAL",
          topicSlug: "unknown",
          topicLabel: "Unknown",
          model: env.GEMINI_ANALYSIS_MODEL,
          status: "FAILED",
          error: (error instanceof Error ? error.message : String(error)).slice(0, MAX_ERROR_LENGTH),
          analyzedAt: new Date()
        }
      });
    }
  });

  return { processed, failed, analyzedLogIds };
}
