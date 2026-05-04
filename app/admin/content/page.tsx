import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminContentPage } from "@/features/admin/components/content/admin-content-page";

type PageProps = { searchParams: Promise<{ search?: string; status?: string; category?: string; language?: string; reviewStatus?: string; freshness?: string }> };

export default async function Page({ searchParams }: PageProps) {
  await requireAnyAdminPermission(adminModulePermissions.content);
  return <AdminContentPage searchParams={await searchParams} />;
}
