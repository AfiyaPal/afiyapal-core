export type AdminFilterOption = { value: string; label: string };
export type AdminFilterConfig = { key: string; label: string; type: "search" | "select" | "date"; placeholder?: string; options?: readonly AdminFilterOption[] };

export const reusableAdminFilters = {
  search: { key: "search", label: "Search", type: "search", placeholder: "Search by name, email, title, or reference..." },
  status: { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, { value: "ACTIVE", label: "Active" }, { value: "PENDING", label: "Pending" }, { value: "IN_REVIEW", label: "In review" }, { value: "RESOLVED", label: "Resolved" }, { value: "SUSPENDED", label: "Suspended" }] },
  dateRange: { key: "date", label: "Date", type: "date" },
  role: { key: "role", label: "Role", type: "select", options: [{ value: "", label: "All roles" }, { value: "USER", label: "User" }, { value: "DOCTOR", label: "Doctor" }, { value: "ADMIN", label: "Admin" }, { value: "SUPER_ADMIN", label: "Super Admin" }, { value: "MEDICAL_REVIEWER", label: "Medical Reviewer" }, { value: "DOCTOR_MANAGER", label: "Doctor Manager" }, { value: "SUPPORT_ADMIN", label: "Support Admin" }, { value: "CONTENT_MANAGER", label: "Content Manager" }] },
  language: { key: "language", label: "Language", type: "select", options: [{ value: "", label: "All languages" }, { value: "en", label: "English" }, { value: "sw", label: "Swahili" }] },
  urgency: { key: "urgency", label: "Urgency", type: "select", options: [{ value: "", label: "All urgency levels" }, { value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" }, { value: "HIGH", label: "High" }, { value: "EMERGENCY", label: "Emergency" }] }
} as const satisfies Record<string, AdminFilterConfig>;

export function AdminFilters({ filters, values = {}, submitLabel = "Apply filters" }: { filters: readonly AdminFilterConfig[]; values?: Record<string, string | undefined>; submitLabel?: string }) {
  return (
    <form className="grid gap-3 rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4" method="get">
      {filters.map((filter) => filter.type === "select" ? (
        <label key={filter.key} className="space-y-2 text-sm font-bold text-slate-700"><span>{filter.label}</span><select name={filter.key} defaultValue={values[filter.key] ?? ""} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-emerald-100">{filter.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      ) : (
        <label key={filter.key} className="space-y-2 text-sm font-bold text-slate-700"><span>{filter.label}</span><input name={filter.key} defaultValue={values[filter.key] ?? ""} type={filter.type === "date" ? "date" : "search"} placeholder={filter.placeholder} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
      ))}
      <div className="flex items-end gap-2">
        <button type="submit" className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">{submitLabel}</button>
      </div>
    </form>
  );
}
