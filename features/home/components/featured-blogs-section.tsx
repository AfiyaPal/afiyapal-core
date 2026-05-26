import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { featuredBlogs } from "../data/home-content";

export function FeaturedBlogsSection() {
  return (
    <section className="container-page py-20" aria-labelledby="featured-blogs-title">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Health knowledge hub</p>
          <h2 id="featured-blogs-title" className="mt-2 text-3xl font-black tracking-tight">Featured health education articles</h2>
          <p className="mt-2 max-w-2xl text-slate-600">Search-friendly, plain-language healthcare education covering prevention, wellbeing, and practical everyday choices.</p>
        </div>
        <Button asChild className="w-fit"><Link href="/blogs">See all blogs</Link></Button>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {featuredBlogs.map((blog) => (
          <article key={blog.slug} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="relative h-56"><Image src={blog.image} alt={blog.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" /></div>
            <div className="p-6">
              <h3 className="text-xl font-bold">{blog.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
              <Link href={`/blogs/${blog.slug}`} className="mt-5 inline-block text-sm font-bold text-brand-700">Read more <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
