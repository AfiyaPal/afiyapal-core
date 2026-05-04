"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import {
  SAFETY_REPORT_PRIORITIES,
  SAFETY_REPORT_STATUSES,
  type SafetyReportPriority,
  type SafetyReportStatus
} from "@/features/admin/data/report-management";
import { buildAdminAuditLogData } from "@/server/services/admin-audit-log-service";

function parseReportId(formData: FormData) {
  const reportId = Number(formData.get("reportId"));
  if (!Number.isInteger(reportId) || reportId <= 0) throw new Error("Invalid safety report id.");
  return reportId;
}

function parseStatus(value: FormDataEntryValue | null): SafetyReportStatus {
  if (typeof value !== "string" || !SAFETY_REPORT_STATUSES.includes(value as SafetyReportStatus)) {
    throw new Error("Invalid report status.");
  }
  return value as SafetyReportStatus;
}

function parsePriority(value: FormDataEntryValue | null): SafetyReportPriority {
  if (typeof value !== "string" || !SAFETY_REPORT_PRIORITIES.includes(value as SafetyReportPriority)) {
    throw new Error("Invalid report priority.");
  }
  return value as SafetyReportPriority;
}

function parseOptionalAdminId(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return null;
  const adminId = Number(value);
  if (!Number.isInteger(adminId) || adminId <= 0) return null;
  return adminId;
}

function readOptionalText(value: FormDataEntryValue | null, maxLength = 2000) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

async function ensureReport(reportId: number) {
  const report = await prisma.safetyReport.findUnique({
    where: { id: reportId },
    select: { id: true, status: true, priority: true, assignedAdminId: true }
  });

  if (!report) throw new Error("Safety report not found.");
  return report;
}

function revalidateReport(reportId: number) {
  revalidatePath(routes.adminReports);
  revalidatePath(`${routes.adminReports}/${reportId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function updateSafetyReportStatusAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_REPORTS]);
  const reportId = parseReportId(formData);
  const status = parseStatus(formData.get("status"));
  const note = readOptionalText(formData.get("note"), 1200);
  const existing = await ensureReport(reportId);

  await prisma.$transaction([
    prisma.safetyReport.update({
      where: { id: reportId },
      data: {
        status,
        resolvedAt: status === "RESOLVED" || status === "DISMISSED" ? new Date() : null
      }
    }),
    prisma.safetyReportActionHistory.create({
      data: {
        reportId,
        actorAdminId: actor.id,
        actionType: "STATUS_CHANGED",
        fromStatus: existing.status,
        toStatus: status,
        note
      }
    }),
    ...(status === "RESOLVED"
      ? [
          prisma.adminAuditLog.create({
            data: buildAdminAuditLogData({
              adminUserId: actor.id,
              actionType: "REPORT_RESOLVED",
              targetType: "SafetyReport",
              targetId: reportId,
              oldValue: { status: existing.status },
              newValue: { status },
              reason: note ?? "Safety report resolved from safety center."
            })
          })
        ]
      : [])
  ]);

  revalidateReport(reportId);
}

export async function updateSafetyReportPriorityAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_REPORTS]);
  const reportId = parseReportId(formData);
  const priority = parsePriority(formData.get("priority"));
  const note = readOptionalText(formData.get("note"), 1200);
  const existing = await ensureReport(reportId);

  await prisma.$transaction([
    prisma.safetyReport.update({ where: { id: reportId }, data: { priority } }),
    prisma.safetyReportActionHistory.create({
      data: {
        reportId,
        actorAdminId: actor.id,
        actionType: "PRIORITY_CHANGED",
        fromPriority: existing.priority,
        toPriority: priority,
        note
      }
    })
  ]);

  revalidateReport(reportId);
}

export async function assignSafetyReportAdminAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_REPORTS]);
  const reportId = parseReportId(formData);
  const assignedAdminId = parseOptionalAdminId(formData.get("assignedAdminId"));
  const note = readOptionalText(formData.get("note"), 1200);
  const existing = await ensureReport(reportId);

  if (assignedAdminId) {
    const admin = await prisma.user.findFirst({
      where: { id: assignedAdminId, status: "ACTIVE", role: { in: ["ADMIN", "SUPER_ADMIN", "SUPPORT_ADMIN", "MEDICAL_REVIEWER"] } },
      select: { id: true }
    });

    if (!admin) throw new Error("Reports can only be assigned to active admin users.");
  }

  await prisma.$transaction([
    prisma.safetyReport.update({ where: { id: reportId }, data: { assignedAdminId } }),
    prisma.safetyReportActionHistory.create({
      data: {
        reportId,
        actorAdminId: actor.id,
        actionType: "ASSIGNED_ADMIN_CHANGED",
        fromAdminId: existing.assignedAdminId,
        toAdminId: assignedAdminId,
        note
      }
    })
  ]);

  revalidateReport(reportId);
}

export async function updateSafetyReportResolutionAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_REPORTS]);
  const reportId = parseReportId(formData);
  const resolutionNotes = readOptionalText(formData.get("resolutionNotes"), 3000);
  await ensureReport(reportId);

  await prisma.$transaction([
    prisma.safetyReport.update({ where: { id: reportId }, data: { resolutionNotes } }),
    prisma.safetyReportActionHistory.create({
      data: {
        reportId,
        actorAdminId: actor.id,
        actionType: "RESOLUTION_UPDATED",
        note: resolutionNotes ?? "Resolution notes cleared."
      }
    })
  ]);

  revalidateReport(reportId);
}
