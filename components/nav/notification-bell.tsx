"use client";

import { Bell } from "lucide-react";

export function NotificationBell({ count, href }: { count: number; href: string }) {
  return (
    <a href={href} className="relative rounded-full p-2 text-slate-500 transition hover:bg-theme-primary-light hover:text-theme-primary">
      <Bell aria-hidden="true" className="size-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 py-0.5 text-[10px] font-bold leading-none text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </a>
  );
}
