import { AdminHealthResourcesPage } from "@/features/admin/components/settings/admin-health-resources-page";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";

type SearchParams = Promise<{ search?: string; type?: string; status?: string; country?: string }>;

export default async function HealthResourcesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS]);
  const params = await searchParams;
  return <AdminHealthResourcesPage filters={{ search: params.search, type: params.type, status: params.status, country: params.country }} />;
}
