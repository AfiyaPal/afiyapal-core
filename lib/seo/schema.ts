import { absoluteUrl, siteConfig } from "./config";

type JsonLd = Record<string, unknown>;

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "MedicalOrganization"],
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: absoluteUrl("/"),
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    foundingLocation: { "@type": "Country", name: "Kenya" },
    areaServed: ["Kenya", "Africa"],
    knowsAbout: siteConfig.keywords,
    sameAs: [siteConfig.creatorUrl],
    founder: {
      "@type": "Organization",
      name: siteConfig.creator,
      url: siteConfig.creatorUrl
    },
    medicalSpecialty: ["PublicHealth", "PrimaryCare", "MentalHealth"],
    isAccessibleForFree: true
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    alternateName: ["Afiyapal", "Afiya Pal", "Afya Pal"],
    url: absoluteUrl("/"),
    description: siteConfig.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: ["en-KE", "sw-KE"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/blogs")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function webApplicationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    "@id": absoluteUrl("/chatbot#application"),
    name: "AfiyaPal Health Assistant",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/chatbot"),
    description:
      "AI-assisted symptom guidance, health education, mental wellbeing support, and healthcare navigation for adults across Africa.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KES" },
    audience: [
      { "@type": "Audience", audienceType: "Patients" },
      { "@type": "Audience", audienceType: "Doctors" },
      { "@type": "Audience", audienceType: "NGOs" },
      { "@type": "Audience", audienceType: "Students" }
    ],
    publisher: { "@id": absoluteUrl("/#organization") }
  };
}

export function medicalWebPageSchema({
  path,
  title,
  description,
  breadcrumbs = []
}: {
  path: string;
  title: string;
  description: string;
  breadcrumbs?: { name: string; path: string }[];
}): JsonLd[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name: title,
      description,
      inLanguage: ["en-KE", "sw-KE"],
      medicalAudience: ["Patient", "Clinician"],
      reviewedBy: { "@id": absoluteUrl("/#organization") },
      publisher: { "@id": absoluteUrl("/#organization") },
      isPartOf: { "@id": absoluteUrl("/#website") },
      about: ["AI health assistant", "public health", "symptom checker", "health education"],
      lastReviewed: new Date().toISOString().slice(0, 10)
    },
    breadcrumbSchema([{ name: "Home", path: "/" }, ...breadcrumbs])
  ];
}

export function faqSchema(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function articleSchema({
  title,
  description,
  path,
  image,
  datePublished,
  dateModified,
  authorName = "AfiyaPal Editorial Team",
  category = "Health education"
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  category?: string | null;
}): JsonLd[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": ["Article", "BlogPosting", "MedicalWebPage"],
      "@id": `${absoluteUrl(path)}#article`,
      headline: title,
      description,
      url: absoluteUrl(path),
      image: image ? absoluteUrl(image) : absoluteUrl("/opengraph-image"),
      datePublished: datePublished ?? undefined,
      dateModified: dateModified ?? datePublished ?? undefined,
      articleSection: category ?? "Health education",
      author: { "@type": "Person", name: authorName ?? "AfiyaPal Editorial Team" },
      publisher: { "@id": absoluteUrl("/#organization") },
      reviewedBy: { "@id": absoluteUrl("/#organization") },
      isAccessibleForFree: true,
      inLanguage: "en-KE",
      about: [category, "health education", "public health Africa"].filter(Boolean)
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blogs", path: "/blogs" },
      { name: title, path }
    ])
  ];
}

export function eventSchema(event: {
  id: number;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  facility: { name: string; city: string | null; country: string; address?: string | null; website?: string | null };
}): JsonLd[] {
  const path = `/events/${event.id}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      "@id": `${absoluteUrl(path)}#event`,
      name: event.title,
      description: event.description ?? "Community health event listed by AfiyaPal.",
      url: absoluteUrl(path),
      startDate: event.startDate.toISOString(),
      endDate: event.endDate?.toISOString(),
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: event.location ?? event.facility.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: event.facility.address ?? event.location ?? undefined,
          addressLocality: event.facility.city ?? undefined,
          addressCountry: event.facility.country
        }
      },
      organizer: {
        "@type": ["Organization", "MedicalOrganization"],
        name: event.facility.name,
        url: event.facility.website ?? absoluteUrl("/events")
      },
      publisher: { "@id": absoluteUrl("/#organization") }
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Events", path: "/events" },
      { name: event.title, path }
    ])
  ];
}
