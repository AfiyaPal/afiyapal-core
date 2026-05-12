import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { DoctorBlogForm } from "@/features/doctor/components/doctor-blog-form";

export const metadata = { title: "Write new article" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Write new article</h1>
      <p className="mt-1 text-sm text-slate-600">Share your health expertise with the AfiyaPal community.</p>
      <div className="mt-8">
        <DoctorBlogForm />
      </div>
    </div>
  );
}
