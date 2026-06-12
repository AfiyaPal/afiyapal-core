import Link from "next/link";
import { routes } from "@/lib/routes";
import { Heart } from "lucide-react";

const quickLinks = [
  { label: "Symptom checker", href: routes.chatbot },
  { label: "Health blogs",    href: routes.blogs },
  { label: "Events",          href: "/events" },
  { label: "Register",        href: routes.register }
];

const platformLinks = [
  { label: "Sign in",          href: routes.login },
  { label: "Doctor registration", href: routes.registerDoctor },
  { label: "Facility registration", href: routes.registerFacility },
  { label: "Admin dashboard",  href: routes.admin }
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-emerald-100/90 bg-white/80 backdrop-blur-sm">
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-brand-100/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-teal-100/35 blur-3xl" />

      <div className="container-page relative py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-600 shadow-lg ring-2 ring-white">
                <span className="text-base font-black text-white">A</span>
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-900">AfiyaPal</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              AI-assisted first-step health guidance for African communities. Clear language, trusted education, and pathways to care when you need them.
            </p>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" aria-hidden />
              Available 24/7 in English &amp; Swahili
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Quick links</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-slate-700 underline-offset-4 transition hover:text-brand-700 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Platform links */}
          <nav aria-label="Platform links">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Platform</p>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-slate-700 underline-offset-4 transition hover:text-brand-700 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-emerald-100/80 pt-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} AfiyaPal. Built with <Heart className="h-3 w-3 text-rose-400 fill-rose-400" aria-hidden /> for African communities.
          </p>
          <p className="max-w-xl md:text-right">
            Informational guidance only. For medical emergencies, visit the nearest facility immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}
