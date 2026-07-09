"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, BookOpen, Calendar, Clock, MessageCircle, Share2, Tag } from "lucide-react";
import { VoteButtons } from "@/features/doctor/components/vote-buttons";
import { articleSchema } from "@/lib/seo/schema";
import type { BlogDetailModel } from "../types/blog";

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
}

function titleCase(value: string | null | undefined) {
  if (!value) return "Health education";
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const CATEGORY_COLORS: Record<string, string> = {
  "general wellness": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "mental health": "bg-purple-50 text-purple-700 ring-purple-200",
  "maternal health": "bg-pink-50 text-pink-700 ring-pink-200",
  nutrition: "bg-lime-50 text-lime-700 ring-lime-200",
  "first aid": "bg-orange-50 text-orange-700 ring-orange-200",
  malaria: "bg-red-50 text-red-700 ring-red-200",
  "health education": "bg-brand-50 text-brand-700 ring-brand-200"
};

function categoryStyle(cat: string | null | undefined) {
  const key = (cat ?? "").replaceAll("_", " ").toLowerCase();
  return CATEGORY_COLORS[key] ?? "bg-slate-50 text-slate-700 ring-slate-200";
}

function estimateSections(content: string) {
  const markdownHeadings = content.match(/^#{2,3}\s+/gm)?.length ?? 0;
  if (markdownHeadings > 0) return markdownHeadings;
  return Math.max(1, content.split(/\n{2,}/).filter(Boolean).length);
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
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const mins = readingTime(blog.content);
  const dateStr = formatDate(blog.createdAt);
  const catLabel = titleCase(blog.category ?? blog.contentCategory);
  const catClass = categoryStyle(blog.category ?? blog.contentCategory);
  const tags = blog.tags ?? [];
  const persistedBlogId = typeof blog.id === "number" && blog.id > 0 ? blog.id : null;

  const jsonLd = useMemo(
    () => articleSchema({
      title: blog.title,
      description: blog.excerpt,
      path: `/blogs/${blog.slug}`,
      image: blog.imageUrl,
      datePublished: blog.createdAt ? new Date(blog.createdAt).toISOString() : null,
      dateModified: blog.createdAt ? new Date(blog.createdAt).toISOString() : null,
      category: catLabel
    }),
    [blog.title, blog.excerpt, blog.slug, blog.imageUrl, blog.createdAt, catLabel]
  );

  useEffect(() => {
    function onScroll() {
      const element = articleRef.current;
      if (!element) return;
      const { top, height } = element.getBoundingClientRect();
      const denominator = Math.max(1, height - window.innerHeight);
      const pct = Math.min(100, Math.max(0, (-top / denominator) * 100));
      setProgress(Number.isFinite(pct) ? pct : 0);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: blog.title, text: blog.excerpt, url }).catch(() => null);
      return;
    }

    await navigator.clipboard.writeText(url).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div
        className="fixed left-0 top-0 z-50 h-1 bg-gradient-to-r from-brand-500 via-accent-blue-500 to-accent-violet-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <main className="bg-white/35">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,163,107,0.35),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.28),transparent_32%)]" />
          {blog.imageUrl ? (
            <>
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/65 to-slate-950" />
            </>
          ) : null}

          <div className="container-page relative flex min-h-[520px] flex-col justify-end py-10 md:py-14">
            <Link
              href="/blogs"
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur-sm ring-1 ring-white/20 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to blogs
            </Link>

            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${catClass}`}>{catLabel}</span>
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-100 ring-1 ring-white/15">
                    <Tag className="h-3 w-3" aria-hidden />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {blog.title}
              </h1>

              {blog.excerpt ? <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{blog.excerpt}</p> : null}

              <div className="mt-7 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-300">
                {dateStr ? (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden />
                    {dateStr}
                  </span>
                ) : null}
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden />
                  {mins} min read
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" aria-hidden />
                  {estimateSections(blog.content)} section{estimateSections(blog.content) !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="container-page py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <article ref={articleRef} className="min-w-0 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/5 md:p-8 lg:p-10">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                {persistedBlogId ? (
                  <VoteButtons
                    blogId={persistedBlogId}
                    initialUp={voteUp}
                    initialDown={voteDown}
                    userVote={userVote}
                    canVote={canVote}
                  />
                ) : (
                  <p className="rounded-full bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600 ring-1 ring-slate-100">
                    Preview article
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md active:scale-95"
                >
                  <Share2 className="h-4 w-4" aria-hidden />
                  {copied ? "Link copied" : "Share"}
                </button>
              </div>

              <div className="blog-markdown max-w-none text-slate-700">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h2 className="mt-10 text-3xl font-black tracking-tight text-slate-950 first:mt-0">{children}</h2>,
                    h2: ({ children }) => <h2 className="mt-10 scroll-mt-24 text-2xl font-black tracking-tight text-slate-950">{children}</h2>,
                    h3: ({ children }) => <h3 className="mt-8 text-xl font-black tracking-tight text-slate-900">{children}</h3>,
                    p: ({ children }) => <p className="mt-5 text-base leading-8 text-slate-700">{children}</p>,
                    ul: ({ children }) => <ul className="mt-5 space-y-2 rounded-2xl bg-emerald-50/70 p-5 text-sm leading-7 text-slate-700 ring-1 ring-emerald-100">{children}</ul>,
                    ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 rounded-2xl bg-slate-50 p-5 pl-9 text-sm leading-7 text-slate-700 ring-1 ring-slate-100">{children}</ol>,
                    li: ({ children }) => <li className="ml-4 list-disc pl-1 marker:text-brand-600">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="mt-6 rounded-2xl border-l-4 border-brand-500 bg-brand-50 p-5 text-sm font-semibold leading-7 text-brand-900">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="font-black text-brand-700 underline underline-offset-4 hover:text-brand-800">{children}</a>,
                    strong: ({ children }) => <strong className="font-black text-slate-950">{children}</strong>,
                    img: ({ src, alt }) => src ? (
                      <span className="relative mt-8 block overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50 shadow-lg shadow-slate-900/5">
                        <Image src={String(src)} alt={alt ?? "Article image"} width={1280} height={720} className="h-auto w-full object-cover" />
                        {alt ? <span className="block px-4 py-3 text-xs font-semibold text-slate-500">{alt}</span> : null}
                      </span>
                    ) : null,
                    table: ({ children }) => <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100"><table className="w-full divide-y divide-slate-100 text-sm">{children}</table></div>,
                    th: ({ children }) => <th className="bg-slate-50 px-4 py-3 text-left font-black text-slate-900">{children}</th>,
                    td: ({ children }) => <td className="border-t border-slate-100 px-4 py-3 text-slate-700">{children}</td>
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>

              <div className="mt-12 rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                <p className="font-black">Medical disclaimer</p>
                <p className="mt-1">
                  This article is for informational purposes only and does not replace professional medical advice,
                  diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
                </p>
              </div>

              <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-gradient-to-br from-brand-50 to-accent-blue-50 p-8 ring-1 ring-brand-100 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-slate-900">Have health concerns?</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Ask AfiyaPal&apos;s AI assistant for first-step guidance, then seek clinical care when needed.</p>
                </div>
                <Link
                  href="/chatbot"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 hover:shadow-lg active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Ask AfiyaPal
                </Link>
              </div>
            </article>

            <aside className="lg:sticky lg:top-20">
              <div className="space-y-5">
                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">About this article</p>
                  <dl className="mt-4 space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="font-bold text-slate-500">Category</dt>
                      <dd><span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${catClass}`}>{catLabel}</span></dd>
                    </div>
                    {dateStr ? (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="font-bold text-slate-500">Published</dt>
                        <dd className="font-black text-slate-900">{dateStr}</dd>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-4">
                      <dt className="font-bold text-slate-500">Reading time</dt>
                      <dd className="font-black text-slate-900">{mins} min</dd>
                    </div>
                  </dl>
                </div>

                {tags.length > 0 ? (
                  <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Topics</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link key={tag} href={`/blogs?tag=${encodeURIComponent(tag)}`} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-100 transition hover:bg-brand-50 hover:text-brand-700">
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Reading progress</p>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-violet-500 transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs font-bold text-slate-400">{Math.round(progress)}% read</p>
                </div>

                <div className="rounded-[1.5rem] border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 shadow-sm">
                  <p className="font-black text-slate-950">Explore more health education</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Use filters on the blog list to discover more articles by category and tag.</p>
                  <Link href="/blogs" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-brand-700 underline-offset-4 hover:underline">
                    More articles <BookOpen className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
