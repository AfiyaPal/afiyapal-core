import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default function AdminDoctorsPage() {
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("doctors")!} />;
}
