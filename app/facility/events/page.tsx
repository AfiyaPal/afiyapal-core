import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getFacilityByAdminId } from "@/features/facility/queries/get-facility-data";
import { FacilityEventList } from "@/features/facility/components/facility-event-list";

export const metadata = { title: "Events" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  const facility = await getFacilityByAdminId(user.id);
  if (!facility) redirect(routes.facilityDashboard);

  return <FacilityEventList events={facility.events} verificationStatus={facility.verificationStatus} />;
}
