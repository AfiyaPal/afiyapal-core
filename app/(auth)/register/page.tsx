import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = { title: "Create account" };

export default function Page() {
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <RegisterForm />
    </main>
  );
}
