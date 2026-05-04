import "server-only";
import { prisma } from "@/server/db/prisma";
import { AI_FLAG_CATEGORIES, AI_FLAG_PRIORITIES, AI_FLAG_STATUSES, AI_FLAG_TRIGGERS } from "@/server/services/ai-safety-flag-service";

export type AiFlagFilters = {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  trigger?: string;
  startDate?: string;
  endDate?: string;
};

const PAGE_SIZE = 25;

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
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

function isValidStatus(value: string | undefined) {
  return !!value && AI_FLAG_STATUSES.includes(value as (typeof AI_FLAG_STATUSES)[number]);
}

function isValidPriority(value: string | undefined) {
  return !!value && AI_FLAG_PRIORITIES.includes(value as (typeof AI_FLAG_PRIORITIES)[number]);
}

function isValidCategory(value: string | undefined) {
  return !!value && AI_FLAG_CATEGORIES.includes(value as (typeof AI_FLAG_CATEGORIES)[number]);
}

function isValidTrigger(value: string | undefined) {
  return !!value && AI_FLAG_TRIGGERS.includes(value as (typeof AI_FLAG_TRIGGERS)[number]);
}

function buildWhere(filters: AiFlagFilters = {}) {
  const search = normalize(filters.search);
  const status = normalize(filters.status);
  const priority = normalize(filters.priority);
  const category = normalize(filters.category);
  const trigger = normalize(filters.trigger);
  const startDate = parseDateStart(normalize(filters.startDate));
  const endDate = parseDateEnd(normalize(filters.endDate));

  return {
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { summary: { contains: search } },
            { adminNotes: { contains: search } },
            { reviewerNotes: { contains: search } },
            { resolutionNotes: { contains: search } }
          ]
        }
      : {}),
    ...(isValidStatus(status) ? { status } : {}),
    ...(isValidPriority(priority) ? { priority } : {}),
    ...(isValidCategory(category) ? { category } : {}),
    ...(isValidTrigger(trigger) ? { trigger } : {}),
    ...(startDate || endDate ? { createdAt: { ...(startDate ? { gte: startDate } : {}), ...(endDate ? { lte: endDate } : {}) } } : {})
  };
}

export async function getAdminAiFlags(filters: AiFlagFilters = {}) {
  const where = buildWhere(filters);
  const [flags, total] = await Promise.all([
    prisma.aiInteractionFlag.findMany({
      where,
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: PAGE_SIZE,
      select: {
        id: true,
        symptomCheckLogId: true,
        userId: true,
        title: true,
        category: true,
        trigger: true,
        priority: true,
        status: true,
        assignedReviewerId: true,
        escalatedConsultationRequestId: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.aiInteractionFlag.count({ where })
  ]);

  const userIds = Array.from(new Set(flags.map((flag) => flag.userId).filter((id): id is number => typeof id === "number")));
  const reviewerIds = Array.from(new Set(flags.map((flag) => flag.assignedReviewerId).filter((id): id is number => typeof id === "number")));

  const [users, reviewers] = await Promise.all([
    userIds.length ? prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, username: true, email: true } }) : [],
    reviewerIds.length ? prisma.user.findMany({ where: { id: { in: reviewerIds } }, select: { id: true, username: true, email: true, role: true } }) : []
  ]);

  const usersById = new Map(users.map((user) => [user.id, user]));
  const reviewersById = new Map(reviewers.map((user) => [user.id, user]));

  return {
    flags: flags.map((flag) => ({
      ...flag,
      user: flag.userId ? usersById.get(flag.userId) ?? null : null,
      assignedReviewer: flag.assignedReviewerId ? reviewersById.get(flag.assignedReviewerId) ?? null : null
    })),
    total,
    pageSize: PAGE_SIZE
  };
}

export async function getAdminAiFlagDetail(flagId: number) {
  const flag = await prisma.aiInteractionFlag.findUnique({
    where: { id: flagId },
    select: {
      id: true,
      symptomCheckLogId: true,
      userId: true,
      title: true,
      summary: true,
      category: true,
      trigger: true,
      priority: true,
      status: true,
      assignedReviewerId: true,
      adminNotes: true,
      reviewerNotes: true,
      resolutionNotes: true,
      escalatedConsultationRequestId: true,
      resolvedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!flag) return null;

  const [user, assignedReviewer, symptomCheck, consultation, eligibleReviewers] = await Promise.all([
    flag.userId ? prisma.user.findUnique({ where: { id: flag.userId }, select: { id: true, username: true, email: true, preferredLanguage: true, role: true, status: true } }) : null,
    flag.assignedReviewerId ? prisma.user.findUnique({ where: { id: flag.assignedReviewerId }, select: { id: true, username: true, email: true, role: true } }) : null,
    flag.symptomCheckLogId
      ? prisma.symptomCheckLog.findUnique({
          where: { id: flag.symptomCheckLogId },
          select: {
            id: true,
            language: true,
            symptomsSummary: true,
            aiResponseSummary: true,
            symptomCategory: true,
            riskLevel: true,
            recommendedNextStep: true,
            escalationSuggested: true,
            status: true,
            createdAt: true
          }
        })
      : null,
    flag.escalatedConsultationRequestId
      ? prisma.consultationRequest.findUnique({
          where: { id: flag.escalatedConsultationRequestId },
          select: { id: true, status: true, urgencyLevel: true, requestedSpecialty: true, createdAt: true }
        })
      : null,
    prisma.user.findMany({
      where: { role: { in: ["SUPER_ADMIN", "ADMIN", "MEDICAL_REVIEWER"] }, status: "ACTIVE" },
      orderBy: { username: "asc" },
      select: { id: true, username: true, email: true, role: true }
    })
  ]);

  return { flag, user, assignedReviewer, symptomCheck, consultation, eligibleReviewers };
}
