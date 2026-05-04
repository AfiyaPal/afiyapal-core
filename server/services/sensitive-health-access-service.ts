import "server-only";
import { prisma } from "@/server/db/prisma";
import { createAdminAuditLog } from "@/server/services/admin-audit-log-service";

export const SENSITIVE_HEALTH_TARGET_TYPES = ["SymptomCheckLog", "AiInteractionFlag", "MentalHealthInteraction"] as const;
export type SensitiveHealthTargetType = (typeof SENSITIVE_HEALTH_TARGET_TYPES)[number];

export const SENSITIVE_ACCESS_DURATION_MINUTES = 15;

function assertValidReason(reason: string | null | undefined) {
  const trimmed = reason?.trim();
  if (!trimmed || trimmed.length < 12) {
    throw new Error("Please provide a clear reason of at least 12 characters before viewing sensitive health details.");
  }
  return trimmed.slice(0, 1200);
}

function assertValidTargetType(targetType: string): asserts targetType is SensitiveHealthTargetType {
  if (!SENSITIVE_HEALTH_TARGET_TYPES.includes(targetType as SensitiveHealthTargetType)) {
    throw new Error("Invalid sensitive health target type.");
  }
}

export async function grantSensitiveHealthAccess(input: {
  adminUserId: number;
  targetType: SensitiveHealthTargetType;
  targetId: number;
  reason: string;
}) {
  const reason = assertValidReason(input.reason);
  assertValidTargetType(input.targetType);

  const expiresAt = new Date(Date.now() + SENSITIVE_ACCESS_DURATION_MINUTES * 60 * 1000);

  const grant = await prisma.adminSensitiveHealthAccessGrant.create({
    data: {
      adminUserId: input.adminUserId,
      targetType: input.targetType,
      targetId: String(input.targetId),
      reason,
      expiresAt
    }
  });

  await createAdminAuditLog({
    adminUserId: input.adminUserId,
    actionType: "SENSITIVE_HEALTH_DETAILS_VIEWED",
    targetType: input.targetType,
    targetId: input.targetId,
    oldValue: null,
    newValue: { grantId: grant.id, expiresAt },
    reason
  });

  return grant;
}

export async function hasActiveSensitiveHealthAccess(input: {
  adminUserId: number;
  targetType: SensitiveHealthTargetType;
  targetId: number;
}) {
  assertValidTargetType(input.targetType);

  const grant = await prisma.adminSensitiveHealthAccessGrant.findFirst({
    where: {
      adminUserId: input.adminUserId,
      targetType: input.targetType,
      targetId: String(input.targetId),
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, reason: true, expiresAt: true, createdAt: true }
  });

  return grant;
}
