"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeCheck, FileText, LayoutDashboard, Menu, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const DOCTOR_NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My articles", href: "/dashboard/blogs", icon: FileText },
  { name: "Write article", href: "/dashboard/blogs/new", icon: Plus },
  { name: "Professional profile", href: "/dashboard/profile", icon: BadgeCheck }
] as const;

export function DoctorMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-theme-border bg-theme-surface text-theme-foreground shadow-sm transition hover:border-theme-primary hover:text-theme-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls="dashboard-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      </button>

      <div
        id="dashboard-mobile-nav"
        className={cn(
          "fixed inset-x-0 top-14 z-40 origin-top border-b border-theme-border bg-theme-surface/98 shadow-lg backdrop-blur-lg motion-safe:transition motion-safe:duration-200 motion-safe:ease-out",
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4 pb-6" aria-label="Mobile doctor navigation">
          {DOCTOR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition",
                  isActive
                    ? "bg-theme-primary text-white shadow-soft"
                    : "text-theme-foreground hover:bg-theme-primary-light hover:text-theme-primary"
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {open && (
        <button
          type="button"
          aria-label="Dismiss menu"
          className="fixed inset-0 top-14 z-30 bg-slate-900/25 backdrop-blur-[2px] motion-safe:animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
