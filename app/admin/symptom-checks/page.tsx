import { AdminModulePlaceholderPage, getAdminModuleByKey } from "@/features/admin/components/admin-module-placeholder-page";

export default function AdminSymptomChecksPage() {
  return <AdminModulePlaceholderPage module={getAdminModuleByKey("symptom-checks")!} />;
}
