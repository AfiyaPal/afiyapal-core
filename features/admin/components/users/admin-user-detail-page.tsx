import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getRoleLabel, USER_ROLES, USER_STATUSES } from "@/server/auth/roles";
import { getAdminUserDetail } from "@/features/admin/queries/get-admin-users";
import { AdminDashboardCard } from "@/features/admin/components/admin-dashboard-card";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { activateUserAction, suspendUserAction, updateUserRoleAction, updateUserStatusAction } from "@/features/admin/actions/admin-user-actions";
import { canCreateAdmin } from "@/server/auth/admin-permissions";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
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

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-emerald-50/60 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-brand-700">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

export async function AdminUserDetailPage({ userId, currentUserRole }: { userId: number; currentUserRole: string }) {
  const detail = await getAdminUserDetail(userId);
  if (!detail) notFound();

  const { user, activitySummary } = detail;
  const canAssignAdminRoles = canCreateAdmin(currentUserRole);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="User profile"
          title={user.username}
          description="Privacy-safe account profile and activity summary. Full symptom or mental health conversations are intentionally not exposed here."
        />
        <Link href={routes.adminUsers} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">
          Back to users
        </Link>
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-emerald-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">{user.email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <AdminStatusBadge tone={user.role === "SUPER_ADMIN" ? "blue" : "slate"}>{getRoleLabel(user.role)}</AdminStatusBadge>
              <AdminStatusBadge tone={statusTone(user.status)}>{user.status}</AdminStatusBadge>
              <AdminStatusBadge tone={user.isVerified ? "green" : "amber"}>{user.isVerified ? "Verified" : "Unverified"}</AdminStatusBadge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.status !== "ACTIVE" ? (
              <form action={activateUserAction}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-black text-white transition hover:bg-brand-700">Activate user</button>
              </form>
            ) : (
              <form action={suspendUserAction}>
                <input type="hidden" name="userId" value={user.id} />
                <button type="submit" className="rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-700">Suspend user</button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ProfileItem label="Name" value={user.username} />
          <ProfileItem label="Email" value={user.email} />
          <ProfileItem label="Phone" value={user.phone || "Not provided"} />
          <ProfileItem label="Preferred language" value={languageLabel(user.preferredLanguage)} />
          <ProfileItem label="Date joined" value={formatDateTime(user.createdAt)} />
          <ProfileItem label="Last updated" value={formatDateTime(user.updatedAt)} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <form action={updateUserRoleAction} className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <input type="hidden" name="userId" value={user.id} />
          <h2 className="text-lg font-black text-slate-950">Change role</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Only Super Admin can assign or remove admin-level roles.</p>
          <select name="role" defaultValue={user.role} className="mt-4 w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-600">
            {USER_ROLES.map((role) => {
              const isAdmin = role !== "USER" && role !== "DOCTOR";
              return <option key={role} value={role} disabled={isAdmin && !canAssignAdminRoles}>{getRoleLabel(role)}</option>;
            })}
          </select>
          <button type="submit" className="mt-4 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save role</button>
        </form>

        <form action={updateUserStatusAction} className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <input type="hidden" name="userId" value={user.id} />
          <h2 className="text-lg font-black text-slate-950">Change account status</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Suspended users cannot access protected services until reactivated.</p>
          <select name="status" defaultValue={user.status} className="mt-4 w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-brand-600">
            {USER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <button type="submit" className="mt-4 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save status</button>
        </form>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-black text-slate-950">Activity summary</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Counts only. Sensitive health conversation content is not shown by default.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AdminDashboardCard label="Blogs created" value={String(activitySummary.blogs)} helper="Health content authored by this user." />
          <AdminDashboardCard label="Comments" value={String(activitySummary.comments)} helper="Community or blog comments." />
          <AdminDashboardCard label="Symptom checks" value={String(activitySummary.symptomChecks)} helper="Logged symptom checker sessions." />
          <AdminDashboardCard label="Consultation requests" value={String(activitySummary.consultationRequests)} helper="Doctor connection requests." />
          <AdminDashboardCard label="AI flags" value={String(activitySummary.aiFlags)} helper="Flagged AI interactions linked to this user." />
          <AdminDashboardCard label="Safety reports" value={String(activitySummary.safetyReports)} helper="Reports submitted by this user." />
        </div>
      </section>
    </div>
  );
}
