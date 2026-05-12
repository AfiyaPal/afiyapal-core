"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building2, CalendarDays, Stethoscope, LayoutDashboard } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/facility", icon: LayoutDashboard },
  { name: "Events", href: "/facility/events", icon: CalendarDays },
  { name: "Professionals", href: "/facility/professionals", icon: Stethoscope }
] as const;

export function FacilitySidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-emerald-100 bg-white/95 px-4 py-6 shadow-sm lg:sticky lg:top-0 lg:block">
      <Link href="/facility" className="block rounded-3xl bg-emerald-50 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">AFIYAPAL</p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">Facility Portal</h2>
      </Link>
      <nav className="mt-6 space-y-1" aria-label="Facility navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/facility" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                isActive ? "bg-brand-600 text-white shadow-soft" : "text-slate-700 hover:bg-emerald-50 hover:text-brand-700"
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
