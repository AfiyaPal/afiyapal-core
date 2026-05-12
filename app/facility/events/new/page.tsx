import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { FacilityEventForm } from "@/features/facility/components/facility-event-form";

export const metadata = { title: "Create event" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Create event</h1>
      <p className="mt-1 text-sm text-slate-600">Add a health event or announcement for your facility.</p>
      <div className="mt-8"><FacilityEventForm /></div>
    </div>
  );
}
