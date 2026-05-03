import { findBlogBySlug } from "@/server/repositories/blog-repository";

export async function getBlogBySlug(slug: string) {
  return findBlogBySlug(slug);
}
