"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { CONSULTATION_STATUSES, type ConsultationStatus } from "@/features/admin/data/consultation-management";
import { buildAdminAuditLogData } from "@/server/services/admin-audit-log-service";
import { notifyDoctorAssignedConsultation, notifyUserConsultationAssigned, notifyUserDoctorResponded } from "@/server/services/notification-service";

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
    select: { id: true, status: true, assignedDoctorId: true, urgencyLevel: true }
  });

  if (!request) throw new Error("Consultation request not found.");
  return request;
}

export async function assignConsultationDoctorAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS]);
  const requestId = parseRequestId(formData);
  const doctorId = parseOptionalDoctorId(formData.get("assignedDoctorId"));
  const existing = await ensureConsultationExists(requestId);

  let assignedDoctorName: string | null = null;

  if (doctorId) {
    const doctor = await prisma.doctorProfile.findFirst({
      where: { id: doctorId, verificationStatus: "VERIFIED" },
      select: { id: true, fullName: true }
    });

    if (!doctor) throw new Error("Only verified doctors can be assigned to consultation requests.");
    assignedDoctorName = doctor.fullName;
  }

  await prisma.$transaction([
    prisma.consultationRequest.update({
      where: { id: requestId },
      data: {
        assignedDoctorId: doctorId,
        status: doctorId ? "ASSIGNED" : "AWAITING_ASSIGNMENT"
      }
    }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "CONSULTATION_ASSIGNED",
        targetType: "ConsultationRequest",
        targetId: requestId,
        oldValue: { assignedDoctorId: existing.assignedDoctorId, status: existing.status },
        newValue: { assignedDoctorId: doctorId, status: doctorId ? "ASSIGNED" : "AWAITING_ASSIGNMENT" },
        reason: doctorId ? "Consultation assigned to a verified doctor." : "Consultation doctor assignment cleared."
      })
    })
  ]);

  if (doctorId) {
    await Promise.allSettled([
      notifyDoctorAssignedConsultation({ doctorProfileId: doctorId, consultationRequestId: requestId, urgencyLevel: existing.urgencyLevel }),
      notifyUserConsultationAssigned({ consultationRequestId: requestId, doctorName: assignedDoctorName })
    ]);
  }

  revalidatePath(routes.adminConsultations);
  revalidatePath(routes.adminAuditLogs);
  revalidatePath(`${routes.adminConsultations}/${requestId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function updateConsultationStatusAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS]);
  const requestId = parseRequestId(formData);
  const status = parseStatus(formData.get("status"));
  const existing = await ensureConsultationExists(requestId);

  await prisma.$transaction([
    prisma.consultationRequest.update({ where: { id: requestId }, data: { status } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "CONSULTATION_STATUS_CHANGED",
        targetType: "ConsultationRequest",
        targetId: requestId,
        oldValue: { status: existing.status },
        newValue: { status },
        reason: "Consultation request status changed from admin queue."
      })
    })
  ]);

  if (["ASSIGNED", "ACCEPTED_BY_DOCTOR", "COMPLETED", "CANCELLED"].includes(status)) {
    await notifyUserDoctorResponded({ consultationRequestId: requestId, status }).catch((error) =>
      console.error("Failed to notify user about consultation status update", error)
    );
  }

  revalidatePath(routes.adminConsultations);
  revalidatePath(routes.adminAuditLogs);
  revalidatePath(`${routes.adminConsultations}/${requestId}`);
  revalidatePath(routes.adminAuditLogs);
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
  revalidatePath(routes.adminAuditLogs);
  revalidatePath(`${routes.adminConsultations}/${requestId}`);
  revalidatePath(routes.adminAuditLogs);
}
