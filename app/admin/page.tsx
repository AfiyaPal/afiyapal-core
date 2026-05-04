import type { Metadata } from "next";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminScopePage } from "@/features/admin/components/admin-scope-page";

export const metadata: Metadata = {
  title: "Admin Scope",
  description: "Stage 2 admin scope for AFIYAPAL."
};

export default async function AdminPage() {
  await requireAnyAdminPermission(adminModulePermissions.overview);
  return <AdminScopePage />;
}
