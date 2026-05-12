import Link from "next/link";
import { ARTICLE_CATEGORIES } from "@/features/admin/data/content-management";
import { DoctorBlogActions } from "./doctor-blog-actions";

const statusBadge: Record<string, { tone: string; label: string }> = {
  DRAFT: { tone: "bg-slate-50 text-slate-700 ring-slate-100", label: "Draft" },
  PENDING_REVIEW: { tone: "bg-amber-50 text-amber-700 ring-amber-100", label: "Pending Review" },
  PUBLISHED: { tone: "bg-emerald-50 text-brand-700 ring-emerald-100", label: "Published" },
  ARCHIVED: { tone: "bg-rose-50 text-rose-700 ring-rose-100", label: "Archived" }
};

type Blog = {
  id: number;
  title: string;
  slug: string;
  status: string;
  contentCategory: string;
  medicalReviewStatus: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string } | null;
  media: { mediaUrl: string; altText: string | null }[];
};

export function DoctorBlogList({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">My articles</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your health education blog posts.</p>
        </div>
        <Link href="/dashboard/blogs/new" className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700">
          Write new article
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-700">No articles yet</p>
          <p className="mt-1 text-sm text-slate-500">Start writing your first health education article.</p>
          <Link href="/dashboard/blogs/new" className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700">
            Write your first article
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
            <thead className="bg-emerald-50/70 text-xs uppercase tracking-wide text-brand-700">
              <tr>
                <th className="px-5 py-3 font-black">Title</th>
                <th className="px-5 py-3 font-black">Category</th>
                <th className="px-5 py-3 font-black">Status</th>
                <th className="px-5 py-3 font-black">Review</th>
                <th className="px-5 py-3 font-black">Updated</th>
                <th className="px-5 py-3 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {blogs.map((blog) => {
                const badge = statusBadge[blog.status] ?? statusBadge.DRAFT;
                const cat = ARTICLE_CATEGORIES.find((c) => c.value === blog.contentCategory);
                return (
                  <tr key={blog.id} className="transition hover:bg-emerald-50/40">
                    <td className="px-5 py-4">
                      <Link href={`/dashboard/blogs/${blog.id}`} className="font-bold text-slate-950 hover:text-brand-600">
                        {blog.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{cat?.label ?? blog.contentCategory}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${badge.tone}`}>{badge.label}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{blog.medicalReviewStatus.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</td>
                    <td className="px-5 py-4 text-slate-600">{new Date(blog.updatedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/blogs/${blog.id}/edit`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                          Edit
                        </Link>
                        <DoctorBlogActions blogId={blog.id} status={blog.status} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
