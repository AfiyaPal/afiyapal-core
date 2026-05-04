import Link from "next/link";
import { routes } from "@/lib/routes";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { getAdminAiFlags, type AiFlagFilters } from "@/features/admin/queries/get-admin-ai-flags";
import { AI_FLAG_CATEGORIES, AI_FLAG_PRIORITIES, AI_FLAG_STATUSES, AI_FLAG_TRIGGERS } from "@/server/services/ai-safety-flag-service";

type AiFlagRow = Awaited<ReturnType<typeof getAdminAiFlags>>["flags"][number];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function label(value: string) {
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function statusTone(status: string) {
  if (status === "ESCALATED") return "red" as const;
  if (status === "RESOLVED") return "green" as const;
  if (status === "IN_REVIEW") return "blue" as const;
  return "amber" as const;
}

function priorityTone(priority: string) {
  if (priority === "CRITICAL") return "red" as const;
  if (priority === "HIGH") return "amber" as const;
  if (priority === "MEDIUM") return "blue" as const;
  return "slate" as const;
}

export async function AdminAiFlagsPage({ filters }: { filters: AiFlagFilters }) {
  const data = await getAdminAiFlags(filters);

  const columns: readonly AdminTableColumn<AiFlagRow>[] = [
    { key: "date", header: "Date", render: (flag) => <span className="text-slate-600">{formatDateTime(flag.createdAt)}</span> },
    {
      key: "flag",
      header: "Flag",
      render: (flag) => (
        <div>
          <Link href={`${routes.adminAiFlags}/${flag.id}`} className="font-black text-slate-950 transition hover:text-brand-700">
            {flag.title}
          </Link>
          <p className="mt-1 text-xs font-semibold text-slate-500">{label(flag.category)} · {label(flag.trigger)}</p>
        </div>
      )
    },
    {
      key: "user",
      header: "User",
      render: (flag) =>
        flag.user ? (
          <div>
            <Link href={`${routes.adminUsers}/${flag.user.id}`} className="font-bold text-slate-800 transition hover:text-brand-700">{flag.user.username}</Link>
            <p className="mt-1 text-xs text-slate-500">{flag.user.email}</p>
          </div>
        ) : (
          <span className="font-semibold text-slate-500">Guest or unavailable</span>
        )
    },
    { key: "priority", header: "Priority", render: (flag) => <AdminStatusBadge tone={priorityTone(flag.priority)}>{flag.priority}</AdminStatusBadge> },
    { key: "status", header: "Status", render: (flag) => <AdminStatusBadge tone={statusTone(flag.status)}>{label(flag.status)}</AdminStatusBadge> },
    {
      key: "reviewer",
      header: "Reviewer",
      render: (flag) => flag.assignedReviewer ? <span className="font-semibold text-slate-700">{flag.assignedReviewer.username}</span> : <span className="text-slate-500">Unassigned</span>
    },
    {
      key: "escalation",
      header: "Escalated",
      render: (flag) => <AdminStatusBadge tone={flag.escalatedConsultationRequestId ? "red" : "slate"}>{flag.escalatedConsultationRequestId ? "Yes" : "No"}</AdminStatusBadge>
    },
    {
      key: "actions",
      header: "Actions",
      render: (flag) => (
        <Link href={`${routes.adminAiFlags}/${flag.id}`} className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
          Review safely
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="AI safety flags"
        title="Review risky AI health interactions"
        description="Automatically detect emergency symptoms, mental health crisis language, pregnancy or child high-risk cases, low-confidence responses, user-reported issues, and repeated unresolved symptoms."
      />
      <AdminFilters
        filters={[
          { key: "search", label: "Search", type: "search", placeholder: "Search flag title, notes, or summary..." },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, ...AI_FLAG_STATUSES.map((status) => ({ value: status, label: label(status) }))] },
          { key: "priority", label: "Priority", type: "select", options: [{ value: "", label: "All priorities" }, ...AI_FLAG_PRIORITIES.map((priority) => ({ value: priority, label: label(priority) }))] },
          { key: "category", label: "Category", type: "select", options: [{ value: "", label: "All categories" }, ...AI_FLAG_CATEGORIES.map((category) => ({ value: category, label: label(category) }))] },
          { key: "trigger", label: "Trigger", type: "select", options: [{ value: "", label: "All triggers" }, ...AI_FLAG_TRIGGERS.map((trigger) => ({ value: trigger, label: label(trigger) }))] },
          { key: "startDate", label: "Start date", type: "date" },
          { key: "endDate", label: "End date", type: "date" }
        ]}
        values={filters}
        submitLabel="Filter flags"
      />
      <AdminDataTable title={`AI safety flags (${data.total})`} description={`Showing up to ${data.pageSize} most recent AI safety flags that match the current filters.`} columns={columns} rows={data.flags} emptyMessage="No AI safety flags match the current filters." />
    </div>
  );
}
