import "server-only";
import { prisma } from "@/server/db/prisma";

export const CONTACT_SUBMISSION_STATUSES = ["NEW", "REVIEWED", "ARCHIVED", "SPAM"] as const;
export type ContactSubmissionStatus = (typeof CONTACT_SUBMISSION_STATUSES)[number];

export type ContactSubmissionFilters = {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export type ContactSubmissionRecord = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  jobPosition: string | null;
  services: string;
  message: string;
  status: string;
  source: string;
  ipHash: string;
  userAgent: string | null;
  adminNotes: string | null;
  reviewedAt: Date | null;
  reviewedById: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type ContactSubmissionDelegate = {
  findMany(args: unknown): Promise<ContactSubmissionRecord[]>;
  count(args?: unknown): Promise<number>;
};

const contactSubmission = (prisma as unknown as { contactSubmission: ContactSubmissionDelegate }).contactSubmission;

function isStatus(value: string | undefined): value is ContactSubmissionStatus {
  return CONTACT_SUBMISSION_STATUSES.includes(value as ContactSubmissionStatus);
}

function dateFrom(value: string | undefined, end = false) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  if (end) date.setHours(23, 59, 59, 999);
  return date;
}

export async function getAdminContactSubmissions(filters: ContactSubmissionFilters = {}) {
  const where: Record<string, unknown> = {};
  const search = filters.search?.trim();
  const start = dateFrom(filters.startDate);
  const end = dateFrom(filters.endDate, true);

  if (isStatus(filters.status)) where.status = filters.status;
  if (start || end) where.createdAt = { ...(start ? { gte: start } : {}), ...(end ? { lte: end } : {}) };
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { subject: { contains: search } },
      { message: { contains: search } }
    ];
  }

  const pageSize = 100;
  const [submissions, total, newCount, reviewedCount] = await Promise.all([
    contactSubmission.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: pageSize
    }),
    contactSubmission.count({ where }),
    contactSubmission.count({ where: { status: "NEW" } }),
    contactSubmission.count({ where: { status: "REVIEWED" } })
  ]);

  return { submissions, total, newCount, reviewedCount, pageSize };
}
