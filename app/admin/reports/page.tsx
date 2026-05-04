import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default function AdminReportsPage() {
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("reports")!} />;
}
