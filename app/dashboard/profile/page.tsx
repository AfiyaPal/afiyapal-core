import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getDoctorProfile } from "@/features/doctor/queries/get-doctor-profile";
import { DoctorProfileForm } from "@/features/doctor/components/doctor-profile-form";
import { UsernameForm } from "@/features/doctor/components/username-form";
import { AvailabilityToggle } from "@/features/doctor/components/availability-toggle";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const profile = await getDoctorProfile(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-theme-foreground">Professional profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Keep your details up to date so our team can verify you and patients can find you.
        </p>
      </div>
      <UsernameForm username={user.username} />
      <AvailabilityToggle
        availabilityStatus={profile?.availabilityStatus ?? "UNAVAILABLE"}
        verificationStatus={profile?.verificationStatus ?? "PENDING"}
      />
      <h2 className="text-lg font-black tracking-tight text-theme-foreground">Professional details</h2>
      <DoctorProfileForm profile={profile} username={user.username} />
    </div>
  );
}
