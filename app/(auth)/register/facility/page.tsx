import { FacilityRegisterForm } from "@/features/auth/components/facility-register-form";

export const metadata = { title: "Register your facility" };

export default function Page() {
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <FacilityRegisterForm />
    </main>
  );
}
