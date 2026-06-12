import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredBlogs } from "../data/home-content";

const categoryColors: Record<string, string> = {
  nutrition: "bg-lime-50 text-lime-700 ring-lime-100",
  sleep: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  mental: "bg-purple-50 text-purple-700 ring-purple-100"
};

const blogCategories = ["nutrition", "sleep", "mental"];

export function FeaturedBlogsSection() {
  return (
    <section className="container-page py-20 md:py-24">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-xl">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">Learn</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Top articles &amp; blogs</h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Practical health education you can trust — written for everyday questions.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/blogs">See all blogs</Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {featuredBlogs.map((blog, i) => {
          const cat = blogCategories[i] ?? "nutrition";
          const catStyle = categoryColors[cat] ?? categoryColors.nutrition;
          return (
            <article
              key={blog.slug}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-md outline-none motion-safe:transition motion-safe:duration-300 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-2xl hover:shadow-brand-500/10 motion-reduce:hover:translate-y-0 focus-within:ring-2 focus-within:ring-brand-400 focus-within:ring-offset-2"
            >
              <Link href={`/blogs/${blog.slug}`} className="relative block h-56 overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent opacity-80 motion-safe:transition-opacity group-hover:opacity-95" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-800 shadow-sm backdrop-blur-sm motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-y-[-2px]">
                  Read article <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
                {/* Category badge */}
                <span className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 capitalize ${catStyle} backdrop-blur-sm`}>
                  {cat}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 motion-safe:transition group-hover:text-brand-800">{blog.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{blog.excerpt}</p>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 underline-offset-4 motion-safe:transition hover:gap-2 hover:text-brand-800 hover:underline"
                >
                  Continue reading <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
