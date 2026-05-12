import { getCurrentUser } from "@/server/auth/session";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getDoctorBlogs } from "@/features/doctor/queries/get-doctor-blogs";
import { DoctorBlogList } from "@/features/doctor/components/doctor-blog-list";

export const metadata = { title: "My articles" };

export default async function Page() {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const blogs = await getDoctorBlogs(user.id);

  return <DoctorBlogList blogs={blogs} />;
}
