import "server-only";
import { prisma } from "@/server/db/prisma";
import {
  SAFETY_REPORT_PRIORITIES,
  SAFETY_REPORT_STATUSES,
  SAFETY_REPORT_TYPES,
  type SafetyReportPriority,
  type SafetyReportStatus,
  type SafetyReportType
} from "@/features/admin/data/report-management";

export type SafetyReportFilters = {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  assignment?: string;
  startDate?: string;
  endDate?: string;
};

const PAGE_SIZE = 25;

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isValidType(value: string | undefined): value is SafetyReportType {
  return !!value && SAFETY_REPORT_TYPES.includes(value as SafetyReportType);
}

function isValidStatus(value: string | undefined): value is SafetyReportStatus {
  return !!value && SAFETY_REPORT_STATUSES.includes(value as SafetyReportStatus);
}

function isValidPriority(value: string | undefined): value is SafetyReportPriority {
  return !!value && SAFETY_REPORT_PRIORITIES.includes(value as SafetyReportPriority);
}

function parseDate(value: string | undefined, endOfDay = false) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  if (endOfDay) date.setHours(23, 59, 59, 999);
  return date;
}

function dateWhere(startDate?: string, endDate?: string) {
  const gte = parseDate(startDate);
  const lte = parseDate(endDate, true);
  if (!gte && !lte) return {};
  return { createdAt: { ...(gte ? { gte } : {}), ...(lte ? { lte } : {}) } };
}

export async function getAdminSafetyReports(filters: SafetyReportFilters = {}) {
  const search = normalize(filters.search);
  const type = normalize(filters.type);
  const status = normalize(filters.status);
  const priority = normalize(filters.priority);
  const assignment = normalize(filters.assignment);

  const where = {
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { summary: { contains: search } },
            { resolutionNotes: { contains: search } }
          ]
        }
      : {}),
    ...(isValidType(type) ? { type } : {}),
    ...(isValidStatus(status) ? { status } : {}),
    ...(isValidPriority(priority) ? { priority } : {}),
    ...(assignment === "assigned" ? { assignedAdminId: { not: null } } : {}),
    ...(assignment === "unassigned" ? { assignedAdminId: null } : {}),
    ...dateWhere(filters.startDate, filters.endDate)
  };

  const [reports, total] = await Promise.all([
    prisma.safetyReport.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: PAGE_SIZE,
      select: {
        id: true,
        reporterUserId: true,
        assignedAdminId: true,
        type: true,
        title: true,
        summary: true,
        priority: true,
        status: true,
        resolutionNotes: true,
        resolvedAt: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.safetyReport.count({ where })
  ]);

  const userIds = [...new Set(reports.flatMap((report) => [report.reporterUserId, report.assignedAdminId]).filter((id): id is number => typeof id === "number"))];

  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true, email: true, role: true, status: true }
      })
    : [];

  const userById = new Map(users.map((user) => [user.id, user]));

  return {
    reports: reports.map((report) => ({
      ...report,
      reporter: report.reporterUserId ? userById.get(report.reporterUserId) ?? null : null,
      assignedAdmin: report.assignedAdminId ? userById.get(report.assignedAdminId) ?? null : null
    })),
    total,
    pageSize: PAGE_SIZE
  };
}

export async function getAdminSafetyReportDetail(reportId: number) {
  const report = await prisma.safetyReport.findUnique({
    where: { id: reportId },
    select: {
      id: true,
      reporterUserId: true,
      assignedAdminId: true,
      type: true,
      title: true,
      summary: true,
      priority: true,
      status: true,
      resolutionNotes: true,
      resolvedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!report) return null;

  const history = await prisma.safetyReportActionHistory.findMany({
    where: { reportId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      reportId: true,
      actorAdminId: true,
      actionType: true,
      fromStatus: true,
      toStatus: true,
      fromPriority: true,
      toPriority: true,
      fromAdminId: true,
      toAdminId: true,
      note: true,
      createdAt: true
    }
  });

  const userIds = [
    report.reporterUserId,
    report.assignedAdminId,
    ...history.flatMap((item) => [item.actorAdminId, item.fromAdminId, item.toAdminId])
  ].filter((id): id is number => typeof id === "number");

  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: [...new Set(userIds)] } },
        select: { id: true, username: true, email: true, role: true, status: true }
      })
    : [];

  const adminUsers = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN", "SUPPORT_ADMIN", "MEDICAL_REVIEWER"] }, status: "ACTIVE" },
    orderBy: [{ role: "asc" }, { username: "asc" }],
    select: { id: true, username: true, email: true, role: true }
  });

  const userById = new Map(users.map((user) => [user.id, user]));

  return {
    report: {
      ...report,
      reporter: report.reporterUserId ? userById.get(report.reporterUserId) ?? null : null,
      assignedAdmin: report.assignedAdminId ? userById.get(report.assignedAdminId) ?? null : null
    },
    history: history.map((item) => ({
      ...item,
      actorAdmin: item.actorAdminId ? userById.get(item.actorAdminId) ?? null : null,
      fromAdmin: item.fromAdminId ? userById.get(item.fromAdminId) ?? null : null,
      toAdmin: item.toAdminId ? userById.get(item.toAdminId) ?? null : null
    })),
    adminUsers
  };
}
