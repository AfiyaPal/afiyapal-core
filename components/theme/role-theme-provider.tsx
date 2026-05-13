"use client";

import { useEffect } from "react";

type DashboardRole = "doctor" | "facility" | "admin";

export function RoleThemeProvider({ role, children }: { role: DashboardRole; children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-role-theme", role);
    return () => document.documentElement.removeAttribute("data-role-theme");
  }, [role]);

  return <>{children}</>;
}
