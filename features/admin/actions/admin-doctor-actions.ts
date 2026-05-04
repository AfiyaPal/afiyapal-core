"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { buildAdminAuditLogData } from "@/server/services/admin-audit-log-service";

function parseDoctorId(formData: FormData) {
  const doctorId = Number(formData.get("doctorId"));
  if (!Number.isInteger(doctorId) || doctorId <= 0) throw new Error("Invalid doctor profile id.");
  return doctorId;
}

function readOptionalText(value: FormDataEntryValue | null, maxLength = 1200) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

async function ensureDoctorProfile(doctorId: number) {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
    select: { id: true, verificationStatus: true, verifiedById: true, verifiedAt: true, rejectionReason: true, suspensionReason: true }
  });

  if (!doctor) throw new Error("Doctor profile not found.");
  return doctor;
}

export async function approveDoctorAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS]);
  const doctorId = parseDoctorId(formData);
  const existing = await ensureDoctorProfile(doctorId);

  await prisma.$transaction([
    prisma.doctorProfile.update({
      where: { id: doctorId },
      data: { verificationStatus: "VERIFIED", verifiedById: actor.id, verifiedAt: new Date(), rejectionReason: null, suspensionReason: null }
    }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "DOCTOR_APPROVED",
        targetType: "DoctorProfile",
        targetId: doctorId,
        oldValue: { verificationStatus: existing.verificationStatus, verifiedById: existing.verifiedById, verifiedAt: existing.verifiedAt },
        newValue: { verificationStatus: "VERIFIED", verifiedById: actor.id },
        reason: "Doctor profile approved from provider verification workflow."
      })
    })
  ]);

  revalidatePath(routes.adminDoctors);
  revalidatePath(routes.adminAuditLogs);
}

export async function rejectDoctorAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS]);
  const doctorId = parseDoctorId(formData);
  const reason = readOptionalText(formData.get("reason")) ?? "Doctor application rejected.";
  const existing = await ensureDoctorProfile(doctorId);

  await prisma.$transaction([
    prisma.doctorProfile.update({ where: { id: doctorId }, data: { verificationStatus: "REJECTED", rejectionReason: reason, verifiedById: null, verifiedAt: null } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "DOCTOR_REJECTED",
        targetType: "DoctorProfile",
        targetId: doctorId,
        oldValue: { verificationStatus: existing.verificationStatus, rejectionReason: existing.rejectionReason },
        newValue: { verificationStatus: "REJECTED", rejectionReason: reason },
        reason
      })
    })
  ]);

  revalidatePath(routes.adminDoctors);
  revalidatePath(routes.adminAuditLogs);
}

export async function suspendDoctorAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS]);
  const doctorId = parseDoctorId(formData);
  const reason = readOptionalText(formData.get("reason")) ?? "Doctor profile suspended.";
  const existing = await ensureDoctorProfile(doctorId);

  await prisma.$transaction([
    prisma.doctorProfile.update({ where: { id: doctorId }, data: { verificationStatus: "SUSPENDED", suspensionReason: reason } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "DOCTOR_SUSPENDED",
        targetType: "DoctorProfile",
        targetId: doctorId,
        oldValue: { verificationStatus: existing.verificationStatus, suspensionReason: existing.suspensionReason },
        newValue: { verificationStatus: "SUSPENDED", suspensionReason: reason },
        reason
      })
    })
  ]);

  revalidatePath(routes.adminDoctors);
  revalidatePath(routes.adminAuditLogs);
}
