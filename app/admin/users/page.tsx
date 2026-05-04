import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default function AdminUsersPage() {
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("users")!} />;
}
