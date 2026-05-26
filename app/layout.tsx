import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ChatLauncher } from "@/features/chatbot/components/chat-launcher";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema, webApplicationSchema } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/seo/config";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#118255",
  colorScheme: "light"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-brand-700 focus:shadow-soft">
          Skip to main content
        </a>
        <JsonLd data={[organizationSchema(), websiteSchema(), webApplicationSchema()]} />
        <AppShell>{children}</AppShell>
        <ChatLauncher />
        <div className="sr-only" aria-live="polite">
          {siteConfig.medicalDisclaimer}
        </div>
      </body>
    </html>
  );
}
