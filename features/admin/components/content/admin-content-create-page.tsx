import Link from "next/link";
import { routes } from "@/lib/routes";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminContentForm } from "@/features/admin/components/content/admin-content-form";

export function AdminContentCreatePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Create article"
          title="Create health education content"
          description="Draft English or Swahili AFIYAPAL content. Articles must be submitted for medical review before publication."
        />
        <Link href={routes.adminContent} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">Back to content</Link>
      </div>
      <AdminContentForm />
    </div>
  );
}
