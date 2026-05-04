import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default function AdminContentPage() {
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("content")!} />;
}
