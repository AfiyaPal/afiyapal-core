"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";

const DASHBOARD_ROUTES = ["/dashboard", "/facility", "/admin"];

const navItems = [
  { label: "Home", href: routes.home },
  { label: "Symptom Checker", href: routes.chatbot },
  { label: "Health Events", href: "/events" },
  { label: "Health Blogs", href: routes.blogs },
  { label: "For Doctors", href: routes.registerDoctor },
  { label: "Login", href: routes.login }
];

export function Header() {
  const pathname = usePathname();
  if (DASHBOARD_ROUTES.some((route) => pathname.startsWith(route))) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur" role="banner">
      <div className="container-page flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-brand-700" aria-label="AfiyaPal home">
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-2xl bg-brand-600 text-sm font-black text-white">AP</span>
          <span>AfiyaPal</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="rounded-full px-2 py-1 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-700"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href={routes.chatbot} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 md:hidden">
          Ask AI
        </Link>
      </div>
    </header>
  );
}
