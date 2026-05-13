import { getCurrentUser } from "@/server/auth/session";
import { redirect, notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getFacilityByAdminId, getFacilityEventDetail } from "@/features/facility/queries/get-facility-data";
import { FacilityEventDetail } from "@/features/facility/components/facility-event-detail";

export const metadata = { title: "Event details" };

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  const facility = await getFacilityByAdminId(user.id);
  if (!facility) redirect(routes.facilityDashboard);
  if (facility.verificationStatus !== "VERIFIED") redirect(routes.facilityEvents);

  const { eventId } = await params;
  const id = Number(eventId);
  if (!Number.isInteger(id)) notFound();

  const event = await getFacilityEventDetail(id, facility.id);
  if (!event) notFound();

  return <FacilityEventDetail event={event} />;
}
