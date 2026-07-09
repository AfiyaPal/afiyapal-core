import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  Globe2,
  GraduationCap,
  HeartPulse,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Users,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SocialIconLink } from "@/components/shared/social-icons";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, organizationSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";
import { routes } from "@/lib/routes";

export const metadata = buildMetadata({
  title: "About AfiyaPal",
  description:
    "Learn about AfiyaPal — an AI-powered public health intelligence and healthcare education platform built for patients, doctors, NGOs, and students across Africa.",
  path: "/about",
  keywords: [
    "about AfiyaPal",
    "AI health platform Africa",
    "healthcare education Kenya",
  ],
});

const heroValues = [
  "Accessibility",
  "Inclusion",
  "Education",
  "Innovation",
] as const;

const heroValueStyles = [
  "bg-brand-50 text-brand-700 ring-brand-100",
  "bg-accent-blue-50 text-accent-blue-700 ring-accent-blue-100",
  "bg-accent-violet-50 text-accent-violet-700 ring-accent-violet-100",
  "bg-teal-50 text-teal-700 ring-teal-100",
] as const;

const storyCards = [
  {
    label: "Why",
    icon: Lightbulb,
    title: "Healthcare questions should not wait for perfect access.",
    description:
      "Many people need a safe first step before deciding whether to self-care, learn more, book a consultation, or seek urgent help.",
  },
  {
    label: "Who",
    icon: Users,
    title: "Built for the whole health community.",
    description:
      "Patients, families, doctors, facilities, NGOs, and students can all use AfiyaPal to learn, connect, and improve access.",
  },
  {
    label: "What",
    icon: HeartPulse,
    title: "AI-assisted guidance plus trusted health education.",
    description:
      "AfiyaPal combines symptom guidance, multilingual education, verified care pathways, events, and privacy-aware health intelligence.",
  },
  {
    label: "Where",
    icon: MapPin,
    title: "Starting in Kenya, designed for African realities.",
    description:
      "The platform is shaped around local languages, care journeys, facility networks, and community outreach needs across the continent.",
  },
  {
    label: "When",
    icon: CalendarDays,
    title: "Available whenever questions arise.",
    description:
      "AfiyaPal is available 24/7 for education and first-step support, while clearly escalating emergencies to human care.",
  },
  {
    label: "How",
    icon: ShieldCheck,
    title: "Safety, trust, and human care stay at the centre.",
    description:
      "The product avoids diagnosis and prescriptions, uses safety prompts, and points users toward qualified professionals when needed.",
  },
];

const pillars = [
  {
    icon: HeartPulse,
    title: "First-step health guidance",
    description:
      "Our AI assistant helps you understand symptoms and next steps in clear language — English or Swahili — before you decide where to seek care.",
    accent: "bg-brand-50 text-brand-700 ring-brand-100",
  },
  {
    icon: GraduationCap,
    title: "Health education for everyone",
    description:
      "Evidence-aware articles and community resources written for everyday questions, not medical textbooks.",
    accent: "bg-accent-blue-50 text-accent-blue-700 ring-accent-blue-100",
  },
  {
    icon: Globe2,
    title: "Public health intelligence",
    description:
      "Aggregated, privacy-respecting insights that help NGOs, facilities, and public health teams understand community needs.",
    accent: "bg-accent-violet-50 text-accent-violet-700 ring-accent-violet-100",
  },
  {
    icon: ShieldCheck,
    title: "Safety first, always",
    description:
      "AfiyaPal never diagnoses or prescribes. It guides you to verified professionals and emergency services when it matters.",
    accent: "bg-teal-50 text-teal-700 ring-teal-100",
  },
];

