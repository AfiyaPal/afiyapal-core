"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { prisma } from "@/server/db/prisma";

function readRequiredText(formData: FormData, key: string, maxLength = 160) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required.`);
  const trimmed = value.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

function readOptionalText(formData: FormData, key: string, maxLength = 900) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) return null;
  const trimmed = value.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

function parseResourceId(formData: FormData) {
  const resourceId = Number(formData.get("resourceId"));
  if (!Number.isInteger(resourceId) || resourceId <= 0) throw new Error("Invalid mental health resource id.");
  return resourceId;
}

export async function createMentalHealthResourceAction(formData: FormData) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS, ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS]);

  await prisma.mentalHealthResource.create({
    data: {
      hotlineName: readRequiredText(formData, "hotlineName"),
      country: readRequiredText(formData, "country", 100),
      phone: readOptionalText(formData, "phone", 80),
      website: readOptionalText(formData, "website", 240),
      description: readOptionalText(formData, "description", 900),
      isActive: formData.get("isActive") === "on"
    }
  });

  revalidatePath(routes.adminMentalHealthResources);
}

export async function updateMentalHealthResourceAction(formData: FormData) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS, ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS]);
  const resourceId = parseResourceId(formData);

  await prisma.mentalHealthResource.update({
    where: { id: resourceId },
    data: {
      hotlineName: readRequiredText(formData, "hotlineName"),
      country: readRequiredText(formData, "country", 100),
      phone: readOptionalText(formData, "phone", 80),
      website: readOptionalText(formData, "website", 240),
      description: readOptionalText(formData, "description", 900),
      isActive: formData.get("isActive") === "on"
    }
  });

  revalidatePath(routes.adminMentalHealthResources);
}

export async function toggleMentalHealthResourceStatusAction(formData: FormData) {
  await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS, ADMIN_PERMISSIONS.REVIEW_HEALTH_FLAGS]);
  const resourceId = parseResourceId(formData);
  const nextStatus = formData.get("nextStatus") === "ACTIVE";

  await prisma.mentalHealthResource.update({
    where: { id: resourceId },
    data: { isActive: nextStatus }
  });

  revalidatePath(routes.adminMentalHealthResources);
}
