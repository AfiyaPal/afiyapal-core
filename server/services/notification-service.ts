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
  "DOCTOR_SUSPENDED",
  "AI_FLAG_CRITICAL",
  "CONSULTATION_URGENT",
  "CONSULTATION_ASSIGNED",
  "DOCTOR_RESPONDED",
  "AI_RESPONSE_REPORTED",
  "CONTENT_PENDING_REVIEW",
  "CONTENT_APPROVED",
  "CONTENT_CHANGES_REQUESTED",
  "CONTENT_REJECTED",
  "CONTACT_SUBMISSION_SUBMITTED",
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

async function getProfessionalEmail(doctorProfileId: number): Promise<string | null> {
  const profile = await prisma.doctorProfile.findUnique({
    where: { id: doctorProfileId },
    select: { email: true, userId: true }
  });
  if (!profile) return null;
  if (profile.email) return profile.email;
  if (!profile.userId) return null;
  const user = await prisma.user.findUnique({ where: { id: profile.userId }, select: { email: true } });
  return user?.email ?? null;
}

export async function notifyAdminsDoctorApplied(input: { doctorProfileId: number; doctorName: string; email?: string | null }) {
  await notifyAdminsWithPermission(ADMIN_PERMISSIONS.APPROVE_REJECT_DOCTORS, {
    type: "DOCTOR_APPLICATION_SUBMITTED",
    title: "Professional application pending review",
    message: `${input.doctorName} submitted a professional verification application and needs review.`,
    priority: "HIGH",
    targetType: "DoctorProfile",
    targetId: input.doctorProfileId
  });

  const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
  if (!to) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { sendEmail } = await import("./email-service");
  await sendEmail({
    to,
    subject: `New professional application: ${input.doctorName}`,
    replyTo: input.email ?? undefined,
    html: `<p><strong>${input.doctorName}</strong> has applied as a professional.</p>
<p>Email: ${input.email ?? "Not provided"}</p>
<p><a href="${appUrl}/admin/professionals">Review application</a></p>`
  }).catch((error) => {
    console.error("Failed to send professional application email", error);
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
    message: `"${input.title}" has been submitted for medical review before publishing.`,
    priority: "NORMAL",
    targetType: "Blog",
    targetId: input.articleId
  });
}

export async function notifyAdminsContactSubmissionSubmitted(input: { submissionId: number; fullName: string; subject: string; email?: string; message?: string }) {
  await notifyAdminsWithPermission(ADMIN_PERMISSIONS.MANAGE_CONTACT_SUBMISSIONS, {
    type: "CONTACT_SUBMISSION_SUBMITTED",
    title: "New contact form submission",
    message: `${input.fullName} sent a contact message: "${input.subject}".`,
    priority: "NORMAL",
    targetType: "ContactSubmission",
    targetId: input.submissionId
  });

  const to = process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER;
  if (!to) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const snippet = input.message ? input.message.slice(0, 200) + (input.message.length > 200 ? "…" : "") : "";

  const { sendEmail } = await import("./email-service");
  await sendEmail({
    to,
    subject: `New contact: ${input.subject}`,
    replyTo: input.email,
    html: `<p><strong>${input.fullName}</strong> (${input.email ?? "no email"}) sent a contact message:</p>
<p><strong>Subject:</strong> ${input.subject}</p>
<p>${snippet}</p>
<p><a href="${appUrl}/admin/contact-submissions">View in admin dashboard</a></p>`
  }).catch((error) => {
    console.error("Failed to send contact submission email", error);
  });
}

