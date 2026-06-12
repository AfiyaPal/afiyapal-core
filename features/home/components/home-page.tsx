import Link from "next/link";
import { MessageCircle, BookOpen, UserCheck, ShieldCheck } from "lucide-react";
import { BenefitsSection } from "./benefits-section";
import { FeaturedBlogsSection } from "./featured-blogs-section";
import { HeroSlider } from "./hero-slider";
import { platformStats } from "../data/home-content";

const howItWorks = [
  { icon: MessageCircle, title: "Describe your symptoms", description: "Type how you feel in English or Swahili. AfiyaPal listens without judgment." },
  { icon: ShieldCheck,   title: "Get AI-powered guidance", description: "Receive evidence-aware first-step insights and recommended next steps instantly." },
  { icon: BookOpen,      title: "Learn from health articles", description: "Explore trusted health education tailored for African communities." },
  { icon: UserCheck,     title: "Connect with a doctor", description: "Request a consultation with a verified healthcare provider near you." }
];

export function HomePage() {
  return (
    <main>
      <HeroSlider />

      {/* Stats bar */}
      <div className="border-y border-brand-100/70 bg-brand-50/60 backdrop-blur-sm">
        <div className="container-page grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {platformStats.map((stat) => (
            <div key={stat.label} className="text-center animate-count-up">
              <p className="text-2xl font-black text-brand-700 md:text-3xl">{stat.value}</p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <BenefitsSection />

      {/* How it works */}
      <section className="relative overflow-hidden py-20">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(100%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 ring-1 ring-teal-100">
              How it works
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Four simple steps to better health</h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => (
              <div
                key={step.title}
                className="group relative flex flex-col items-start rounded-3xl border border-slate-100 bg-white p-6 shadow-sm motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-500/10"
              >
                <span className="absolute right-5 top-4 text-5xl font-black text-slate-100 select-none group-hover:text-brand-100/80 motion-safe:transition">
                  0{i + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 motion-safe:transition group-hover:bg-brand-100 group-hover:scale-110">
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

      {/* CTA banner */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-teal-700 px-8 py-14 text-center shadow-2xl shadow-brand-700/30 md:px-16">
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-teal-400/20 blur-3xl" />
          <p className="relative text-sm font-semibold uppercase tracking-widest text-brand-100">Ready to start?</p>
          <h2 className="relative mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
            Your health journey starts here
          </h2>
          <p className="relative mt-4 mx-auto max-w-xl text-brand-100">
            Get first-step AI health guidance, explore trusted articles, and connect with verified doctors — all in one place.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/chatbot"
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-brand-50 hover:shadow-xl active:scale-[0.98]"
            >
              Try the symptom checker
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
