import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blogs", "/chatbot", "/events", "/llms.txt", "/ai.txt"],
        disallow: ["/admin", "/dashboard", "/facility", "/api", "/unauthorized"]
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/blogs", "/chatbot", "/events", "/llms.txt", "/ai.txt"],
        disallow: ["/admin", "/dashboard", "/facility", "/api"]
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/blogs", "/chatbot", "/events", "/llms.txt", "/ai.txt"],
        disallow: ["/admin", "/dashboard", "/facility", "/api"]
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/blogs", "/chatbot", "/events", "/llms.txt", "/ai.txt"],
        disallow: ["/admin", "/dashboard", "/facility", "/api"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
