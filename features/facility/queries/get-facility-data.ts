import "server-only";
import { prisma } from "@/server/db/prisma";

export async function getFacilityByAdminId(adminId: number) {
  return prisma.facility.findFirst({
    where: { adminId },
    include: {
      professionals: {
        include: {
          doctorProfile: { select: { id: true, fullName: true, specialty: true, verificationStatus: true } }
        }
      },
      events: { orderBy: { startDate: "desc" } }
    }
  });
}

export async function getFacilityById(id: number) {
  return prisma.facility.findUnique({
    where: { id },
    include: {
      professionals: {
        include: {
          doctorProfile: { select: { id: true, fullName: true, specialty: true, verificationStatus: true } }
        }
      },
      events: { orderBy: { startDate: "desc" } }
    }
  });
}

export async function getFacilityEvents(facilityId: number) {
  return prisma.event.findMany({
    where: { facilityId },
    orderBy: { startDate: "desc" }
  });
}

export async function getFacilityEventDetail(eventId: number, facilityId: number) {
  return prisma.event.findFirst({
    where: { id: eventId, facilityId }
  });
}

export async function getAvailableDoctors() {
  return prisma.doctorProfile.findMany({
    where: { verificationStatus: "VERIFIED" },
    select: { id: true, fullName: true, specialty: true, userId: true },
    orderBy: { fullName: "asc" }
  });
}
