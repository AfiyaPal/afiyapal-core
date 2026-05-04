import "server-only";
import { prisma } from "@/server/db/prisma";
import { SYMPTOM_RISK_LEVELS } from "@/server/services/symptom-check-logging-service";

export type SymptomCheckFilters = {
  riskLevel?: string;
  language?: string;
  startDate?: string;
  endDate?: string;
  escalationSuggested?: string;
  status?: string;
};

const PAGE_SIZE = 25;
const VALID_LANGUAGES = ["en", "sw"] as const;
const VALID_STATUSES = ["COMPLETED", "FAILED", "REVIEWED", "ESCALATED"] as const;

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function parseBooleanFilter(value: string | undefined) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseDateStart(value: string | undefined) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseDateEnd(value: string | undefined) {
  if (!value) return undefined;
  const date = new Date(`${value}T23:59:59.999Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function validRisk(value: string | undefined) {
  return !!value && SYMPTOM_RISK_LEVELS.includes(value as (typeof SYMPTOM_RISK_LEVELS)[number]);
}

function validLanguage(value: string | undefined) {
  return !!value && VALID_LANGUAGES.includes(value as (typeof VALID_LANGUAGES)[number]);
}

function validStatus(value: string | undefined) {
  return !!value && VALID_STATUSES.includes(value as (typeof VALID_STATUSES)[number]);
}

function buildWhere(filters: SymptomCheckFilters = {}) {
  const riskLevel = normalize(filters.riskLevel);
  const language = normalize(filters.language);
  const status = normalize(filters.status);
  const startDate = parseDateStart(normalize(filters.startDate));
  const endDate = parseDateEnd(normalize(filters.endDate));
  const escalationSuggested = parseBooleanFilter(normalize(filters.escalationSuggested));

  return {
    ...(validRisk(riskLevel) ? { riskLevel } : {}),
    ...(validLanguage(language) ? { language } : {}),
    ...(validStatus(status) ? { status } : {}),
    ...(typeof escalationSuggested === "boolean" ? { escalationSuggested } : {}),
    ...(startDate || endDate ? { createdAt: { ...(startDate ? { gte: startDate } : {}), ...(endDate ? { lte: endDate } : {}) } } : {})
  };
}

export async function getAdminSymptomChecks(filters: SymptomCheckFilters = {}) {
  const where = buildWhere(filters);

  const [logs, total] = await Promise.all([
    prisma.symptomCheckLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      select: {
        id: true,
        userId: true,
        language: true,
        symptomCategory: true,
        riskLevel: true,
        escalationSuggested: true,
        status: true,
        createdAt: true
      }
    }),
    prisma.symptomCheckLog.count({ where })
  ]);

  const userIds = Array.from(new Set(logs.map((log) => log.userId).filter((id): id is number => typeof id === "number")));
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, username: true, email: true } })
    : [];
  const usersById = new Map(users.map((user) => [user.id, user]));

  return {
    logs: logs.map((log) => ({ ...log, user: log.userId ? usersById.get(log.userId) ?? null : null })),
    total,
    pageSize: PAGE_SIZE
  };
}

export async function getAdminSymptomCheckDetail(logId: number) {
  const log = await prisma.symptomCheckLog.findUnique({
    where: { id: logId },
    select: {
      id: true,
      userId: true,
      language: true,
      symptomsSummary: true,
      aiResponseSummary: true,
      symptomCategory: true,
      riskLevel: true,
      recommendedNextStep: true,
      escalationSuggested: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!log) return null;

  const [user, flags] = await Promise.all([
    log.userId ? prisma.user.findUnique({ where: { id: log.userId }, select: { id: true, username: true, email: true, preferredLanguage: true, role: true, status: true } }) : null,
    prisma.aiInteractionFlag.findMany({
      where: { symptomCheckLogId: log.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, category: true, priority: true, status: true, createdAt: true }
    })
  ]);

  return { log, user, flags };
}
