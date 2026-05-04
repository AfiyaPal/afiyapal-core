import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters, type AdminFilterConfig } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { approveDoctorAction, rejectDoctorAction, suspendDoctorAction } from "@/features/admin/actions/admin-doctor-actions";
import { DOCTOR_VERIFICATION_STATUSES, doctorVerificationStatusLabels } from "@/features/admin/data/doctor-management";
import type { AdminDoctorFilters } from "@/features/admin/queries/get-admin-doctors";

type DoctorRow = Awaited<ReturnType<typeof import("@/features/admin/queries/get-admin-doctors").getAdminDoctors>>["doctors"][number];

const filters: AdminFilterConfig[] = [
  { key: "search", label: "Search", type: "search", placeholder: "Search doctor name, email, phone, license..." },
  { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, ...DOCTOR_VERIFICATION_STATUSES.map((status) => ({ value: status, label: doctorVerificationStatusLabels[status] }))] },
  { key: "specialty", label: "Specialty", type: "search", placeholder: "General, mental health, pediatric..." },
  { key: "language", label: "Language", type: "search", placeholder: "English, Swahili..." }
];

function toneForStatus(status: string) {
  if (status === "VERIFIED") return "green" as const;
  if (status === "PENDING") return "amber" as const;
  if (status === "REJECTED" || status === "SUSPENDED") return "red" as const;
  return "slate" as const;
}

const columns: AdminTableColumn<DoctorRow>[] = [
  { key: "doctor", header: "Doctor", render: (row) => <div><p className="font-bold text-slate-950">{row.fullName}</p><p className="text-xs text-slate-500">{row.email ?? row.phone ?? "No contact"}</p></div> },
  { key: "specialty", header: "Specialty", render: (row) => <span>{row.specialty ?? "General"}</span> },
  { key: "location", header: "Location", render: (row) => <span>{[row.cityRegion, row.country].filter(Boolean).join(", ") || "—"}</span> },
  { key: "languages", header: "Languages", render: (row) => <span>{row.languagesSpoken ?? "—"}</span> },
  { key: "status", header: "Status", render: (row) => <AdminStatusBadge tone={toneForStatus(row.verificationStatus)}>{doctorVerificationStatusLabels[row.verificationStatus as keyof typeof doctorVerificationStatusLabels] ?? row.verificationStatus}</AdminStatusBadge> },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="flex min-w-64 flex-col gap-2">
        <form action={approveDoctorAction}><input type="hidden" name="doctorId" value={row.id} /><button className="w-full rounded-full bg-brand-600 px-3 py-2 text-xs font-black text-white transition hover:bg-brand-700" type="submit">Approve</button></form>
        <form action={rejectDoctorAction} className="flex gap-2"><input type="hidden" name="doctorId" value={row.id} /><input name="reason" placeholder="Reason" className="min-w-0 flex-1 rounded-full border border-emerald-100 px-3 py-2 text-xs outline-none focus:border-brand-600" /><button className="rounded-full bg-amber-100 px-3 py-2 text-xs font-black text-amber-800" type="submit">Reject</button></form>
        <form action={suspendDoctorAction} className="flex gap-2"><input type="hidden" name="doctorId" value={row.id} /><input name="reason" placeholder="Reason" className="min-w-0 flex-1 rounded-full border border-emerald-100 px-3 py-2 text-xs outline-none focus:border-brand-600" /><button className="rounded-full bg-rose-100 px-3 py-2 text-xs font-black text-rose-700" type="submit">Suspend</button></form>
      </div>
    )
  }
];

export function AdminDoctorsPage({ data, values }: { data: Awaited<ReturnType<typeof import("@/features/admin/queries/get-admin-doctors").getAdminDoctors>>; values: AdminDoctorFilters }) {
  return (
    <div className="space-y-6">
      <AdminSectionHeader eyebrow="Provider operations" title="Doctor verification" description="Review provider profiles and approve, reject, or suspend doctors. These sensitive actions are written to the Super Admin audit log." />
      <AdminFilters filters={filters} values={Object.fromEntries(Object.entries(values).filter(([, value]) => typeof value === "string")) as Record<string, string>} submitLabel="Filter doctors" />
      <AdminDataTable title={`Doctor profiles (${data.total})`} description={`Showing latest ${data.pageSize} matching doctor profiles.`} columns={columns} rows={data.doctors} emptyMessage="No doctor profiles found." />
    </div>
  );
}
