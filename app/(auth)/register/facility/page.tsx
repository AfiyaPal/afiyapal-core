import { FacilityRegisterForm } from "@/features/auth/components/facility-register-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Register your facility",
  description: "Register your hospital, clinic, or health facility on AfiyaPal to reach communities and list health events.",
  path: "/register/facility"
});

export default function Page() {
  return (
    <main className="container-page flex min-h-[80vh] items-center justify-center py-10 md:py-14">
      <FacilityRegisterForm />
    </main>
  );
}
