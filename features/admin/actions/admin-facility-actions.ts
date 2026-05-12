"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { buildAdminAuditLogData } from "@/server/services/admin-audit-log-service";

export async function getAdminFacilities() {
  const facilities = await prisma.facility.findMany({
    include: {
      professionals: { include: { doctorProfile: { select: { fullName: true, specialty: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });
  return facilities;
}

export async function approveFacilityAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.APPROVE_REJECT_FACILITIES]);
  const facilityId = Number(formData.get("facilityId"));
  if (!Number.isInteger(facilityId) || facilityId <= 0) throw new Error("Invalid facility id.");

  const existing = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!existing) throw new Error("Facility not found.");

  await prisma.$transaction([
    prisma.facility.update({
      where: { id: facilityId },
      data: { verificationStatus: "VERIFIED", verifiedById: actor.id, verifiedAt: new Date(), rejectionReason: null, suspensionReason: null }
    }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "FACILITY_APPROVED",
        targetType: "Facility",
        targetId: facilityId,
        oldValue: { verificationStatus: existing.verificationStatus },
        newValue: { verificationStatus: "VERIFIED" },
        reason: "Facility approved from admin verification workflow."
      })
    })
  ]);

  revalidatePath(routes.adminFacilities);
  revalidatePath(routes.adminAuditLogs);
}

export async function rejectFacilityAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.APPROVE_REJECT_FACILITIES]);
  const facilityId = Number(formData.get("facilityId"));
  if (!Number.isInteger(facilityId) || facilityId <= 0) throw new Error("Invalid facility id.");

  const reason = typeof formData.get("reason") === "string" ? (formData.get("reason") as string).trim() || "Facility application rejected." : "Facility application rejected.";
  const existing = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!existing) throw new Error("Facility not found.");

  await prisma.$transaction([
    prisma.facility.update({
      where: { id: facilityId },
      data: { verificationStatus: "REJECTED", rejectionReason: reason, verifiedById: null, verifiedAt: null }
    }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "FACILITY_REJECTED",
        targetType: "Facility",
        targetId: facilityId,
        oldValue: { verificationStatus: existing.verificationStatus },
        newValue: { verificationStatus: "REJECTED", rejectionReason: reason },
        reason
      })
    })
  ]);

  revalidatePath(routes.adminFacilities);
  revalidatePath(routes.adminAuditLogs);
}

export async function suspendFacilityAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.APPROVE_REJECT_FACILITIES]);
  const facilityId = Number(formData.get("facilityId"));
  if (!Number.isInteger(facilityId) || facilityId <= 0) throw new Error("Invalid facility id.");

  const reason = typeof formData.get("reason") === "string" ? (formData.get("reason") as string).trim() || "Facility suspended." : "Facility suspended.";
  const existing = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!existing) throw new Error("Facility not found.");

  await prisma.$transaction([
    prisma.facility.update({
      where: { id: facilityId },
      data: { verificationStatus: "SUSPENDED", suspensionReason: reason }
    }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "FACILITY_SUSPENDED",
        targetType: "Facility",
        targetId: facilityId,
        oldValue: { verificationStatus: existing.verificationStatus },
        newValue: { verificationStatus: "SUSPENDED", suspensionReason: reason },
        reason
      })
    })
  ]);

  revalidatePath(routes.adminFacilities);
  revalidatePath(routes.adminAuditLogs);
}
