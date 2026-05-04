import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminContentDetailPage } from "@/features/admin/components/content/admin-content-detail-page";

type PageProps = { params: Promise<{ blogId: string }> };

export default async function Page({ params }: PageProps) {
  await requireAnyAdminPermission(adminModulePermissions.content);
  const { blogId } = await params;
  return <AdminContentDetailPage articleId={Number(blogId)} />;
}
