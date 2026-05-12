import { DoctorRegisterForm } from "@/features/auth/components/doctor-register-form";

export const metadata = { title: "Join as a health professional" };

export default function Page() {
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <DoctorRegisterForm />
    </main>
  );
}
