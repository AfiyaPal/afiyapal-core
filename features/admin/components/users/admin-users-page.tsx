import Link from "next/link";
import { routes } from "@/lib/routes";
import { getRoleLabel, USER_ROLES, USER_STATUSES } from "@/server/auth/roles";
import { getAdminUsers } from "@/features/admin/queries/get-admin-users";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { activateUserAction, suspendUserAction, updateUserRoleAction } from "@/features/admin/actions/admin-user-actions";
import { canCreateAdmin } from "@/server/auth/admin-permissions";

type SearchParams = { search?: string; role?: string; status?: string };
type UserRow = Awaited<ReturnType<typeof getAdminUsers>>["users"][number];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function languageLabel(value: string | null | undefined) {
  if (value === "sw") return "Swahili";
  return "English";
}

function statusTone(status: string) {
  if (status === "ACTIVE") return "green" as const;
  if (status === "SUSPENDED") return "red" as const;
  return "slate" as const;
}

export async function AdminUsersPage({ searchParams, currentUserRole }: { searchParams: SearchParams; currentUserRole: string }) {
  const data = await getAdminUsers(searchParams);
  const canAssignAdminRoles = canCreateAdmin(currentUserRole);

  const columns: readonly AdminTableColumn<UserRow>[] = [
    {
      key: "user",
      header: "User",
      render: (user) => (
        <div>
          <Link href={`${routes.adminUsers}/${user.id}`} className="font-black text-slate-950 transition hover:text-brand-700">
            {user.username}
          </Link>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
          {user.phone ? <p className="mt-1 text-xs text-slate-500">{user.phone}</p> : null}
        </div>
      )
    },
    { key: "role", header: "Role", render: (user) => <AdminStatusBadge tone={user.role === "SUPER_ADMIN" ? "blue" : "slate"}>{getRoleLabel(user.role)}</AdminStatusBadge> },
    { key: "status", header: "Status", render: (user) => <AdminStatusBadge tone={statusTone(user.status)}>{user.status}</AdminStatusBadge> },
    { key: "language", header: "Language", render: (user) => <span className="font-semibold text-slate-700">{languageLabel(user.preferredLanguage)}</span> },
    { key: "joined", header: "Date joined", render: (user) => <span className="text-slate-600">{formatDate(user.createdAt)}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <div className="flex min-w-64 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Link href={`${routes.adminUsers}/${user.id}`} className="rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
              View profile
            </Link>
            {user.status !== "ACTIVE" ? (
              <form action={activateUserAction}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-black text-white transition hover:bg-brand-700">Activate</button>
              </form>
            ) : (
              <form action={suspendUserAction}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-black text-white transition hover:bg-rose-700">Suspend</button>
              </form>
            )}
          </div>
          <form action={updateUserRoleAction} className="flex gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <select name="role" defaultValue={user.role} className="min-w-0 flex-1 rounded-full border border-emerald-100 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-brand-600">
              {USER_ROLES.map((role) => {
                const isAdmin = role !== "USER" && role !== "DOCTOR";
                return <option key={role} value={role} disabled={isAdmin && !canAssignAdminRoles}>{getRoleLabel(role)}</option>;
              })}
            </select>
            <button type="submit" className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white transition hover:bg-slate-800">Save</button>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="User management"
        title="Manage platform users"
        description="Search users, filter by role or account status, review safe profile summaries, and control user access without exposing sensitive health conversations by default."
      />
      <AdminFilters
        filters={[
          { key: "search", label: "Search", type: "search", placeholder: "Search by name or email..." },
          { key: "role", label: "Role", type: "select", options: [{ value: "", label: "All roles" }, ...USER_ROLES.map((role) => ({ value: role, label: getRoleLabel(role) }))] },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, ...USER_STATUSES.map((status) => ({ value: status, label: status }))] }
        ]}
        values={searchParams}
        submitLabel="Filter users"
      />
      <AdminDataTable title={`Users (${data.total})`} description={`Showing up to ${data.pageSize} most recent users that match the current filters.`} columns={columns} rows={data.users} emptyMessage="No users match the current filters." />
    </div>
  );
}
