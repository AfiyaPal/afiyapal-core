import "server-only";
import { prisma } from "@/server/db/prisma";
import { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus } from "@/server/auth/roles";

type UserListFilters = {
  search?: string;
  role?: string;
  status?: string;
};

const PAGE_SIZE = 25;

function normalize(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function isValidRole(value: string | undefined): value is UserRole {
  return !!value && USER_ROLES.includes(value as UserRole);
}

function isValidStatus(value: string | undefined): value is UserStatus {
  return !!value && USER_STATUSES.includes(value as UserStatus);
}

export async function getAdminUsers(filters: UserListFilters = {}) {
  const search = normalize(filters.search);
  const role = normalize(filters.role);
  const status = normalize(filters.status);

  const where = {
    ...(search
      ? {
          OR: [
            { username: { contains: search } },
            { email: { contains: search } }
          ]
        }
      : {}),
    ...(isValidRole(role) ? { role } : {}),
    ...(isValidStatus(status) ? { status } : {})
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        preferredLanguage: true,
        role: true,
        status: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);

  return { users, total, pageSize: PAGE_SIZE };
}

export async function getAdminUserDetail(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      preferredLanguage: true,
      role: true,
      status: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) return null;

  const [blogs, comments, symptomChecks, consultationRequests, aiFlags, safetyReports] = await Promise.all([
    prisma.blog.count({ where: { creatorId: user.id } }),
    prisma.comment.count({ where: { userId: user.id } }),
    prisma.symptomCheckLog.count({ where: { userId: user.id } }),
    prisma.consultationRequest.count({ where: { userId: user.id } }),
    prisma.aiInteractionFlag.count({ where: { userId: user.id } }),
    prisma.safetyReport.count({ where: { reporterUserId: user.id } })
  ]);

  return {
    user,
    activitySummary: {
      blogs,
      comments,
      symptomChecks,
      consultationRequests,
      aiFlags,
      safetyReports
    }
  };
}
