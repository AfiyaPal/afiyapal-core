"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { BlogSummary } from "../types/blog";

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL_WELLNESS: "Wellness",
  MENTAL_HEALTH:    "Mental Health",
  MATERNAL_HEALTH:  "Maternal",
  NUTRITION:        "Nutrition",
  FIRST_AID:        "First Aid",
  MALARIA:          "Malaria"
};

const CATEGORY_COLORS: Record<string, string> = {
  GENERAL_WELLNESS: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  MENTAL_HEALTH:    "bg-purple-50 text-purple-700 ring-purple-100",
  MATERNAL_HEALTH:  "bg-pink-50 text-pink-700 ring-pink-100",
  NUTRITION:        "bg-lime-50 text-lime-700 ring-lime-100",
  FIRST_AID:        "bg-orange-50 text-orange-700 ring-orange-100",
  MALARIA:          "bg-red-50 text-red-700 ring-red-100"
};

function catStyle(cat: string | null | undefined) {
  return CATEGORY_COLORS[cat ?? ""] ?? "bg-slate-50 text-slate-600 ring-slate-100";
}

function catLabel(cat: string | null | undefined) {
  return CATEGORY_LABELS[cat ?? ""] ?? cat ?? "General";
}

export function BlogList({ blogs }: { blogs: BlogSummary[] }) {
  const [query, setQuery]   = useState("");
  const [active, setActive] = useState("ALL");

  const categories = ["ALL", ...Array.from(
    new Set(blogs.map((b) => b.contentCategory).filter((c): c is string => !!c))
  )];

  const filtered = blogs.filter((b) => {
    const matchCat  = active === "ALL" || b.contentCategory === active;
    const matchText = !query
      || b.title.toLowerCase().includes(query.toLowerCase())
      || (b.excerpt ?? "").toLowerCase().includes(query.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <main className="container-page py-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">Health education blogs</h1>
        <p className="mt-3 text-slate-600">Articles and resources to support informed health choices.</p>
      </div>

      {/* Search + filter bar */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition ${
                active === cat
                  ? "bg-brand-600 text-white ring-brand-600 shadow-sm"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat === "ALL" ? "All" : (CATEGORY_LABELS[cat] ?? cat)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title={blogs.length === 0 ? "No blogs yet" : "No results found"}
            description={
              blogs.length === 0
                ? "Connect the database or seed sample blogs to show content here."
                : "Try a different search term or category."
            }
          />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-slate-500">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm motion-safe:transition motion-safe:duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-xl hover:shadow-brand-500/10"
              >
                {blog.imageUrl ? (
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 backdrop-blur-sm ${catStyle(blog.contentCategory)}`}>
                      {catLabel(blog.contentCategory)}
                    </span>
                  </div>
                ) : (
                  <div className="flex h-20 items-center justify-center bg-brand-50">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${catStyle(blog.contentCategory)}`}>
                      {catLabel(blog.contentCategory)}
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold text-slate-900 motion-safe:transition group-hover:text-brand-700">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 line-clamp-3">{blog.excerpt}</p>
                  )}
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 underline-offset-4 motion-safe:transition hover:gap-2 hover:underline"
                  >
                    Read more <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
