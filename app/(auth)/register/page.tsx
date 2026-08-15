import { Suspense } from "react";
import { RegisterForm } from "@/features/auth/components/register-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Join as a health professional",
  description: "Create a verified AfiyaPal account for health professionals. Complete your professional profile from your dashboard after signing up.",
  path: "/register"
});

export default function Page() {
  return (
    <main className="container-page flex min-h-[80vh] items-center justify-center py-10 md:py-14">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
