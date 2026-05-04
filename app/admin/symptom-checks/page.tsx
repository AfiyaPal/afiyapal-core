import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminSymptomChecksPage } from "@/features/admin/components/symptom-checks/admin-symptom-checks-page";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SymptomChecksPage({ searchParams }: PageProps) {
  await requireAnyAdminPermission(adminModulePermissions["symptom-checks"]);
  const params = (await searchParams) ?? {};

  return (
    <AdminSymptomChecksPage
      filters={{
        riskLevel: first(params.riskLevel),
        language: first(params.language),
        startDate: first(params.startDate),
        endDate: first(params.endDate),
        escalationSuggested: first(params.escalationSuggested),
        status: first(params.status)
      }}
    />
  );
}
