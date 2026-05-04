import { AdminDoctorsPage } from "@/features/admin/components/doctors/admin-doctors-page";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { getAdminDoctors, type AdminDoctorFilters } from "@/features/admin/queries/get-admin-doctors";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";

type DoctorSearchParams = Promise<AdminDoctorFilters>;

export default async function AdminDoctorsRoute({ searchParams }: { searchParams: DoctorSearchParams }) {
  await requireAnyAdminPermission(adminModulePermissions.doctors);
  const values = await searchParams;
  const data = await getAdminDoctors(values);
  return <AdminDoctorsPage data={data} values={values} />;
}
