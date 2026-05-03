import type { BlogDetailModel } from "../types/blog";

export function BlogDetail({ blog }: { blog: BlogDetailModel }) {
  return (
    <main className="container-page max-w-4xl py-12">
      <p className="text-sm font-semibold text-brand-700">{blog.category ?? "Health education"}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{blog.title}</h1>
      <article className="prose prose-slate mt-8 max-w-none leading-8">
        {blog.content.split("\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
    </main>
  );
}
