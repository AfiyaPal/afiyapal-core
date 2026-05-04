import "server-only";
import { prisma } from "@/server/db/prisma";
import { CONSULTATION_STATUSES, CONSULTATION_URGENCY_LEVELS, type ConsultationStatus, type ConsultationUrgencyLevel } from "@/features/admin/data/consultation-management";

export type ConsultationFilters = {
  search?: string;
  status?: string;
  urgency?: string;
  specialty?: string;
  language?: string;
  assignment?: string;
};

const PAGE_SIZE = 25;

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isValidStatus(value: string | undefined): value is ConsultationStatus {
  return !!value && CONSULTATION_STATUSES.includes(value as ConsultationStatus);
}

function isValidUrgency(value: string | undefined): value is ConsultationUrgencyLevel {
  return !!value && CONSULTATION_URGENCY_LEVELS.includes(value as ConsultationUrgencyLevel);
}

function isValidLanguage(value: string | undefined) {
  return value === "en" || value === "sw";
}

export async function getAdminConsultations(filters: ConsultationFilters = {}) {
  const search = normalize(filters.search);
  const status = normalize(filters.status);
  const urgency = normalize(filters.urgency);
  const specialty = normalize(filters.specialty);
  const language = normalize(filters.language);
  const assignment = normalize(filters.assignment);

  const where = {
    ...(search
      ? {
          OR: [
            { reasonSummary: { contains: search } },
            { countryRegion: { contains: search } },
            { requestedSpecialty: { contains: search } },
            { adminNotes: { contains: search } }
          ]
        }
      : {}),
    ...(isValidStatus(status) ? { status } : {}),
    ...(isValidUrgency(urgency) ? { urgencyLevel: urgency } : {}),
    ...(specialty ? { requestedSpecialty: { contains: specialty } } : {}),
    ...(isValidLanguage(language) ? { preferredLanguage: language } : {}),
    ...(assignment === "assigned" ? { assignedDoctorId: { not: null } } : {}),
    ...(assignment === "unassigned" ? { assignedDoctorId: null } : {})
  };

  const [requests, total] = await Promise.all([
    prisma.consultationRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      select: {
        id: true,
        userId: true,
        assignedDoctorId: true,
        reasonSummary: true,
        preferredLanguage: true,
        countryRegion: true,
        urgencyLevel: true,
        requestedSpecialty: true,
        status: true,
        adminNotes: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.consultationRequest.count({ where })
  ]);

  const userIds = [...new Set(requests.map((request) => request.userId).filter((id): id is number => typeof id === "number"))];
  const doctorIds = [...new Set(requests.map((request) => request.assignedDoctorId).filter((id): id is number => typeof id === "number"))];

  const [users, doctors] = await Promise.all([
    userIds.length
      ? prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, username: true, email: true, preferredLanguage: true } })
      : Promise.resolve([]),
    doctorIds.length
      ? prisma.doctorProfile.findMany({ where: { id: { in: doctorIds } }, select: { id: true, fullName: true, specialty: true, verificationStatus: true } })
      : Promise.resolve([])
  ]);

  const userById = new Map(users.map((user) => [user.id, user]));
  const doctorById = new Map(doctors.map((doctor) => [doctor.id, doctor]));

  return {
    requests: requests.map((request) => ({
      ...request,
      user: request.userId ? userById.get(request.userId) ?? null : null,
      assignedDoctor: request.assignedDoctorId ? doctorById.get(request.assignedDoctorId) ?? null : null
    })),
    total,
    pageSize: PAGE_SIZE
  };
}

export async function getAdminConsultationDetail(requestId: number) {
  const request = await prisma.consultationRequest.findUnique({
    where: { id: requestId },
    select: {
      id: true,
      userId: true,
      assignedDoctorId: true,
      reasonSummary: true,
      preferredLanguage: true,
      countryRegion: true,
      urgencyLevel: true,
      requestedSpecialty: true,
      status: true,
      adminNotes: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!request) return null;

  const [user, assignedDoctor, verifiedDoctors] = await Promise.all([
    request.userId
      ? prisma.user.findUnique({
          where: { id: request.userId },
          select: { id: true, username: true, email: true, phone: true, preferredLanguage: true, status: true, createdAt: true }
        })
      : Promise.resolve(null),
    request.assignedDoctorId
      ? prisma.doctorProfile.findUnique({
          where: { id: request.assignedDoctorId },
          select: { id: true, fullName: true, email: true, phone: true, specialty: true, languagesSpoken: true, country: true, cityRegion: true, verificationStatus: true, availabilityStatus: true }
        })
      : Promise.resolve(null),
    prisma.doctorProfile.findMany({
      where: { verificationStatus: "VERIFIED" },
      orderBy: [{ specialty: "asc" }, { fullName: "asc" }],
      select: { id: true, fullName: true, specialty: true, country: true, cityRegion: true, languagesSpoken: true, availabilityStatus: true }
    })
  ]);

  return { request, user, assignedDoctor, verifiedDoctors };
}
