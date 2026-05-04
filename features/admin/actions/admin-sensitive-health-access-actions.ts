"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { grantSensitiveHealthAccess, type SensitiveHealthTargetType } from "@/server/services/sensitive-health-access-service";

function readPositiveId(value: FormDataEntryValue | null) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid target id.");
  return id;
}

function readTargetType(value: FormDataEntryValue | null): SensitiveHealthTargetType {
  if (value === "SymptomCheckLog" || value === "AiInteractionFlag" || value === "MentalHealthInteraction") return value;
  throw new Error("Invalid sensitive health target type.");
}

function readReason(value: FormDataEntryValue | null) {
  if (typeof value !== "string") throw new Error("A reason is required before viewing sensitive health details.");
  return value;
}

function redirectForTarget(targetType: SensitiveHealthTargetType, targetId: number) {
  if (targetType === "SymptomCheckLog") redirect(`${routes.adminSymptomChecks}/${targetId}?sensitive=1`);
  if (targetType === "AiInteractionFlag") redirect(`${routes.adminAiFlags}/${targetId}?sensitive=1`);
  redirect(routes.adminAiFlags);
}

export async function requestSensitiveHealthAccessAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.VIEW_SENSITIVE_HEALTH_DETAILS]);
  const targetType = readTargetType(formData.get("targetType"));
  const targetId = readPositiveId(formData.get("targetId"));
  const reason = readReason(formData.get("reason"));

  await grantSensitiveHealthAccess({
    adminUserId: actor.id,
    targetType,
    targetId,
    reason
  });

  revalidatePath(routes.adminAuditLogs);
  if (targetType === "SymptomCheckLog") revalidatePath(`${routes.adminSymptomChecks}/${targetId}`);
  if (targetType === "AiInteractionFlag") revalidatePath(`${routes.adminAiFlags}/${targetId}`);

  redirectForTarget(targetType, targetId);
}
