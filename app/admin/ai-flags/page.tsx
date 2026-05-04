import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default function AdminAiFlagsPage() {
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("ai-flags")!} />;
}
