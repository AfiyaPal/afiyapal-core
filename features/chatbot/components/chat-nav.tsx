"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, House } from "lucide-react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ChatNav({
  mode,
  hasThread,
  onNewChat,
  installAction
}: {
  mode: "page" | "frame";
  hasThread: boolean;
  onNewChat: () => void;
  installAction?: ReactNode;
}) {
  const brand = (
    <span className="flex items-center gap-2.5">
      <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-xl ring-2 ring-brand-700/70 transition group-hover:ring-brand-500">
        <Image src="/brand/favicon-source.png" alt="" width={36} height={36} className="h-full w-full object-cover" priority />
      </span>
      <span className="text-base font-bold tracking-tight text-white">AfiyaPal</span>
    </span>
  );

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-brand-800 bg-brand-900/90 px-4 backdrop-blur sm:px-6">
      {mode === "page" ? (
        <Link href={routes.home} aria-label="Back to AfiyaPal home" className="group rounded-xl outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900">
          {brand}
        </Link>
      ) : (
        <span className="flex items-center gap-2.5">{brand}</span>
      )}

      <p className="hidden items-center gap-1.5 text-xs text-brand-300 sm:flex" aria-hidden>
        <span className="size-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
        Online · English &amp; Swahili
      </p>

      <div className="ml-auto flex items-center gap-2">
        {installAction}
        {hasThread && (
          <button
            type="button"
            onClick={onNewChat}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-700 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-brand-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
          >
            <Plus className="size-3.5" aria-hidden />
            New chat
          </button>
        )}
        {mode === "page" && (
          <Link
            href={routes.home}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-brand-600 bg-brand-800/60 px-3 py-1.5 text-xs font-semibold text-brand-100 transition hover:border-brand-500 hover:bg-brand-700 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
            )}
          >
            <House className="size-3.5" aria-hidden />
            Back to Home
          </Link>
        )}
      </div>
    </header>
  );
}
