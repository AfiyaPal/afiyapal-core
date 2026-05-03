import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { featuredBlogs } from "../data/home-content";

export function FeaturedBlogsSection() {
  return (
    <section className="container-page py-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Top articles and blogs</h2>
          <p className="mt-2 text-slate-600">Useful health education articles migrated from the Django homepage.</p>
        </div>
        <Button asChild className="w-fit"><Link href="/blogs">See all blogs</Link></Button>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {featuredBlogs.map((blog) => (
          <article key={blog.slug} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <div className="relative h-56"><Image src={blog.image} alt={blog.title} fill className="object-cover" /></div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
              <Link href={`/blogs/${blog.slug}`} className="mt-5 inline-block text-sm font-semibold text-brand-700">Read more →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
