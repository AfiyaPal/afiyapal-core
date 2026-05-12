import { getCurrentUser } from "@/server/auth/session";
import { redirect, notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getDoctorBlogDetail } from "@/features/doctor/queries/get-doctor-blogs";
import { DoctorBlogForm } from "@/features/doctor/components/doctor-blog-form";

export const metadata = { title: "Edit article" };

export default async function Page({ params }: { params: Promise<{ blogId: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const { blogId } = await params;
  const id = Number(blogId);
  if (!Number.isInteger(id)) notFound();

  const blog = await getDoctorBlogDetail(id, user.id);
  if (!blog) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Edit article</h1>
      <p className="mt-1 text-sm text-slate-600">Update your health education article.</p>
      <div className="mt-8">
        <DoctorBlogForm blog={blog} />
      </div>
    </div>
  );
}
