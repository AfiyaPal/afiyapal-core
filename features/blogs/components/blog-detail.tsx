import { JsonLd } from "@/components/seo/json-ld";
import { VoteButtons } from "@/features/doctor/components/vote-buttons";
import { articleSchema } from "@/lib/seo/schema";
import type { BlogDetailModel } from "../types/blog";

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
  return (
    <main className="container-page max-w-4xl py-12">
      <JsonLd
        data={articleSchema({
          title: blog.title,
          description: blog.excerpt,
          path: `/blogs/${blog.slug}`,
          image: blog.imageUrl,
          datePublished: blog.createdAt ? new Date(blog.createdAt).toISOString() : null,
          category: blog.category
        })}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm font-semibold text-slate-500">
        <a href="/" className="hover:text-brand-700">Home</a> <span aria-hidden="true">/</span> <a href="/blogs" className="hover:text-brand-700">Blogs</a>
      </nav>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-700">{blog.category ?? "Health education"}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">{blog.title}</h1>
      <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        This article is educational and does not replace a clinician. For severe symptoms, seek urgent local medical care immediately.
      </p>
      <div className="mt-6 flex items-center gap-4" aria-label="Article feedback">
        <VoteButtons blogId={blog.id as number} initialUp={voteUp} initialDown={voteDown} userVote={userVote} canVote={canVote} />
      </div>
      <article className="prose prose-slate mt-8 max-w-none leading-8">
        {blog.content.split("\n").filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
      <aside className="mt-10 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm" aria-labelledby="article-safety-title">
        <h2 id="article-safety-title" className="text-lg font-black text-slate-950">Health safety reminder</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use this article as a learning resource. If symptoms are severe, persistent, or worrying, speak with a qualified healthcare professional or visit a nearby facility.
        </p>
      </aside>
    </main>
  );
}
