import "server-only";
import { prisma } from "@/server/db/prisma";
import { DOCTOR_VERIFICATION_STATUSES, type DoctorVerificationStatus } from "@/features/admin/data/doctor-management";

export type AdminDoctorFilters = { search?: string; status?: string; specialty?: string; language?: string };
const PAGE_SIZE = 25;

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isStatus(value: string | undefined): value is DoctorVerificationStatus {
  return !!value && DOCTOR_VERIFICATION_STATUSES.includes(value as DoctorVerificationStatus);
}

export async function getAdminDoctors(filters: AdminDoctorFilters = {}) {
  const search = normalize(filters.search);
  const status = normalize(filters.status);
  const specialty = normalize(filters.specialty);
  const language = normalize(filters.language);

  const where = {
    ...(search ? { OR: [{ fullName: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }, { licenseNumber: { contains: search } }] } : {}),
    ...(isStatus(status) ? { verificationStatus: status } : {}),
    ...(specialty ? { specialty: { contains: specialty } } : {}),
    ...(language ? { languagesSpoken: { contains: language } } : {})
  };

  const [doctors, total] = await Promise.all([
    prisma.doctorProfile.findMany({
      where,
      orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
      take: PAGE_SIZE,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        country: true,
        cityRegion: true,
        specialty: true,
        languagesSpoken: true,
        licenseNumber: true,
        verificationStatus: true,
        availabilityStatus: true,
        createdAt: true,
        verifiedById: true,
        verifiedAt: true,
        rejectionReason: true,
        suspensionReason: true
      }
    }),
    prisma.doctorProfile.count({ where })
  ]);

  return { doctors, total, pageSize: PAGE_SIZE };
}
