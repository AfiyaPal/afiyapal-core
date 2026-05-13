import "server-only";
import { prisma } from "@/server/db/prisma";

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .filter((w) => !["this", "that", "with", "from", "have", "what", "about", "tell", "know", "need", "help", "want", "some", "there", "they", "them", "their", "when", "where", "which", "your", "also", "would", "could", "should", "does", "doing", "being", "been", "very", "just", "then", "than", "more", "much", "many", "each", "well", "over", "such", "only", "other", "into", "than", "because"].includes(w));
  return [...new Set(words)].slice(0, 8);
}

type ContextBlog = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  contentCategory: string;
};

type ContextEvent = {
  id: number;
  title: string;
  type: string;
  startDate: Date;
  location: string | null;
  facility: { name: string; city: string | null; country: string };
};

type ChatbotContext = {
  blogs: ContextBlog[];
  events: ContextEvent[];
};

export async function retrieveChatbotContext(userMessage: string): Promise<ChatbotContext> {
  const keywords = extractKeywords(userMessage);
  if (keywords.length === 0) return { blogs: [], events: [] };

  const blogWhere = {
    status: "PUBLISHED",
    OR: keywords.map((kw) => ({
      OR: [
        { title: { contains: kw } },
        { excerpt: { contains: kw } },
        { content: { contains: kw } }
      ]
    }))
  };

  const eventWhere = {
    isPublic: true,
    status: { in: ["UPCOMING", "ONGOING"] },
    facility: { verificationStatus: "VERIFIED" },
    OR: keywords.map((kw) => ({
      OR: [
        { title: { contains: kw } },
        { description: { contains: kw } }
      ]
    }))
  };

  const [blogs, events] = await Promise.all([
    prisma.blog.findMany({
      where: blogWhere,
      select: { id: true, title: true, slug: true, excerpt: true, contentCategory: true },
      take: 4,
      orderBy: { publishedAt: "desc" }
    }),
    prisma.event.findMany({
      where: eventWhere,
      select: {
        id: true,
        title: true,
        type: true,
        startDate: true,
        location: true,
        facility: { select: { name: true, city: true, country: true } }
      },
      take: 3,
      orderBy: { startDate: "asc" }
    })
  ]);

  return { blogs, events };
}

export function formatContextForPrompt(context: ChatbotContext): string {
  const parts: string[] = [];

  if (context.blogs.length > 0) {
    parts.push("---\nRelevant health articles from AfiyaPal:");
    context.blogs.forEach((b) => {
      parts.push(`- "${b.title}" → Read at /blogs/${b.slug}${b.excerpt ? ` — ${b.excerpt.slice(0, 120)}` : ""}`);
    });
  }

  if (context.events.length > 0) {
    parts.push("---\nUpcoming health events:");
    context.events.forEach((e) => {
      const date = new Date(e.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      parts.push(`- ${e.title} (${e.type.replaceAll("_", " ").toLowerCase()}) on ${date} at ${e.facility.name}${e.location ? `, ${e.location}` : `, ${e.facility.city ?? e.facility.country}`}`);
    });
  }

  return parts.join("\n");
}