const team = [
  {
    name: "Roberto Georges",
    role: "Technical Lead",
    bio: "Leads the architecture, engineering standards, and delivery roadmap for AfiyaPal, ensuring the platform is scalable, secure, and ready for real healthcare workflows across Africa.",
    image: "/images/team/roberto-georges.png",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/search/results/people/?keywords=Roberto%20Georges",
      },
      { label: "X", href: "https://x.com/search?q=Roberto%20Georges" },
    ],
  },
  {
    name: "Carolyne Wanjiku",
    role: "Project Manager",
    bio: "Coordinates product planning, delivery milestones, stakeholder communication, and quality assurance so every AfiyaPal release stays practical, measurable, and community-focused.",
    image: "/images/team/carolyne-wanjiku.png",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/search/results/people/?keywords=Carolyne%20Wanjiku",
      },
      { label: "X", href: "https://x.com/search?q=Carolyne%20Wanjiku" },
    ],
  },
  {
    name: "Edwin Gichira",
    role: "AI Integration Lead",
    bio: "Shapes the AI assistant experience, safety prompts, health-intelligence integrations, and responsible escalation paths that keep AfiyaPal helpful without replacing clinicians.",
    image: "/images/team/edwin-gichira.png",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/search/results/people/?keywords=Edwin%20Gichira",
      },
      { label: "X", href: "https://x.com/search?q=Edwin%20Gichira" },
    ],
  },
  {
    name: "Bedan Macharia",
    role: "Cyber Security Strategist",
    bio: "Guides privacy, secure deployment, data-handling discipline, and platform hardening so sensitive health interactions are protected by design.",
    image: "/images/team/bedan-macharia.png",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/search/results/people/?keywords=Bedan%20Macharia",
      },
      { label: "X", href: "https://x.com/search?q=Bedan%20Macharia" },
    ],
  },
  {
    name: "Lindah Mukami",
    role: "Project Designer",
    bio: "Designs accessible, trustworthy, and human-centered experiences that make complex healthcare guidance feel simple for patients, providers, and partners.",
    image: "/images/team/lindah-mukami.png",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/search/results/people/?keywords=Lindah%20Mukami",
      },
      { label: "X", href: "https://x.com/search?q=Lindah%20Mukami" },
    ],
  },
  {
    name: "Osike Shadrack",
    role: "Partnership Lead",
    bio: "Builds relationships with facilities, clinicians, NGOs, and community health stakeholders to grow AfiyaPal into a practical network for care access and outreach.",
    image: "/images/team/osike-shadrack.png",
    socials: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/search/results/people/?keywords=Osike%20Shadrack",
      },
      { label: "X", href: "https://x.com/search?q=Osike%20Shadrack" },
    ],
  },
];

