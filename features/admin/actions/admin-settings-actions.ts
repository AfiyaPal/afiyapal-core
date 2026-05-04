"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/lib/routes";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS } from "@/server/auth/admin-permissions";
import { prisma } from "@/server/db/prisma";
import { createAdminAuditLog } from "@/server/services/admin-audit-log-service";
import { defaultPlatformSettings, healthResourceTypeLabels, type PlatformSettingKey } from "@/features/admin/data/platform-settings";

const platformSettingKeys = Object.keys(defaultPlatformSettings) as PlatformSettingKey[];

function readText(formData: FormData, key: string, maxLength = 4000) {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength).trim() : trimmed;
}

function readRequiredText(formData: FormData, key: string, maxLength = 240) {
  const value = readText(formData, key, maxLength);
  if (!value) throw new Error(`${key} is required.`);
  return value;
}

function readOptionalText(formData: FormData, key: string, maxLength = 1200) {
  const value = readText(formData, key, maxLength);
  return value || null;
}

function parseResourceId(formData: FormData) {
  const resourceId = Number(formData.get("resourceId"));
  if (!Number.isInteger(resourceId) || resourceId <= 0) throw new Error("Invalid health resource id.");
  return resourceId;
}

export async function updatePlatformSettingsAction(formData: FormData) {
  const admin = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS]);

  const before = await prisma.platformSetting.findMany({ where: { key: { in: platformSettingKeys } } });
  const beforeMap = Object.fromEntries(before.map((setting) => [setting.key, setting.value]));

  await prisma.$transaction(
    platformSettingKeys.map((key) =>
      prisma.platformSetting.upsert({
        where: { key },
        create: { key, value: readText(formData, key, 5000) || defaultPlatformSettings[key], updatedById: admin.id },
        update: { value: readText(formData, key, 5000) || defaultPlatformSettings[key], updatedById: admin.id }
      })
    )
  );

  const after = Object.fromEntries(platformSettingKeys.map((key) => [key, readText(formData, key, 5000) || defaultPlatformSettings[key]]));

  await createAdminAuditLog({
    adminUserId: admin.id,
    actionType: "PLATFORM_SETTINGS_UPDATED",
    targetType: "PlatformSetting",
    targetId: "platform-settings",
    oldValue: beforeMap,
    newValue: after,
    reason: "Admin settings updated"
  });

  revalidatePath(routes.adminSettings);
}

export async function createHealthResourceAction(formData: FormData) {
  const admin = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS]);
  const type = readRequiredText(formData, "type", 80);
  if (!(type in healthResourceTypeLabels)) throw new Error("Invalid health resource type.");

  const resource = await prisma.healthResource.create({
    data: {
      type,
      name: readRequiredText(formData, "name", 180),
      country: readRequiredText(formData, "country", 100),
      region: readOptionalText(formData, "region", 120),
      phone: readOptionalText(formData, "phone", 80),
      email: readOptionalText(formData, "email", 180),
      website: readOptionalText(formData, "website", 240),
      description: readOptionalText(formData, "description", 1200),
      isActive: formData.get("isActive") === "on"
    }
  });

  await createAdminAuditLog({
    adminUserId: admin.id,
    actionType: "HEALTH_RESOURCE_CREATED",
    targetType: "HealthResource",
    targetId: resource.id,
    newValue: { type: resource.type, name: resource.name, country: resource.country, isActive: resource.isActive },
    reason: "Health resource created from admin settings"
  });

  revalidatePath(routes.adminHealthResources);
}

export async function updateHealthResourceAction(formData: FormData) {
  const admin = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS]);
  const resourceId = parseResourceId(formData);
  const type = readRequiredText(formData, "type", 80);
  if (!(type in healthResourceTypeLabels)) throw new Error("Invalid health resource type.");

  const before = await prisma.healthResource.findUnique({ where: { id: resourceId } });
  if (!before) throw new Error("Health resource not found.");

  const resource = await prisma.healthResource.update({
    where: { id: resourceId },
    data: {
      type,
      name: readRequiredText(formData, "name", 180),
      country: readRequiredText(formData, "country", 100),
      region: readOptionalText(formData, "region", 120),
      phone: readOptionalText(formData, "phone", 80),
      email: readOptionalText(formData, "email", 180),
      website: readOptionalText(formData, "website", 240),
      description: readOptionalText(formData, "description", 1200),
      isActive: formData.get("isActive") === "on"
    }
  });

  await createAdminAuditLog({
    adminUserId: admin.id,
    actionType: "HEALTH_RESOURCE_UPDATED",
    targetType: "HealthResource",
    targetId: resource.id,
    oldValue: { type: before.type, name: before.name, country: before.country, isActive: before.isActive },
    newValue: { type: resource.type, name: resource.name, country: resource.country, isActive: resource.isActive },
    reason: "Health resource updated from admin settings"
  });

  revalidatePath(routes.adminHealthResources);
}

export async function toggleHealthResourceStatusAction(formData: FormData) {
  const admin = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_ADMIN_SETTINGS]);
  const resourceId = parseResourceId(formData);
  const nextStatus = formData.get("nextStatus") === "ACTIVE";

  const before = await prisma.healthResource.findUnique({ where: { id: resourceId } });
  if (!before) throw new Error("Health resource not found.");

  const resource = await prisma.healthResource.update({ where: { id: resourceId }, data: { isActive: nextStatus } });

  await createAdminAuditLog({
    adminUserId: admin.id,
    actionType: "HEALTH_RESOURCE_STATUS_CHANGED",
    targetType: "HealthResource",
    targetId: resource.id,
    oldValue: { isActive: before.isActive },
    newValue: { isActive: resource.isActive },
    reason: nextStatus ? "Health resource activated" : "Health resource deactivated"
  });

  revalidatePath(routes.adminHealthResources);
}
