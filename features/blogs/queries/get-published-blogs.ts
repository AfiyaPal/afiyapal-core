import { listPublishedBlogs } from "@/server/repositories/blog-repository";

export async function getPublishedBlogs() {
  return listPublishedBlogs();
}
