"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Search, Stethoscope, UserRound } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { PublicProfessionalCard } from "../types/professional";

function formatSpecialty(value: string | null | undefined) {
  return value?.trim() || "Healthcare professional";
}

function formatLocation(professional: PublicProfessionalCard) {
  return [professional.cityRegion, professional.country].filter(Boolean).join(", ") || "Location on request";
}

export function ProfessionalsDirectory({ professionals }: { professionals: PublicProfessionalCard[] }) {
  const [query, setQuery] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("ALL");

  const specialties = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          professionals
            .map((professional) => professional.specialty?.trim())
            .filter((value): value is string => Boolean(value))
        )
      )
    ],
    [professionals]
  );

  const filtered = professionals.filter((professional) => {
    const term = query.trim().toLowerCase();
    const matchSpecialty = activeSpecialty === "ALL" || professional.specialty?.trim() === activeSpecialty;
    const matchText =
      !term ||
      professional.fullName.toLowerCase().includes(term) ||
      (professional.specialty ?? "").toLowerCase().includes(term) ||
      (professional.languagesSpoken ?? "").toLowerCase().includes(term) ||
      (professional.cityRegion ?? "").toLowerCase().includes(term) ||
      (professional.country ?? "").toLowerCase().includes(term) ||
      (professional.bio ?? "").toLowerCase().includes(term);
    return matchSpecialty && matchText;
  });

  return (
    <main className="container-page py-12 md:py-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 p-6 text-white shadow-2xl shadow-brand-900/20 md:p-10 lg:p-12">
        <div aria-hidden className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-teal-300/25 blur-3xl" />

        <div className="relative">
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-brand-100 ring-1 ring-white/15">
            Verified professionals
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Health professionals near you.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-50/85">
            Browse verified health professionals who are currently available. Each profile shows their specialty, location, published articles, and affiliated facilities.
          </p>

          <div className="mt-7 grid max-w-md gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
              <p className="text-2xl font-black">{professionals.length}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Available now</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
              <p className="text-2xl font-black">{Math.max(0, specialties.length - 1)}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-300">Specialties</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-brand-900/5 backdrop-blur md:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(260px,420px)_1fr] lg:items-start">
          <div>
            <label htmlFor="professional-search" className="text-xs font-black uppercase tracking-wide text-slate-500">
              Search professionals
            </label>
            <div className="relative mt-2">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="professional-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, specialty, or location..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">Specialty</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter by specialty">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => setActiveSpecialty(specialty)}
                  className={`rounded-full px-3.5 py-2 text-xs font-black ring-1 transition ${
                    activeSpecialty === specialty
                      ? "bg-brand-600 text-white ring-brand-600 shadow-sm"
                      : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {specialty === "ALL" ? "All" : specialty}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title={professionals.length === 0 ? "No professionals yet" : "No results found"}
            description={
              professionals.length === 0
                ? "Verified professionals will appear here once their profiles are approved."
                : "Try a different search term or specialty."
            }
          />
        </div>
      ) : (
        <section className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand-700">Available professionals</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                {filtered.length} professional{filtered.length !== 1 ? "s" : ""}
              </h2>
            </div>

            {activeSpecialty !== "ALL" || query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveSpecialty("ALL");
                }}
                className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((professional) => (
              <article
                key={professional.id}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <Link href={`/professionals/${professional.id}`} className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-100 to-teal-100 text-brand-700">
                        <UserRound className="size-5" aria-hidden />
                      </span>
                      <div>
                        <h3 className="text-lg font-black leading-tight tracking-tight text-slate-950 transition group-hover:text-brand-700">
                          {professional.fullName}
                        </h3>
                        <p className="text-sm font-semibold text-brand-700">{formatSpecialty(professional.specialty)}</p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">
                      <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                      Available
                    </span>
                  </div>

                  <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <MapPin className="size-3.5" aria-hidden />
                    {formatLocation(professional)}
                  </p>

                  {professional.languagesSpoken ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Stethoscope className="size-3.5" aria-hidden />
                      {professional.languagesSpoken}
                    </p>
                  ) : null}

                  {professional.bio ? (
                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{professional.bio}</p>
                  ) : (
                    <div className="flex-1" />
                  )}

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-700 underline-offset-4 transition group-hover:gap-3 group-hover:underline">
                    View profile
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
