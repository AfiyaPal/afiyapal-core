"use client";

import { logoutAction } from "@/features/admin/actions/admin-session-actions";

export function UserDropdown({ username, email, roleLabel, initials }: { username: string; email: string; roleLabel: string; initials: string }) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-theme-border bg-theme-surface py-1 pl-1 pr-3 shadow-sm transition hover:border-theme-primary">
        <span className="grid size-8 place-items-center rounded-full bg-theme-primary text-xs font-black text-white">{initials}</span>
        <span className="hidden text-left md:block">
          <span className="block text-sm font-bold text-theme-foreground">{username}</span>
          <span className="block text-xs text-slate-500">{roleLabel}</span>
        </span>
      </summary>
      <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-theme-border bg-theme-surface p-4 shadow-soft">
        <p className="text-sm font-bold text-theme-foreground">{username}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{email}</p>
        <p className="mt-3 inline-flex rounded-full bg-theme-primary-light px-3 py-1 text-xs font-bold text-theme-primary-dark">{roleLabel}</p>
        <form action={logoutAction} className="mt-4">
          <button type="submit" className="w-full rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
            Log out
          </button>
        </form>
      </div>
    </details>
  );
}
