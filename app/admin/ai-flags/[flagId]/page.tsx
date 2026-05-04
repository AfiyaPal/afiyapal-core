import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminAiFlagDetailPage } from "@/features/admin/components/ai-flags/admin-ai-flag-detail-page";

type AdminAiFlagDetailRouteProps = {
  params: Promise<{ flagId: string }>;
  searchParams?: Promise<{ sensitive?: string }>;
};

export default async function AdminAiFlagDetailRoute({ params, searchParams }: AdminAiFlagDetailRouteProps) {
  const adminUser = await requireAnyAdminPermission(adminModulePermissions["ai-flags"]);
  const { flagId } = await params;
  const query = searchParams ? await searchParams : {};
  const parsedFlagId = Number(flagId);

  return <AdminAiFlagDetailPage flagId={Number.isInteger(parsedFlagId) ? parsedFlagId : 0} adminUser={adminUser} sensitiveRequested={query.sensitive === "1"} />;
}
