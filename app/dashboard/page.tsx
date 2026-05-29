import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getDoctorProfile } from "@/features/doctor/queries/get-doctor-profile";
import { getDoctorBlogs } from "@/features/doctor/queries/get-doctor-blogs";
import { DoctorDashboardPage } from "@/features/doctor/components/doctor-dashboard-page";
import { MaternalEmergencyButton } from "@/features/maternal/components/maternal-emergency-button";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const [profile, blogs] = await Promise.all([
    getDoctorProfile(user.id),
    getDoctorBlogs(user.id)
  ]);

  return (
    <>
      <MaternalEmergencyButton />
      <DoctorDashboardPage profile={profile} name={user.username} blogCount={blogs.length} />
    </>
  );
}
