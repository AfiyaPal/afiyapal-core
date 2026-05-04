import "server-only";
import { prisma } from "@/server/db/prisma";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { notifyAdminsWithPermission } from "@/server/services/notification-service";
import { SAFETY_REPORT_PRIORITIES, SAFETY_REPORT_TYPES, type SafetyReportPriority, type SafetyReportType } from "@/features/admin/data/report-management";

function normalizeText(value: string, maxLength = 2000) {
  const trimmed = value.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

function ensureReportType(type: string): SafetyReportType {
  if (!SAFETY_REPORT_TYPES.includes(type as SafetyReportType)) return "PLATFORM_ISSUE";
  return type as SafetyReportType;
}

function ensurePriority(priority: string | undefined): SafetyReportPriority {
  if (!priority || !SAFETY_REPORT_PRIORITIES.includes(priority as SafetyReportPriority)) return "MEDIUM";
  return priority as SafetyReportPriority;
}

export async function createSafetyReport(input: {
  reporterUserId?: number | null;
  assignedAdminId?: number | null;
  type: SafetyReportType | string;
  title: string;
  summary?: string | null;
  priority?: SafetyReportPriority | string;
}) {
  const type = ensureReportType(input.type);
  const priority = ensurePriority(input.priority);

  const report = await prisma.$transaction(async (tx) => {
    const report = await tx.safetyReport.create({
      data: {
        reporterUserId: input.reporterUserId ?? null,
        assignedAdminId: input.assignedAdminId ?? null,
        type,
        title: normalizeText(input.title, 180),
        summary: input.summary ? normalizeText(input.summary) : null,
        priority,
        status: "OPEN"
      }
    });

    await tx.safetyReportActionHistory.create({
      data: {
        reportId: report.id,
        actorAdminId: input.assignedAdminId ?? null,
        actionType: "CREATED",
        toStatus: "OPEN",
        toPriority: priority,
        toAdminId: input.assignedAdminId ?? null,
        note: `Created ${type.toLowerCase().replaceAll("_", " ")} safety report.`
      }
    });

    return report;
  });

  if (type === "AI_RESPONSE_REPORT" || type === "SAFETY_INCIDENT" || priority === "HIGH" || priority === "CRITICAL") {
    await notifyAdminsAboutSafetyReport({ reportId: report.id, type, title: report.title, priority }).catch((error) =>
      console.error("Failed to notify admins about safety report", error)
    );
  }

  return report;
}

export async function notifyAdminsAboutSafetyReport(input: { reportId: number; type: SafetyReportType | string; title: string; priority?: SafetyReportPriority | string }) {
  const priority = ensurePriority(input.priority);
  const notificationPriority = priority === "CRITICAL" ? "CRITICAL" : priority === "HIGH" ? "HIGH" : "NORMAL";

  return notifyAdminsWithPermission(ADMIN_PERMISSIONS.MANAGE_REPORTS, {
    type: input.type === "AI_RESPONSE_REPORT" ? "AI_RESPONSE_REPORTED" : "SAFETY_REPORT_SUBMITTED",
    title: input.type === "AI_RESPONSE_REPORT" ? "AI response report submitted" : "Safety report submitted",
    message: `${input.title} requires review in the safety center.`,
    priority: notificationPriority,
    targetType: "SafetyReport",
    targetId: input.reportId
  });
}
