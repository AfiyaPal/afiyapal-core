import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ChatLauncher } from "@/features/chatbot/components/chat-launcher";

export const metadata: Metadata = {
  title: {
    default: "AfiyaPal",
    template: "%s | AfiyaPal"
  },
  description: "A fast, AI-powered health guidance companion for accessible first-step support.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <ChatLauncher />
      </body>
    </html>
  );
}
