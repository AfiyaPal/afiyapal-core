"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAdminUser } from "@/server/auth/admin-guard";

function parseNotificationId(formData: FormData) {
  const notificationId = Number(formData.get("notificationId"));
  if (!Number.isInteger(notificationId) || notificationId <= 0) throw new Error("Invalid notification id.");
  return notificationId;
}

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireAdminUser();
  const notificationId = parseNotificationId(formData);

  await prisma.notification.updateMany({
    where: { id: notificationId, recipientUserId: user.id },
    data: { status: "READ", readAt: new Date() }
  });

  revalidatePath(routes.adminNotifications);
}

export async function markAllNotificationsReadAction() {
  const user = await requireAdminUser();

  await prisma.notification.updateMany({
    where: { recipientUserId: user.id, status: "UNREAD" },
    data: { status: "READ", readAt: new Date() }
  });

  revalidatePath(routes.adminNotifications);
}
