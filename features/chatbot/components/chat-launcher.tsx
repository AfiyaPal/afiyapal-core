"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { shouldShowMarketingChrome } from "@/lib/layout-chrome";

export function ChatLauncher() {
  const pathname = usePathname();

  if (!shouldShowMarketingChrome(pathname)) return null;

  return (
    <Link
      href="/chatbot"
      aria-label="Open AfiyaPal chatbot"
      title="Ask AfiyaPal"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-600/35 ring-4 ring-brand-400/15 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-600/40 hover:ring-brand-400/30 active:translate-y-0 active:scale-[0.96] motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={2} aria-hidden />
    </Link>
  );
}
