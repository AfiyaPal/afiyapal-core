import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./config";

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = "/opengraph-image",
  keywords = [],
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  authors
}: SeoInput = {}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} | ${siteConfig.tagline}`;

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          title: resolvedTitle,
          description,
          url,
          siteName: siteConfig.name,
          locale: siteConfig.locale,
          type: "article",
          images: [{ url: imageUrl, width: 1200, height: 630, alt: `${siteConfig.name} - ${siteConfig.tagline}` }],
          publishedTime,
          modifiedTime,
          authors
        }
      : {
          title: resolvedTitle,
          description,
          url,
          siteName: siteConfig.name,
          locale: siteConfig.locale,
          type: "website",
          images: [{ url: imageUrl, width: 1200, height: 630, alt: `${siteConfig.name} - ${siteConfig.tagline}` }]
        };

  return {
    title: resolvedTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.creator, url: siteConfig.creatorUrl }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    metadataBase: new URL(absoluteUrl("/")),
    alternates: {
      canonical: url,
      languages: {
        "en-KE": url,
        en: url,
        "x-default": url
      }
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [imageUrl]
    },
    category: "healthcare education"
  };
}

export function buildNoIndexMetadata(title: string, description?: string): Metadata {
  return buildMetadata({ title, description, noIndex: true });
}
