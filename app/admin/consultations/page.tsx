import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default function AdminConsultationsPage() {
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("consultations")!} />;
}
