import { getCurrentUser } from "@/server/auth/session";
import { redirect, notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getDoctorBlogDetail } from "@/features/doctor/queries/get-doctor-blogs";
import { DoctorBlogDetail } from "@/features/doctor/components/doctor-blog-detail";

export default async function Page({ params }: { params: Promise<{ blogId: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const { blogId } = await params;
  const id = Number(blogId);
  if (!Number.isInteger(id)) notFound();

  const blog = await getDoctorBlogDetail(id, user.id);
  if (!blog) notFound();

  return <DoctorBlogDetail blog={blog} />;
}
