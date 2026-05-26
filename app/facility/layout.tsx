import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { routes } from "@/lib/routes";
import { FacilitySidebar } from "@/features/facility/components/facility-sidebar";
import { RoleThemeProvider } from "@/components/theme/role-theme-provider";
import { FacilityNavbar } from "@/components/nav/facility-navbar";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata = buildNoIndexMetadata("Facility Dashboard", "Protected AfiyaPal facility workspace.");

export default async function FacilityLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "FACILITY_ADMIN") redirect(routes.login);

  return (
    <RoleThemeProvider role="facility">
      <div className="min-h-screen bg-theme-background text-theme-foreground">
        <FacilityNavbar />
        <div className="flex">
          <FacilitySidebar />
          <main className="flex-1 px-6 py-8 md:px-10 lg:px-14">{children}</main>
        </div>
      </div>
    </RoleThemeProvider>
  );
}
