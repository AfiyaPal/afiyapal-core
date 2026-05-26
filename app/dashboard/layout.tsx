import { DoctorSidebar } from "@/features/doctor/components/doctor-sidebar";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { routes } from "@/lib/routes";
import { RoleThemeProvider } from "@/components/theme/role-theme-provider";
import { DoctorNavbar } from "@/components/nav/doctor-navbar";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata = buildNoIndexMetadata("Doctor Dashboard", "Protected AfiyaPal doctor workspace.");

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  return (
    <RoleThemeProvider role="doctor">
      <div className="min-h-screen bg-theme-background text-theme-foreground">
        <DoctorNavbar />
        <div className="flex">
          <DoctorSidebar />
          <main className="flex-1 px-6 py-8 md:px-10 lg:px-14">
            {children}
          </main>
        </div>
      </div>
    </RoleThemeProvider>
  );
}
