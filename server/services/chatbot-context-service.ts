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

type ContextProfessional = {
  id: number;
  fullName: string;
  specialty: string | null;
  cityRegion: string | null;
  country: string | null;
};

type ChatbotContext = {
  blogs: ContextBlog[];
  events: ContextEvent[];
  professionals: ContextProfessional[];
};

export async function retrieveChatbotContext(userMessage: string): Promise<ChatbotContext> {
  const keywords = extractKeywords(userMessage);
  if (keywords.length === 0) return { blogs: [], events: [], professionals: [] };

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

  const professionalWhere = {
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE",
    OR: keywords.map((kw) => ({
      OR: [
        { fullName: { contains: kw } },
        { specialty: { contains: kw } },
        { languagesSpoken: { contains: kw } },
        { cityRegion: { contains: kw } },
        { country: { contains: kw } },
        { bio: { contains: kw } }
      ]
    }))
  };

  const [blogs, events, professionals] = await Promise.all([
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
    }),
    prisma.doctorProfile.findMany({
      where: professionalWhere,
      select: { id: true, fullName: true, specialty: true, cityRegion: true, country: true },
      take: 3,
      orderBy: { fullName: "asc" }
    })
  ]);

  return { blogs, events, professionals };
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

  if (context.professionals.length > 0) {
    parts.push("---\nVerified professionals on AfiyaPal:");
    context.professionals.forEach((p) => {
      const location = [p.cityRegion, p.country].filter(Boolean).join(", ") || "Location on request";
      parts.push(`- ${p.fullName} (${p.specialty ?? "health professional"}) in ${location}, currently available → View profile at /professionals/${p.id}`);
    });
  }

  return parts.join("\n");
}
