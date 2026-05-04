import "dotenv/config";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const SEED_PREFIX = "[Seed]";
const SEED_DOMAIN = "afiyapal.seed";

const roles = [
  "USER",
  "DOCTOR",
  "ADMIN",
  "SUPER_ADMIN",
  "MEDICAL_REVIEWER",
  "SUPPORT_ADMIN",
  "DOCTOR_MANAGER",
  "CONTENT_MANAGER",
] as const;

const userStatuses = ["ACTIVE", "SUSPENDED", "DELETED"] as const;
const doctorStatuses = ["PENDING", "VERIFIED", "REJECTED", "SUSPENDED"] as const;
const riskLevels = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;
const symptomStatuses = ["COMPLETED", "REVIEWED", "ESCALATED", "FAILED"] as const;
const aiFlagStatuses = ["OPEN", "IN_REVIEW", "RESOLVED", "ESCALATED"] as const;
const aiFlagPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const aiFlagCategories = [
  "EMERGENCY_SYMPTOMS",
  "MENTAL_HEALTH_CRISIS",
  "PREGNANCY_OR_CHILD_HIGH_RISK",
  "USER_REPORTED_WRONG_ANSWER",
  "LOW_CONFIDENCE_AI_RESPONSE",
  "REPEATED_UNRESOLVED_SYMPTOMS",
] as const;
const aiFlagTriggers = ["AUTOMATIC_RISK_RULE", "USER_REPORT", "REVIEWER_CREATED"] as const;
const articleStatuses = ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "ARCHIVED"] as const;
const articleCategories = [
  "MALARIA",
  "MATERNAL_HEALTH",
  "NUTRITION",
  "MENTAL_HEALTH",
  "FIRST_AID",
  "GENERAL_WELLNESS",
] as const;
const languages = ["en", "sw"] as const;
const medicalReviewStatuses = ["NOT_SUBMITTED", "PENDING", "APPROVED", "CHANGES_REQUESTED", "REJECTED"] as const;
const consultationStatuses = [
  "NEW",
  "AWAITING_ASSIGNMENT",
  "ASSIGNED",
  "ACCEPTED_BY_DOCTOR",
  "COMPLETED",
  "CANCELLED",
  "ESCALATED",
] as const;
const urgencyLevels = ["LOW", "MEDIUM", "HIGH", "EMERGENCY"] as const;
const specialties = [
  "General clinician",
  "Mental health",
  "Maternal health",
  "Pediatrics",
  "Nutrition",
  "First aid",
  "Malaria care",
  "Other",
] as const;
const reportTypes = [
  "AI_RESPONSE_REPORT",
  "DOCTOR_REPORT",
  "USER_REPORT",
  "CONTENT_REPORT",
  "PLATFORM_ISSUE",
  "SAFETY_INCIDENT",
] as const;
const reportStatuses = ["OPEN", "IN_REVIEW", "RESOLVED", "DISMISSED"] as const;
const reportPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const safetyReportActionTypes = [
  "CREATED",
  "STATUS_CHANGED",
  "PRIORITY_CHANGED",
  "ASSIGNED_ADMIN_CHANGED",
  "RESOLUTION_UPDATED",
  "NOTE_ADDED",
] as const;
const auditActions = [
  "USER_ACTIVATED",
  "USER_SUSPENDED",
  "USER_STATUS_CHANGED",
  "USER_ROLE_CHANGED",
  "DOCTOR_APPROVED",
  "DOCTOR_REJECTED",
  "DOCTOR_SUSPENDED",
  "ARTICLE_PUBLISHED",
  "ARTICLE_UNPUBLISHED",
  "ARTICLE_ARCHIVED",
  "AI_FLAG_RESOLVED",
  "AI_FLAG_ESCALATED",
  "CONSULTATION_ASSIGNED",
  "CONSULTATION_STATUS_CHANGED",
  "REPORT_RESOLVED",
  "SENSITIVE_HEALTH_DETAILS_VIEWED",
  "PLATFORM_SETTINGS_UPDATED",
  "HEALTH_RESOURCE_CREATED",
  "HEALTH_RESOURCE_UPDATED",
  "HEALTH_RESOURCE_STATUS_CHANGED",
] as const;
const auditTargetTypes = [
  "User",
  "DoctorProfile",
  "Blog",
  "AiInteractionFlag",
  "ConsultationRequest",
  "SafetyReport",
  "SymptomCheckLog",
  "MentalHealthInteraction",
  "PlatformSetting",
  "HealthResource",
] as const;
const notificationTypes = [
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
  "SAFETY_REPORT_SUBMITTED",
] as const;
const notificationPriorities = ["LOW", "NORMAL", "HIGH", "CRITICAL"] as const;
const healthResourceTypes = ["CLINIC", "HOTLINE", "EMERGENCY_CONTACT", "COUNTRY_RESOURCE"] as const;

