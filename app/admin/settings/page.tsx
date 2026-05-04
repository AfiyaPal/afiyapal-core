import Link from "next/link";
import { routes } from "@/lib/routes";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";

export default async function AdminSettingsPage() {
  await requireAnyAdminPermission(adminModulePermissions.settings);

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Admin settings"
        title="Configure safety and support defaults"
        description="Stage 2 settings focus on practical health-safety controls, support resources, and governance defaults. More platform-level settings can be added here as the product matures."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Link href={routes.adminMentalHealthResources} className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Mental health</p>
          <h2 className="mt-3 text-xl font-black text-slate-950">Support resources</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Manage hotline names, countries, phone numbers, websites, descriptions, and active/inactive status.</p>
        </Link>

        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Safety copy</p>
          <h2 className="mt-3 text-xl font-black text-slate-950">Emergency guidance</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Placeholder for future editable emergency text, AI disclaimers, and escalation language.</p>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-700">Governance</p>
          <h2 className="mt-3 text-xl font-black text-slate-950">Review rules</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Placeholder for content review intervals, doctor verification requirements, and supported languages.</p>
        </div>
      </div>
    </div>
  );
}
