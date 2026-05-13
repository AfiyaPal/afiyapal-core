"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type AdminNavItem = { name: string; href: string; summary: string };

export function AdminSidebar({ navItems }: { navItems: readonly AdminNavItem[] }) {
  const pathname = usePathname();
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-theme-border bg-theme-surface px-4 py-6 shadow-sm lg:sticky lg:top-0 lg:block">
      <Link href="/admin" className="block rounded-3xl bg-theme-primary-light p-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-primary-dark">AFIYAPAL</p>
        <h1 className="mt-1 text-xl font-black tracking-tight text-slate-950">Admin Center</h1>
        <p className="mt-2 text-xs leading-5 text-slate-600">Safety, doctors, content, consultations, and platform operations.</p>
      </Link>
      <nav className="mt-6 space-y-1" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
          return (
            <Link key={item.href} href={item.href} className={cn("group block rounded-2xl px-4 py-3 text-sm transition", isActive ? "bg-theme-primary text-white shadow-soft" : "text-slate-700 hover:bg-theme-primary-light hover:text-theme-primary")}>
              <span className="font-bold">{item.name}</span>
              <span className={cn("mt-1 block text-xs leading-5", isActive ? "text-white/80" : "text-slate-500 group-hover:text-theme-primary")}>{item.summary}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
