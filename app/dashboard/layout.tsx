import { DoctorSidebar } from "@/features/doctor/components/doctor-sidebar";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { routes } from "@/lib/routes";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  return (
    <div className="flex min-h-screen">
      <DoctorSidebar />
      <main className="flex-1 px-6 py-8 md:px-10 lg:px-14">
        {children}
      </main>
    </div>
  );
}
