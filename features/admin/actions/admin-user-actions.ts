"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { prisma } from "@/server/db/prisma";
import { requireAnyAdminPermission } from "@/server/auth/admin-guard";
import { ADMIN_PERMISSIONS, canCreateAdmin } from "@/server/auth/admin-permissions";
import { USER_ROLES, USER_STATUSES, type UserRole, type UserStatus, isAdminRole } from "@/server/auth/roles";
import { buildAdminAuditLogData } from "@/server/services/admin-audit-log-service";

function parseUserId(formData: FormData) {
  const userId = Number(formData.get("userId"));
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user id.");
  }
  return userId;
}

function assertValidStatus(value: FormDataEntryValue | null): UserStatus {
  if (typeof value !== "string" || !USER_STATUSES.includes(value as UserStatus)) {
    throw new Error("Invalid user status.");
  }
  return value as UserStatus;
}

function assertValidRole(value: FormDataEntryValue | null): UserRole {
  if (typeof value !== "string" || !USER_ROLES.includes(value as UserRole)) {
    throw new Error("Invalid user role.");
  }
  return value as UserRole;
}

async function ensureTargetExists(userId: number) {
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true, status: true } });
  if (!target) redirect(routes.adminUsers);
  return target;
}

export async function activateUserAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_USERS]);
  const userId = parseUserId(formData);
  const target = await ensureTargetExists(userId);

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { status: "ACTIVE" } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "USER_ACTIVATED",
        targetType: "User",
        targetId: userId,
        oldValue: { status: target.status },
        newValue: { status: "ACTIVE" },
        reason: "User account activated from admin user management."
      })
    })
  ]);
  revalidatePath(routes.adminUsers);
  revalidatePath(`${routes.adminUsers}/${userId}`);
  revalidatePath(routes.adminAuditLogs);

  if (actor.id === userId) revalidatePath(routes.admin);
}

export async function suspendUserAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_USERS]);
  const userId = parseUserId(formData);

  if (actor.id === userId) {
    throw new Error("You cannot suspend your own admin account.");
  }

  const target = await ensureTargetExists(userId);
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { status: "SUSPENDED" } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "USER_SUSPENDED",
        targetType: "User",
        targetId: userId,
        oldValue: { status: target.status },
        newValue: { status: "SUSPENDED" },
        reason: "User account suspended from admin user management."
      })
    })
  ]);
  revalidatePath(routes.adminUsers);
  revalidatePath(`${routes.adminUsers}/${userId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function updateUserStatusAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_USERS]);
  const userId = parseUserId(formData);
  const status = assertValidStatus(formData.get("status"));

  if (actor.id === userId && status !== "ACTIVE") {
    throw new Error("You cannot deactivate your own admin account.");
  }

  const target = await ensureTargetExists(userId);
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { status } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: status === "SUSPENDED" ? "USER_SUSPENDED" : status === "ACTIVE" ? "USER_ACTIVATED" : "USER_STATUS_CHANGED",
        targetType: "User",
        targetId: userId,
        oldValue: { status: target.status },
        newValue: { status },
        reason: "User account status changed from admin user management."
      })
    })
  ]);
  revalidatePath(routes.adminUsers);
  revalidatePath(`${routes.adminUsers}/${userId}`);
  revalidatePath(routes.adminAuditLogs);
}

export async function updateUserRoleAction(formData: FormData) {
  const actor = await requireAnyAdminPermission([ADMIN_PERMISSIONS.MANAGE_USERS]);
  const userId = parseUserId(formData);
  const role = assertValidRole(formData.get("role"));
  const target = await ensureTargetExists(userId);

  const assigningAdminRole = isAdminRole(role);
  const removingAdminRole = isAdminRole(target.role) && !isAdminRole(role);

  if ((assigningAdminRole || removingAdminRole) && !canCreateAdmin(actor.role)) {
    throw new Error("Only Super Admin can assign or remove admin roles.");
  }

  if (actor.id === userId && role !== "SUPER_ADMIN") {
    throw new Error("You cannot remove your own Super Admin access.");
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { role } }),
    prisma.adminAuditLog.create({
      data: buildAdminAuditLogData({
        adminUserId: actor.id,
        actionType: "USER_ROLE_CHANGED",
        targetType: "User",
        targetId: userId,
        oldValue: { role: target.role },
        newValue: { role },
        reason: "User role changed from admin user management."
      })
    })
  ]);
  revalidatePath(routes.adminUsers);
  revalidatePath(`${routes.adminUsers}/${userId}`);
  revalidatePath(routes.adminAuditLogs);
}
