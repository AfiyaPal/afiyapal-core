import "server-only";
import { prisma } from "@/server/db/prisma";
import { ARTICLE_CATEGORIES, ARTICLE_LANGUAGES, ARTICLE_STATUSES, MEDICAL_REVIEW_STATUSES, isOutdatedContent } from "@/features/admin/data/content-management";

type ContentFilters = {
  search?: string;
  status?: string;
  category?: string;
  language?: string;
  reviewStatus?: string;
  freshness?: string;
};

function normalizeStatus(value: string | null | undefined) {
  if (!value) return value;
  const normalized = value.toUpperCase();
  if (normalized === "PUBLISHED" || normalized === "PENDING_REVIEW" || normalized === "DRAFT" || normalized === "ARCHIVED") return normalized;
  return value;
}

function safeString(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

export async function getAdminContent(filters: ContentFilters = {}) {
  const search = safeString(filters.search);
  const status = ARTICLE_STATUSES.includes(filters.status as never) ? filters.status : undefined;
  const category = ARTICLE_CATEGORIES.some((item) => item.value === filters.category) ? filters.category : undefined;
  const language = ARTICLE_LANGUAGES.some((item) => item.value === filters.language) ? filters.language : undefined;
  const reviewStatus = MEDICAL_REVIEW_STATUSES.includes(filters.reviewStatus as never) ? filters.reviewStatus : undefined;

  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { slug: { contains: search } },
            { excerpt: { contains: search } },
            { tags: { contains: search } }
          ]
        }
      : {}),
    ...(status ? { status } : {}),
    ...(category ? { contentCategory: category } : {}),
    ...(language ? { language } : {}),
    ...(reviewStatus ? { medicalReviewStatus: reviewStatus } : {})
  };

  const [articles, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: {
        creator: { select: { id: true, username: true, email: true } },
        media: { select: { id: true, mediaUrl: true, altText: true }, take: 1 }
      },
      orderBy: { updatedAt: "desc" },
      take: 100
    }),
    prisma.blog.count({ where })
  ]);

  const mapped = articles.map((article) => ({
    ...article,
    status: normalizeStatus(article.status) ?? "DRAFT",
    isOutdated: isOutdatedContent(article.updatedAt, article.reviewedAt, article.status),
    imageUrl: article.media[0]?.mediaUrl ?? null
  }));

  return {
    total,
    pageSize: 100,
    articles: filters.freshness === "outdated" ? mapped.filter((article) => article.isOutdated) : mapped
  };
}

export async function getAdminContentDetail(blogId: number) {
  const article = await prisma.blog.findUnique({
    where: { id: blogId },
    include: {
      creator: { select: { id: true, username: true, email: true } },
      media: { select: { id: true, mediaUrl: true, mediaType: true, altText: true, uploadedAt: true } },
      comments: { select: { id: true }, take: 1 }
    }
  });

  if (!article) return null;

  const reviewedBy = article.reviewedById
    ? await prisma.user.findUnique({ where: { id: article.reviewedById }, select: { id: true, username: true, email: true } })
    : null;

  return {
    ...article,
    status: normalizeStatus(article.status) ?? "DRAFT",
    reviewedBy,
    imageUrl: article.media[0]?.mediaUrl ?? null,
    isOutdated: isOutdatedContent(article.updatedAt, article.reviewedAt, article.status)
  };
}
