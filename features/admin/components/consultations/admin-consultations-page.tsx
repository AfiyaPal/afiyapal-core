import Link from "next/link";
import { routes } from "@/lib/routes";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { getAdminConsultations, type ConsultationFilters } from "@/features/admin/queries/get-admin-consultations";
import { CONSULTATION_SPECIALTIES, CONSULTATION_STATUSES, CONSULTATION_URGENCY_LEVELS, consultationStatusLabel, consultationStatusTone, consultationUrgencyLabel, consultationUrgencyTone } from "@/features/admin/data/consultation-management";

export type ConsultationRow = Awaited<ReturnType<typeof getAdminConsultations>>["requests"][number];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function languageLabel(value: string | null | undefined) {
  if (value === "sw") return "Swahili";
  return "English";
}

function truncate(value: string, limit = 96) {
  return value.length > limit ? `${value.slice(0, limit - 1).trim()}…` : value;
}

export async function AdminConsultationsPage({ filters }: { filters: ConsultationFilters }) {
  const data = await getAdminConsultations(filters);

  const columns: readonly AdminTableColumn<ConsultationRow>[] = [
    { key: "date", header: "Date", render: (request) => <span className="text-slate-600">{formatDateTime(request.createdAt)}</span> },
    {
      key: "request",
      header: "Request",
      render: (request) => (
        <div className="min-w-72">
          <Link href={`${routes.adminConsultations}/${request.id}`} className="font-black text-slate-950 transition hover:text-brand-700">
            {truncate(request.reasonSummary)}
          </Link>
          <p className="mt-1 text-xs font-semibold text-slate-500">{request.requestedSpecialty || "General clinician"}</p>
          {request.countryRegion ? <p className="mt-1 text-xs text-slate-500">{request.countryRegion}</p> : null}
        </div>
      )
    },
    {
      key: "user",
      header: "User",
      render: (request) =>
        request.user ? (
          <div>
            <Link href={`${routes.adminUsers}/${request.user.id}`} className="font-bold text-slate-800 transition hover:text-brand-700">{request.user.username}</Link>
            <p className="mt-1 text-xs text-slate-500">{request.user.email}</p>
          </div>
        ) : (
          <span className="font-semibold text-slate-500">Guest or unavailable</span>
        )
    },
    { key: "language", header: "Language", render: (request) => <span className="font-semibold text-slate-700">{languageLabel(request.preferredLanguage)}</span> },
    { key: "urgency", header: "Urgency", render: (request) => <AdminStatusBadge tone={consultationUrgencyTone(request.urgencyLevel)}>{consultationUrgencyLabel(request.urgencyLevel)}</AdminStatusBadge> },
    { key: "status", header: "Status", render: (request) => <AdminStatusBadge tone={consultationStatusTone(request.status)}>{consultationStatusLabel(request.status)}</AdminStatusBadge> },
    {
      key: "doctor",
      header: "Assigned doctor",
      render: (request) => request.assignedDoctor ? <span className="font-semibold text-slate-700">{request.assignedDoctor.fullName}</span> : <span className="text-slate-500">Unassigned</span>
    },
    {
      key: "actions",
      header: "Actions",
      render: (request) => (
        <Link href={`${routes.adminConsultations}/${request.id}`} className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
          Manage request
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Consultation requests"
        title="Coordinate doctor connection requests"
        description="Review patient requests, prioritize urgent cases, assign verified doctors, update statuses, and keep internal care-coordination notes. Sensitive health context stays summarized by default."
      />
      <AdminFilters
        filters={[
          { key: "search", label: "Search", type: "search", placeholder: "Search reason, country, specialty, or notes..." },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, ...CONSULTATION_STATUSES.map((status) => ({ value: status, label: consultationStatusLabel(status) }))] },
          { key: "urgency", label: "Urgency", type: "select", options: [{ value: "", label: "All urgency levels" }, ...CONSULTATION_URGENCY_LEVELS.map((urgency) => ({ value: urgency, label: consultationUrgencyLabel(urgency) }))] },
          { key: "specialty", label: "Specialty", type: "select", options: [{ value: "", label: "All specialties" }, ...CONSULTATION_SPECIALTIES.map((specialty) => ({ value: specialty, label: specialty }))] },
          { key: "language", label: "Language", type: "select", options: [{ value: "", label: "All languages" }, { value: "en", label: "English" }, { value: "sw", label: "Swahili" }] },
          { key: "assignment", label: "Assignment", type: "select", options: [{ value: "", label: "Assigned or unassigned" }, { value: "assigned", label: "Assigned" }, { value: "unassigned", label: "Unassigned" }] }
        ]}
        values={filters}
        submitLabel="Filter requests"
      />
      <AdminDataTable title={`Consultation requests (${data.total})`} description={`Showing up to ${data.pageSize} most recent consultation requests that match the current filters.`} columns={columns} rows={data.requests} emptyMessage="No consultation requests match the current filters." />
    </div>
  );
}
