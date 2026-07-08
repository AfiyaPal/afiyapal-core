import { RegisterForm } from "@/features/auth/components/register-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Create account",
  description: "Create a free AfiyaPal account for AI health guidance, trusted articles, and pathways to verified care.",
  path: "/register"
});

export default function Page() {
  return (
    <main className="container-page flex min-h-[80vh] items-center justify-center py-10 md:py-14">
      <RegisterForm />
    </main>
  );
}