export async function notifyDoctorArticleReviewed(articleId: number, input: { title: string; reviewStatus: string; reviewNotes?: string | null }) {
  const article = await prisma.blog.findUnique({ where: { id: articleId }, select: { creatorId: true } });
  if (!article?.creatorId) return null;

  const labels: Record<string, { title: string; message: string }> = {
    APPROVED: {
      title: "Article approved",
      message: `Your article "${input.title}" has been approved for publishing.`
    },
    CHANGES_REQUESTED: {
      title: "Article changes requested",
      message: input.reviewNotes
        ? `Your article "${input.title}" needs changes. Review notes: ${input.reviewNotes}`
        : `Your article "${input.title}" needs changes before it can be published.`
    },
    REJECTED: {
      title: "Article rejected",
      message: input.reviewNotes
        ? `Your article "${input.title}" was not approved. Reason: ${input.reviewNotes}`
        : `Your article "${input.title}" was not approved for publication.`
    }
  };

  const label = labels[input.reviewStatus];
  if (!label) return null;

  return createNotification({
    recipientUserId: article.creatorId,
    type: `CONTENT_${input.reviewStatus}`,
    title: label.title,
    message: label.message,
    priority: input.reviewStatus === "APPROVED" ? "NORMAL" : "HIGH",
    targetType: "Blog",
    targetId: articleId
  });
}

export async function notifyDoctorApproved(doctorProfileId: number) {
  await notifyDoctorProfileUser(doctorProfileId, {
    type: "DOCTOR_APPROVED",
    title: "Professional profile approved",
    message: "Your AFIYAPAL professional profile has been approved. You can now receive consultation requests from patients.",
    priority: "HIGH",
    targetType: "DoctorProfile",
    targetId: doctorProfileId
  });

  const email = await getProfessionalEmail(doctorProfileId);
  if (!email) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { sendEmail } = await import("./email-service");
  await sendEmail({
    to: email,
    subject: "Your AfiyaPal professional profile has been verified",
    html: `<p>Congratulations! Your AfiyaPal professional profile has been verified.</p>
<p>You can now receive consultation requests from patients.</p>
<p><a href="${appUrl}/dashboard">Go to your dashboard</a></p>`
  }).catch((error) => {
    console.error("Failed to send professional approval email", error);
  });
}

export async function notifyDoctorRejected(doctorProfileId: number, reason?: string | null) {
  await notifyDoctorProfileUser(doctorProfileId, {
    type: "DOCTOR_REJECTED",
    title: "Professional verification was not approved",
    message: reason ? `Your professional verification was rejected. Reason: ${reason}` : "Your professional verification was rejected. Please review your application details and try again if appropriate.",
    priority: "HIGH",
    targetType: "DoctorProfile",
    targetId: doctorProfileId
  });

  const email = await getProfessionalEmail(doctorProfileId);
  if (!email) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const reasonBlock = reason ? `<p>Reason: ${reason}</p>` : "";
  const { sendEmail } = await import("./email-service");
  await sendEmail({
    to: email,
    subject: "Update on your AfiyaPal verification",
    html: `<p>Your professional verification was not approved at this time.</p>
${reasonBlock}
<p>You can update your profile and resubmit for verification.</p>
<p><a href="${appUrl}/dashboard/profile">Update your profile</a></p>`
  }).catch((error) => {
    console.error("Failed to send professional rejection email", error);
  });
}

export async function notifyDoctorSuspended(doctorProfileId: number, reason?: string | null) {
  await notifyDoctorProfileUser(doctorProfileId, {
    type: "DOCTOR_SUSPENDED",
    title: "Professional profile suspended",
    message: reason ? `Your professional profile has been suspended. Reason: ${reason}` : "Your professional profile has been suspended.",
    priority: "HIGH",
    targetType: "DoctorProfile",
    targetId: doctorProfileId
  });

  const email = await getProfessionalEmail(doctorProfileId);
  if (!email) return;

  const reasonBlock = reason ? `<p>Reason: ${reason}</p>` : "";
  const { sendEmail } = await import("./email-service");
  await sendEmail({
    to: email,
    subject: "Your AfiyaPal professional profile has been suspended",
    html: `<p>Your professional profile has been suspended.</p>
${reasonBlock}
<p>Please contact support for assistance.</p>`
  }).catch((error) => {
    console.error("Failed to send professional suspension email", error);
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
