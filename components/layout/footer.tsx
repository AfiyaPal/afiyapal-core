import Link from "next/link";
import { siteConfig } from "@/lib/seo/config";

const footerLinks = [
  { label: "Symptom checker", href: "/chatbot" },
  { label: "Health education", href: "/blogs" },
  { label: "Health events", href: "/events" },
  { label: "Doctor registration", href: "/register/doctor" },
  { label: "Facility registration", href: "/register/facility" }
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-emerald-100 bg-white" role="contentinfo">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-lg font-black text-brand-700">AfiyaPal</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{siteConfig.tagline}</p>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
            <p className="font-bold">Medical safety notice</p>
            <p className="mt-1">{siteConfig.medicalDisclaimer}</p>
            <p className="mt-1">{siteConfig.emergencyNotice}</p>
          </div>
        </div>
        <nav aria-label="Footer navigation" className="grid gap-2 text-sm">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="font-semibold text-slate-700 hover:text-brand-700">
              {item.label}
            </Link>
          ))}
          <a href={siteConfig.creatorUrl} className="font-semibold text-slate-700 hover:text-brand-700" rel="noopener noreferrer" target="_blank">
            Built by {siteConfig.creator}
          </a>
        </nav>
      </div>
      <div className="border-t border-emerald-50 py-4">
        <div className="container-page flex flex-col gap-2 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} AfiyaPal. All rights reserved.</p>
          <p>Minimum intended age: {siteConfig.minimumAge}. Current status: {siteConfig.stage}.</p>
        </div>
      </div>
    </footer>
  );
}
