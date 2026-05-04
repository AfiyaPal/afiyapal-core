import "server-only";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import type { AdminRecentActivityItem } from "@/features/admin/components/admin-recent-activity-feed";

type CountRow = { count: number | bigint | string | null };

type RawActivityRow = {
  id: number | string;
  title: string | null;
  description: string | null;
  createdAt: Date | string;
  status?: string | null;
  riskLevel?: string | null;
  priority?: string | null;
};

function toCount(rows: readonly CountRow[] | unknown): number {
  if (!Array.isArray(rows) || rows.length === 0) return 0;
  const value = rows[0]?.count;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function asDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

async function safeCount(sql: string, ...values: unknown[]) {
  try {
    const rows = await prisma.$queryRawUnsafe<CountRow[]>(sql, ...values);
    return toCount(rows);
  } catch {
    return 0;
  }
}

async function safeRows<Row>(sql: string, ...values: unknown[]) {
  try {
    return await prisma.$queryRawUnsafe<Row[]>(sql, ...values);
  } catch {
    return [];
  }
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function activityTone(status?: string | null, priority?: string | null, riskLevel?: string | null): AdminRecentActivityItem["tone"] {
  const normalized = `${status ?? ""} ${priority ?? ""} ${riskLevel ?? ""}`.toUpperCase();
  if (normalized.includes("CRITICAL") || normalized.includes("EMERGENCY") || normalized.includes("HIGH")) return "red";
  if (normalized.includes("PENDING") || normalized.includes("OPEN") || normalized.includes("NEW")) return "amber";
  if (normalized.includes("PUBLISHED") || normalized.includes("COMPLETED") || normalized.includes("VERIFIED")) return "green";
  return "slate";
}

export async function getAdminOverviewDashboardData() {
  const today = daysAgo(1);
  const week = daysAgo(7);
  const month = daysAgo(30);

  const [
    totalUsers,
    activeToday,
    activeWeek,
    activeMonth,
    totalSymptomChecks,
    totalConsultationRequests,
    pendingDoctorVerifications,
    flaggedAiInteractions,
    emergencyRiskInteractions,
    publishedArticles,
    recentUsers,
    recentDoctors,
    recentSymptomChecks,
    recentConsultations,
    recentAiFlags,
    recentBlogs,
    recentReports
  ] = await Promise.all([
    safeCount('SELECT COUNT(*) AS count FROM "User"'),
    safeCount('SELECT COUNT(*) AS count FROM "User" WHERE "updatedAt" >= ?', today),
    safeCount('SELECT COUNT(*) AS count FROM "User" WHERE "updatedAt" >= ?', week),
    safeCount('SELECT COUNT(*) AS count FROM "User" WHERE "updatedAt" >= ?', month),
    safeCount('SELECT COUNT(*) AS count FROM "SymptomCheckLog"'),
    safeCount('SELECT COUNT(*) AS count FROM "ConsultationRequest"'),
    safeCount('SELECT COUNT(*) AS count FROM "DoctorProfile" WHERE "verificationStatus" = ?', "PENDING"),
    safeCount('SELECT COUNT(*) AS count FROM "AiInteractionFlag" WHERE "status" IN (?, ?)', "OPEN", "IN_REVIEW"),
    safeCount('SELECT COUNT(*) AS count FROM "SymptomCheckLog" WHERE "riskLevel" = ?', "EMERGENCY"),
    safeCount('SELECT COUNT(*) AS count FROM "Blog" WHERE LOWER("status") = ?', "published"),
    safeRows<RawActivityRow>('SELECT "id", "username" AS title, "email" AS description, "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 5'),
    safeRows<RawActivityRow>('SELECT "id", "fullName" AS title, "specialty" AS description, "createdAt", "verificationStatus" AS status FROM "DoctorProfile" ORDER BY "createdAt" DESC LIMIT 5'),
    safeRows<RawActivityRow>('SELECT "id", "symptomCategory" AS title, "recommendedNextStep" AS description, "createdAt", "riskLevel" FROM "SymptomCheckLog" ORDER BY "createdAt" DESC LIMIT 5'),
    safeRows<RawActivityRow>('SELECT "id", "reasonSummary" AS title, "requestedSpecialty" AS description, "createdAt", "status", "urgencyLevel" AS priority FROM "ConsultationRequest" ORDER BY "createdAt" DESC LIMIT 5'),
    safeRows<RawActivityRow>('SELECT "id", "title", "summary" AS description, "createdAt", "status", "priority" FROM "AiInteractionFlag" ORDER BY "createdAt" DESC LIMIT 5'),
    safeRows<RawActivityRow>('SELECT "id", "title", "status" AS description, "createdAt", "status" FROM "Blog" WHERE LOWER("status") = ? ORDER BY "createdAt" DESC LIMIT 5', "published"),
    safeRows<RawActivityRow>('SELECT "id", "title", "summary" AS description, "createdAt", "status", "priority" FROM "SafetyReport" ORDER BY "createdAt" DESC LIMIT 5')
  ]);

  const recentActivity: AdminRecentActivityItem[] = [
    ...recentUsers.map((item) => ({
      id: `user-${item.id}`,
      type: "New user registered",
      title: item.title ?? "New AFIYAPAL user",
      description: item.description ?? "A new account was created.",
      createdAt: asDate(item.createdAt),
      href: routes.adminUsers,
      tone: "green" as const
    })),
    ...recentDoctors.map((item) => ({
      id: `doctor-${item.id}`,
      type: "Doctor applied",
      title: item.title ?? "Doctor application",
      description: item.description ? `Specialty: ${item.description}` : "A doctor application was submitted.",
      createdAt: asDate(item.createdAt),
      href: routes.adminDoctors,
      tone: activityTone(item.status)
    })),
    ...recentSymptomChecks.map((item) => ({
      id: `symptom-${item.id}`,
      type: "Symptom check completed",
      title: item.title ?? "Symptom check",
      description: item.description ?? "A symptom checker interaction was logged.",
      createdAt: asDate(item.createdAt),
      href: routes.adminSymptomChecks,
      tone: activityTone(undefined, undefined, item.riskLevel)
    })),
    ...recentConsultations.map((item) => ({
      id: `consultation-${item.id}`,
      type: "Consultation requested",
      title: item.title ?? "Consultation request",
      description: item.description ? `Requested specialty: ${item.description}` : "A patient requested care connection.",
      createdAt: asDate(item.createdAt),
      href: routes.adminConsultations,
      tone: activityTone(item.status, item.priority)
    })),
    ...recentAiFlags.map((item) => ({
      id: `ai-flag-${item.id}`,
      type: "AI response flagged",
      title: item.title ?? "AI safety flag",
      description: item.description ?? "A flagged AI interaction needs review.",
      createdAt: asDate(item.createdAt),
      href: routes.adminAiFlags,
      tone: activityTone(item.status, item.priority)
    })),
    ...recentBlogs.map((item) => ({
      id: `blog-${item.id}`,
      type: "Blog published",
      title: item.title ?? "Published health article",
      description: "Health education content is now public.",
      createdAt: asDate(item.createdAt),
      href: routes.adminContent,
      tone: activityTone(item.status)
    })),
    ...recentReports.map((item) => ({
      id: `report-${item.id}`,
      type: "Safety report opened",
      title: item.title ?? "Safety report",
      description: item.description ?? "A report needs review in the safety center.",
      createdAt: asDate(item.createdAt),
      href: routes.adminReports,
      tone: activityTone(item.status, item.priority)
    }))
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 12);

  return {
    totals: {
      totalUsers,
      activeToday,
      activeWeek,
      activeMonth,
      totalSymptomChecks,
      totalConsultationRequests,
      pendingDoctorVerifications,
      flaggedAiInteractions,
      emergencyRiskInteractions,
      publishedArticles
    },
    recentActivity
  };
}
