import "server-only";
import { prisma } from "@/server/db/prisma";
import { ADMIN_AUDIT_ACTIONS, ADMIN_AUDIT_TARGET_TYPES, type AdminAuditAction, type AdminAuditTargetType } from "@/features/admin/data/admin-audit-log";

export type AdminAuditLogFilters = {
  search?: string;
  actionType?: string;
  targetType?: string;
  adminUserId?: string;
  startDate?: string;
  endDate?: string;
};

const PAGE_SIZE = 30;

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseDate(value: string | undefined, endOfDay = false) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay) date.setHours(23, 59, 59, 999);
  return date;
}

function parseId(value: string | undefined) {
  if (!value) return undefined;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

function isAuditAction(value: string | undefined): value is AdminAuditAction {
  return !!value && ADMIN_AUDIT_ACTIONS.includes(value as AdminAuditAction);
}

function isTargetType(value: string | undefined): value is AdminAuditTargetType {
  return !!value && ADMIN_AUDIT_TARGET_TYPES.includes(value as AdminAuditTargetType);
}

function dateWhere(startDate?: string, endDate?: string) {
  const gte = parseDate(startDate);
  const lte = parseDate(endDate, true);
  if (!gte && !lte) return {};
  return { createdAt: { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) } };
}

export async function getAdminAuditLogs(filters: AdminAuditLogFilters = {}) {
  const search = normalize(filters.search);
  const actionType = normalize(filters.actionType);
  const targetType = normalize(filters.targetType);
  const adminUserId = parseId(filters.adminUserId);

  const where = {
    ...(search
      ? {
          OR: [
            { actionType: { contains: search } },
            { targetType: { contains: search } },
            { targetId: { contains: search } },
            { oldValue: { contains: search } },
            { newValue: { contains: search } },
            { reason: { contains: search } }
          ]
        }
      : {}),
    ...(isAuditAction(actionType) ? { actionType } : {}),
    ...(isTargetType(targetType) ? { targetType } : {}),
    ...(adminUserId ? { adminUserId } : {}),
    ...dateWhere(filters.startDate, filters.endDate)
  };

  const [logs, total, admins] = await Promise.all([
    prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      select: {
        id: true,
        adminUserId: true,
        actionType: true,
        targetType: true,
        targetId: true,
        oldValue: true,
        newValue: true,
        reason: true,
        createdAt: true
      }
    }),
    prisma.adminAuditLog.count({ where }),
    prisma.user.findMany({
      where: { role: { in: ["ADMIN", "SUPER_ADMIN", "SUPPORT_ADMIN", "MEDICAL_REVIEWER", "DOCTOR_MANAGER", "CONTENT_MANAGER"] } },
      orderBy: [{ role: "asc" }, { username: "asc" }],
      select: { id: true, username: true, email: true, role: true, status: true }
    })
  ]);

  const adminById = new Map(admins.map((admin) => [admin.id, admin]));

  return {
    logs: logs.map((log) => ({ ...log, adminUser: log.adminUserId ? adminById.get(log.adminUserId) ?? null : null })),
    admins,
    total,
    pageSize: PAGE_SIZE
  };
}
