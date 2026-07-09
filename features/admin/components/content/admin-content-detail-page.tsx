import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getAdminContentDetail } from "@/features/admin/queries/get-admin-content";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { articleCategoryLabel, articleLanguageLabel, articleStatusLabel, medicalReviewStatusLabel } from "@/features/admin/data/content-management";
import { approveArticleForPublishingAction, archiveArticleAction, publishArticleAction, rejectArticleAction, requestArticleChangesAction, submitArticleForReviewAction, unpublishArticleAction } from "@/features/admin/actions/admin-content-actions";

function formatDateTime(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusTone(status: string) {
  if (status === "PUBLISHED") return "green" as const;
  if (status === "PENDING_REVIEW") return "amber" as const;
  if (status === "ARCHIVED") return "slate" as const;
  return "blue" as const;
}

function reviewTone(status: string) {
  if (status === "APPROVED") return "green" as const;
  if (status === "PENDING") return "amber" as const;
  if (status === "REJECTED" || status === "CHANGES_REQUESTED") return "red" as const;
  return "slate" as const;
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-emerald-50/60 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-brand-700">{label}</p>
      <div className="mt-2 break-words text-sm font-bold text-slate-900">{value}</div>
    </div>
  );
}

export async function AdminContentDetailPage({ articleId }: { articleId: number }) {
  const article = await getAdminContentDetail(articleId);
  if (!article) notFound();
  const articleTags = (article as typeof article & { tags?: string | null }).tags ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Article detail"
          title={article.title}
          description="Medical-review metadata, publishing controls, and a safe article preview for the AFIYAPAL content workflow."
        />
        <div className="flex flex-wrap gap-2">
          <Link href={routes.adminContent} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">Back</Link>
          <Link href={`${routes.adminContent}/${article.id}/edit`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800">Edit</Link>
        </div>
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-emerald-100 pb-4">
          <AdminStatusBadge tone={statusTone(article.status)}>{articleStatusLabel(article.status)}</AdminStatusBadge>
          <AdminStatusBadge tone={reviewTone(article.medicalReviewStatus)}>{medicalReviewStatusLabel(article.medicalReviewStatus)}</AdminStatusBadge>
          <AdminStatusBadge tone="slate">{articleCategoryLabel(article.contentCategory)}</AdminStatusBadge>
          <AdminStatusBadge tone="slate">{articleLanguageLabel(article.language)}</AdminStatusBadge>
          {article.isOutdated ? <AdminStatusBadge tone="amber">Needs freshness review</AdminStatusBadge> : null}
          {articleTags ? <AdminStatusBadge tone="blue">Tagged</AdminStatusBadge> : null}
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Slug" value={article.slug} />
          <DetailItem label="Author" value={`${article.creator.username} (${article.creator.email})`} />
          <DetailItem label="Created" value={formatDateTime(article.createdAt)} />
          <DetailItem label="Updated" value={formatDateTime(article.updatedAt)} />
          <DetailItem label="Published" value={formatDateTime(article.publishedAt)} />
          <DetailItem label="Archived" value={formatDateTime(article.archivedAt)} />
          <DetailItem label="Reviewed by" value={article.reviewedBy ? `${article.reviewedBy.username} (${article.reviewedBy.email})` : "Not reviewed"} />
          <DetailItem label="Reviewed on" value={formatDateTime(article.reviewedAt)} />
          <DetailItem label="Featured image" value={article.imageUrl || "Not provided"} />
          <DetailItem label="Tags" value={articleTags || "No tags added"} />
        </div>
        {article.reviewNotes ? <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Review notes:</strong> {article.reviewNotes}</div> : null}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Publishing actions</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Content managers can move content through draft, review, published, and archived states. Publishing requires medical approval unless the actor also has review authority.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <form action={submitArticleForReviewAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-amber-600 px-4 py-2 text-sm font-black text-white transition hover:bg-amber-700">Submit for review</button></form>
            {article.status !== "PUBLISHED" ? <form action={publishArticleAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-black text-white transition hover:bg-brand-700">Publish</button></form> : <form action={unpublishArticleAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-slate-700 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800">Unpublish</button></form>}
            <form action={archiveArticleAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-700">Archive</button></form>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Medical review</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Medical reviewers can approve content for publication or request changes with review notes.</p>
          <form action={approveArticleForPublishingAction} className="mt-4 space-y-3">
            <input type="hidden" name="articleId" value={article.id} />
            <textarea name="reviewNotes" rows={3} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Optional approval notes" />
            <button className="rounded-full bg-brand-600 px-4 py-2 text-sm font-black text-white transition hover:bg-brand-700">Approve for publishing</button>
          </form>
          <form action={requestArticleChangesAction} className="mt-4 space-y-3">
            <input type="hidden" name="articleId" value={article.id} />
            <textarea name="reviewNotes" rows={3} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Required notes for requested changes" />
            <button className="rounded-full bg-amber-600 px-4 py-2 text-sm font-black text-white transition hover:bg-amber-700">Request changes</button>
          </form>
          <form action={rejectArticleAction} className="mt-4 space-y-3">
            <input type="hidden" name="articleId" value={article.id} />
            <textarea name="reviewNotes" rows={3} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-600" placeholder="Reason for rejection" />
            <button className="rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-700">Reject article</button>
          </form>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Privacy-safe content preview</h2>
        <p className="mt-1 text-sm text-slate-600">This preview shows article content only, not user health conversations or private AI logs.</p>
        {article.excerpt ? <p className="mt-4 rounded-2xl bg-emerald-50/70 p-4 text-sm font-semibold leading-6 text-slate-700">{article.excerpt}</p> : null}
        <div className="prose prose-slate mt-5 max-w-none whitespace-pre-wrap text-sm leading-7 text-slate-700">{article.content}</div>
      </section>
    </div>
  );
}
