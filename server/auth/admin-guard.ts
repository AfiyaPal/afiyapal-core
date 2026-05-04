import "server-only";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getCurrentUser } from "@/server/auth/session";
import { isActiveUserStatus, isAdminRole, isUserRole } from "@/server/auth/roles";
import { type AdminPermission, hasAnyAdminPermission } from "@/server/auth/admin-permissions";

export async function requireAdminUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`${routes.login}?next=${routes.admin}`);
  }

  if (!isActiveUserStatus(user.status) || !isUserRole(user.role) || !isAdminRole(user.role)) {
    redirect(routes.unauthorized);
  }

  return user;
}

export async function requireAnyAdminPermission(permissions: readonly AdminPermission[]) {
  const user = await requireAdminUser();

  if (!hasAnyAdminPermission(user.role, permissions)) {
    redirect(routes.unauthorized);
  }

  return user;
}
