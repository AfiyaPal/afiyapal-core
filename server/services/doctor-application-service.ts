import "server-only";
import { prisma } from "@/server/db/prisma";
import { notifyAdminsDoctorApplied } from "@/server/services/notification-service";

type DoctorApplicationInput = {
  userId?: number | null;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  cityRegion?: string | null;
  licenseNumber?: string | null;
  specialty?: string | null;
  languagesSpoken?: string | null;
  yearsOfExperience?: number | null;
  bio?: string | null;
};

function normalizeText(value: string | null | undefined, maxLength = 500) {
  if (!value) return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export async function createDoctorApplication(input: DoctorApplicationInput) {
  const doctor = await prisma.doctorProfile.create({
    data: {
      userId: input.userId ?? null,
      fullName: normalizeText(input.fullName, 180) ?? "Doctor applicant",
      email: normalizeText(input.email, 180),
      phone: normalizeText(input.phone, 60),
      country: normalizeText(input.country, 120),
      cityRegion: normalizeText(input.cityRegion, 120),
      licenseNumber: normalizeText(input.licenseNumber, 120),
      specialty: normalizeText(input.specialty, 120),
      languagesSpoken: normalizeText(input.languagesSpoken, 240),
      yearsOfExperience: input.yearsOfExperience ?? null,
      bio: normalizeText(input.bio, 1200),
      verificationStatus: "PENDING",
      availabilityStatus: "UNAVAILABLE"
    }
  });

  await notifyAdminsDoctorApplied({ doctorProfileId: doctor.id, doctorName: doctor.fullName }).catch((error) =>
    console.error("Failed to notify admins about doctor application", error)
  );

  return doctor;
}