function seedEmail(slug: string) {
  return `${slug}@${SEED_DOMAIN}`;
}

function seedUsername(slug: string) {
  return `seed_${slug.replace(/[^a-z0-9_]/gi, "_").toLowerCase()}`;
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function monthsAgo(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

async function cleanupSeedData() {
  const seededBlogs = await prisma.blog.findMany({
    where: { slug: { startsWith: "seed-" } },
    select: { id: true },
  });
  const seededBlogIds = seededBlogs.map((blog) => blog.id);

  if (seededBlogIds.length > 0) {
    await prisma.comment.deleteMany({ where: { blogId: { in: seededBlogIds } } });
    await prisma.media.deleteMany({ where: { blogId: { in: seededBlogIds } } });
    await prisma.blog.deleteMany({ where: { id: { in: seededBlogIds } } });
  }

  await prisma.notification.deleteMany({ where: { title: { startsWith: SEED_PREFIX } } });
  await prisma.adminSensitiveHealthAccessGrant.deleteMany({ where: { reason: { contains: SEED_PREFIX } } });
  await prisma.adminAuditLog.deleteMany({ where: { reason: { contains: SEED_PREFIX } } });
  await prisma.safetyReportActionHistory.deleteMany({ where: { note: { contains: SEED_PREFIX } } });
  await prisma.safetyReport.deleteMany({ where: { title: { startsWith: SEED_PREFIX } } });
  await prisma.consultationRequest.deleteMany({ where: { reasonSummary: { startsWith: SEED_PREFIX } } });
  await prisma.aiInteractionFlag.deleteMany({ where: { title: { startsWith: SEED_PREFIX } } });
  await prisma.symptomCheckLog.deleteMany({ where: { symptomsSummary: { startsWith: SEED_PREFIX } } });
  await prisma.mentalHealthInteraction.deleteMany({ where: { interactionSummary: { startsWith: SEED_PREFIX } } });
  await prisma.mentalHealthResource.deleteMany({ where: { hotlineName: { startsWith: SEED_PREFIX } } });
  await prisma.healthResource.deleteMany({ where: { name: { startsWith: SEED_PREFIX } } });
  await prisma.doctorProfile.deleteMany({ where: { email: { endsWith: `@${SEED_DOMAIN}` } } });
  await prisma.platformSetting.deleteMany({ where: { key: { startsWith: "seed." } } });
}

async function upsertSeedUsers(passwordHash: string) {
  const users: Record<string, { id: number; role: string; email: string }> = {};

  for (const role of roles) {
    const slug = role.toLowerCase();
    const status = role === "USER" ? "ACTIVE" : "ACTIVE";
    const user = await prisma.user.upsert({
      where: { email: seedEmail(slug) },
      update: {
        username: seedUsername(slug),
        phone: role === "USER" ? "0700000000" : null,
        preferredLanguage: role === "DOCTOR" ? "sw" : "en",
        passwordHash,
        role,
        status,
        isVerified: true,
      },
      create: {
        username: seedUsername(slug),
        email: seedEmail(slug),
        phone: role === "USER" ? "0700000000" : null,
        preferredLanguage: role === "DOCTOR" ? "sw" : "en",
        passwordHash,
        role,
        status,
        isVerified: true,
      },
    });
    users[role] = { id: user.id, role: user.role, email: user.email };
  }

  for (const status of userStatuses) {
    const slug = `user_${status.toLowerCase()}`;
    const user = await prisma.user.upsert({
      where: { email: seedEmail(slug) },
      update: {
        username: seedUsername(slug),
        passwordHash,
        role: "USER",
        status,
        preferredLanguage: status === "SUSPENDED" ? "sw" : "en",
        isVerified: status !== "DELETED",
      },
      create: {
        username: seedUsername(slug),
        email: seedEmail(slug),
        passwordHash,
        role: "USER",
        status,
        preferredLanguage: status === "SUSPENDED" ? "sw" : "en",
        isVerified: status !== "DELETED",
      },
    });
    users[`USER_${status}`] = { id: user.id, role: user.role, email: user.email };
  }

  return users;
}

async function createDoctorProfiles(users: Record<string, { id: number; role: string; email: string }>) {
  const doctors: Record<string, { id: number; userId?: number | null; status: string }> = {};

  for (const [index, status] of doctorStatuses.entries()) {
    const userSlug = `doctor_${status.toLowerCase()}`;
    const doctorUser = await prisma.user.upsert({
      where: { email: seedEmail(userSlug) },
      update: {
        username: seedUsername(userSlug),
        passwordHash: await bcrypt.hash("Password123!", 12),
        role: "DOCTOR",
        status: "ACTIVE",
        isVerified: status === "VERIFIED",
      },
      create: {
        username: seedUsername(userSlug),
        email: seedEmail(userSlug),
        passwordHash: await bcrypt.hash("Password123!", 12),
        role: "DOCTOR",
        status: "ACTIVE",
        isVerified: status === "VERIFIED",
      },
    });

    const doctor = await prisma.doctorProfile.create({
      data: {
        userId: doctorUser.id,
        fullName: `${SEED_PREFIX} Dr ${status.charAt(0)}${status.slice(1).toLowerCase()}`,
        email: doctorUser.email,
        phone: `071000000${index}`,
        country: "Kenya",
        cityRegion: index % 2 === 0 ? "Mombasa" : "Nairobi",
        licenseNumber: `SEED-LIC-${status}`,
        specialty: specialties[index % specialties.length],
        languagesSpoken: index % 2 === 0 ? "English, Swahili" : "English",
        yearsOfExperience: 3 + index,
        bio: `${SEED_PREFIX} ${status.toLowerCase()} doctor profile for admin verification testing.`,
        verificationStatus: status,
        availabilityStatus: status === "VERIFIED" ? "AVAILABLE" : "UNAVAILABLE",
        verifiedById: status === "VERIFIED" ? users.SUPER_ADMIN.id : null,
        verifiedAt: status === "VERIFIED" ? daysAgo(5) : null,
        rejectionReason: status === "REJECTED" ? `${SEED_PREFIX} License document was unreadable.` : null,
        suspensionReason: status === "SUSPENDED" ? `${SEED_PREFIX} Temporarily suspended for QA testing.` : null,
        createdAt: daysAgo(20 - index),
      },
    });
    doctors[status] = { id: doctor.id, userId: doctor.userId, status };
  }

  return doctors;
}

async function createCategories() {
  const categories: Record<string, { id: number }> = {};
  for (const category of articleCategories) {
    const model = await prisma.category.upsert({
      where: { name: category },
      update: { description: `${SEED_PREFIX} ${category.toLowerCase().replace(/_/g, " ")} category.` },
      create: { name: category, description: `${SEED_PREFIX} ${category.toLowerCase().replace(/_/g, " ")} category.` },
    });
    categories[category] = { id: model.id };
  }
  return categories;
}

async function createBlogs(users: Record<string, { id: number }>, categories: Record<string, { id: number }>) {
  const blogs: Record<string, { id: number; slug: string; status: string }> = {};

  for (const [index, category] of articleCategories.entries()) {
    const status = articleStatuses[index % articleStatuses.length];
    const reviewStatus = medicalReviewStatuses[index % medicalReviewStatuses.length];
    const isPublished = status === "PUBLISHED";
    const isArchived = status === "ARCHIVED";
    const slug = `seed-${category.toLowerCase().replace(/_/g, "-")}-${status.toLowerCase()}`;
    const blog = await prisma.blog.create({
      data: {
        title: `${SEED_PREFIX} ${category.replace(/_/g, " ")} Article - ${status}`,
        slug,
        excerpt: `${SEED_PREFIX} QA article for ${category} in ${languages[index % languages.length]}.`,
        content: `${SEED_PREFIX} This is development-only article content for testing content management workflows, medical review states, languages, categories, and publishing actions.`,
        status,
        language: languages[index % languages.length],
        contentCategory: category,
        medicalReviewStatus: reviewStatus,
        reviewedById: reviewStatus === "APPROVED" ? users.MEDICAL_REVIEWER.id : null,
        reviewedAt: reviewStatus === "APPROVED" ? daysAgo(10) : null,
        reviewNotes: `${SEED_PREFIX} Review notes for ${category}.`,
        publishedAt: isPublished ? monthsAgo(index === 2 ? 8 : 1) : null,
        archivedAt: isArchived ? daysAgo(3) : null,
        creatorId: users.CONTENT_MANAGER.id,
        categoryId: categories[category].id,
        createdAt: monthsAgo(index + 1),
        updatedAt: index === 2 ? monthsAgo(8) : daysAgo(index + 1),
      },
    });
    blogs[status] = { id: blog.id, slug, status };

    await prisma.media.create({
      data: {
        blogId: blog.id,
        mediaUrl: `/images/seed/${slug}.jpg`,
        mediaType: "image",
        altText: `${SEED_PREFIX} placeholder image for ${category}`,
      },
    });
  }

  const firstBlog = Object.values(blogs)[0];
  if (firstBlog) {
    const parent = await prisma.comment.create({
      data: {
        blogId: firstBlog.id,
        userId: users.USER.id,
        comment: `${SEED_PREFIX} This is a QA blog comment.`,
      },
    });
    await prisma.comment.create({
      data: {
        blogId: firstBlog.id,
        userId: users.SUPPORT_ADMIN.id,
        parentCommentId: parent.id,
        comment: `${SEED_PREFIX} This is a QA reply comment.`,
      },
    });
  }

  return blogs;
}

async function createSymptomLogs(users: Record<string, { id: number }>) {
  const logs: Array<{ id: number; riskLevel: string; status: string }> = [];

  for (const [index, riskLevel] of riskLevels.entries()) {
    const status = symptomStatuses[index % symptomStatuses.length];
    const log = await prisma.symptomCheckLog.create({
      data: {
        userId: users.USER.id,
        language: languages[index % languages.length],
        symptomsSummary: `${SEED_PREFIX} ${riskLevel} symptom summary for admin QA.`,
        aiResponseSummary: `${SEED_PREFIX} Privacy-safe AI response summary for ${riskLevel} risk.`,
        symptomCategory: ["General", "Malaria-like", "Respiratory", "Emergency"][index],
        riskLevel,
        recommendedNextStep:
          riskLevel === "EMERGENCY"
            ? "Seek emergency care immediately."
            : "Monitor symptoms and consult a clinician if symptoms persist.",
        escalationSuggested: riskLevel === "HIGH" || riskLevel === "EMERGENCY",
        status,
        createdAt: daysAgo(index + 1),
      },
    });
    logs.push({ id: log.id, riskLevel, status });
  }

  return logs;
}

async function createMentalHealthInteractions(users: Record<string, { id: number }>) {
  const interactions: Array<{ id: number; riskLevel: string }> = [];

  for (const [index, riskLevel] of riskLevels.entries()) {
    const interaction = await prisma.mentalHealthInteraction.create({
      data: {
        userId: users.USER.id,
        language: languages[index % languages.length],
        moodCategory: ["GENERAL_SUPPORT", "STRESS", "ANXIETY", "CRISIS_SUPPORT"][index],
        riskLevel,
        interactionSummary: `${SEED_PREFIX} ${riskLevel} mental health support summary for QA.`,
        aiResponseSummary: `${SEED_PREFIX} Supportive, non-diagnostic response summary for ${riskLevel} risk.`,
        supportResourcesShown: riskLevel === "HIGH" || riskLevel === "EMERGENCY" ? "Kenya emergency contacts, trusted support hotline" : "Breathing exercise, journaling prompt",
        escalationSuggested: riskLevel === "HIGH" || riskLevel === "EMERGENCY",
        status: symptomStatuses[index % symptomStatuses.length],
        createdAt: daysAgo(index + 2),
      },
    });
    interactions.push({ id: interaction.id, riskLevel });
  }

  return interactions;
}

async function createAiFlags(
  users: Record<string, { id: number }>,
  symptomLogs: Array<{ id: number }>,
  mentalHealthInteractions: Array<{ id: number }>,
) {
  const flags: Record<string, { id: number; status: string; priority: string }> = {};

  for (const [index, category] of aiFlagCategories.entries()) {
    const status = aiFlagStatuses[index % aiFlagStatuses.length];
    const priority = aiFlagPriorities[index % aiFlagPriorities.length];
    const flag = await prisma.aiInteractionFlag.create({
      data: {
        symptomCheckLogId: category === "MENTAL_HEALTH_CRISIS" ? null : symptomLogs[index % symptomLogs.length]?.id,
        mentalHealthInteractionId: category === "MENTAL_HEALTH_CRISIS" ? mentalHealthInteractions[index % mentalHealthInteractions.length]?.id : null,
        userId: users.USER.id,
        title: `${SEED_PREFIX} ${category.replace(/_/g, " ")}`,
        summary: `${SEED_PREFIX} Privacy-safe safety flag summary for ${category}.`,
        category,
        trigger: aiFlagTriggers[index % aiFlagTriggers.length],
        priority: category === "EMERGENCY_SYMPTOMS" || category === "MENTAL_HEALTH_CRISIS" ? "CRITICAL" : priority,
        status,
        assignedReviewerId: status === "IN_REVIEW" ? users.MEDICAL_REVIEWER.id : null,
        adminNotes: `${SEED_PREFIX} Admin QA note for ${category}.`,
        reviewerNotes: status === "IN_REVIEW" ? `${SEED_PREFIX} Reviewer is assessing the case.` : null,
        resolutionNotes: status === "RESOLVED" ? `${SEED_PREFIX} Resolved during QA seed.` : null,
        resolvedAt: status === "RESOLVED" ? daysAgo(1) : null,
        createdAt: daysAgo(index + 1),
      },
    });
    flags[category] = { id: flag.id, status, priority: flag.priority };
  }

  return flags;
}

async function createConsultations(
  users: Record<string, { id: number }>,
  doctors: Record<string, { id: number }>,
) {
  const consultations: Array<{ id: number; status: string }> = [];

  for (const [index, status] of consultationStatuses.entries()) {
    const assignedDoctorId = ["ASSIGNED", "ACCEPTED_BY_DOCTOR", "COMPLETED"].includes(status) ? doctors.VERIFIED.id : null;
    const request = await prisma.consultationRequest.create({
      data: {
        userId: users.USER.id,
        assignedDoctorId,
        reasonSummary: `${SEED_PREFIX} Consultation request for ${status} workflow testing.`,
        preferredLanguage: languages[index % languages.length],
        countryRegion: index % 2 === 0 ? "Kenya / Mombasa" : "Kenya / Nairobi",
        urgencyLevel: urgencyLevels[index % urgencyLevels.length],
        requestedSpecialty: specialties[index % specialties.length],
        status,
        adminNotes: `${SEED_PREFIX} Internal admin note for ${status}.`,
        createdAt: daysAgo(index + 1),
      },
    });
    consultations.push({ id: request.id, status });
  }

  return consultations;
}

async function createSafetyReports(users: Record<string, { id: number }>) {
  const reports: Array<{ id: number; type: string; status: string }> = [];

  for (const [index, type] of reportTypes.entries()) {
    const status = reportStatuses[index % reportStatuses.length];
    const priority = reportPriorities[index % reportPriorities.length];
    const report = await prisma.safetyReport.create({
      data: {
        reporterUserId: users.USER.id,
        assignedAdminId: ["IN_REVIEW", "RESOLVED"].includes(status) ? users.SUPPORT_ADMIN.id : null,
        type,
        title: `${SEED_PREFIX} ${type.replace(/_/g, " ")}`,
        summary: `${SEED_PREFIX} Safety center QA report for ${type}.`,
        priority,
        status,
        resolutionNotes: status === "RESOLVED" || status === "DISMISSED" ? `${SEED_PREFIX} Resolution notes for ${type}.` : null,
        resolvedAt: status === "RESOLVED" || status === "DISMISSED" ? daysAgo(1) : null,
        createdAt: daysAgo(index + 1),
      },
    });
    reports.push({ id: report.id, type, status });

    await prisma.safetyReportActionHistory.create({
      data: {
        reportId: report.id,
        actorAdminId: users.SUPPORT_ADMIN.id,
        actionType: safetyReportActionTypes[index % safetyReportActionTypes.length],
        fromStatus: index === 0 ? null : "OPEN",
        toStatus: status,
        fromPriority: index === 0 ? null : "MEDIUM",
        toPriority: priority,
        note: `${SEED_PREFIX} Safety report action history for ${type}.`,
      },
    });
  }

  return reports;
}

async function createSettingsAndResources(users: Record<string, { id: number }>) {
  const settings = [
    ["seed.supportedLanguages", "English, Swahili"],
    ["seed.emergencyMessageText", "If this may be an emergency, contact local emergency services or go to the nearest clinic immediately."],
    ["seed.doctorVerificationRequirements", "License number, identity verification, specialty, country, and language review required."],
    ["seed.aiDisclaimerText", "AFIYAPAL provides supportive health information, not a diagnosis or replacement for professional care."],
    ["seed.defaultConsultationUrgencyRules", "Emergency symptoms escalate immediately; high-risk symptoms require clinician review."],
    ["seed.contentReviewIntervalMonths", "6"],
    ["seed.contactSupportEmail", "support@afiyapal.local"],
  ];

  for (const [key, value] of settings) {
    await prisma.platformSetting.upsert({
      where: { key },
      update: { value, updatedById: users.SUPER_ADMIN.id },
      create: { key, value, updatedById: users.SUPER_ADMIN.id },
    });
  }

  for (const [index, type] of healthResourceTypes.entries()) {
    await prisma.healthResource.create({
      data: {
        type,
        name: `${SEED_PREFIX} ${type.replace(/_/g, " ")}`,
        country: index % 2 === 0 ? "Kenya" : "Tanzania",
        region: index % 2 === 0 ? "Mombasa" : "Dar es Salaam",
        phone: `+25470000000${index}`,
        email: `resource${index}@${SEED_DOMAIN}`,
        website: `https://example.com/seed-health-resource-${index}`,
        description: `${SEED_PREFIX} Country-specific ${type.toLowerCase().replace(/_/g, " ")} for QA testing.`,
        isActive: index % 2 === 0,
      },
    });
  }

  for (const [index, riskLevel] of riskLevels.entries()) {
    await prisma.mentalHealthResource.create({
      data: {
        hotlineName: `${SEED_PREFIX} Mental Health ${riskLevel} Resource`,
        country: index % 2 === 0 ? "Kenya" : "Uganda",
        phone: `+25471100000${index}`,
        website: `https://example.com/seed-mental-health-${index}`,
        description: `${SEED_PREFIX} Mental health support resource for ${riskLevel} QA testing.`,
        isActive: index % 2 === 0,
      },
    });
  }
}

async function createAuditLogs(
  users: Record<string, { id: number }>,
  targets: {
    userId: number;
    doctorId: number;
    blogId: number;
    flagId: number;
    consultationId: number;
    reportId: number;
    symptomLogId: number;
    mentalHealthInteractionId: number;
  },
) {
  const targetIdsByType: Record<string, string> = {
    User: String(targets.userId),
    DoctorProfile: String(targets.doctorId),
    Blog: String(targets.blogId),
    AiInteractionFlag: String(targets.flagId),
    ConsultationRequest: String(targets.consultationId),
    SafetyReport: String(targets.reportId),
    SymptomCheckLog: String(targets.symptomLogId),
    MentalHealthInteraction: String(targets.mentalHealthInteractionId),
    PlatformSetting: "seed.supportedLanguages",
    HealthResource: "seed-health-resource",
  };

  for (const [index, actionType] of auditActions.entries()) {
    const targetType = auditTargetTypes[index % auditTargetTypes.length];
    await prisma.adminAuditLog.create({
      data: {
        adminUserId: users.SUPER_ADMIN.id,
        actionType,
        targetType,
        targetId: targetIdsByType[targetType],
        oldValue: json({ before: `${SEED_PREFIX} old ${actionType}` }),
        newValue: json({ after: `${SEED_PREFIX} new ${actionType}` }),
        reason: `${SEED_PREFIX} QA audit log for ${actionType}.`,
        createdAt: daysAgo(index),
      },
    });
  }

  await prisma.adminSensitiveHealthAccessGrant.create({
    data: {
      adminUserId: users.MEDICAL_REVIEWER.id,
      targetType: "SymptomCheckLog",
      targetId: String(targets.symptomLogId),
      reason: `${SEED_PREFIX} QA sensitive health access reason.`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });
}

async function createNotifications(users: Record<string, { id: number }>) {
  const recipients = [users.SUPER_ADMIN.id, users.DOCTOR.id, users.USER.id];

  for (const [index, type] of notificationTypes.entries()) {
    await prisma.notification.create({
      data: {
        recipientUserId: recipients[index % recipients.length],
        type,
        title: `${SEED_PREFIX} ${type.replace(/_/g, " ")}`,
        message: `${SEED_PREFIX} Notification message for ${type}.`,
        priority: notificationPriorities[index % notificationPriorities.length],
        targetType: index % 2 === 0 ? "Admin" : "User",
        targetId: `seed-${index + 1}`,
        status: index % 2 === 0 ? "UNREAD" : "READ",
        readAt: index % 2 === 0 ? null : daysAgo(1),
        createdAt: daysAgo(index),
      },
    });
  }
}

async function main() {
  console.log("🌱 Seeding AFIYAPAL development data...");

  await cleanupSeedData();

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const users = await upsertSeedUsers(passwordHash);
  const doctors = await createDoctorProfiles(users);
  const categories = await createCategories();
  const blogs = await createBlogs(users, categories);
  const symptomLogs = await createSymptomLogs(users);
  const mentalHealthInteractions = await createMentalHealthInteractions(users);
  const flags = await createAiFlags(users, symptomLogs, mentalHealthInteractions);
  const consultations = await createConsultations(users, doctors);
  const reports = await createSafetyReports(users);
  await createSettingsAndResources(users);
  await createAuditLogs(users, {
    userId: users.USER.id,
    doctorId: doctors.VERIFIED.id,
    blogId: Object.values(blogs)[0].id,
    flagId: Object.values(flags)[0].id,
    consultationId: consultations[0].id,
    reportId: reports[0].id,
    symptomLogId: symptomLogs[0].id,
    mentalHealthInteractionId: mentalHealthInteractions[0].id,
  });
  await createNotifications(users);

  console.log("✅ Seed completed.");
  console.log("Login examples, all using password: Password123!");
  console.table(
    Object.entries(users).map(([key, user]) => ({
      key,
      email: user.email,
      role: user.role,
    })),
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
