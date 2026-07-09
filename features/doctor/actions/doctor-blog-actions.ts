"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { routes } from "@/lib/routes";
import { notifyAdminsContentPendingReview } from "@/server/services/notification-service";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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

function normalizeTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12)
    .join(", ");
}

async function requireDoctor() {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);
  return user;
}

export async function createDoctorBlogAction(_: unknown, formData: FormData) {
  const user = await requireDoctor();
  const title = getText(formData, "title");
  const content = getText(formData, "content");
  const excerpt = getText(formData, "excerpt");
  const contentCategory = getText(formData, "contentCategory") || "GENERAL_WELLNESS";
  const language = getText(formData, "language") || "en";
  const tags = normalizeTags(getText(formData, "tags"));

  if (title.length < 4) return { ok: false, message: "Title must be at least 4 characters." };
  if (content.length < 40) return { ok: false, message: "Content must be at least 40 characters." };

  const slug = await uniqueSlug(title);

  await prisma.blog.create({
    data: {
      title,
      slug,
      excerpt: excerpt || content.slice(0, 180),
      content,
      contentCategory,
      language,
      tags,
      status: "DRAFT",
      medicalReviewStatus: "NOT_SUBMITTED",
      creatorId: user.id
    }
  });

  revalidatePath("/dashboard/blogs");
  redirect("/dashboard/blogs");
}

export async function updateDoctorBlogAction(_: unknown, formData: FormData) {
  const user = await requireDoctor();
  const blogId = Number(formData.get("blogId"));
  if (!Number.isInteger(blogId) || blogId <= 0) return { ok: false, message: "Invalid blog ID." };

  const existing = await prisma.blog.findFirst({ where: { id: blogId, creatorId: user.id } });
  if (!existing) return { ok: false, message: "Blog not found." };

  const title = getText(formData, "title");
  const content = getText(formData, "content");
  const excerpt = getText(formData, "excerpt");
  const contentCategory = getText(formData, "contentCategory") || existing.contentCategory;
  const language = getText(formData, "language") || existing.language;
  const tags = normalizeTags(getText(formData, "tags"));

  if (title.length < 4) return { ok: false, message: "Title must be at least 4 characters." };
  if (content.length < 40) return { ok: false, message: "Content must be at least 40 characters." };

  const slug = await uniqueSlug(title, blogId);

  await prisma.blog.update({
    where: { id: blogId },
    data: {
      title,
      slug,
      excerpt: excerpt || content.slice(0, 180),
      content,
      contentCategory,
      language,
      tags,
      ...(existing.status === "PUBLISHED" ? { status: "PENDING_REVIEW", medicalReviewStatus: "PENDING" } : {})
    }
  });

  revalidatePath("/dashboard/blogs");
  redirect("/dashboard/blogs");
}

export async function deleteDoctorBlogAction(formData: FormData) {
  const user = await requireDoctor();
  const blogId = Number(formData.get("blogId"));
  if (!Number.isInteger(blogId) || blogId <= 0) return { ok: false, message: "Invalid blog ID." };

  const existing = await prisma.blog.findFirst({ where: { id: blogId, creatorId: user.id } });
  if (!existing) return { ok: false, message: "Blog not found." };

  await prisma.blog.delete({ where: { id: blogId } });

  revalidatePath("/dashboard/blogs");
  return { ok: true, message: "Blog deleted." };
}

export async function submitDoctorBlogForReviewAction(formData: FormData) {
  const user = await requireDoctor();
  const blogId = Number(formData.get("blogId"));
  if (!Number.isInteger(blogId) || blogId <= 0) return { ok: false, message: "Invalid blog ID." };

  const existing = await prisma.blog.findFirst({ where: { id: blogId, creatorId: user.id } });
  if (!existing) return { ok: false, message: "Blog not found." };

  const article = await prisma.blog.update({
    where: { id: blogId },
    data: { status: "PENDING_REVIEW", medicalReviewStatus: "PENDING" },
    select: { title: true }
  });

  notifyAdminsContentPendingReview({ articleId: blogId, title: article.title }).catch((error) =>
    console.error("Failed to notify medical reviewers about pending content", error)
  );

  revalidatePath("/dashboard/blogs");
  return { ok: true, message: "Blog submitted for review." };
}
