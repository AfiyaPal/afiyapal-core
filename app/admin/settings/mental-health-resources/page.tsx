import { AdminMentalHealthResourcesPage } from "@/features/admin/components/settings/admin-mental-health-resources-page";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";

type SearchParams = Promise<{ search?: string; status?: string; country?: string }>;

export default async function MentalHealthResourcesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS, ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS]);
  const params = await searchParams;
  return <AdminMentalHealthResourcesPage filters={{ search: params.search, status: params.status, country: params.country }} />;
}
