import Link from "next/link";
import Image from "next/image";
import { HeartPulse, GraduationCap, Stethoscope, Building2, ShieldCheck, Globe2, Users } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, organizationSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";
import { routes } from "@/lib/routes";

export const metadata = buildMetadata({
  title: "About AfiyaPal",
  description:
    "Learn about AfiyaPal — an AI-powered public health intelligence and healthcare education platform built for patients, doctors, NGOs, and students across Africa.",
  path: "/about",
  keywords: ["about AfiyaPal", "AI health platform Africa", "healthcare education Kenya"]
});

const heroValues = ["Accessibility", "Inclusion", "Education", "Innovation"] as const;

const heroValueStyles = [
  "bg-brand-50 text-brand-700 ring-brand-100",
  "bg-accent-blue-50 text-accent-blue-700 ring-accent-blue-100",
  "bg-accent-violet-50 text-accent-violet-700 ring-accent-violet-100",
  "bg-teal-50 text-teal-700 ring-teal-100"
] as const;

const pillars = [
  {
    icon: HeartPulse,
    title: "First-step health guidance",
    description:
      "Our AI assistant helps you understand symptoms and next steps in clear language — English or Swahili — before you decide where to seek care.",
    accent: "bg-brand-50 text-brand-700 ring-brand-100"
  },
  {
    icon: GraduationCap,
    title: "Health education for everyone",
    description:
      "Evidence-aware articles and community resources written for everyday questions, not medical textbooks.",
    accent: "bg-accent-blue-50 text-accent-blue-700 ring-accent-blue-100"
  },
  {
    icon: Globe2,
    title: "Public health intelligence",
    description:
      "Aggregated, privacy-respecting insights that help NGOs, facilities, and public health teams understand community needs.",
    accent: "bg-accent-violet-50 text-accent-violet-700 ring-accent-violet-100"
  },
  {
    icon: ShieldCheck,
    title: "Safety first, always",
    description:
      "AfiyaPal never diagnoses or prescribes. It guides you to verified professionals and emergency services when it matters.",
    accent: "bg-teal-50 text-teal-700 ring-teal-100"
  }
];

const team = [
  {
    name: "Roberto Georges",
    role: "Technical Lead",
    bio: "Experienced technical lead specializing in educational technology and AI-driven solutions across Africa.",
    initials: "RG",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    name: "Carolyne Wanjiku",
    role: "Project Manager",
    bio: "Strategic project manager with a track record of delivering impactful health and education initiatives.",
    initials: "CW",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Edwin Gichira",
    role: "AI Integration Lead",
    bio: "AI integration lead focused on building safe and explainable health intelligence into the platform.",
    initials: "EG",
    gradient: "from-cyan-500 to-sky-600",
  },
  {
    name: "Bedan Macharia",
    role: "Cyber Security Strategist",
    bio: "Cyber security analyst ensuring data privacy and secure infrastructure for the platform.",
    initials: "BM",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Lindah Mukami",
    role: "Project Designer",
    bio: "Project designer crafting user-centered interfaces for accessible health experiences.",
    initials: "LM",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Osike Shadrack",
    role: "Partnership Lead",
    bio: "Partnership lead connecting AfiyaPal with healthcare organizations and community stakeholders.",
    initials: "OS",
    gradient: "from-amber-500 to-orange-600",
  },
];

const audiences = [
  { icon: Users, label: "Patients & families", description: "Accessible first-step guidance, 24/7." },
  { icon: Stethoscope, label: "Doctors", description: "A verified network for consultations and health content." },
  { icon: Building2, label: "Facilities & NGOs", description: "Community events, outreach, and health intelligence." },
  { icon: GraduationCap, label: "Students", description: "Trusted learning resources for the next generation of health workers." }
];

export default function Page() {
  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" }
          ])
        ]}
      />

      {/* Hero */}
      <section className="container-page py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-accent-violet-50 px-3 py-1 text-sm font-semibold text-accent-violet-700 ring-1 ring-accent-violet-100">
              About AfiyaPal
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Your health. Your guide.{" "}
              <span className="bg-gradient-to-r from-brand-600 via-accent-blue-600 to-accent-violet-600 bg-clip-text text-transparent">
                Always with you.
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-slate-600">
              {siteConfig.description} We exist to make trustworthy, first-step health
              guidance available to every community — starting in Kenya and growing across
              the continent.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              {heroValues.map((value, i) => (
                <span key={value} className={`rounded-full px-3 py-1.5 ring-1 ${heroValueStyles[i]}`}>
                  {value}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div aria-hidden className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-br from-brand-200/40 via-accent-blue-100/40 to-accent-violet-200/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-white/80 p-10 shadow-2xl shadow-accent-violet-500/10 ring-1 ring-slate-200/70 backdrop-blur-sm">
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

      {/* Vision & mission */}
      <section className="border-y border-brand-200/50 bg-gradient-to-r from-brand-50/80 via-brand-100/40 to-brand-50/80">
        <div className="container-page py-14 md:py-16">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#056636] via-brand-700 to-[#008958] p-8 shadow-2xl shadow-brand-900/20 md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-100">Mission</p>
                <p className="mt-3 text-base leading-relaxed text-white md:text-lg">
                  To bridge healthcare gaps by delivering trusted, multilingual digital health services that educate, support, and connect communities with timely medical guidance.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/10 p-6 shadow-[0_22px_55px_-14px_rgba(0,0,0,0.45)] backdrop-blur-md md:-translate-y-1 md:p-8 md:shadow-[0_28px_60px_-12px_rgba(0,0,0,0.5)]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-white/8 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15 blur-2xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-50">Vision</p>
                  <p className="mt-3 text-base leading-relaxed text-white md:text-lg">
                    To build a future where every person is empowered to live healthier lives through trusted, accessible healthcare services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="container-page py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">What AfiyaPal does</h2>
          <p className="mt-3 text-slate-600">Four pillars, one goal: informed, confident health decisions.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-sm motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-violet-500/10"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${pillar.accent}`}>
                <pillar.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container-page pb-16 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Meet the team</h2>
          <p className="mt-3 text-slate-600">The people behind AfiyaPal, building for healthier communities.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="group rounded-3xl border border-slate-200/80 bg-white/90 p-6 text-center shadow-sm motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-sm font-bold tracking-wide text-white shadow-md ring-2 ring-white`}
              >
                {member.initials}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{member.name}</h3>
              <p className="text-xs font-medium text-brand-600">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Who it serves */}
      <section className="container-page pb-16 md:pb-20">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-sm md:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">Built for the whole health community</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <div key={audience.label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-accent-blue-500 to-accent-violet-500 text-white shadow-md">
                  <audience.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{audience.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety note + CTA */}
      <section className="container-page pb-24">
        <div className="rounded-[2rem] bg-gradient-to-r from-[#056636] via-brand-700 to-[#008958] px-8 py-12 text-center shadow-2xl shadow-brand-900/25 md:px-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">A note on safety</p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
            {siteConfig.medicalDisclaimer} {siteConfig.emergencyNotice}
          </p>
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
      </section>
    </main>
  );
}
