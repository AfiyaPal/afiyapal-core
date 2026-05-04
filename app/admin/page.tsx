import type { Metadata } from "next";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminOverviewPage } from "@/features/admin/components/admin-overview-page";
import { getAdminOverviewDashboardData } from "@/features/admin/queries/get-admin-overview-dashboard-data";

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "AFIYAPAL Stage 2 admin overview dashboard."
};

export default async function AdminPage() {
  await requireAnyAdminPermission(adminModulePermissions.overview);
  const data = await getAdminOverviewDashboardData();
  return <AdminOverviewPage data={data} />;
}
