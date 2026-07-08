import { DoctorRegisterForm } from "@/features/auth/components/doctor-register-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Join as a health professional",
  description: "Register as a verified doctor or health professional on AfiyaPal and connect with patients across Africa.",
  path: "/register/doctor"
});

export default function Page() {
  return (
    <main className="container-page flex min-h-[80vh] items-center justify-center py-10 md:py-14">
      <DoctorRegisterForm />
    </main>
  );
}
