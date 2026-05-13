import { getCurrentUser } from "@/server/auth/session";
import { redirect, notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getFacilityByAdminId, getFacilityEventDetail } from "@/features/facility/queries/get-facility-data";
import { FacilityEventForm } from "@/features/facility/components/facility-event-form";

export const metadata = { title: "Edit event" };

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

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Edit event</h1>
      <p className="mt-1 text-sm text-slate-600">Update your facility event details.</p>
      <div className="mt-8"><FacilityEventForm event={event} /></div>
    </div>
  );
}
