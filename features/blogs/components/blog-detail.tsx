"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, MessageCircle } from "lucide-react";
import { VoteButtons } from "@/features/doctor/components/vote-buttons";
import { articleSchema } from "@/lib/seo/schema";
import type { BlogDetailModel } from "../types/blog";

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function buildParagraphs(content: string) {
  return content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const CATEGORY_COLORS: Record<string, string> = {
  "general wellness":  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "mental health":     "bg-purple-50  text-purple-700  ring-purple-200",
  "maternal health":   "bg-pink-50    text-pink-700    ring-pink-200",
  nutrition:           "bg-lime-50    text-lime-700    ring-lime-200",
  "first aid":         "bg-orange-50  text-orange-700  ring-orange-200",
  malaria:             "bg-red-50     text-red-700     ring-red-200",
  "health education":  "bg-brand-50   text-brand-700   ring-brand-200"
};

function categoryStyle(cat: string | null | undefined) {
  const key = (cat ?? "").toLowerCase();
  return CATEGORY_COLORS[key] ?? "bg-slate-50 text-slate-700 ring-slate-200";
}

export function BlogDetail({
  blog,
  voteUp,
  voteDown,
  userVote,
  canVote
}: {
  blog: BlogDetailModel;
  voteUp: number;
  voteDown: number;
  userVote: "UP" | "DOWN" | null;
  canVote: boolean;
}) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied]     = useState(false);
  const articleRef              = useRef<HTMLElement>(null);

  const paragraphs = buildParagraphs(blog.content);
  const mins       = readingTime(blog.content);
  const dateStr    = formatDate(blog.createdAt);
  const catLabel   = blog.category ? capitalize(blog.category) : "Health education";
  const catClass   = categoryStyle(blog.category);

  /* Reading progress bar */
  useEffect(() => {
    function onScroll() {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = Math.max(0, -top);
      const pct      = Math.min(100, (scrolled / (height - window.innerHeight)) * 100);
      setProgress(isNaN(pct) ? 0 : pct);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: blog.title, url }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(url).catch(() => null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed left-0 top-0 z-50 h-1 bg-gradient-to-r from-brand-500 to-teal-500 motion-safe:transition-all motion-safe:duration-100"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <main>
        {/* ── Hero / banner ─────────────────────────────────── */}
        <div className="relative w-full overflow-hidden bg-slate-950" style={{ minHeight: "min(52vh, 480px)" }}>
          {blog.imageUrl ? (
            <>
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/50 to-slate-950/90" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-900 to-slate-950" />
          )}

          <div className="container-page relative flex flex-col justify-end pb-10 pt-20" style={{ minHeight: "min(52vh, 480px)" }}>
            {/* Back link */}
            <Link
              href="/blogs"
              className="mb-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Back to blogs
            </Link>

            {/* Category badge */}
            <span className={`mb-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ring-1 ${catClass}`}>
              {catLabel}
            </span>

            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                {blog.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              {dateStr && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden />
                  {dateStr}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden />
                {mins} min read
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" aria-hidden />
                {paragraphs.length} section{paragraphs.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── Body layout ───────────────────────────────────── */}
        <div className="container-page py-12">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_280px]">

            {/* Article body */}
            <article ref={articleRef} className="min-w-0">
              {/* Action bar */}
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <VoteButtons
                  blogId={blog.id as number}
                  initialUp={voteUp}
                  initialDown={voteDown}
                  userVote={userVote}
                  canVote={canVote}
                />
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-95"
                >
                  <Share2 className="h-4 w-4" aria-hidden />
                  {copied ? "Link copied!" : "Share"}
                </button>
              </div>

              {/* Prose content */}
              <div className="space-y-6 text-base leading-8 text-slate-700">
                {paragraphs.map((para, i) => {
                  /* Treat short all-caps / title-case lines as section headings */
                  const isHeading = para.length < 100 && /^[A-Z]/.test(para) && !para.endsWith(".");
                  if (isHeading && i > 0) {
                    return (
                      <h2
                        key={i}
                        id={`section-${i}`}
                        className="pt-4 text-xl font-bold tracking-tight text-slate-900 md:text-2xl"
                      >
                        {para}
                      </h2>
                    );
                  }
                  return (
                    <p key={i} className="text-slate-700">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Bottom disclaimer */}
              <div className="mt-12 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                <p className="font-semibold">Medical disclaimer</p>
                <p className="mt-1">
                  This article is for informational purposes only and does not replace professional medical advice,
                  diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
                </p>
              </div>

              {/* CTA block */}
              <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-br from-brand-50 to-teal-50 p-8 ring-1 ring-brand-100 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-slate-900">Have health concerns?</p>
                  <p className="mt-1 text-sm text-slate-600">Ask AfiyaPal&apos;s AI assistant for first-step guidance.</p>
                </div>
                <Link
                  href="/chatbot"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 hover:shadow-lg active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Ask AfiyaPal
                </Link>
              </div>
            </article>

            {/* ── Sticky sidebar ─────────────────────────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-20 space-y-6">

                {/* About this article */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">About this article</p>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${catClass}`}>{catLabel}</span>
                    </li>
                    {dateStr && (
                      <li className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                        {dateStr}
                      </li>
                    )}
                    <li className="flex items-center gap-2 text-xs">
                      <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden />
                      {mins} min read
                    </li>
                  </ul>
                </div>

                {/* Reading progress card */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Reading progress</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-teal-500 motion-safe:transition-all motion-safe:duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs text-slate-400">{Math.round(progress)}% read</p>
                </div>

                {/* Quick links */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Explore more</p>
                  <ul className="space-y-2.5">
                    <li>
                      <Link href="/blogs" className="flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-brand-700">
                        <BookOpen className="h-4 w-4 text-brand-400" aria-hidden />
                        More health articles
                      </Link>
                    </li>
                    <li>
                      <Link href="/chatbot" className="flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-brand-700">
                        <MessageCircle className="h-4 w-4 text-brand-400" aria-hidden />
                        Ask the AI assistant
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
