import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Building2, CalendarDays, Languages, MapPin, MessageCircle, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { routes } from "@/lib/routes";
import type { PublicProfessionalDetail } from "../types/professional";

function formatSpecialty(value: string | null | undefined) {
  return value?.trim() || "Healthcare professional";
}

function formatLocation(professional: { cityRegion: string | null; country: string | null }) {
  return [professional.cityRegion, professional.country].filter(Boolean).join(", ") || "Location on request";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(value);
}

export function ProfessionalProfile({ professional }: { professional: PublicProfessionalDetail }) {
  const specialty = formatSpecialty(professional.specialty);

  return (
    <main className="container-page py-12 md:py-16">
      <Link
        href="/professionals"
        className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 transition hover:gap-3 hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All professionals
      </Link>

      <section className="mt-6 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 p-6 text-white shadow-2xl shadow-brand-900/20 md:p-10 lg:p-12">
        <div aria-hidden className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-teal-300/25 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25">
              <UserRound className="size-8" aria-hidden />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight md:text-4xl">{professional.fullName}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-black text-emerald-200 ring-1 ring-emerald-300/30">
                  <span className="size-1.5 rounded-full bg-emerald-300" aria-hidden />
                  Available
                </span>
              </div>
              <p className="mt-2 text-lg font-semibold text-brand-100">{specialty}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-50/80">
                <ShieldCheck className="size-4" aria-hidden />
                Identity and credentials verified by AfiyaPal
              </p>
            </div>
          </div>

          <Link
            href={routes.chatbot}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-brand-50 hover:shadow-xl"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Ask AfiyaPal about {specialty}
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {professional.bio ? (
            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <h2 className="text-lg font-black tracking-tight text-slate-950">About</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{professional.bio}</p>
            </section>
          ) : null}

          {professional.blogs.length > 0 ? (
            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-brand-700" aria-hidden />
                <h2 className="text-lg font-black tracking-tight text-slate-950">Articles by {professional.fullName}</h2>
              </div>
              <div className="mt-4 space-y-3">
                {professional.blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.slug}`}
                    className="group block rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-brand-200 hover:bg-brand-50/60"
                  >
                    <h3 className="text-sm font-black tracking-tight text-slate-950 transition group-hover:text-brand-700">{blog.title}</h3>
                    {blog.excerpt ? <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600">{blog.excerpt}</p> : null}
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <CalendarDays className="size-3.5" aria-hidden />
                      {formatDate(blog.publishedAt ?? blog.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {professional.facilities.length > 0 ? (
            <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-brand-700" aria-hidden />
                <h2 className="text-lg font-black tracking-tight text-slate-950">Affiliated facilities</h2>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {professional.facilities.map((facility) => (
                  <div key={facility.facilityId} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <p className="flex items-center gap-1.5 text-sm font-black text-slate-950">
                      <BadgeCheck className="size-4 shrink-0 text-brand-700" aria-hidden />
                      {facility.facilityName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {[facility.facilityCity, facility.facilityCountry].filter(Boolean).join(", ") || "Location on request"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-wide text-slate-500">Quick facts</h2>
            <dl className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Stethoscope className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
                <div>
                  <dt className="text-xs font-bold text-slate-400">Specialty</dt>
                  <dd className="mt-0.5 text-sm font-bold text-slate-800">{specialty}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
                <div>
                  <dt className="text-xs font-bold text-slate-400">Location</dt>
                  <dd className="mt-0.5 text-sm font-bold text-slate-800">{formatLocation(professional)}</dd>
                </div>
              </div>
              {professional.languagesSpoken ? (
                <div className="flex items-start gap-3">
                  <Languages className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
                  <div>
                    <dt className="text-xs font-bold text-slate-400">Languages</dt>
                    <dd className="mt-0.5 text-sm font-bold text-slate-800">{professional.languagesSpoken}</dd>
                  </div>
                </div>
              ) : null}
              {professional.yearsOfExperience != null ? (
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
                  <div>
                    <dt className="text-xs font-bold text-slate-400">Experience</dt>
                    <dd className="mt-0.5 text-sm font-bold text-slate-800">{professional.yearsOfExperience} years</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="rounded-[1.75rem] border border-brand-100 bg-brand-50/80 p-6">
            <h2 className="text-sm font-black tracking-tight text-brand-900">Not sure what you need?</h2>
            <p className="mt-2 text-xs leading-6 text-brand-800/80">
              Chat with AfiyaPal to describe your concern. It shares first-step guidance and can point you to professionals who match.
            </p>
            <Link
              href={routes.chatbot}
              className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-700 underline-offset-4 transition hover:gap-3 hover:underline"
            >
              Start a chat
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
