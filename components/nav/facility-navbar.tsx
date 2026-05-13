import Link from "next/link";
import { Building2, CalendarDays, LayoutDashboard, Plus, Stethoscope } from "lucide-react";
import { getCurrentUser } from "@/server/auth/session";
import { getRoleLabel } from "@/server/auth/roles";
import { UserDropdown } from "./user-dropdown";

const navLinks = [
  { label: "Dashboard", href: "/facility", icon: LayoutDashboard },
  { label: "Events", href: "/facility/events", icon: CalendarDays },
  { label: "Professionals", href: "/facility/professionals", icon: Stethoscope }
];

export async function FacilityNavbar() {
  const user = await getCurrentUser();
  if (!user) return null;

  const initials = user.username.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "F";

  return (
    <header className="sticky top-0 z-30 border-b border-theme-border bg-theme-surface/90 backdrop-blur">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/facility" className="flex items-center gap-2">
            <span className="text-base font-bold text-theme-primary-dark">AfiyaPal</span>
            <span className="hidden rounded-full bg-theme-primary-light px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-theme-primary-dark md:inline">Facility</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-theme-primary-light hover:text-theme-primary"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/facility/events/new"
            className="hidden items-center gap-1.5 rounded-full bg-theme-primary px-4 py-1.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 md:inline-flex"
          >
            <Plus aria-hidden="true" className="size-4" />
            Create event
          </Link>
          <Link href="/facility" className="relative rounded-full p-2 text-slate-500 transition hover:bg-theme-primary-light hover:text-theme-primary">
            <Building2 aria-hidden="true" className="size-5" />
          </Link>
          <UserDropdown username={user.username} email={user.email} roleLabel={getRoleLabel(user.role)} initials={initials} />
        </div>
      </div>
    </header>
  );
}
