import type { Metadata } from "next";
import { AdminTestingChecklistPage } from "@/features/admin/components/testing/admin-testing-checklist-page";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";

export const metadata: Metadata = {
  title: "Admin Testing Checklist",
  description: "AFIYAPAL Stage 2 admin QA checklist."
};

export default async function AdminTestingChecklistRoute() {
  await requireAnyAdminPermission(adminModulePermissions.testing);
  return <AdminTestingChecklistPage />;
}
