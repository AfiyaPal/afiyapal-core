import "server-only";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/session";

export async function getVoteCounts(blogId: number) {
  const [up, down] = await Promise.all([
    prisma.blogVote.count({ where: { blogId, vote: "UP" } }),
    prisma.blogVote.count({ where: { blogId, vote: "DOWN" } })
  ]);
  return { up, down, total: up - down };
}

export async function getUserVote(blogId: number, userId: number): Promise<"UP" | "DOWN" | null> {
  const vote = await prisma.blogVote.findUnique({
    where: { blogId_userId: { blogId, userId } }
  });
  if (!vote) return null;
  if (vote.vote === "UP" || vote.vote === "DOWN") return vote.vote;
  return null;
}

export async function canUserVote(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
  if (!user) return false;
  if (user.role === "DOCTOR") {
    const profile = await prisma.doctorProfile.findUnique({ where: { userId }, select: { verificationStatus: true } });
    return profile?.verificationStatus === "VERIFIED";
  }
  if (user.role === "FACILITY_ADMIN") {
    const facility = await prisma.facility.findFirst({ where: { adminId: userId }, select: { verificationStatus: true } });
    return facility?.verificationStatus === "VERIFIED";
  }
  return false;
}
