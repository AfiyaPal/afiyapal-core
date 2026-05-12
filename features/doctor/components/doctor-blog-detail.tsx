import Link from "next/link";
import { ARTICLE_CATEGORIES } from "@/features/admin/data/content-management";
import { VoteButtons } from "@/features/doctor/components/vote-buttons";

const statusBadge: Record<string, { tone: string; label: string }> = {
  DRAFT: { tone: "bg-slate-50 text-slate-700 ring-slate-100", label: "Draft" },
  PENDING_REVIEW: { tone: "bg-amber-50 text-amber-700 ring-amber-100", label: "Pending Review" },
  PUBLISHED: { tone: "bg-emerald-50 text-brand-700 ring-emerald-100", label: "Published" },
  ARCHIVED: { tone: "bg-rose-50 text-rose-700 ring-rose-100", label: "Archived" }
};

type BlogDetail = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  status: string;
  contentCategory: string;
  medicalReviewStatus: string;
  language: string;
  reviewNotes: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  category: { id: number; name: string } | null;
  media: { mediaUrl: string; altText: string | null; mediaType: string | null }[];
  comments: { id: number; comment: string; createdAt: Date; user: { username: string } }[];
};

export function DoctorBlogDetail({
  blog,
  voteUp,
  voteDown,
  userVote,
  canVote
}: {
  blog: BlogDetail;
  voteUp: number;
  voteDown: number;
  userVote: "UP" | "DOWN" | null;
  canVote: boolean;
}) {
  const badge = statusBadge[blog.status] ?? statusBadge.DRAFT;
  const cat = ARTICLE_CATEGORIES.find((c) => c.value === blog.contentCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/blogs" className="text-sm font-semibold text-brand-600 hover:text-brand-700">&larr; My articles</Link>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{blog.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${badge.tone}`}>{badge.label}</span>
            <span className="text-sm text-slate-500">{cat?.label ?? blog.contentCategory}</span>
            <span className="text-sm text-slate-500">Review: {blog.medicalReviewStatus.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</span>
          </div>
        </div>
        <Link
          href={`/dashboard/blogs/${blog.id}/edit`}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
        >
          Edit article
        </Link>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white px-5 py-3 shadow-sm">
        <VoteButtons blogId={blog.id} initialUp={voteUp} initialDown={voteDown} userVote={userVote} canVote={canVote} />
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
        <div className="prose prose-slate max-w-none">
          {blog.content.split("\n").map((line, i) => (
            <p key={i} className="mb-4 leading-relaxed text-slate-700">{line || "\u00A0"}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
