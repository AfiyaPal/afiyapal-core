"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronDown,
  Search,
  Tag,
  X,
} from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { BlogSummary } from "../types/blog";

const CATEGORY_LABELS: Record<string, string> = {
  GENERAL_WELLNESS: "Wellness",
  MENTAL_HEALTH: "Mental Health",
  MATERNAL_HEALTH: "Maternal Health",
  NUTRITION: "Nutrition",
  FIRST_AID: "First Aid",
  MALARIA: "Malaria",
};

const CATEGORY_COLORS: Record<string, string> = {
  GENERAL_WELLNESS: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  MENTAL_HEALTH: "bg-purple-50 text-purple-700 ring-purple-100",
  MATERNAL_HEALTH: "bg-pink-50 text-pink-700 ring-pink-100",
  NUTRITION: "bg-lime-50 text-lime-700 ring-lime-100",
  FIRST_AID: "bg-orange-50 text-orange-700 ring-orange-100",
  MALARIA: "bg-red-50 text-red-700 ring-red-100",
};

function catStyle(cat: string | null | undefined) {
  return (
    CATEGORY_COLORS[cat ?? ""] ?? "bg-slate-50 text-slate-600 ring-slate-100"
  );
}

function catLabel(cat: string | null | undefined) {
  return CATEGORY_LABELS[cat ?? ""] ?? cat?.replaceAll("_", " ") ?? "General";
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function readingEstimate(excerpt?: string | null) {
  const words = (excerpt ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round((words + 600) / 220));
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

export function BlogList({ blogs }: { blogs: BlogSummary[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTag, setActiveTag] = useState("ALL");

  const categories = useMemo(
    () => [
      "ALL",
      ...Array.from(
        new Set(
          blogs
            .map((blog) => blog.contentCategory)
            .filter((category): category is string => Boolean(category)),
        ),
      ),
    ],
    [blogs],
  );

  const tagStats = useMemo(() => {
    const stats = new Map<string, { label: string; count: number }>();

    blogs.forEach((blog) => {
      (blog.tags ?? []).forEach((rawTag) => {
        const label = rawTag.trim();
        if (!label) return;

        const key = normalizeTag(label);
        const current = stats.get(key);

        stats.set(key, {
          label: current?.label ?? label,
          count: (current?.count ?? 0) + 1,
        });
      });
    });

    return Array.from(stats.values()).sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    );
  }, [blogs]);

  const tags = useMemo(
    () => ["ALL", ...tagStats.map((tag) => tag.label)],
    [tagStats],
  );

  const quickTags = useMemo(() => tagStats.slice(0, 8), [tagStats]);

  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get("tag");
    if (!tag) return;

    const matchingTag = tags.find(
      (item) => normalizeTag(item) === normalizeTag(tag),
    );

    setActiveTag(matchingTag ?? tag);
  }, [tags]);

  const featured = blogs[0];

  const filtered = blogs.filter((blog) => {
    const term = query.trim().toLowerCase();
    const blogTags = blog.tags ?? [];

    const matchCategory =
      activeCategory === "ALL" || blog.contentCategory === activeCategory;

    const matchTag =
      activeTag === "ALL" ||
      blogTags.some((tag) => normalizeTag(tag) === normalizeTag(activeTag));

    const matchText =
      !term ||
      blog.title.toLowerCase().includes(term) ||
      (blog.excerpt ?? "").toLowerCase().includes(term) ||
      blogTags.some((tag) => tag.toLowerCase().includes(term));

    return matchCategory && matchTag && matchText;
  });

  return (
    <main className="container-page py-12 md:py-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 p-6 text-white shadow-2xl shadow-brand-900/20 md:p-10 lg:p-12">
        <div
          aria-hidden
          className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-teal-300/25 blur-3xl"
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-brand-100 ring-1 ring-white/15">
              AfiyaPal health library
            </span>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Practical health education for African communities.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-brand-50/85">
              Browse evidence-aware articles on prevention, maternal health,
              nutrition, first aid, mental wellbeing, and community health.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-black">{blogs.length}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                  Articles
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-black">
                  {Math.max(0, categories.length - 1)}
                </p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                  Categories
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-black">
                  {Math.max(0, tags.length - 1)}
                </p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                  Tags
                </p>
              </div>
            </div>
          </div>

          {featured ? (
            <Link
              href={`/blogs/${featured.slug}`}
              className="group overflow-hidden rounded-[1.75rem] bg-white text-slate-950 shadow-xl shadow-slate-950/20 ring-1 ring-white/15"
            >
              <div className="relative h-60 overflow-hidden">
                {featured.imageUrl ? (
                  <Image
                    src={featured.imageUrl}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-brand-100 to-accent-violet-100" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />

                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ring-1 ${catStyle(
                    featured.contentCategory,
                  )}`}
                >
                  Featured · {catLabel(featured.contentCategory)}
                </span>
              </div>

              <div className="p-5">
                <h2 className="line-clamp-2 text-xl font-black tracking-tight transition group-hover:text-brand-700">
                  {featured.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {featured.excerpt}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-700">
                  Read featured article
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-brand-900/5 backdrop-blur md:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(260px,420px)_1fr] lg:items-start">
          <div>
            <label
              htmlFor="blog-search"
              className="text-xs font-black uppercase tracking-wide text-slate-500"
            >
              Search library
            </label>

            <div className="relative mt-2">
              <Search
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />

              <input
                id="blog-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, topic, or tag..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                Categories
              </p>

              <div
                className="mt-2 flex flex-wrap gap-2"
                role="group"
                aria-label="Filter by category"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-3.5 py-2 text-xs font-black ring-1 transition ${
                      activeCategory === category
                        ? "bg-brand-600 text-white ring-brand-600 shadow-sm"
                        : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {category === "ALL" ? "All" : catLabel(category)}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
              <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:items-start">
                <div className="min-w-0">
                  <label
                    htmlFor="blog-tag-filter"
                    className="text-xs font-black uppercase tracking-wide text-slate-500"
                  >
                    Topic tag
                  </label>

                  <div className="relative mt-2">
                    <Tag
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />

                    <select
                      id="blog-tag-filter"
                      value={activeTag}
                      onChange={(event) => setActiveTag(event.target.value)}
                      className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    >
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag === "ALL" ? "All tags" : tag}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Popular tags
                    </p>

                    {activeTag !== "ALL" ? (
                      <button
                        type="button"
                        onClick={() => setActiveTag("ALL")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600 ring-1 ring-slate-200 transition hover:text-brand-700"
                      >
                        Clear tag
                        <X className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    ) : null}
                  </div>

                  {quickTags.length > 0 ? (
                    <div
                      className="mt-3 flex max-w-full flex-wrap gap-2 overflow-hidden"
                      role="group"
                      aria-label="Popular blog tags"
                    >
                      {quickTags.map((tag) => (
                        <button
                          key={tag.label}
                          type="button"
                          onClick={() => setActiveTag(tag.label)}
                          title={tag.label}
                          className={`inline-flex max-w-full items-center rounded-full px-3 py-1.5 text-xs font-bold ring-1 transition sm:max-w-[12rem] ${
                            normalizeTag(activeTag) === normalizeTag(tag.label)
                              ? "bg-slate-950 text-white ring-slate-950"
                              : "bg-white text-slate-600 ring-slate-200 hover:bg-brand-50 hover:text-brand-700"
                          }`}
                        >
                          <span className="truncate">#{tag.label}</span>
                          <span className="ml-1 shrink-0 text-[10px] opacity-70">
                            {tag.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      Tags will appear after articles are seeded or published.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title={blogs.length === 0 ? "No blogs yet" : "No results found"}
            description={
              blogs.length === 0
                ? "Connect the database or seed sample blogs to show content here."
                : "Try a different search term, category, or tag."
            }
          />
        </div>
      ) : (
        <section className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand-700">
                Explore articles
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                {filtered.length} matching article
                {filtered.length !== 1 ? "s" : ""}
              </h2>
            </div>

            {activeCategory !== "ALL" || activeTag !== "ALL" || query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("ALL");
                  setActiveTag("ALL");
                }}
                className="w-fit rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((blog) => {
              const date = formatDate(blog.createdAt);
              const visibleTags = (blog.tags ?? []).slice(0, 3);
              const hiddenTagCount = Math.max(
                0,
                (blog.tags?.length ?? 0) - visibleTags.length,
              );

              return (
                <article
                  key={blog.id}
                  className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-100 hover:shadow-xl hover:shadow-brand-500/10"
                >
                  <Link href={`/blogs/${blog.slug}`} className="block">
                    <div className="relative h-56 overflow-hidden bg-brand-50">
                      {blog.imageUrl ? (
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-100 via-white to-accent-violet-100 text-brand-700">
                          <BookOpen className="h-10 w-10" aria-hidden />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ring-1 ${catStyle(
                          blog.contentCategory,
                        )}`}
                      >
                        {catLabel(blog.contentCategory)}
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                      {date ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" aria-hidden />
                          {date}
                        </span>
                      ) : null}

                      <span>{readingEstimate(blog.excerpt)} min read</span>
                    </div>

                    <h3 className="mt-3 text-xl font-black leading-tight tracking-tight text-slate-950 transition group-hover:text-brand-700">
                      <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h3>

                    {blog.excerpt ? (
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                        {blog.excerpt}
                      </p>
                    ) : null}

                    {visibleTags.length > 0 ? (
                      <div className="mt-5 flex flex-wrap items-center gap-1.5">
                        {visibleTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setActiveTag(tag)}
                            className="max-w-[9rem] truncate rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-100 transition hover:bg-brand-50 hover:text-brand-700"
                            title={tag}
                          >
                            #{tag}
                          </button>
                        ))}

                        {hiddenTagCount > 0 ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500 ring-1 ring-slate-200">
                            +{hiddenTagCount}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-700 underline-offset-4 transition hover:gap-3 hover:underline"
                    >
                      Read article
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
