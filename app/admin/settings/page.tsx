import { AdminPlatformSettingsPage } from "@/features/admin/components/settings/admin-platform-settings-page";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";

export default async function AdminSettingsPage() {
  await requireAnyAdminPermission(adminModulePermissions.settings);
  return <AdminPlatformSettingsPage />;
}
