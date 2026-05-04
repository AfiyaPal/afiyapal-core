import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminAiFlagDetailPage } from "@/features/admin/components/ai-flags/admin-ai-flag-detail-page";

type AdminAiFlagDetailRouteProps = {
  params: Promise<{ flagId: string }>;
};

export default async function AdminAiFlagDetailRoute({ params }: AdminAiFlagDetailRouteProps) {
  await requireAnyAdminPermission(adminModulePermissions["ai-flags"]);
  const { flagId } = await params;
  const parsedFlagId = Number(flagId);

  return <AdminAiFlagDetailPage flagId={Number.isInteger(parsedFlagId) ? parsedFlagId : 0} />;
}
