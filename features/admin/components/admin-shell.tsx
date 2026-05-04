import type { ReactNode } from "react";
import { AdminSidebar, type AdminNavItem } from "./admin-sidebar";
import { AdminTopbar, type AdminTopbarUser } from "./admin-topbar";

export function AdminShell({ children, navItems, user }: { children: ReactNode; navItems: readonly AdminNavItem[]; user: AdminTopbarUser }) {
  return (
    <div className="min-h-screen bg-[#f8fffb] text-slate-950">
      <div className="flex min-h-screen">
        <AdminSidebar navItems={navItems} />
        <div className="min-w-0 flex-1"><AdminTopbar user={user} /><main className="px-4 py-6 md:px-8 md:py-8">{children}</main></div>
      </div>
    </div>
  );
}
