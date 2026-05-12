import "server-only";
import { prisma } from "@/server/db/prisma";

export async function getDoctorProfile(userId: number) {
  return prisma.doctorProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      fullName: true,
      specialty: true,
      verificationStatus: true,
      availabilityStatus: true,
      country: true,
      cityRegion: true,
      licenseNumber: true,
      yearsOfExperience: true,
      languagesSpoken: true,
      bio: true,
      rejectionReason: true,
      suspensionReason: true,
      createdAt: true
    }
  });
}
