import "server-only";
import { prisma } from "@/server/db/prisma";
import type { AdminAuditAction, AdminAuditTargetType } from "@/features/admin/data/admin-audit-log";

type AuditClient = Pick<typeof prisma, "adminAuditLog">;

type AuditValue = string | number | boolean | null | undefined | Record<string, unknown> | Array<unknown>;

export type CreateAdminAuditLogInput = {
  adminUserId?: number | null;
  actionType: AdminAuditAction;
  targetType: AdminAuditTargetType;
  targetId: string | number;
  oldValue?: AuditValue;
  newValue?: AuditValue;
  reason?: string | null;
};

function serializeAuditValue(value: AuditValue) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "string") return value.slice(0, 4000);
  return JSON.stringify(value).slice(0, 4000);
}

export function buildAdminAuditLogData(input: CreateAdminAuditLogInput) {
  return {
    adminUserId: input.adminUserId ?? null,
    actionType: input.actionType,
    targetType: input.targetType,
    targetId: String(input.targetId),
    oldValue: serializeAuditValue(input.oldValue),
    newValue: serializeAuditValue(input.newValue),
    reason: input.reason?.trim() ? input.reason.trim().slice(0, 1200) : null
  };
}

export async function createAdminAuditLog(input: CreateAdminAuditLogInput, client: AuditClient = prisma) {
  return client.adminAuditLog.create({ data: buildAdminAuditLogData(input) });
}
