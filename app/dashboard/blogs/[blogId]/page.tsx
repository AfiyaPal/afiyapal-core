import { getCurrentUser } from "@/server/auth/session";
import { redirect, notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { getDoctorBlogDetail } from "@/features/doctor/queries/get-doctor-blogs";
import { DoctorBlogDetail } from "@/features/doctor/components/doctor-blog-detail";
import { getVoteCounts, getUserVote, canUserVote } from "@/features/doctor/queries/get-votes";

export default async function Page({ params }: { params: Promise<{ blogId: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const { blogId } = await params;
  const id = Number(blogId);
  if (!Number.isInteger(id)) notFound();

  const [blog, votes, canVote] = await Promise.all([
    getDoctorBlogDetail(id, user.id),
    getVoteCounts(id),
    canUserVote(user.id)
  ]);
  if (!blog) notFound();

  const userVote = await getUserVote(id, user.id);

  return (
    <DoctorBlogDetail
      blog={blog}
      voteUp={votes.up}
      voteDown={votes.down}
      userVote={userVote}
      canVote={canVote}
    />
  );
}
