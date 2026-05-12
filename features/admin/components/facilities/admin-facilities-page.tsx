import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { FACILITY_TYPES } from "@/features/facility/data/facility-management";

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

const columns: readonly AdminTableColumn<FacilityRow>[] = [
  { key: "name", header: "Name", render: (row) => <span className="font-bold text-slate-950">{row.name}</span> },
  { key: "type", header: "Type", render: (row) => <span className="text-slate-600">{FACILITY_TYPES.find((t) => t.value === row.type)?.label ?? row.type}</span> },
  { key: "location", header: "Location", render: (row) => <span className="text-slate-600">{row.city ? `${row.city}, ${row.country}` : row.country}</span> },
  { key: "professionals", header: "Professionals", render: (row) => <span className="text-slate-600">{row.professionalCount}</span> },
  { key: "status", header: "Status", render: (row) => {
    const tone = row.verificationStatus === "VERIFIED" ? "green" : row.verificationStatus === "PENDING" ? "amber" : "red";
    return <AdminStatusBadge tone={tone}>{row.verificationStatus}</AdminStatusBadge>;
  }},
  { key: "registered", header: "Registered", render: (row) => <span className="text-slate-600">{new Date(row.createdAt).toLocaleDateString()}</span> }
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
