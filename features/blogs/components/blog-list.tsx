import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/schema";
import { EmptyState } from "@/components/shared/empty-state";
import type { BlogSummary } from "../types/blog";

export function BlogList({ blogs }: { blogs: BlogSummary[] }) {
  return (
    <main className="container-page py-12">
      <JsonLd
        data={[
          ...medicalWebPageSchema({
            path: "/blogs",
            title: "AfiyaPal Health Education Articles",
            description: "Plain-language healthcare education articles for African communities.",
            breadcrumbs: [{ name: "Blogs", path: "/blogs" }]
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" }
          ])
        ]}
      />
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-700">Healthcare education Africa</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Health education articles</h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-700">
          Evidence-aware, accessible health education from AfiyaPal covering prevention, everyday wellbeing, mental health, public health, and safe next steps.
        </p>
      </section>
      {blogs.length === 0 ? (
        <div className="mt-10"><EmptyState title="No blogs yet" description="Connect the database or seed sample blogs to show content here." /></div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog.id} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              {blog.imageUrl ? <div className="relative h-56"><Image src={blog.imageUrl} alt={blog.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" /></div> : null}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Health education</p>
                <h2 className="mt-2 text-xl font-bold">{blog.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{blog.excerpt}</p>
                <Link href={`/blogs/${blog.slug}`} className="mt-5 inline-block text-sm font-bold text-brand-700">Read article <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
