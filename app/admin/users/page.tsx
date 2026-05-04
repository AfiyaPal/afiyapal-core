import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default async function AdminUsersPage() {
  await requireAnyAdminPermission(adminModulePermissions["users"]);
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("users")!} />;
}
