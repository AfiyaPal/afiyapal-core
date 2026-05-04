"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS, hasAdminPermission } from "@/server/auth/admin-permissions";
import { ARTICLE_CATEGORIES, ARTICLE_LANGUAGES, ARTICLE_STATUSES, MEDICAL_REVIEW_STATUSES } from "@/features/admin/data/content-management";
import { buildAdminAuditLogData } from "@/server/services/admin-audit-log-service";

type ArticleFormData = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  contentCategory: string;
  language: string;
  imageUrl?: string;
  imageAlt?: string;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseArticleId(formData: FormData) {
  const articleId = Number(formData.get("articleId"));
  if (!Number.isInteger(articleId) || articleId <= 0) throw new Error("Invalid article id.");
  return articleId;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 90);
}

async function uniqueSlug(base: string, currentArticleId?: number) {
  const root = slugify(base) || `article-${Date.now()}`;
  let candidate = root;
  let index = 2;

  while (true) {
    const existing = await prisma.blog.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === currentArticleId) return candidate;
    candidate = `${root}-${index}`;
    index += 1;
  }
}

function parseArticleForm(formData: FormData): ArticleFormData {
  const title = getText(formData, "title");
  const content = getText(formData, "content");
  const excerpt = getText(formData, "excerpt");
  const slug = getText(formData, "slug");
  const imageUrl = getText(formData, "imageUrl");
  const imageAlt = getText(formData, "imageAlt");
  const contentCategory = getText(formData, "contentCategory") || "GENERAL_WELLNESS";
  const language = getText(formData, "language") || "en";

  if (title.length < 4) throw new Error("Article title must be at least 4 characters.");
  if (content.length < 40) throw new Error("Article content must be at least 40 characters.");
  if (!ARTICLE_CATEGORIES.some((item) => item.value === contentCategory)) throw new Error("Invalid article category.");
  if (!ARTICLE_LANGUAGES.some((item) => item.value === language)) throw new Error("Invalid article language.");

  return { title, content, excerpt, slug, contentCategory, language, imageUrl, imageAlt };
}

function assertStatus(value: string) {
  if (!ARTICLE_STATUSES.includes(value as never)) throw new Error("Invalid article status.");
  return value;
}

function assertReviewStatus(value: string) {
  if (!MEDICAL_REVIEW_STATUSES.includes(value as never)) throw new Error("Invalid review status.");
  return value;
}

function ensureCanManageContent(role: string) {
  if (!hasAdminPermission(role, ADMIN_PERMISSIONS.MANAGE_CONTENT)) throw new Error("You do not have content management access.");
}

function ensureCanReviewContent(role: string) {
  if (!hasAdminPermission(role, ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT)) throw new Error("You do not have medical content review access.");
}

export async function createArticleAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  ensureCanManageContent(actor.role);
  const input = parseArticleForm(formData);
  const slug = await uniqueSlug(input.slug || input.title);

  const article = await prisma.blog.create({
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt || input.content.slice(0, 180),
      content: input.content,
      contentCategory: input.contentCategory,
      language: input.language,
      status: "DRAFT",
      medicalReviewStatus: "NOT_SUBMITTED",
      creatorId: actor.id,
      media: input.imageUrl
        ? { create: [{ mediaUrl: input.imageUrl, mediaType: "image", altText: input.imageAlt || input.title }] }
        : undefined
    }
  });

  revalidatePath(routes.adminContent);
  redirect(`${routes.adminContent}/${article.id}`);
}

export async function updateArticleAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  ensureCanManageContent(actor.role);
  const articleId = parseArticleId(formData);
  const input = parseArticleForm(formData);
  const slug = await uniqueSlug(input.slug || input.title, articleId);

  const existing = await prisma.blog.findUnique({ where: { id: articleId }, include: { media: true } });
  if (!existing) redirect(routes.adminContent);

  await prisma.blog.update({
    where: { id: articleId },
    data: {
      title: input.title,
      slug,
      excerpt: input.excerpt || input.content.slice(0, 180),
      content: input.content,
      contentCategory: input.contentCategory,
      language: input.language,
      ...(existing.status === "PUBLISHED" ? { medicalReviewStatus: "PENDING", status: "PENDING_REVIEW", publishedAt: null } : {}),
      ...(input.imageUrl
        ? {
            media: existing.media.length > 0
              ? { update: { where: { id: existing.media[0].id }, data: { mediaUrl: input.imageUrl, mediaType: "image", altText: input.imageAlt || input.title } } }
              : { create: [{ mediaUrl: input.imageUrl, mediaType: "image", altText: input.imageAlt || input.title }] }
          }
        : {})
    }
  });

  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
  redirect(`${routes.adminContent}/${articleId}`);
}

