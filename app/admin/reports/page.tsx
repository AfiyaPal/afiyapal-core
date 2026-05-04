import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminReportsPage } from "@/features/admin/components/reports/admin-reports-page";
import type { SafetyReportFilters } from "@/features/admin/queries/get-admin-reports";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(searchParams: Record<string, string | string[] | undefined>, key: keyof SafetyReportFilters) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminReportsRoute({ searchParams }: PageProps) {
  await requireAnyAdminPermission(adminModulePermissions.reports);
  const params = (await searchParams) ?? {};

  return (
    <AdminReportsPage
      filters={{
        search: readParam(params, "search"),
        type: readParam(params, "type"),
        status: readParam(params, "status"),
        priority: readParam(params, "priority"),
        assignment: readParam(params, "assignment"),
        startDate: readParam(params, "startDate"),
        endDate: readParam(params, "endDate")
      }}
    />
  );
}
