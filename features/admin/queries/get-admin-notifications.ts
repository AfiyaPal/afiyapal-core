import "server-only";
import { prisma } from "@/server/db/prisma";
import { requireAdminUser } from "@/server/auth/admin-guard";

export type AdminNotificationFilters = {
  status?: string;
  priority?: string;
  type?: string;
};

export async function getAdminNotifications(filters: AdminNotificationFilters = {}) {
  const user = await requireAdminUser();
  const where = {
    recipientUserId: user.id,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.type ? { type: filters.type } : {})
  };

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
        priority: true,
        status: true,
        targetType: true,
        targetId: true,
        readAt: true,
        createdAt: true
      }
    }),
    prisma.notification.count({ where: { recipientUserId: user.id, status: "UNREAD" } })
  ]);

  return { notifications, unreadCount };
}
