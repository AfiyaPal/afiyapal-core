import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminConsultationDetailPage } from "@/features/admin/components/consultations/admin-consultation-detail-page";

type PageProps = {
  params: Promise<{ requestId: string }>;
};

export default async function AdminConsultationDetailRoute({ params }: PageProps) {
  await requireAnyAdminPermission(adminModulePermissions["consultations"]);
  const { requestId } = await params;
  return <AdminConsultationDetailPage requestId={Number(requestId)} />;
}
