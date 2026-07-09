import Link from "next/link";
import { MessageCircle, BookOpen, UserCheck, ShieldCheck, Stethoscope } from "lucide-react";
import { BenefitsSection } from "./benefits-section";
import { FeaturedBlogsSection } from "./featured-blogs-section";
import { HeroSlider } from "./hero-slider";
import { ContactSection } from "./contact-section";
import { platformStats } from "../data/home-content";
import { routes } from "@/lib/routes";

// Icon chips walk through the logo gradient: green -> teal -> blue -> violet
const howItWorks = [
  { icon: MessageCircle, title: "Describe your symptoms", description: "Type how you feel in English or Swahili. AfiyaPal listens without judgment.", accent: "bg-brand-50 text-brand-600 ring-brand-100 group-hover:bg-brand-100" },
  { icon: ShieldCheck,   title: "Get AI-powered guidance", description: "Receive evidence-aware first-step insights and recommended next steps instantly.", accent: "bg-teal-50 text-teal-600 ring-teal-100 group-hover:bg-teal-100" },
  { icon: BookOpen,      title: "Learn from health articles", description: "Explore trusted health education tailored for African communities.", accent: "bg-accent-blue-50 text-accent-blue-600 ring-accent-blue-100 group-hover:bg-accent-blue-100" },
  { icon: UserCheck,     title: "Connect with a doctor", description: "Request a consultation with a verified healthcare provider near you.", accent: "bg-accent-violet-50 text-accent-violet-600 ring-accent-violet-100 group-hover:bg-accent-violet-100" }
];

export function HomePage() {
  return (
    <main>
      <HeroSlider />

      {/* Stats bar */}
      <div className="border-y border-brand-200/50 bg-gradient-to-r from-brand-100/90 via-accent-blue-100/75 to-accent-violet-100/80 backdrop-blur-sm">
        <div className="container-page grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {platformStats.map((stat) => (
            <div key={stat.label} className="text-center animate-count-up">
              <p className="bg-gradient-to-r from-brand-600 via-accent-blue-600 to-accent-violet-600 bg-clip-text text-2xl font-black text-transparent md:text-3xl">{stat.value}</p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <BenefitsSection />

      {/* Brand banner */}
      <section className="border-t border-brand-200/40 bg-gradient-to-r from-brand-100/80 via-accent-blue-100/60 to-accent-violet-100/70 py-10 md:py-12">
        <div className="container-page">
          <div
            role="img"
            aria-label="AfiyaPal — Your Health. Your Guide. Always with You. AI-powered health guidance for African communities."
            className="aspect-[3/1] w-full select-none overflow-hidden rounded-[2rem] bg-cover bg-center shadow-2xl shadow-accent-violet-700/25 ring-1 ring-brand-200/50"
            style={{ backgroundImage: "url('/brand/banner.png')" }}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-violet-50/75 via-brand-50/60 to-accent-blue-50/75 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-accent-violet-50 px-3 py-1 text-sm font-semibold text-accent-violet-700 ring-1 ring-accent-violet-100">
              How it works
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Four simple steps to better health</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => (
              <div
                key={step.title}
                className="group relative flex flex-col items-start rounded-3xl border border-brand-200/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:border-accent-violet-200/80 hover:shadow-lg hover:shadow-accent-violet-500/15"
              >
                <span className="absolute right-5 top-4 text-5xl font-black text-slate-100 select-none group-hover:text-brand-100/80 motion-safe:transition">
                  0{i + 1}
                </span>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 motion-safe:transition group-hover:scale-110 ${step.accent}`}>
                  <step.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedBlogsSection />

      {/* Connect with a doctor */}
      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#056636] via-brand-700 to-[#008958] px-8 py-14 text-center shadow-2xl shadow-brand-900/25 md:px-16 md:py-16">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-brand-400/20 blur-3xl" />

          <p className="relative text-sm font-semibold uppercase tracking-widest text-brand-100">Care when you need it</p>
          <h2 className="relative mt-3 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
            Connect with a doctor
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-brand-50/95 md:text-xl">
            Request a consultation with a verified healthcare provider near you.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={routes.register}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-brand-50 hover:shadow-xl active:scale-[0.98]"
            >
              <Stethoscope className="h-4 w-4" aria-hidden />
              Request a consultation
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  );
}
