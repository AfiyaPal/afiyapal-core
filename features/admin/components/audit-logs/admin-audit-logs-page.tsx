import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters, type AdminFilterConfig } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { ADMIN_AUDIT_ACTIONS, ADMIN_AUDIT_TARGET_TYPES, adminAuditActionLabels, adminAuditTargetLabels } from "@/features/admin/data/admin-audit-log";
import type { AdminAuditLogFilters } from "@/features/admin/queries/get-admin-audit-logs";
import { getRoleLabel } from "@/server/auth/roles";

type AuditLogRow = Awaited<ReturnType<typeof import("@/features/admin/queries/get-admin-audit-logs").getAdminAuditLogs>>["logs"][number];

type AdminOption = Awaited<ReturnType<typeof import("@/features/admin/queries/get-admin-audit-logs").getAdminAuditLogs>>["admins"][number];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

function truncate(value: string | null, length = 80) {
  if (!value) return "—";
  return value.length > length ? `${value.slice(0, length - 1).trim()}…` : value;
}

function buildFilters(values: AdminAuditLogFilters, admins: AdminOption[]): AdminFilterConfig[] {
  return [
    { key: "search", label: "Search", type: "search", placeholder: "Search action, target, reason, old/new value..." },
    {
      key: "actionType",
      label: "Action",
      type: "select",
      options: [{ value: "", label: "All actions" }, ...ADMIN_AUDIT_ACTIONS.map((action) => ({ value: action, label: adminAuditActionLabels[action] }))]
    },
    {
      key: "targetType",
      label: "Target",
      type: "select",
      options: [{ value: "", label: "All target types" }, ...ADMIN_AUDIT_TARGET_TYPES.map((target) => ({ value: target, label: adminAuditTargetLabels[target] }))]
    },
    {
      key: "adminUserId",
      label: "Admin",
      type: "select",
      options: [
        { value: "", label: "All admins" },
        ...admins.map((admin) => ({ value: String(admin.id), label: `${admin.username} · ${getRoleLabel(admin.role)}` }))
      ]
    },
    { key: "startDate", label: "Start date", type: "date" },
    { key: "endDate", label: "End date", type: "date" }
  ];
}

const columns: AdminTableColumn<AuditLogRow>[] = [
  {
    key: "createdAt",
    header: "Timestamp",
    render: (row) => <span className="whitespace-nowrap text-xs font-semibold text-slate-600">{formatDate(row.createdAt)}</span>
  },
  {
    key: "admin",
    header: "Admin user",
    render: (row) => row.adminUser ? (
      <div>
        <p className="font-bold text-slate-950">{row.adminUser.username}</p>
        <p className="text-xs text-slate-500">{getRoleLabel(row.adminUser.role)}</p>
      </div>
    ) : <span className="text-slate-400">System / unavailable</span>
  },
  {
    key: "action",
    header: "Action",
    render: (row) => <AdminStatusBadge tone="blue">{adminAuditActionLabels[row.actionType as keyof typeof adminAuditActionLabels] ?? row.actionType}</AdminStatusBadge>
  },
  {
    key: "target",
    header: "Target",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{adminAuditTargetLabels[row.targetType as keyof typeof adminAuditTargetLabels] ?? row.targetType}</p>
        <p className="text-xs text-slate-500">ID: {row.targetId}</p>
      </div>
    )
  },
  {
    key: "change",
    header: "Change",
    render: (row) => (
      <div className="max-w-xl space-y-1 text-xs leading-5">
        <p><span className="font-bold text-slate-700">Old:</span> {truncate(row.oldValue)}</p>
        <p><span className="font-bold text-slate-700">New:</span> {truncate(row.newValue)}</p>
      </div>
    )
  },
  {
    key: "reason",
    header: "Reason",
    render: (row) => <span className="text-sm text-slate-600">{truncate(row.reason, 120)}</span>
  }
];

export function AdminAuditLogsPage({ data, filters }: { data: Awaited<ReturnType<typeof import("@/features/admin/queries/get-admin-audit-logs").getAdminAuditLogs>>; filters: AdminAuditLogFilters }) {
  const valueMap = Object.fromEntries(Object.entries(filters).filter(([, value]) => typeof value === "string")) as Record<string, string>;

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Super Admin only"
        title="Admin audit logs"
        description="Trace sensitive governance actions across users, doctors, articles, AI flags, consultations, and safety reports. These logs are intentionally read-only."
      />

      <AdminFilters filters={buildFilters(filters, data.admins)} values={valueMap} submitLabel="Filter audit logs" />

      <AdminDataTable
        title={`Audit trail (${data.total})`}
        description={`Showing latest ${data.pageSize} matching audit entries. Use filters to narrow by admin, action, target, or date.`}
        columns={columns}
        rows={data.logs}
        emptyMessage="No audit log entries found for the selected filters."
      />
    </div>
  );
}
