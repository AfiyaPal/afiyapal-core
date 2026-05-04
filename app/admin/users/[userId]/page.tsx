import { notFound } from "next/navigation";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminUserDetailPage } from "@/features/admin/components/users/admin-user-detail-page";

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default async function UserDetailPage({ params }: PageProps) {
  const currentUser = await requireAnyAdminPermission(adminModulePermissions["users"]);
  const { userId } = await params;
  const id = Number(userId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  return <AdminUserDetailPage userId={id} currentUserRole={currentUser.role} />;
}
