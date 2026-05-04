import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminConsultationsPage } from "@/features/admin/components/consultations/admin-consultations-page";
import type { ConsultationFilters } from "@/features/admin/queries/get-admin-consultations";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function readParam(searchParams: Record<string, string | string[] | undefined>, key: keyof ConsultationFilters) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminConsultationsRoute({ searchParams }: PageProps) {
  await requireAnyAdminPermission(adminModulePermissions["consultations"]);
  const params = (await searchParams) ?? {};

  return (
    <AdminConsultationsPage
      filters={{
        search: readParam(params, "search"),
        status: readParam(params, "status"),
        urgency: readParam(params, "urgency"),
        specialty: readParam(params, "specialty"),
        language: readParam(params, "language"),
        assignment: readParam(params, "assignment")
      }}
    />
  );
}
