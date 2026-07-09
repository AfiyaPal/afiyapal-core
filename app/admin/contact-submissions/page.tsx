import type { Metadata } from "next";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminContactSubmissionsPage } from "@/features/admin/components/contact-submissions/admin-contact-submissions-page";
import type { ContactSubmissionFilters } from "@/features/admin/queries/get-admin-contact-submissions";

export const metadata: Metadata = {
  title: "Contact Submissions",
  description: "Review AfiyaPal homepage contact form messages."
};

export default async function Page({ searchParams }: { searchParams: Promise<ContactSubmissionFilters> }) {
  await requireAnyAdminPermission(adminModulePermissions["contact-submissions"]);
  const filters = await searchParams;
  return <AdminContactSubmissionsPage filters={filters} />;
}
