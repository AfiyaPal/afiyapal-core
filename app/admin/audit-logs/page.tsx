import { AdminAuditLogsPage } from "@/features/admin/components/audit-logs/admin-audit-logs-page";
import { getAdminAuditLogs, type AdminAuditLogFilters } from "@/features/admin/queries/get-admin-audit-logs";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";

type AuditLogsSearchParams = Promise<AdminAuditLogFilters>;

export default async function AdminAuditLogsRoute({ searchParams }: { searchParams: AuditLogsSearchParams }) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.VIEW_AUDIT_SENSITIVE_ADMIN_DATA]);
  const filters = await searchParams;
  const data = await getAdminAuditLogs(filters);
  return <AdminAuditLogsPage data={data} filters={filters} />;
}
