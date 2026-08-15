"use client";

import { Bell } from "lucide-react";

export function NotificationBell({ count, href }: { count: number; href: string }) {
  const label = count > 0 ? `Notifications, ${count} unread` : "Notifications";
  return (
    <a
      href={href}
      aria-label={label}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition hover:bg-theme-primary-light hover:text-theme-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2"
    >
      <Bell aria-hidden="true" className="size-5" />
      {count > 0 && (
        <span aria-hidden="true" className="absolute right-0.5 top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 py-0.5 text-[10px] font-bold leading-none text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </a>
  );
}
