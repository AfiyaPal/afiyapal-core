import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} - AI Health Assistant for Africa`,
    short_name: siteConfig.name,
    description: siteConfig.shortDescription,
    start_url: "/chatbot",
    scope: "/",
    display: "standalone",
    background_color: "#05261b",
    theme_color: "#05261b",
    orientation: "portrait-primary",
    categories: ["health", "education", "medical"],
    lang: "en-KE",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" }
    ]
  };
}
