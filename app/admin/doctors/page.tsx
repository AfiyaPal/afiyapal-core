import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default async function AdminDoctorsPage() {
  await requireAnyAdminPermission(adminModulePermissions["doctors"]);
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("doctors")!} />;
}
