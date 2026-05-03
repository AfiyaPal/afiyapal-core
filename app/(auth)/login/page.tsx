import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = { title: "Sign in" };

export default function Page() {
  return (
    <main className="container-page flex min-h-[70vh] items-center justify-center py-12">
      <LoginForm />
    </main>
  );
}
