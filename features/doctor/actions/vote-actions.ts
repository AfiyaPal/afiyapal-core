"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { canUserVote } from "@/features/doctor/queries/get-votes";

export async function voteAction(blogId: number, vote: "UP" | "DOWN") {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, message: "You must be signed in to vote." };

    const eligible = await canUserVote(user.id);
    if (!eligible) return { ok: false, message: "Only verified health professionals can vote." };

    await prisma.$transaction(async (tx) => {
      const existing = await tx.blogVote.findUnique({
        where: { blogId_userId: { blogId, userId: user.id } }
      });

      if (existing) {
        if (existing.vote === vote) {
          throw new Error("ALREADY_VOTED");
        }
        await tx.blogVote.update({
          where: { id: existing.id },
          data: { vote }
        });
      } else {
        await tx.blogVote.create({
          data: { blogId, userId: user.id, vote }
        });
      }
    });

    revalidatePath(`/dashboard/blogs/${blogId}`);
    revalidatePath(`/blogs`);
    return { ok: true, message: vote === "UP" ? "Upvoted." : "Downvoted." };
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY_VOTED") {
      return { ok: false, message: `You already voted ${vote === "UP" ? "up" : "down"} on this article.` };
    }
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}

export async function unvoteAction(blogId: number) {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, message: "You must be signed in." };

    await prisma.$transaction(async (tx) => {
      const existing = await tx.blogVote.findUnique({
        where: { blogId_userId: { blogId, userId: user.id } }
      });
      if (!existing) {
        throw new Error("NOT_VOTED");
      }
      await tx.blogVote.delete({ where: { id: existing.id } });
    });

    revalidatePath(`/dashboard/blogs/${blogId}`);
    revalidatePath(`/blogs`);
    return { ok: true, message: "Vote removed." };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_VOTED") {
      return { ok: false, message: "You haven't voted on this article." };
    }
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
