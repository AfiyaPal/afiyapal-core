"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function ChatLauncher() {
  return (
    <Link
      href="/chatbot"
      aria-label="Open AfiyaPal chatbot"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-soft transition hover:bg-brand-700"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}
