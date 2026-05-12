import "server-only";
import { prisma } from "@/server/db/prisma";

export async function getPublicEvents() {
  return prisma.event.findMany({
    where: {
      isPublic: true,
      status: { in: ["UPCOMING", "ONGOING"] },
      facility: { verificationStatus: "VERIFIED" }
    },
    include: {
      facility: { select: { name: true, city: true, country: true, type: true } }
    },
    orderBy: { startDate: "asc" }
  });
}

export async function getPublicEventDetail(eventId: number) {
  return prisma.event.findFirst({
    where: { id: eventId, isPublic: true, facility: { verificationStatus: "VERIFIED" } },
    include: {
      facility: { select: { id: true, name: true, type: true, city: true, country: true, address: true, phone: true, email: true, website: true, description: true } }
    }
  });
}
