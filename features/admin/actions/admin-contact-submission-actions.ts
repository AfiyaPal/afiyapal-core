"use server";

import { revalidatePath } from "next/cache";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { prisma } from "@/server/db/prisma";
import { routes } from "@/lib/routes";

type ContactSubmissionWriteDelegate = {
  update(args: unknown): Promise<unknown>;
};

const contactSubmission = (prisma as unknown as { contactSubmission: ContactSubmissionWriteDelegate }).contactSubmission;

const allowedStatuses = ["NEW", "REVIEWED", "ARCHIVED", "SPAM"] as const;

function parseId(formData: FormData) {
  const id = Number(formData.get("submissionId"));
  if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid contact submission id.");
  return id;
}

function parseStatus(formData: FormData) {
  const value = String(formData.get("status") ?? "");
  if (!allowedStatuses.includes(value as never)) throw new Error("Invalid contact submission status.");
  return value;
}

export async function updateContactSubmissionStatusAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_CONTACT_SUBMISSIONS]);
  const id = parseId(formData);
  const status = parseStatus(formData);

  await contactSubmission.update({
    where: { id },
    data: {
      status,
      reviewedAt: status === "REVIEWED" || status === "ARCHIVED" || status === "SPAM" ? new Date() : null,
      reviewedById: status === "REVIEWED" || status === "ARCHIVED" || status === "SPAM" ? actor.id : null
    }
  });

  revalidatePath(routes.adminContactSubmissions);
}
