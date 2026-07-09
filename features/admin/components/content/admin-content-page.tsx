import Link from "next/link";
import { routes } from "@/lib/routes";
import { getAdminContent } from "@/features/admin/queries/get-admin-content";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { ARTICLE_CATEGORIES, ARTICLE_LANGUAGES, ARTICLE_STATUSES, MEDICAL_REVIEW_STATUSES, articleCategoryLabel, articleLanguageLabel, articleStatusLabel, medicalReviewStatusLabel } from "@/features/admin/data/content-management";
import { archiveArticleAction, publishArticleAction, submitArticleForReviewAction, unpublishArticleAction } from "@/features/admin/actions/admin-content-actions";

type SearchParams = { search?: string; status?: string; category?: string; language?: string; reviewStatus?: string; freshness?: string };
type ArticleRow = Awaited<ReturnType<typeof getAdminContent>>["articles"][number];

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
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

function ArticleActionButtons({ article }: { article: ArticleRow }) {
  return (
    <div className="flex min-w-56 flex-wrap gap-2">
      <Link href={`${routes.adminContent}/${article.id}`} className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">View</Link>
      <Link href={`${routes.adminContent}/${article.id}/edit`} className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">Edit</Link>
      {article.status === "DRAFT" || article.medicalReviewStatus === "CHANGES_REQUESTED" ? (
        <form action={submitArticleForReviewAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-amber-600 px-3 py-1.5 text-xs font-black text-white transition hover:bg-amber-700">Submit</button></form>
      ) : null}
      {article.status !== "PUBLISHED" ? (
        <form action={publishArticleAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-black text-white transition hover:bg-brand-700">Publish</button></form>
      ) : (
        <form action={unpublishArticleAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-black text-white transition hover:bg-slate-800">Unpublish</button></form>
      )}
      {article.status !== "ARCHIVED" ? (
        <form action={archiveArticleAction}><input type="hidden" name="articleId" value={article.id} /><button className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-black text-white transition hover:bg-rose-700">Archive</button></form>
      ) : null}
    </div>
  );
}

export async function AdminContentPage({ searchParams }: { searchParams: SearchParams }) {
  const data = await getAdminContent(searchParams);

  const columns: readonly AdminTableColumn<ArticleRow>[] = [
    {
      key: "article",
      header: "Article",
      render: (article) => {
        const tags = ((article as ArticleRow & { tags?: string | null }).tags ?? "")
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean)
          .slice(0, 4);

        return (
          <div>
            <Link href={`${routes.adminContent}/${article.id}`} className="font-black text-slate-950 transition hover:text-brand-700">{article.title}</Link>
            <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-slate-500">{article.excerpt ?? article.content.slice(0, 140)}</p>
            {tags.length > 0 ? (
              <div className="mt-2 flex max-w-md flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-500 ring-1 ring-slate-100">#{tag}</span>
                ))}
              </div>
            ) : null}
            {article.isOutdated ? <p className="mt-2 text-xs font-black text-amber-700">Review reminder: older than 6 months.</p> : null}
          </div>
        );
      }
    },
    { key: "status", header: "Status", render: (article) => <AdminStatusBadge tone={statusTone(article.status)}>{articleStatusLabel(article.status)}</AdminStatusBadge> },
    { key: "review", header: "Medical review", render: (article) => <AdminStatusBadge tone={reviewTone(article.medicalReviewStatus)}>{medicalReviewStatusLabel(article.medicalReviewStatus)}</AdminStatusBadge> },
    { key: "category", header: "Category", render: (article) => <span className="font-semibold text-slate-700">{articleCategoryLabel(article.contentCategory)}</span> },
    { key: "language", header: "Language", render: (article) => <span className="font-semibold text-slate-700">{articleLanguageLabel(article.language)}</span> },
    { key: "updated", header: "Updated", render: (article) => <span className="text-slate-600">{formatDate(article.updatedAt)}</span> },
    { key: "actions", header: "Actions", render: (article) => <ArticleActionButtons article={article} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Content management"
          title="Manage AFIYAPAL health articles"
          description="Create, edit, medically review, publish, unpublish, archive, and refresh English/Swahili health education content. Outdated published articles are flagged after 6 months without review."
        />
        <Link href={routes.adminContentNew} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800">Create article</Link>
      </div>

      <AdminFilters
        filters={[
          { key: "search", label: "Search", type: "search", placeholder: "Search by title, slug, or excerpt..." },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, ...ARTICLE_STATUSES.map((status) => ({ value: status, label: articleStatusLabel(status) }))] },
          { key: "category", label: "Category", type: "select", options: [{ value: "", label: "All categories" }, ...ARTICLE_CATEGORIES] },
          { key: "language", label: "Language", type: "select", options: [{ value: "", label: "All languages" }, ...ARTICLE_LANGUAGES] },
          { key: "reviewStatus", label: "Review", type: "select", options: [{ value: "", label: "All review states" }, ...MEDICAL_REVIEW_STATUSES.map((status) => ({ value: status, label: medicalReviewStatusLabel(status) }))] },
          { key: "freshness", label: "Freshness", type: "select", options: [{ value: "", label: "All content" }, { value: "outdated", label: "Needs review" }] }
        ]}
        values={searchParams}
        submitLabel="Filter content"
      />

      <AdminDataTable title={`Articles (${data.articles.length} shown / ${data.total} total)`} description={`Showing up to ${data.pageSize} articles matching the current filters.`} columns={columns} rows={data.articles} emptyMessage="No content matches the current filters." />
    </div>
  );
}
