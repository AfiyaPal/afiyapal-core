import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminAiFlagsPage } from "@/features/admin/components/ai-flags/admin-ai-flags-page";
import type { AiFlagFilters } from "@/features/admin/queries/get-admin-ai-flags";

type AdminAiFlagsRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(searchParams: Record<string, string | string[] | undefined>, key: keyof AiFlagFilters) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminAiFlagsRoute({ searchParams }: AdminAiFlagsRouteProps) {
  await requireAnyAdminPermission(adminModulePermissions["ai-flags"]);
  const params = (await searchParams) ?? {};

  return (
    <AdminAiFlagsPage
      filters={{
        search: readParam(params, "search"),
        status: readParam(params, "status"),
        priority: readParam(params, "priority"),
        category: readParam(params, "category"),
        trigger: readParam(params, "trigger"),
        startDate: readParam(params, "startDate"),
        endDate: readParam(params, "endDate")
      }}
    />
  );
}
