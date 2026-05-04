"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { AI_FLAG_PRIORITIES, AI_FLAG_STATUSES, type AiFlagPriority, type AiFlagStatus } from "@/server/services/ai-safety-flag-service";

function parseFlagId(formData: FormData) {
  const flagId = Number(formData.get("flagId"));
  if (!Number.isInteger(flagId) || flagId <= 0) throw new Error("Invalid AI flag id.");
  return flagId;
}

function parseOptionalUserId(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return null;
  const userId = Number(value);
  if (!Number.isInteger(userId) || userId <= 0) return null;
  return userId;
}

function parseStatus(value: FormDataEntryValue | null): AiFlagStatus {
  if (typeof value !== "string" || !AI_FLAG_STATUSES.includes(value as AiFlagStatus)) throw new Error("Invalid AI flag status.");
  return value as AiFlagStatus;
}

function parsePriority(value: FormDataEntryValue | null): AiFlagPriority {
  if (typeof value !== "string" || !AI_FLAG_PRIORITIES.includes(value as AiFlagPriority)) throw new Error("Invalid AI flag priority.");
  return value as AiFlagPriority;
}

function readOptionalText(value: FormDataEntryValue | null, maxLength = 1200) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

async function ensureFlagExists(flagId: number) {
  const flag = await prisma.aiInteractionFlag.findUnique({
    where: { id: flagId },
    select: {
      id: true,
      userId: true,
      symptomCheckLogId: true,
      title: true,
      summary: true,
      category: true,
      priority: true,
      status: true,
      escalatedConsultationRequestId: true
    }
  });

  if (!flag) redirect(routes.adminAiFlags);
  return flag;
}

export async function updateAiFlagStatusAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS]);
  const flagId = parseFlagId(formData);
  const status = parseStatus(formData.get("status"));
  await ensureFlagExists(flagId);

  await prisma.aiInteractionFlag.update({
    where: { id: flagId },
    data: {
      status,
      assignedReviewerId: actor.id,
      resolvedAt: status === "RESOLVED" ? new Date() : null
    }
  });

  revalidatePath(routes.adminAiFlags);
  revalidatePath(`${routes.adminAiFlags}/${flagId}`);
}

export async function assignAiFlagReviewerAction(formData: FormData) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS]);
  const flagId = parseFlagId(formData);
  const reviewerId = parseOptionalUserId(formData.get("assignedReviewerId"));
  await ensureFlagExists(flagId);

  if (reviewerId) {
    const reviewer = await prisma.user.findFirst({
      where: { id: reviewerId, status: "ACTIVE", role: { in: ["SUPER_ADMIN", "ADMIN", "MEDICAL_REVIEWER"] } },
      select: { id: true }
    });

    if (!reviewer) throw new Error("Selected reviewer is not eligible to review AI health flags.");
  }

  await prisma.aiInteractionFlag.update({ where: { id: flagId }, data: { assignedReviewerId: reviewerId, status: reviewerId ? "IN_REVIEW" : "OPEN" } });
  revalidatePath(routes.adminAiFlags);
  revalidatePath(`${routes.adminAiFlags}/${flagId}`);
}

export async function updateAiFlagNotesAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS]);
  const flagId = parseFlagId(formData);
  await ensureFlagExists(flagId);

  await prisma.aiInteractionFlag.update({
    where: { id: flagId },
    data: {
      adminNotes: readOptionalText(formData.get("adminNotes")),
      reviewerNotes: readOptionalText(formData.get("reviewerNotes")),
      resolutionNotes: readOptionalText(formData.get("resolutionNotes")),
      priority: parsePriority(formData.get("priority")),
      assignedReviewerId: actor.id
    }
  });

  revalidatePath(routes.adminAiFlags);
  revalidatePath(`${routes.adminAiFlags}/${flagId}`);
}

export async function escalateAiFlagToConsultationAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS, ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS]);
  const flagId = parseFlagId(formData);
  const requestedSpecialty = readOptionalText(formData.get("requestedSpecialty"), 120) ?? "General clinician";
  const adminNotes = readOptionalText(formData.get("adminNotes"), 1200);
  const flag = await ensureFlagExists(flagId);

  if (flag.escalatedConsultationRequestId) {
    revalidatePath(`${routes.adminAiFlags}/${flagId}`);
    return;
  }

  const symptomCheck = flag.symptomCheckLogId
    ? await prisma.symptomCheckLog.findUnique({
        where: { id: flag.symptomCheckLogId },
        select: { language: true, symptomsSummary: true, symptomCategory: true, riskLevel: true, recommendedNextStep: true }
      })
    : null;

  const urgencyLevel = flag.priority === "CRITICAL" ? "EMERGENCY" : flag.priority === "HIGH" ? "HIGH" : "MEDIUM";

  const consultation = await prisma.consultationRequest.create({
    data: {
      userId: flag.userId ?? null,
      reasonSummary: symptomCheck?.symptomsSummary ?? flag.summary ?? flag.title,
      preferredLanguage: symptomCheck?.language ?? "en",
      urgencyLevel,
      requestedSpecialty,
      status: "ESCALATED",
      adminNotes:
        adminNotes ??
        `Escalated from AI safety flag #${flag.id}. Category: ${flag.category}. Priority: ${flag.priority}. Reviewed by admin user #${actor.id}.`
    }
  });

  await Promise.all([
    prisma.aiInteractionFlag.update({
      where: { id: flagId },
      data: {
        status: "ESCALATED",
        assignedReviewerId: actor.id,
        escalatedConsultationRequestId: consultation.id,
        adminNotes: adminNotes ?? flag.summary ?? flag.title
      }
    }),
    flag.symptomCheckLogId
      ? prisma.symptomCheckLog.update({ where: { id: flag.symptomCheckLogId }, data: { status: "ESCALATED", escalationSuggested: true } })
      : Promise.resolve()
  ]);

  revalidatePath(routes.adminAiFlags);
  revalidatePath(`${routes.adminAiFlags}/${flagId}`);
  revalidatePath(routes.adminConsultations);
}
