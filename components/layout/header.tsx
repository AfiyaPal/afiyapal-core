"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { shouldShowMarketingChrome } from "@/lib/layout-chrome";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home",   href: routes.home },
  { label: "About",  href: routes.about },
  { label: "Blogs",  href: routes.blogs },
  { label: "Chatbot", href: routes.chatbot }
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!shouldShowMarketingChrome(pathname)) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-brand-200/60 bg-gradient-to-r from-brand-100/90 via-accent-blue-50/85 to-accent-violet-100/80 backdrop-blur-md backdrop-saturate-150 motion-safe:transition-all motion-safe:duration-200",
        scrolled ? "h-14 shadow-md shadow-brand-500/5" : "h-16"
      )}
    >
      <div className="container-page flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-brand-600/25 ring-2 ring-white transition duration-300 group-hover:shadow-xl group-hover:shadow-brand-600/30">
            <Image src="/brand/favicon-source.png" alt="" width={36} height={36} className="h-full w-full object-cover" priority />
          </span>
          <span className={cn("font-bold tracking-tight text-slate-900 transition group-hover:text-brand-700", scrolled ? "text-lg" : "text-xl")}>
            AfiyaPal
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3 py-2 text-sm font-medium outline-none transition-colors duration-200",
                  active ? "text-brand-700" : "text-slate-600 hover:bg-brand-50/90 hover:text-brand-700",
                  "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                )}
              >
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-teal-500" aria-hidden />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href={routes.login}
            className="hidden rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 hover:shadow-md md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Sign in
          </Link>
          <Link
            href={routes.register}
            className="hidden rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition hover:from-brand-600 hover:to-brand-800 hover:shadow-lg md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Get started
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-brand-200/60 bg-gradient-to-b from-brand-50/98 via-accent-blue-50/95 to-accent-violet-50/95 backdrop-blur-lg md:hidden motion-safe:transition motion-safe:duration-200 motion-safe:ease-out",
          mobileOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4 pb-6" aria-label="Mobile main">
          {navItems.map((item, i) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: mobileOpen ? `${i * 45}ms` : undefined }}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium outline-none motion-safe:animate-fade-in-up",
                  active ? "bg-brand-50 text-brand-800 ring-1 ring-brand-100" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-3 flex gap-3 px-4">
            <Link href={routes.login} className="flex-1 rounded-xl border border-brand-200 py-2.5 text-center text-sm font-semibold text-brand-700">
              Sign in
            </Link>
            <Link href={routes.register} className="flex-1 rounded-xl bg-brand-600 py-2.5 text-center text-sm font-semibold text-white">
              Get started
            </Link>
          </div>
        </nav>
        <Link href={routes.chatbot} className="rounded-full bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 md:hidden">
          Ask AI
        </Link>
      </div>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Dismiss menu"
          className="fixed inset-0 top-16 z-30 bg-slate-900/25 backdrop-blur-[2px] md:hidden motion-safe:animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
