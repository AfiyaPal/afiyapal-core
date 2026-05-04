import { AdminDashboardCard } from "@/features/admin/components/admin-dashboard-card";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { adminTestingChecklistGroups, adminTestingSeedAccounts } from "@/features/admin/data/admin-testing-checklist";

const totalChecks = adminTestingChecklistGroups.reduce((sum, group) => sum + group.items.length, 0);
const requiredChecks = adminTestingChecklistGroups.reduce((sum, group) => sum + group.items.filter((item) => item.status === "Required").length, 0);
const regressionChecks = adminTestingChecklistGroups.reduce((sum, group) => sum + group.items.filter((item) => item.status === "Regression").length, 0);

export function AdminTestingChecklistPage() {
  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Phase 17"
        title="Testing checklist"
        description="A practical QA checklist for validating AFIYAPAL admin access, safety, privacy, workflow permissions, notifications, filters, and audit behavior before release."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminDashboardCard label="Total checks" value={String(totalChecks)} helper="Manual QA cases to complete before release." />
        <AdminDashboardCard label="Required checks" value={String(requiredChecks)} helper="Must pass before the admin dashboard is considered ready." />
        <AdminDashboardCard label="Regression checks" value={String(regressionChecks)} helper="Repeat these after future admin workflow changes." />
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Recommended local test accounts</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Create normal accounts through registration, then promote their roles/statuses in Prisma Studio for local QA. Do not ship shared production passwords.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {adminTestingSeedAccounts.map((account) => (
            <div key={account.role} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <p className="text-sm font-black text-slate-950">{account.role}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{account.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      {adminTestingChecklistGroups.map((group) => (
        <section key={group.title} className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <div className="border-b border-emerald-100 p-5">
            <h2 className="text-lg font-black text-slate-950">{group.title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{group.summary}</p>
          </div>
          <div className="divide-y divide-emerald-50">
            {group.items.map((item) => (
              <article key={item.id} className="grid gap-4 p-5 xl:grid-cols-[180px_1fr]">
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-700">{item.id}</p>
                  <AdminStatusBadge tone={item.status === "Required" ? "red" : item.status === "Regression" ? "amber" : "blue"}>{item.status}</AdminStatusBadge>
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-black text-slate-950">{item.title}</h3>
                  <div className="grid gap-3 text-sm leading-6 text-slate-600 lg:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-black text-slate-900">Setup</p>
                      <p className="mt-1">{item.setup}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-black text-slate-900">Action</p>
                      <p className="mt-1">{item.action}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50/70 p-4">
                      <p className="font-black text-slate-900">Expected result</p>
                      <p className="mt-1">{item.expectedResult}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50/70 p-4">
                      <p className="font-black text-slate-900">Evidence to capture</p>
                      <p className="mt-1">{item.evidence}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
