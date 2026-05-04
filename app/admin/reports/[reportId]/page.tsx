import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminReportDetailPage } from "@/features/admin/components/reports/admin-report-detail-page";

type PageProps = {
  params: Promise<{ reportId: string }>;
};

export default async function AdminReportDetailRoute({ params }: PageProps) {
  await requireAnyAdminPermission(adminModulePermissions.reports);
  const { reportId } = await params;
  return <AdminReportDetailPage reportId={Number(reportId)} />;
}
