import "server-only";
import { prisma } from "@/server/db/prisma";

export async function getDoctorBlogs(userId: number) {
  return prisma.blog.findMany({
    where: { creatorId: userId },
    include: {
      category: { select: { name: true } },
      media: { select: { mediaUrl: true, altText: true }, take: 1 }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getDoctorBlogDetail(blogId: number, userId: number) {
  const article = await prisma.blog.findFirst({
    where: { id: blogId, creatorId: userId },
    include: {
      category: { select: { id: true, name: true } },
      media: { select: { mediaUrl: true, altText: true, mediaType: true } },
      comments: {
        select: { id: true, comment: true, createdAt: true, user: { select: { username: true } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  return article;
}

export async function getDoctorNotifications(userId: number) {
  return prisma.notification.findMany({
    where: { recipientUserId: userId },
    orderBy: { createdAt: "desc" },
    take: 10
  });
}
