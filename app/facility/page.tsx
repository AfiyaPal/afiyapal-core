import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getFacilityByAdminId } from "@/features/facility/queries/get-facility-data";
import { FacilityDashboardPage } from "@/features/facility/components/facility-dashboard-page";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  const facility = await getFacilityByAdminId(user.id);

  return <FacilityDashboardPage facility={facility} />;
}