export async function submitArticleForReviewAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  ensureCanManageContent(actor.role);
  const articleId = parseArticleId(formData);

  await prisma.blog.update({
    where: { id: articleId },
    data: { status: "PENDING_REVIEW", medicalReviewStatus: "PENDING", reviewedById: null, reviewedAt: null }
  });

  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function approveArticleForPublishingAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT]);
  ensureCanReviewContent(actor.role);
  const articleId = parseArticleId(formData);
  const reviewNotes = getText(formData, "reviewNotes");

  await prisma.blog.update({
    where: { id: articleId },
    data: {
      medicalReviewStatus: "APPROVED",
      reviewedById: actor.id,
      reviewedAt: new Date(),
      reviewNotes: reviewNotes || null
    }
  });

  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function requestArticleChangesAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT]);
  ensureCanReviewContent(actor.role);
  const articleId = parseArticleId(formData);
  const reviewNotes = getText(formData, "reviewNotes");

  await prisma.blog.update({
    where: { id: articleId },
    data: {
      status: "DRAFT",
      medicalReviewStatus: "CHANGES_REQUESTED",
      reviewedById: actor.id,
      reviewedAt: new Date(),
      reviewNotes: reviewNotes || "Changes requested before publication."
    }
  });

  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function publishArticleAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  ensureCanManageContent(actor.role);
  const articleId = parseArticleId(formData);
  const article = await prisma.blog.findUnique({ where: { id: articleId }, select: { status: true, medicalReviewStatus: true, publishedAt: true } });
  if (!article) redirect(routes.adminContent);
  if (article.medicalReviewStatus !== "APPROVED" && !hasAdminPermission(actor.role, ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT)) {
    throw new Error("Article must be medically approved before publishing.");
  }

  await prisma.$transaction([
    prisma.blog.update({ where: { id: articleId }, data: { status: "PUBLISHED", publishedAt: new Date(), archivedAt: null } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "ARTICLE_PUBLISHED",
        targetType: "Blog",
        targetId: articleId,
        oldValue: { status: article.status, publishedAt: article.publishedAt },
        newValue: { status: "PUBLISHED" },
        reason: "Article published from content management workflow."
      })
    })
  ]);
  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function unpublishArticleAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  ensureCanManageContent(actor.role);
  const articleId = parseArticleId(formData);
  const article = await prisma.blog.findUnique({ where: { id: articleId }, select: { status: true, publishedAt: true } });
  if (!article) redirect(routes.adminContent);

  await prisma.$transaction([
    prisma.blog.update({ where: { id: articleId }, data: { status: "DRAFT", publishedAt: null } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "ARTICLE_UNPUBLISHED",
        targetType: "Blog",
        targetId: articleId,
        oldValue: { status: article.status, publishedAt: article.publishedAt },
        newValue: { status: "DRAFT", publishedAt: null },
        reason: "Article unpublished from content management workflow."
      })
    })
  ]);
  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function archiveArticleAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  ensureCanManageContent(actor.role);
  const articleId = parseArticleId(formData);
  const article = await prisma.blog.findUnique({ where: { id: articleId }, select: { status: true, publishedAt: true, archivedAt: true } });
  if (!article) redirect(routes.adminContent);

  await prisma.$transaction([
    prisma.blog.update({ where: { id: articleId }, data: { status: "ARCHIVED", archivedAt: new Date(), publishedAt: null } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "ARTICLE_ARCHIVED",
        targetType: "Blog",
        targetId: articleId,
        oldValue: { status: article.status, publishedAt: article.publishedAt, archivedAt: article.archivedAt },
        newValue: { status: "ARCHIVED" },
        reason: "Article archived from content management workflow."
      })
    })
  ]);
  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function updateArticleReviewStatusAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT]);
  ensureCanReviewContent(actor.role);
  const articleId = parseArticleId(formData);
  const medicalReviewStatus = assertReviewStatus(getText(formData, "medicalReviewStatus"));
  const reviewNotes = getText(formData, "reviewNotes");

  await prisma.blog.update({
    where: { id: articleId },
    data: {
      medicalReviewStatus,
      reviewedById: actor.id,
      reviewedAt: new Date(),
      reviewNotes: reviewNotes || null,
      ...(medicalReviewStatus === "APPROVED" ? {} : { status: assertStatus(medicalReviewStatus === "PENDING" ? "PENDING_REVIEW" : "DRAFT") })
    }
  });

  revalidatePath(routes.adminContent);
  revalidatePath(`${routes.adminContent}/${articleId}`);
  revalidatePath(routes.adminAuditLogs);
}
