import type { MetadataRoute } from "next";
import { getBaseUrl, siteConfig } from "@/lib/seo/config";
import { getPublishedBlogs } from "@/features/blogs/queries/get-published-blogs";
import { getPublicEvents } from "@/features/facility/queries/get-public-events";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = siteConfig.publicRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path === "/chatbot" ? 0.9 : 0.7,
    alternates: {
      languages: {
        "en-KE": `${baseUrl}${path}`,
        "sw-KE": `${baseUrl}/sw${path === "/" ? "" : path}`
      }
    }
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getPublishedBlogs();
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.createdAt ? new Date(blog.createdAt) : now,
      changeFrequency: "monthly",
      priority: 0.75
    }));
  } catch {
    blogRoutes = [];
  }

  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const events = await getPublicEvents();
    eventRoutes = events.map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: event.startDate ? new Date(event.startDate) : now,
      changeFrequency: "weekly",
      priority: 0.65
    }));
  } catch {
    eventRoutes = [];
  }

  return [...staticRoutes, ...blogRoutes, ...eventRoutes];
}
