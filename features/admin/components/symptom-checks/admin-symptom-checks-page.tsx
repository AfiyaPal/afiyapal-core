import Link from "next/link";
import { routes } from "@/lib/routes";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { getAdminSymptomChecks, type SymptomCheckFilters } from "@/features/admin/queries/get-admin-symptom-checks";
import { SYMPTOM_RISK_LEVELS } from "@/server/services/symptom-check-logging-service";

type SymptomCheckRow = Awaited<ReturnType<typeof getAdminSymptomChecks>>["logs"][number];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function languageLabel(value: string | null | undefined) {
  if (value === "sw") return "Swahili";
  return "English";
}

function riskTone(riskLevel: string) {
  if (riskLevel === "EMERGENCY") return "red" as const;
  if (riskLevel === "HIGH") return "amber" as const;
  if (riskLevel === "MEDIUM") return "blue" as const;
  return "green" as const;
}

function statusTone(status: string) {
  if (status === "ESCALATED") return "red" as const;
  if (status === "REVIEWED") return "blue" as const;
  if (status === "FAILED") return "amber" as const;
  return "green" as const;
}

export async function AdminSymptomChecksPage({ filters }: { filters: SymptomCheckFilters }) {
  const data = await getAdminSymptomChecks(filters);

  const columns: readonly AdminTableColumn<SymptomCheckRow>[] = [
    { key: "date", header: "Date", render: (log) => <span className="text-slate-600">{formatDateTime(log.createdAt)}</span> },
    {
      key: "user",
      header: "User",
      render: (log) =>
        log.user ? (
          <div>
            <Link href={`${routes.adminUsers}/${log.user.id}`} className="font-black text-slate-950 transition hover:text-brand-700">
              {log.user.username}
            </Link>
            <p className="mt-1 text-xs text-slate-500">{log.user.email}</p>
          </div>
        ) : (
          <span className="font-semibold text-slate-500">Guest or unavailable</span>
        )
    },
    { key: "language", header: "Language", render: (log) => <span className="font-semibold text-slate-700">{languageLabel(log.language)}</span> },
    { key: "category", header: "Symptom category", render: (log) => <span className="font-semibold text-slate-700">{log.symptomCategory ?? "General symptoms"}</span> },
    { key: "risk", header: "Risk level", render: (log) => <AdminStatusBadge tone={riskTone(log.riskLevel)}>{log.riskLevel}</AdminStatusBadge> },
    { key: "escalation", header: "Escalation suggested", render: (log) => <AdminStatusBadge tone={log.escalationSuggested ? "amber" : "slate"}>{log.escalationSuggested ? "Yes" : "No"}</AdminStatusBadge> },
    { key: "status", header: "Status", render: (log) => <AdminStatusBadge tone={statusTone(log.status)}>{log.status}</AdminStatusBadge> },
    {
      key: "actions",
      header: "Actions",
      render: (log) => (
        <Link href={`${routes.adminSymptomChecks}/${log.id}`} className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
          View safe summary
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Symptom checker logs"
        title="Review AI symptom checker activity"
        description="Track every symptom checker request with risk level, language, category, escalation status, and privacy-safe summaries. Raw health conversations are not exposed by default."
      />
      <AdminFilters
        filters={[
          { key: "riskLevel", label: "Risk level", type: "select", options: [{ value: "", label: "All risk levels" }, ...SYMPTOM_RISK_LEVELS.map((risk) => ({ value: risk, label: risk }))] },
          { key: "language", label: "Language", type: "select", options: [{ value: "", label: "All languages" }, { value: "en", label: "English" }, { value: "sw", label: "Swahili" }] },
          { key: "startDate", label: "Start date", type: "date" },
          { key: "endDate", label: "End date", type: "date" },
          { key: "escalationSuggested", label: "Escalation", type: "select", options: [{ value: "", label: "All" }, { value: "true", label: "Escalation suggested" }, { value: "false", label: "No escalation" }] },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, { value: "COMPLETED", label: "Completed" }, { value: "REVIEWED", label: "Reviewed" }, { value: "ESCALATED", label: "Escalated" }, { value: "FAILED", label: "Failed" }] }
        ]}
        values={filters}
        submitLabel="Filter logs"
      />
      <AdminDataTable title={`Symptom checks (${data.total})`} description={`Showing up to ${data.pageSize} most recent symptom checker requests that match the current filters.`} columns={columns} rows={data.logs} emptyMessage="No symptom checker logs match the current filters." />
    </div>
  );
}
