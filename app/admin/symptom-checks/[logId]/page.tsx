import { notFound } from "next/navigation";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminSymptomCheckDetailPage } from "@/features/admin/components/symptom-checks/admin-symptom-check-detail-page";

type PageProps = {
  params: Promise<{ logId: string }>;
  searchParams?: Promise<{ sensitive?: string }>;
};

export default async function SymptomCheckDetailPage({ params, searchParams }: PageProps) {
  const adminUser = await requireAnyAdminPermission(adminModulePermissions["symptom-checks"]);
  const { logId } = await params;
  const query = searchParams ? await searchParams : {};
  const id = Number(logId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  return <AdminSymptomCheckDetailPage logId={id} adminUser={adminUser} sensitiveRequested={query.sensitive === "1"} />;
}
