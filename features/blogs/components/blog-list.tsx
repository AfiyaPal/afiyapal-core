import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import type { BlogSummary } from "../types/blog";

export function BlogList({ blogs }: { blogs: BlogSummary[] }) {
  return (
    <main className="container-page py-12">
      <h1 className="text-4xl font-bold tracking-tight">Health education blogs</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Articles and resources to support informed health choices.</p>
      {blogs.length === 0 ? (
        <div className="mt-10"><EmptyState title="No blogs yet" description="Connect the database or seed sample blogs to show content here." /></div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              {blog.imageUrl ? <div className="relative h-56"><Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" /></div> : null}
              <div className="p-6">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
                <Link href={`/blogs/${blog.slug}`} className="mt-5 inline-block text-sm font-semibold text-brand-700">Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
