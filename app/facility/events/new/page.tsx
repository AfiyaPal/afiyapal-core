import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getFacilityByAdminId } from "@/features/facility/queries/get-facility-data";
import { FacilityEventForm } from "@/features/facility/components/facility-event-form";

export const metadata = { title: "Create event" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  const facility = await getFacilityByAdminId(user.id);
  if (!facility) redirect(routes.facilityDashboard);
  if (facility.verificationStatus !== "VERIFIED") redirect(routes.facilityEvents);

  const params = await searchParams;
  const topicLabel = typeof params.topicLabel === "string" ? params.topicLabel : undefined;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Create event</h1>
      <p className="mt-1 text-sm text-slate-600">Add a health event or announcement for your facility.</p>
      {topicLabel && (
        <p className="mt-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Suggested by community insights: <strong>{topicLabel}</strong>. A prefilled title and type are below — edit as needed.
        </p>
      )}
      <div className="mt-8">
        <FacilityEventForm
          initialTitle={topicLabel ? `Medical camp: ${topicLabel}` : undefined}
          initialType={topicLabel ? "MEDICAL_CAMP" : undefined}
        />
      </div>
    </div>
  );
}
