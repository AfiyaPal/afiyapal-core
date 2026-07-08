export const siteConfig = {
  name: "AfiyaPal",
  legalName: "AfiyaPal Health Intelligence Platform",
  domain: "https://www.afiyapal.co.ke",
  tagline: "An AI-powered public health intelligence and healthcare education platform.",
  description:
    "AfiyaPal is an AI-powered public health intelligence and healthcare education platform for patients, doctors, NGOs, and students across Africa.",
  shortDescription: "AI-powered health education, symptom guidance, and public health intelligence for Africa.",
  locale: "en_KE",
  languageAlternates: {
    en: "https://www.afiyapal.co.ke",
    sw: "https://www.afiyapal.co.ke/sw"
  },
  creator: "TalonArch",
  creatorUrl: "https://talonarch.vercel.app",
  region: "Pan-African",
  country: "KE",
  minimumAge: "18+",
  stage: "Pilot stage",
  keywords: [
    "AfiyaPal",
    "Afiyapal",
    "afiya pal",
    "afya pal",
    "afyapal",
    "TalonArch",
    "AI healthcare Africa",
    "AI health assistant",
    "symptom checker Kenya",
    "symptom checker Africa",
    "telemedicine Africa",
    "telemedicine Kenya",
    "multilingual health assistant",
    "AI public health platform",
    "AI medical assistant Africa",
    "healthcare education Africa",
    "online doctor consultation Africa",
    "Swahili healthcare AI",
    "mental health support Africa",
    "AI-powered health education"
  ],
  publicRoutes: ["/", "/about", "/blogs", "/chatbot", "/events", "/login", "/register", "/register/doctor", "/register/facility"],
  protectedPrefixes: ["/admin", "/dashboard", "/facility"],
  emergencyNotice:
    "AfiyaPal does not provide emergency medical services. For severe symptoms or emergencies, call local emergency services or visit the nearest health facility immediately.",
  medicalDisclaimer:
    "AfiyaPal provides educational health information and AI-assisted first-step guidance only. It is not a diagnosis, prescription, or replacement for a licensed clinician."
} as const;

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || siteConfig.domain;
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${normalizedPath}`;
}
