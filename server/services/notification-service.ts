import "server-only";
import { prisma } from "@/server/db/prisma";
import { ADMIN_PERMISSIONS, hasAdminPermission, type AdminPermission } from "@/server/auth/admin-permissions";
import { isAdminRole, type UserRole } from "@/server/auth/roles";

export const NOTIFICATION_PRIORITIES = ["LOW", "NORMAL", "HIGH", "CRITICAL"] as const;
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];

export const NOTIFICATION_TYPES = [
  "DOCTOR_APPLICATION_SUBMITTED",
  "DOCTOR_APPROVED",
  "DOCTOR_REJECTED",
  "AI_FLAG_CRITICAL",
  "CONSULTATION_URGENT",
  "CONSULTATION_ASSIGNED",
  "DOCTOR_RESPONDED",
  "AI_RESPONSE_REPORTED",
  "CONTENT_PENDING_REVIEW",
  "REPORT_RESOLVED",
  "SAFETY_REPORT_SUBMITTED"
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

type NotificationInput = {
  recipientUserId: number;
  type: NotificationType | string;
  title: string;
  message: string;
  priority?: NotificationPriority;
  targetType?: string | null;
  targetId?: string | number | null;
};

type NotificationClient = Pick<typeof prisma, "notification">;

function normalizeMessage(value: string, maxLength = 900) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function normalizePriority(priority?: NotificationPriority): NotificationPriority {
  return priority && NOTIFICATION_PRIORITIES.includes(priority) ? priority : "NORMAL";
}

export async function createNotification(input: NotificationInput, client: NotificationClient = prisma) {
  return client.notification.create({
    data: {
      recipientUserId: input.recipientUserId,
      type: input.type,
      title: normalizeMessage(input.title, 160),
      message: normalizeMessage(input.message),
      priority: normalizePriority(input.priority),
      targetType: input.targetType ?? null,
      targetId: input.targetId == null ? null : String(input.targetId),
      status: "UNREAD"
    }
  });
}

async function findActiveAdminsWithPermission(permission: AdminPermission) {
  const admins = await prisma.user.findMany({
    where: { status: "ACTIVE", role: { in: ["ADMIN", "SUPER_ADMIN", "MEDICAL_REVIEWER", "SUPPORT_ADMIN", "DOCTOR_MANAGER", "CONTENT_MANAGER"] } },
    select: { id: true, role: true }
  });

  return admins.filter((admin) => isAdminRole(admin.role) && hasAdminPermission(admin.role as UserRole, permission));
}

export async function notifyAdminsWithPermission(permission: AdminPermission, input: Omit<NotificationInput, "recipientUserId">) {
  const admins = await findActiveAdminsWithPermission(permission);
  if (admins.length === 0) return [];

  return Promise.all(
    admins.map((admin) =>
      createNotification({
        ...input,
        recipientUserId: admin.id
      })
    )
  );
}

export async function notifyDoctorProfileUser(doctorProfileId: number, input: Omit<NotificationInput, "recipientUserId">) {
  const doctor = await prisma.doctorProfile.findUnique({ where: { id: doctorProfileId }, select: { userId: true } });
  if (!doctor?.userId) return null;
  return createNotification({ ...input, recipientUserId: doctor.userId });
}

export async function notifyConsultationRequester(consultationRequestId: number, input: Omit<NotificationInput, "recipientUserId">) {
  const request = await prisma.consultationRequest.findUnique({ where: { id: consultationRequestId }, select: { userId: true } });
  if (!request?.userId) return null;
  return createNotification({ ...input, recipientUserId: request.userId });
}

export async function notifyAdminsDoctorApplied(input: { doctorProfileId: number; doctorName: string }) {
  return notifyAdminsWithPermission(ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS, {
    type: "DOCTOR_APPLICATION_SUBMITTED",
    title: "Doctor application pending review",
    message: `${input.doctorName} submitted a doctor verification application and needs review.`,
    priority: "HIGH",
    targetType: "DoctorProfile",
    targetId: input.doctorProfileId
  });
}

export async function notifyAdminsCriticalAiFlag(input: { flagId: number; title: string; category: string }) {
  return notifyAdminsWithPermission(ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS, {
    type: "AI_FLAG_CRITICAL",
    title: "Critical AI safety flag",
    message: `${input.title} was flagged as critical. Category: ${input.category}.`,
    priority: "CRITICAL",
    targetType: "AiInteractionFlag",
    targetId: input.flagId
  });
}

export async function notifyAdminsUrgentConsultation(input: { consultationRequestId: number; urgencyLevel: string; specialty?: string | null }) {
  return notifyAdminsWithPermission(ADMIN_PERMISSIONS.MANAGE_CONSULTATIONS, {
    type: "CONSULTATION_URGENT",
    title: "Urgent consultation request",
    message: `A ${input.urgencyLevel.toLowerCase()} consultation request needs attention${input.specialty ? ` for ${input.specialty}` : ""}.`,
    priority: input.urgencyLevel === "EMERGENCY" ? "CRITICAL" : "HIGH",
    targetType: "ConsultationRequest",
    targetId: input.consultationRequestId
  });
}

export async function notifyAdminsAiResponseReported(input: { flagId: number; userId?: number | null }) {
  return notifyAdminsWithPermission(ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS, {
    type: "AI_RESPONSE_REPORTED",
    title: "User reported an AI response",
    message: `A user reported that an AI health response may be wrong or unsafe${input.userId ? ` for user #${input.userId}` : ""}.`,
    priority: "HIGH",
    targetType: "AiInteractionFlag",
    targetId: input.flagId
  });
}

export async function notifyAdminsContentPendingReview(input: { articleId: number; title: string }) {
  return notifyAdminsWithPermission(ADMIN_PERMISSIONS.REVIEW_MEDICAL_CONTENT, {
    type: "CONTENT_PENDING_REVIEW",
    title: "Article pending medical review",
    message: `“${input.title}” has been submitted for medical review before publishing.`,
    priority: "NORMAL",
    targetType: "Blog",
    targetId: input.articleId
  });
}

export async function notifyDoctorApproved(doctorProfileId: number) {
  return notifyDoctorProfileUser(doctorProfileId, {
    type: "DOCTOR_APPROVED",
    title: "Doctor profile approved",
    message: "Your AFIYAPAL doctor profile has been approved. You can now be assigned eligible consultation requests.",
    priority: "HIGH",
    targetType: "DoctorProfile",
    targetId: doctorProfileId
  });
}

export async function notifyDoctorRejected(doctorProfileId: number, reason?: string | null) {
  return notifyDoctorProfileUser(doctorProfileId, {
    type: "DOCTOR_REJECTED",
    title: "Doctor verification was not approved",
    message: reason ? `Your doctor verification was rejected. Reason: ${reason}` : "Your doctor verification was rejected. Please review your application details and try again if appropriate.",
    priority: "HIGH",
    targetType: "DoctorProfile",
    targetId: doctorProfileId
  });
}

export async function notifyDoctorAssignedConsultation(input: { doctorProfileId: number; consultationRequestId: number; urgencyLevel?: string | null }) {
  return notifyDoctorProfileUser(input.doctorProfileId, {
    type: "CONSULTATION_ASSIGNED",
    title: "New consultation assigned",
    message: `A consultation request has been assigned to you${input.urgencyLevel ? ` with ${input.urgencyLevel.toLowerCase()} urgency` : ""}.`,
    priority: input.urgencyLevel === "EMERGENCY" ? "CRITICAL" : input.urgencyLevel === "HIGH" ? "HIGH" : "NORMAL",
    targetType: "ConsultationRequest",
    targetId: input.consultationRequestId
  });
}

export async function notifyUserConsultationAssigned(input: { consultationRequestId: number; doctorName?: string | null }) {
  return notifyConsultationRequester(input.consultationRequestId, {
    type: "CONSULTATION_ASSIGNED",
    title: "Your consultation request was assigned",
    message: input.doctorName ? `Your consultation request has been assigned to ${input.doctorName}.` : "Your consultation request has been assigned to a verified doctor.",
    priority: "HIGH",
    targetType: "ConsultationRequest",
    targetId: input.consultationRequestId
  });
}

export async function notifyUserDoctorResponded(input: { consultationRequestId: number; status: string }) {
  return notifyConsultationRequester(input.consultationRequestId, {
    type: "DOCTOR_RESPONDED",
    title: "Doctor response update",
    message: `Your consultation request status changed to ${input.status.toLowerCase().replaceAll("_", " ")}.`,
    priority: "NORMAL",
    targetType: "ConsultationRequest",
    targetId: input.consultationRequestId
  });
}

export async function notifyUserReportResolved(reportId: number) {
  const report = await prisma.safetyReport.findUnique({ where: { id: reportId }, select: { reporterUserId: true, title: true } });
  if (!report?.reporterUserId) return null;
  return createNotification({
    recipientUserId: report.reporterUserId,
    type: "REPORT_RESOLVED",
    title: "Your report was resolved",
    message: `Your report “${report.title}” has been reviewed and resolved.`,
    priority: "NORMAL",
    targetType: "SafetyReport",
    targetId: reportId
  });
}
