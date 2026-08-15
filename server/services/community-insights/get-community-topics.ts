import "server-only";
import { prisma } from "@/server/db/prisma";

export const BLOG_ARTICLE_CATEGORIES = [
  "MALARIA",
  "MATERNAL_HEALTH",
  "NUTRITION",
  "MENTAL_HEALTH",
  "FIRST_AID",
  "GENERAL_WELLNESS"
] as const;

export type BlogArticleCategory = (typeof BLOG_ARTICLE_CATEGORIES)[number];

export type CommunityTopic = {
  topicSlug: string;
  topicLabel: string;
  messageCount: number;
  sentimentScore: number;
  summary: string | null;
};

export function suggestBlogCategory(topicSlug: string): BlogArticleCategory {
  const slug = topicSlug.toLowerCase();

  if (slug.includes("malaria")) return "MALARIA";
  if (
    slug.includes("mental") ||
    slug.includes("anxiety") ||
    slug.includes("anxious") ||
    slug.includes("depress") ||
    slug.includes("stress") ||
    slug.includes("mood") ||
    slug.includes("panic") ||
    slug.includes("suicid") ||
    slug.includes("grief") ||
    slug.includes("wasiwasi") ||
    slug.includes("msongo")
  ) {
    return "MENTAL_HEALTH";
  }
  if (
    slug.includes("pregnan") ||
    slug.includes("maternal") ||
    slug.includes("mimba") ||
    slug.includes("mjamzito") ||
    slug.includes("newborn") ||
    slug.includes("infant") ||
    slug.includes("baby") ||
    slug.includes("child") ||
    slug.includes("mtoto") ||
    slug.includes("vaccin")
  ) {
    return "MATERNAL_HEALTH";
  }
  if (
    slug.includes("nutrition") ||
    slug.includes("diet") ||
    slug.includes("weight") ||
    slug.includes("feeding") ||
    slug.includes("malnutrition") ||
    slug.includes("anemia") ||
    slug.includes("lishe")
  ) {
    return "NUTRITION";
  }
  if (
    slug.includes("first-aid") ||
    slug.includes("injury") ||
    slug.includes("wound") ||
    slug.includes("burn") ||
    slug.includes("bite") ||
    slug.includes("accident") ||
    slug.includes("poison") ||
    slug.includes("fracture")
  ) {
    return "FIRST_AID";
  }

  return "GENERAL_WELLNESS";
}

export async function getCommunityTopics(limit = 5): Promise<CommunityTopic[]> {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const insights = await prisma.communityInsight.findMany({
    where: { periodStart: { gte: since } },
    orderBy: { messageCount: "desc" },
    take: 100,
    select: {
      topicSlug: true,
      topicLabel: true,
      messageCount: true,
      sentimentScore: true,
      summary: true
    }
  });

  const byTopic = new Map<string, CommunityTopic & { weightedSentiment: number }>();

  for (const insight of insights) {
    const entry =
      byTopic.get(insight.topicSlug) ??
      ({
        topicSlug: insight.topicSlug,
        topicLabel: insight.topicLabel,
        messageCount: 0,
        sentimentScore: 0,
        summary: null,
        weightedSentiment: 0
      } as CommunityTopic & { weightedSentiment: number });

    entry.messageCount += insight.messageCount;
    entry.weightedSentiment += insight.sentimentScore * insight.messageCount;
    if (insight.summary) entry.summary = insight.summary;

    byTopic.set(insight.topicSlug, entry);
  }

  return Array.from(byTopic.values())
    .map(({ weightedSentiment, ...topic }) => ({
      ...topic,
      sentimentScore: topic.messageCount > 0 ? weightedSentiment / topic.messageCount : 0
    }))
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, limit);
}
