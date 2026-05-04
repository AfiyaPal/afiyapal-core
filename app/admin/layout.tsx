import type { ReactNode } from "react";
import { requireAdminUser } from "@/server/auth/admin-guard";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminUser();
  return children;
}
