import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { routes } from "@/lib/routes";
import { FacilitySidebar } from "@/features/facility/components/facility-sidebar";

export default async function FacilityLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  return (
    <div className="flex min-h-screen">
      <FacilitySidebar />
      <main className="flex-1 px-6 py-8 md:px-10 lg:px-14">{children}</main>
    </div>
  );
}
