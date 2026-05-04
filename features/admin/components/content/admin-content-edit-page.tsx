import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getAdminContentDetail } from "@/features/admin/queries/get-admin-content";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminContentForm } from "@/features/admin/components/content/admin-content-form";

export async function AdminContentEditPage({ articleId }: { articleId: number }) {
  const article = await getAdminContentDetail(articleId);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Edit article"
          title={article.title}
          description="Editing published content moves it back into review so medical quality is preserved before republishing."
        />
        <div className="flex flex-wrap gap-2">
          <Link href={`${routes.adminContent}/${article.id}`} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">Cancel</Link>
          <Link href={routes.adminContent} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">All content</Link>
        </div>
      </div>
      <AdminContentForm article={article} />
    </div>
  );
}
