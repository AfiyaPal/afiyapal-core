import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default async function AdminSymptomChecksPage() {
  await requireAnyAdminPermission(adminModulePermissions["symptom-checks"]);
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("symptom-checks")!} />;
}
