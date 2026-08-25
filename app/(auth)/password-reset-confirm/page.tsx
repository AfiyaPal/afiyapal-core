import { PasswordResetConfirmForm } from "@/features/auth/components/password-reset-confirm-form";

export const metadata = { title: "Set new password" };

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <PasswordResetConfirmForm token={token ?? ""} />
    </main>
  );
}
