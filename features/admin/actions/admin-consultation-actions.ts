"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { CONSULTATION_STATUSES, type ConsultationStatus } from "@/features/admin/data/consultation-management";

function parseRequestId(formData: FormData) {
  const requestId = Number(formData.get("requestId"));
  if (!Number.isInteger(requestId) || requestId <= 0) throw new Error("Invalid consultation request id.");
  return requestId;
}

function parseOptionalDoctorId(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return null;
  const doctorId = Number(value);
  if (!Number.isInteger(doctorId) || doctorId <= 0) return null;
  return doctorId;
}

function parseStatus(value: FormDataEntryValue | null): ConsultationStatus {
  if (typeof value !== "string" || !CONSULTATION_STATUSES.includes(value as ConsultationStatus)) {
    throw new Error("Invalid consultation status.");
  }
  return value as ConsultationStatus;
}

function readOptionalText(value: FormDataEntryValue | null, maxLength = 1600) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

async function ensureConsultationExists(requestId: number) {
  const request = await prisma.consultationRequest.findUnique({
    where: { id: requestId },
    select: { id: true, status: true, assignedDoctorId: true }
  });

  if (!request) throw new Error("Consultation request not found.");
  return request;
}

export async function assignConsultationDoctorAction(formData: FormData) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS]);
  const requestId = parseRequestId(formData);
  const doctorId = parseOptionalDoctorId(formData.get("assignedDoctorId"));
  await ensureConsultationExists(requestId);

  if (doctorId) {
    const doctor = await prisma.doctorProfile.findFirst({
      where: { id: doctorId, verificationStatus: "VERIFIED" },
      select: { id: true }
    });

    if (!doctor) throw new Error("Only verified doctors can be assigned to consultation requests.");
  }

  await prisma.consultationRequest.update({
    where: { id: requestId },
    data: {
      assignedDoctorId: doctorId,
      status: doctorId ? "ASSIGNED" : "AWAITING_ASSIGNMENT"
    }
  });

  revalidatePath(routes.adminConsultations);
  revalidatePath(`${routes.adminConsultations}/${requestId}`);
}

export async function updateConsultationStatusAction(formData: FormData) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS]);
  const requestId = parseRequestId(formData);
  const status = parseStatus(formData.get("status"));
  await ensureConsultationExists(requestId);

  await prisma.consultationRequest.update({ where: { id: requestId }, data: { status } });

  revalidatePath(routes.adminConsultations);
  revalidatePath(`${routes.adminConsultations}/${requestId}`);
}

export async function updateConsultationNotesAction(formData: FormData) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS]);
  const requestId = parseRequestId(formData);
  await ensureConsultationExists(requestId);

  await prisma.consultationRequest.update({
    where: { id: requestId },
    data: { adminNotes: readOptionalText(formData.get("adminNotes")) }
  });

  revalidatePath(routes.adminConsultations);
  revalidatePath(`${routes.adminConsultations}/${requestId}`);
}
