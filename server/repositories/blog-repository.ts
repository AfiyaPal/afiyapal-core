import "server-only";
import { prisma } from "@/server/db/prisma";
import { featuredBlogs } from "@/features/home/data/home-content";
import type { BlogDetailModel, BlogSummary } from "@/features/blogs/types/blog";

export async function listPublishedBlogs(): Promise<BlogSummary[]> {
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: { in: ["PUBLISHED", "published"] } },
      include: { media: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });

    if (blogs.length === 0) return fallbackBlogs();

    return blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? blog.content.slice(0, 150),
      imageUrl: blog.media[0]?.mediaUrl ?? null,
      createdAt: blog.publishedAt ?? blog.createdAt,
      contentCategory: blog.contentCategory ?? null
    }));
  } catch {
    return fallbackBlogs();
  }
}

export async function findBlogBySlug(slug: string): Promise<BlogDetailModel | null> {
  try {
    const blog = await prisma.blog.findFirst({
      where: { slug, status: { in: ["PUBLISHED", "published"] } },
      include: { category: true, media: true }
    });

    if (!blog) return fallbackBlog(slug);

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? blog.content.slice(0, 150),
      content: blog.content,
      category: blog.category?.name ?? blog.contentCategory?.replaceAll("_", " ").toLowerCase() ?? null,
      imageUrl: blog.media[0]?.mediaUrl ?? null,
      createdAt: blog.publishedAt ?? blog.createdAt
    };
  } catch {
    return fallbackBlog(slug);
  }
}

function fallbackBlogs(): BlogSummary[] {
  return featuredBlogs.map((blog, index) => ({
    id: index + 1,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    imageUrl: blog.image
  }));
}

function fallbackBlog(slug: string): BlogDetailModel | null {
  const blog = featuredBlogs.find((item) => item.slug === slug);
  if (!blog) return null;
  return {
    id: slug,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    imageUrl: blog.image,
    content: `${blog.excerpt}\n\nThis is placeholder content from the migration starter. Connect Prisma to your real blog database or seed this page with migrated Django blog data.`,
    category: "Health education"
  };
}
