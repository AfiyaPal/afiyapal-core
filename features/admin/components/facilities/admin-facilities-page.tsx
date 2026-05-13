import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { FACILITY_TYPES } from "@/features/facility/data/facility-management";
import { approveFacilityAction, rejectFacilityAction, suspendFacilityAction } from "@/features/admin/actions/admin-facility-actions";

type FacilityRow = {
  id: number;
  name: string;
  type: string;
  country: string;
  city: string | null;
  verificationStatus: string;
  professionalCount: number;
  createdAt: Date;
};

const toneForStatus: Record<string, "green" | "amber" | "red"> = {
  VERIFIED: "green",
  PENDING: "amber",
  REJECTED: "red",
  SUSPENDED: "red"
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended"
};

const columns: readonly AdminTableColumn<FacilityRow>[] = [
  { key: "name", header: "Name", render: (row) => <span className="font-bold text-slate-950">{row.name}</span> },
  { key: "type", header: "Type", render: (row) => <span className="text-slate-600">{FACILITY_TYPES.find((t) => t.value === row.type)?.label ?? row.type}</span> },
  { key: "location", header: "Location", render: (row) => <span className="text-slate-600">{row.city ? `${row.city}, ${row.country}` : row.country}</span> },
  { key: "professionals", header: "Professionals", render: (row) => <span className="text-slate-600">{row.professionalCount}</span> },
  { key: "status", header: "Status", render: (row) => <AdminStatusBadge tone={toneForStatus[row.verificationStatus] ?? "amber"}>{statusLabels[row.verificationStatus] ?? row.verificationStatus}</AdminStatusBadge> },
  { key: "registered", header: "Registered", render: (row) => <span className="text-slate-600">{new Date(row.createdAt).toLocaleDateString()}</span> },
  {
    key: "actions",
    header: "Actions",
    render: (row) => (
      <div className="flex min-w-64 flex-col gap-2">
        {row.verificationStatus !== "VERIFIED" && (
          <form action={approveFacilityAction}><input type="hidden" name="facilityId" value={row.id} /><button className="w-full rounded-full bg-brand-600 px-3 py-2 text-xs font-black text-white transition hover:bg-brand-700" type="submit">Approve</button></form>
        )}
        {row.verificationStatus !== "REJECTED" && (
          <form action={rejectFacilityAction} className="flex gap-2"><input type="hidden" name="facilityId" value={row.id} /><input name="reason" placeholder="Rejection reason" className="min-w-0 flex-1 rounded-full border border-emerald-100 px-3 py-2 text-xs outline-none focus:border-brand-600" /><button className="rounded-full bg-amber-100 px-3 py-2 text-xs font-black text-amber-800" type="submit">Reject</button></form>
        )}
        {row.verificationStatus !== "SUSPENDED" && (
          <form action={suspendFacilityAction} className="flex gap-2"><input type="hidden" name="facilityId" value={row.id} /><input name="reason" placeholder="Suspension reason" className="min-w-0 flex-1 rounded-full border border-emerald-100 px-3 py-2 text-xs outline-none focus:border-brand-600" /><button className="rounded-full bg-rose-100 px-3 py-2 text-xs font-black text-rose-700" type="submit">Suspend</button></form>
        )}
      </div>
    )
  }
];

export function AdminFacilitiesPage({ facilities }: { facilities: { id: number; name: string; type: string; country: string; city: string | null; verificationStatus: string; createdAt: Date; professionals: unknown[] }[] }) {
  const rows: FacilityRow[] = facilities.map((f) => ({
    id: f.id,
    name: f.name,
    type: f.type,
    country: f.country,
    city: f.city,
    verificationStatus: f.verificationStatus,
    professionalCount: f.professionals.length,
    createdAt: f.createdAt
  }));

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
        <AdminSectionHeader
          eyebrow="AFIYAPAL Admin"
          title="Facility Management"
          description="Review, approve, and manage health facility registrations on the platform."
        />
      </section>
      <AdminDataTable
        title="Registered facilities"
        description={`${facilities.length} total facility registration(s).`}
        columns={columns}
        rows={rows}
        emptyMessage="No facilities registered yet."
      />
    </div>
  );
}
