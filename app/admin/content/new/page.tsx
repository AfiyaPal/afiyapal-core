import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { AdminContentCreatePage } from "@/features/admin/components/content/admin-content-create-page";

export default async function Page() {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  return <AdminContentCreatePage />;
}
