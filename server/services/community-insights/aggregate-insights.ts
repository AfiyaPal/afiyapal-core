import "server-only";
import { prisma } from "@/server/db/prisma";

const SENTIMENT_WEIGHTS: Record<string, number> = {
  POSITIVE: 1,
  NEUTRAL: 0,
  NEGATIVE: -1,
  MIXED: 0.5
};

type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "MIXED";

type InsightGroup = {
  periodStart: Date;
  source: string;
  topicSlug: string;
  topicLabel: string;
  messageCount: number;
  sentimentBreakdown: Record<Sentiment, number>;
  sentimentScore: number;
  summary: string | null;
  latestAt: number;
};

function startOfUtcDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export type AggregateResult = {
  groups: number;
  upserted: number;
};

export async function aggregateCommunityInsights(): Promise<AggregateResult> {
  const analyses = await prisma.chatLogAnalysis.findMany({
    where: { status: "ANALYZED" },
    select: {
      sentiment: true,
      sentimentConfidence: true,
      topicSlug: true,
      topicLabel: true,
      summary: true,
      analyzedAt: true,
      symptomCheckLogId: true,
      mentalHealthInteractionId: true
    }
  });

  const groups = new Map<string, InsightGroup>();

  for (const analysis of analyses) {
    if (!analysis.analyzedAt) continue;

    const periodStart = startOfUtcDay(analysis.analyzedAt);
    const source = analysis.symptomCheckLogId ? "SYMPTOM_CHECK" : "MENTAL_HEALTH";
    const key = `${periodStart.toISOString()}|${source}|${analysis.topicSlug}`;
    const analyzedAtMs = analysis.analyzedAt.getTime();

    let group = groups.get(key);
    if (!group) {
      group = {
        periodStart,
        source,
        topicSlug: analysis.topicSlug,
        topicLabel: analysis.topicLabel,
        messageCount: 0,
        sentimentBreakdown: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0, MIXED: 0 },
        sentimentScore: 0,
        summary: null,
        latestAt: 0
      };
      groups.set(key, group);
    }

    group.messageCount += 1;
    if (analysis.sentiment in group.sentimentBreakdown) {
      group.sentimentBreakdown[analysis.sentiment as Sentiment] += 1;
    }
    group.sentimentScore += SENTIMENT_WEIGHTS[analysis.sentiment] ?? 0;

    if (analysis.summary && analyzedAtMs > group.latestAt) {
      group.latestAt = analyzedAtMs;
      group.summary = analysis.summary;
    }
  }

  let upserted = 0;

  for (const group of groups.values()) {
    group.sentimentScore = group.messageCount > 0 ? group.sentimentScore / group.messageCount : 0;
    const periodEnd = new Date(group.periodStart.getTime() + 24 * 60 * 60 * 1000);

    await prisma.communityInsight.upsert({
      where: {
        periodStart_source_topicSlug: {
          periodStart: group.periodStart,
          source: group.source,
          topicSlug: group.topicSlug
        }
      },
      update: {
        periodEnd,
        topicLabel: group.topicLabel,
        messageCount: group.messageCount,
        sentimentBreakdown: JSON.stringify(group.sentimentBreakdown),
        sentimentScore: group.sentimentScore,
        summary: group.summary
      },
      create: {
        periodStart: group.periodStart,
        periodEnd,
        source: group.source,
        topicSlug: group.topicSlug,
        topicLabel: group.topicLabel,
        messageCount: group.messageCount,
        sentimentBreakdown: JSON.stringify(group.sentimentBreakdown),
        sentimentScore: group.sentimentScore,
        summary: group.summary
      }
    });

    upserted += 1;
  }

  return { groups: groups.size, upserted };
}
