import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { createHealthResourceAction, toggleHealthResourceStatusAction, updateHealthResourceAction } from "@/features/admin/actions/admin-settings-actions";
import { getAdminHealthResources, type HealthResourceFilters } from "@/features/admin/queries/get-admin-health-resources";
import { healthResourceTypes, healthResourceTypeLabels, type HealthResourceType } from "@/features/admin/data/platform-settings";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

type ResourceRow = Awaited<ReturnType<typeof getAdminHealthResources>>["resources"][number];

function ResourceForm({ resource }: { resource?: ResourceRow }) {
  return (
    <form action={resource ? updateHealthResourceAction : createHealthResourceAction} className="space-y-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      {resource ? <input type="hidden" name="resourceId" value={resource.id} /> : null}
      <div>
        <h2 className="text-lg font-black text-slate-950">{resource ? "Edit health resource" : "Add health resource"}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">Use this for clinics, hotlines, emergency contacts, and country-specific health resources.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm font-bold text-slate-700"><span>Type</span><select name="type" defaultValue={resource?.type ?? "CLINIC"} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100">{healthResourceTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>
        <label className="space-y-2 text-sm font-bold text-slate-700"><span>Name</span><input name="name" defaultValue={resource?.name ?? ""} required className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
        <label className="space-y-2 text-sm font-bold text-slate-700"><span>Country</span><input name="country" defaultValue={resource?.country ?? "Kenya"} required className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
        <label className="space-y-2 text-sm font-bold text-slate-700"><span>Region/city</span><input name="region" defaultValue={resource?.region ?? ""} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
        <label className="space-y-2 text-sm font-bold text-slate-700"><span>Phone</span><input name="phone" defaultValue={resource?.phone ?? ""} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
        <label className="space-y-2 text-sm font-bold text-slate-700"><span>Email</span><input name="email" type="email" defaultValue={resource?.email ?? ""} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
        <label className="space-y-2 text-sm font-bold text-slate-700 md:col-span-2"><span>Website</span><input name="website" defaultValue={resource?.website ?? ""} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
      </div>
      <label className="block space-y-2 text-sm font-bold text-slate-700"><span>Description</span><textarea name="description" defaultValue={resource?.description ?? ""} rows={3} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
      <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700"><input name="isActive" type="checkbox" defaultChecked={resource?.isActive ?? true} className="h-4 w-4 rounded border-emerald-200" /> Active</label>
      <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">{resource ? "Save resource" : "Create resource"}</button>
    </form>
  );
}

export async function AdminHealthResourcesPage({ filters }: { filters: HealthResourceFilters }) {
  const data = await getAdminHealthResources(filters);

  const columns: readonly AdminTableColumn<ResourceRow>[] = [
    { key: "name", header: "Resource", render: (resource) => <div><p className="font-black text-slate-950">{resource.name}</p><p className="mt-1 text-xs font-semibold text-slate-500">{healthResourceTypeLabels[resource.type as HealthResourceType] ?? resource.type}</p></div> },
    { key: "location", header: "Location", render: (resource) => <div className="text-sm"><p>{resource.country}</p><p className="text-xs font-semibold text-slate-500">{resource.region ?? "All regions"}</p></div> },
    { key: "contact", header: "Contact", render: (resource) => <div className="space-y-1 text-sm"><p>{resource.phone ?? "No phone listed"}</p>{resource.email ? <p className="text-brand-700">{resource.email}</p> : null}{resource.website ? <p className="text-brand-700">{resource.website}</p> : null}</div> },
    { key: "description", header: "Description", render: (resource) => <p className="max-w-md text-sm leading-6 text-slate-600">{resource.description ?? "No description added."}</p> },
    { key: "status", header: "Status", render: (resource) => <AdminStatusBadge tone={resource.isActive ? "green" : "slate"}>{resource.isActive ? "Active" : "Inactive"}</AdminStatusBadge> },
    { key: "updated", header: "Updated", render: (resource) => <span className="text-slate-600">{formatDateTime(resource.updatedAt)}</span> },
    { key: "action", header: "Action", render: (resource) => <form action={toggleHealthResourceStatusAction}><input type="hidden" name="resourceId" value={resource.id} /><input type="hidden" name="nextStatus" value={resource.isActive ? "INACTIVE" : "ACTIVE"} /><button className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">{resource.isActive ? "Deactivate" : "Activate"}</button></form> }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader eyebrow="Health resources" title="Manage clinics, hotlines, emergency contacts, and country resources" description="Maintain practical country-aware resources used by admins, consultations, and future public safety guidance. Store operational summaries only." />
      <AdminFilters
        filters={[
          { key: "search", label: "Search", type: "search", placeholder: "Search name, country, region, phone, email, website, or description..." },
          { key: "type", label: "Type", type: "select", options: [{ value: "", label: "All types" }, ...healthResourceTypes] },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, { value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }] },
          { key: "country", label: "Country", type: "search", placeholder: "Country, e.g. Kenya" }
        ]}
        values={filters}
        submitLabel="Filter resources"
      />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <ResourceForm />
        <AdminDataTable title={`Health resources (${data.total})`} description={`Showing up to ${data.pageSize} resources that match the current filters.`} columns={columns} rows={data.resources} emptyMessage="No health resources match the current filters." />
      </div>
      {data.resources.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {data.resources.slice(0, 2).map((resource) => <ResourceForm key={resource.id} resource={resource} />)}
        </div>
      ) : null}
    </div>
  );
}
