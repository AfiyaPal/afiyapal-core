import { AdminProfessionalsPage } from "@/features/admin/components/professionals/admin-professionals-page";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { getAdminProfessionals, type AdminProfessionalFilters } from "@/features/admin/queries/get-admin-professionals";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";

type ProfessionalSearchParams = Promise<AdminProfessionalFilters>;

export default async function AdminProfessionalsRoute({ searchParams }: { searchParams: ProfessionalSearchParams }) {
  await requireAnyAdminPermission(adminModulePermissions.doctors);
  const values = await searchParams;
  const data = await getAdminProfessionals(values);
  return <AdminProfessionalsPage data={data} values={values} />;
}
