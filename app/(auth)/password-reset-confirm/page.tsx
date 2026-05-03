import { PasswordResetConfirmForm } from "@/features/auth/components/password-reset-confirm-form";

export const metadata = { title: "Set new password" };

export default function Page() {
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <PasswordResetConfirmForm />
    </main>
  );
}
