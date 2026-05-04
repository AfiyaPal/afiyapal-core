import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { AdminContentEditPage } from "@/features/admin/components/content/admin-content-edit-page";

type PageProps = { params: Promise<{ blogId: string }> };

export default async function Page({ params }: PageProps) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTENT]);
  const { blogId } = await params;
  return <AdminContentEditPage articleId={Number(blogId)} />;
}
