import Link from "next/link";
import { routes } from "@/lib/routes";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { getAdminSafetyReports, type SafetyReportFilters } from "@/features/admin/queries/get-admin-reports";
import {
  SAFETY_REPORT_PRIORITIES,
  SAFETY_REPORT_STATUSES,
  SAFETY_REPORT_TYPES,
  safetyReportPriorityLabel,
  safetyReportPriorityTone,
  safetyReportStatusLabel,
  safetyReportStatusTone,
  safetyReportTypeLabel
} from "@/features/admin/data/report-management";

export type SafetyReportRow = Awaited<ReturnType<typeof getAdminSafetyReports>>["reports"][number];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function truncate(value: string | null | undefined, limit = 110) {
  if (!value) return "No summary provided.";
  return value.length > limit ? `${value.slice(0, limit - 1).trim()}…` : value;
}

export async function AdminReportsPage({ filters }: { filters: SafetyReportFilters }) {
  const data = await getAdminSafetyReports(filters);

  const columns: readonly AdminTableColumn<SafetyReportRow>[] = [
    { key: "date", header: "Date", render: (report) => <span className="text-slate-600">{formatDateTime(report.createdAt)}</span> },
    {
      key: "report",
      header: "Report",
      render: (report) => (
        <div className="min-w-72">
          <Link href={`${routes.adminReports}/${report.id}`} className="font-black text-slate-950 transition hover:text-brand-700">
            {report.title}
          </Link>
          <p className="mt-1 text-xs leading-5 text-slate-500">{truncate(report.summary)}</p>
          <p className="mt-1 text-xs font-bold text-brand-700">{safetyReportTypeLabel(report.type)}</p>
        </div>
      )
    },
    {
      key: "reporter",
      header: "Reporter",
      render: (report) =>
        report.reporter ? (
          <div>
            <Link href={`${routes.adminUsers}/${report.reporter.id}`} className="font-bold text-slate-800 transition hover:text-brand-700">{report.reporter.username}</Link>
            <p className="mt-1 text-xs text-slate-500">{report.reporter.email}</p>
          </div>
        ) : (
          <span className="font-semibold text-slate-500">Anonymous/system</span>
        )
    },
    { key: "priority", header: "Priority", render: (report) => <AdminStatusBadge tone={safetyReportPriorityTone(report.priority)}>{safetyReportPriorityLabel(report.priority)}</AdminStatusBadge> },
    { key: "status", header: "Status", render: (report) => <AdminStatusBadge tone={safetyReportStatusTone(report.status)}>{safetyReportStatusLabel(report.status)}</AdminStatusBadge> },
    {
      key: "assigned",
      header: "Assigned admin",
      render: (report) => report.assignedAdmin ? <span className="font-semibold text-slate-700">{report.assignedAdmin.username}</span> : <span className="text-slate-500">Unassigned</span>
    },
    {
      key: "actions",
      header: "Actions",
      render: (report) => (
        <Link href={`${routes.adminReports}/${report.id}`} className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
          Review report
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Reports and safety center"
        title="Review platform reports and safety incidents"
        description="Handle AI response reports, doctor reports, user reports, content reports, platform issues, and safety incidents with priority, assignment, action history, and resolution notes."
      />
      <AdminFilters
        filters={[
          { key: "search", label: "Search", type: "search", placeholder: "Search title, summary, or resolution notes..." },
          { key: "type", label: "Type", type: "select", options: [{ value: "", label: "All report types" }, ...SAFETY_REPORT_TYPES.map((type) => ({ value: type, label: safetyReportTypeLabel(type) }))] },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, ...SAFETY_REPORT_STATUSES.map((status) => ({ value: status, label: safetyReportStatusLabel(status) }))] },
          { key: "priority", label: "Priority", type: "select", options: [{ value: "", label: "All priorities" }, ...SAFETY_REPORT_PRIORITIES.map((priority) => ({ value: priority, label: safetyReportPriorityLabel(priority) }))] },
          { key: "assignment", label: "Assignment", type: "select", options: [{ value: "", label: "Assigned or unassigned" }, { value: "assigned", label: "Assigned" }, { value: "unassigned", label: "Unassigned" }] },
          { key: "startDate", label: "Start date", type: "date" },
          { key: "endDate", label: "End date", type: "date" }
        ]}
        values={filters}
        submitLabel="Filter reports"
      />
      <AdminDataTable title={`Safety reports (${data.total})`} description={`Showing up to ${data.pageSize} most recent reports matching the current filters.`} columns={columns} rows={data.reports} emptyMessage="No safety reports match the current filters." />
    </div>
  );
}
