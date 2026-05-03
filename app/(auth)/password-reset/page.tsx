import { PasswordResetForm } from "@/features/auth/components/password-reset-form";

export const metadata = { title: "Reset password" };

export default function Page() {
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <PasswordResetForm />
    </main>
  );
}
