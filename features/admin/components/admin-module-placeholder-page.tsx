import Link from "next/link";
import { AdminDataTable, type AdminTableColumn } from "./admin-data-table";
import { AdminFilters, reusableAdminFilters, type AdminFilterConfig } from "./admin-filters";
import { AdminStatusBadge } from "./admin-status-badge";
import { adminModules, type AdminModuleKey } from "@/features/admin/data/admin-scope";

type AdminModule = (typeof adminModules)[number];
type ModuleChecklistRow = { item: string; status: string; owner: string };

const moduleFilterMap: Partial<Record<AdminModuleKey, readonly AdminFilterConfig[]>> = {
  users: [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.role, reusableAdminFilters.dateRange],
  doctors: [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.language, reusableAdminFilters.dateRange],
  "symptom-checks": [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.language, reusableAdminFilters.dateRange],
  "ai-flags": [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.urgency, reusableAdminFilters.dateRange],
  content: [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.language, reusableAdminFilters.dateRange],
  consultations: [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.urgency, reusableAdminFilters.language],
  reports: [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.urgency, reusableAdminFilters.dateRange],
  settings: [reusableAdminFilters.search, reusableAdminFilters.status]
};

const checklistColumns: readonly AdminTableColumn<ModuleChecklistRow>[] = [
  { key: "item", header: "MVP capability", render: (row) => <span className="font-semibold text-slate-900">{row.item}</span> },
  { key: "status", header: "Status", render: (row) => <AdminStatusBadge tone="amber">{row.status}</AdminStatusBadge> },
  { key: "owner", header: "Primary owner", render: (row) => row.owner }
];

function getModuleOwner(moduleKey: AdminModuleKey) {
  if (moduleKey === "doctors") return "Doctor Manager";
  if (moduleKey === "ai-flags" || moduleKey === "symptom-checks") return "Medical Reviewer";
  if (moduleKey === "content") return "Content Manager";
  if (moduleKey === "consultations" || moduleKey === "reports") return "Support Admin";
  if (moduleKey === "settings") return "Super Admin";
  return "Super Admin / Support Admin";
}

export function getAdminModuleByKey(key: AdminModule["key"]) {
  return adminModules.find((module) => module.key === key);
}

export function AdminModulePlaceholderPage({ module }: { module: AdminModule }) {
  const filters = moduleFilterMap[module.key] ?? [reusableAdminFilters.search, reusableAdminFilters.status, reusableAdminFilters.dateRange];
  const rows = module.mvpIncludes.map((item) => ({ item, status: "Ready for data integration", owner: getModuleOwner(module.key) }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <Link href="/admin" className="text-sm font-bold text-brand-700 hover:text-brand-600">← Back to overview</Link>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-brand-700">Stage 2 admin module</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{module.name}</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">{module.summary}</p>
      </div>
      <AdminFilters filters={filters} />
      <AdminDataTable title={`${module.name} MVP table shell`} description="Reusable admin table structure for this module. Later phases will connect this table to real database records and protected actions." columns={checklistColumns} rows={rows} />
    </div>
  );
}
