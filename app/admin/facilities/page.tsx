import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { getAdminFacilities } from "@/features/admin/actions/admin-facility-actions";
import { AdminFacilitiesPage } from "@/features/admin/components/facilities/admin-facilities-page";

export const metadata = { title: "Facility Management" };

export default async function Page() {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_FACILITIES, ADMIN_PERMISSIONS.APPROVE_REJECT_FACILITIES]);
  const facilities = await getAdminFacilities();

  return <AdminFacilitiesPage facilities={facilities} />;
}
