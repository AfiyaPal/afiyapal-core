"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { canUserVote } from "@/features/doctor/queries/get-votes";

export async function voteAction(blogId: number, vote: "UP" | "DOWN") {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "You must be signed in to vote." };

  const eligible = await canUserVote(user.id);
  if (!eligible) return { ok: false, message: "Only verified health professionals can vote." };

  const existing = await prisma.blogVote.findUnique({
    where: { blogId_userId: { blogId, userId: user.id } }
  });

  if (existing) {
    if (existing.vote === vote) {
      return { ok: false, message: `You already voted ${vote === "UP" ? "up" : "down"} on this article.` };
    }
    await prisma.blogVote.update({
      where: { id: existing.id },
      data: { vote }
    });
  } else {
    await prisma.blogVote.create({
      data: { blogId, userId: user.id, vote }
    });
  }

  revalidatePath(`/dashboard/blogs/${blogId}`);
  revalidatePath(`/blogs`);
  return { ok: true, message: vote === "UP" ? "Upvoted." : "Downvoted." };
}

export async function unvoteAction(blogId: number) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "You must be signed in." };

  const existing = await prisma.blogVote.findUnique({
    where: { blogId_userId: { blogId, userId: user.id } }
  });
  if (!existing) return { ok: false, message: "You haven't voted on this article." };

  await prisma.blogVote.delete({ where: { id: existing.id } });

  revalidatePath(`/dashboard/blogs/${blogId}`);
  revalidatePath(`/blogs`);
  return { ok: true, message: "Vote removed." };
}
