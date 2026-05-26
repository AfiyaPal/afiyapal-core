import type { ReactNode } from "react";
import { adminModules } from "@/features/admin/data/admin-scope";
import { adminModulePermissions } from "@/features/admin/data/admin-permission-rules";
import { AdminShell } from "@/features/admin/components/admin-shell";
import { requireAdminUser } from "@/server/auth/admin-guard";
import { hasAnyAdminPermission } from "@/server/auth/admin-permissions";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata = buildNoIndexMetadata("Admin Console", "Protected AfiyaPal administration area.");

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminUser();
  const navItems = adminModules
    .filter((module) => hasAnyAdminPermission(user.role, adminModulePermissions[module.key]))
    .map((module) => ({ name: module.name, href: module.route, summary: module.summary }));

  return <AdminShell navItems={navItems} user={{ username: user.username, email: user.email, role: user.role }}>{children}</AdminShell>;
}