const audiences = [
  {
    icon: Users,
    label: "Patients & families",
    description: "Accessible first-step guidance, 24/7.",
  },
  {
    icon: Stethoscope,
    label: "Doctors",
    description: "A verified network for consultations and health content.",
  },
  {
    icon: Building2,
    label: "Facilities & NGOs",
    description: "Community events, outreach, and health intelligence.",
  },
  {
    icon: GraduationCap,
    label: "Students",
    description:
      "Trusted learning resources for the next generation of health workers.",
  },
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="container-page py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-100">
              <Sparkles className="h-4 w-4" aria-hidden />
              About AfiyaPal
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Your health. Your guide.{" "}
              <span className="bg-gradient-to-r from-brand-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                Always with you.
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              {siteConfig.description} We exist to make trustworthy, first-step
              health guidance available to every community — starting in Kenya
              and growing across the continent.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              {heroValues.map((value, i) => (
                <span
                  key={value}
                  className={`rounded-full px-3 py-1.5 ring-1 ${heroValueStyles[i]}`}
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-br from-brand-200/50 via-teal-100/40 to-accent-blue-100/50 blur-3xl"
            />
            <div className="relative overflow-hidden rounded-[2rem] bg-white/80 p-10 shadow-2xl shadow-brand-500/10 ring-1 ring-slate-200/70 backdrop-blur-sm">
              <Image
                src="/brand/logo.png"
                alt="AfiyaPal logo"
                width={480}
                height={480}
                className="h-auto w-full select-none"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story / 5WH */}
      <section className="border-y border-brand-100 bg-gradient-to-br from-brand-50/80 via-white to-emerald-50/80">
        <div className="container-page py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-brand-700 ring-1 ring-brand-100">
                Our story
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                AfiyaPal starts with a simple question: what should someone do
                next?
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                People often search for health answers before they reach a
                clinic. AfiyaPal makes that first step safer: clear education,
                responsible AI guidance, and pathways to human care where it
                matters.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={routes.chatbot}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                >
                  Try the assistant{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href={routes.blogs}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-5 py-3 text-sm font-black text-brand-700 transition hover:bg-brand-50"
                >
                  Read health articles
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {storyCards.map((item) => (
                <article
                  key={item.label}
                  className="group rounded-[1.75rem] border border-white bg-white/85 p-5 shadow-sm ring-1 ring-brand-100/70 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="container-page py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-[#05261b] via-brand-800 to-brand-600 p-6 shadow-2xl shadow-brand-900/25 md:p-10">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-28 left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          />

          <div className="relative grid gap-5 md:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white/15 bg-white/10 p-7 text-white backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Target className="h-5 w-5" aria-hidden />
                </span>

                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-100">
                  Mission
                </p>
              </div>

              <p className="mt-5 text-lg font-bold leading-8 text-white md:text-xl">
                To bridge healthcare gaps by delivering trusted, multilingual
                digital health services that educate, support, and connect
                communities with timely medical guidance.
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-white/25 bg-white p-7 text-slate-950 shadow-2xl shadow-slate-950/15 md:-translate-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                  <Eye className="h-5 w-5" aria-hidden />
                </span>

                <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-700">
                  Vision
                </p>
              </div>

              <p className="mt-5 text-lg font-bold leading-8 text-slate-700 md:text-xl">
                To build a future where every person is empowered to live
                healthier lives through trusted, accessible healthcare services.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="container-page pb-16 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            What AfiyaPal does
          </h2>
          <p className="mt-3 text-slate-600">
            Four pillars, one goal: informed, confident health decisions.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-sm motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${pillar.accent}`}
              >
                <pillar.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-page pb-16 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 ring-1 ring-brand-100">
            Our people
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Meet the team
          </h2>
          <p className="mt-3 text-slate-600">
            The people behind AfiyaPal, building safer digital health access for
            African communities.
          </p>
        </div>
        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="group relative rounded-[2rem] border border-brand-100/80 bg-white/90 px-6 pb-7 pt-24 text-center shadow-sm ring-1 ring-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10"
            >
              <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-br from-brand-200 via-white to-teal-100 p-1.5 shadow-2xl shadow-brand-700/15 ring-8 ring-white">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-brand-50">
                  <Image
                    src={member.image}
                    alt={`AfiyaPal team avatar for ${member.name}`}
                    fill
                    sizes="128px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-950">
                {member.name}
              </h3>
              <p className="mt-2 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">
                {member.role}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {member.bio}
              </p>
              <div className="mt-5 flex justify-center gap-2">
                {member.socials.map((social) => (
                  <SocialIconLink
                    key={`${member.name}-${social.label}`}
                    label={social.label}
                    href={social.href}
                    className="h-9 w-9 ring-2"
                    iconClassName="h-3.5 w-3.5"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Who it serves */}
      <section className="container-page pb-16 md:pb-20">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-sm md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Built for the whole health community
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <div key={audience.label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-teal-500 to-brand-700 text-white shadow-md">
                  <audience.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  {audience.label}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety note + CTA */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#05261b] via-brand-800 to-brand-600 px-8 py-12 text-center shadow-2xl shadow-brand-900/25 md:px-16">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-brand-700 shadow-sm ring-1 ring-white/60">
              <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden />A
              note on safety
            </span>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
              {siteConfig.medicalDisclaimer} {siteConfig.emergencyNotice}
            </p>
            <div className="mx-auto mt-7 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
              {["No diagnosis", "No prescriptions", "Escalate emergencies"].map(
                (item) => (
                  <p
                    key={item}
                    className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/15"
                  >
                    <CheckCircle2
                      className="h-4 w-4 text-brand-100"
                      aria-hidden
                    />
                    {item}
                  </p>
                ),
              )}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={routes.chatbot}
                className="rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-brand-50 hover:shadow-xl active:scale-[0.98]"
              >
                Try the AI assistant
              </Link>
              <Link
                href={routes.register}
                className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Create a free account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
