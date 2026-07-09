import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Heart, Mail, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { SocialIconLink } from "@/components/shared/social-icons";

const quickLinks = [
  { label: "About us", href: routes.about },
  { label: "Symptom checker", href: routes.chatbot },
  { label: "Health blogs", href: routes.blogs },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/#contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/profile.php?id=61591438966150",
  },
  { label: "LinkedIn", href: "https://linkedin.com/in/afiyapal" },
  { label: "X", href: "https://x.com/afiyapal" },
  { label: "Instagram", href: "https://instagram.com/afiya.pal" },
];

function getCurrentYear() {
  return new Date().getFullYear();
}

export function Footer() {
  const year = getCurrentYear();
  const copyright = year > 2025 ? `2025-${year}` : "2025";

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-brand-200/60 bg-gradient-to-br from-brand-50 via-white to-emerald-50/80 backdrop-blur-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-60 w-60 rounded-full bg-brand-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-52 w-52 rounded-full bg-teal-200/35 blur-3xl"
      />

      <div className="container-page relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.65fr_1fr] lg:items-start lg:gap-16">
          <div className="max-w-md space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl shadow-lg ring-2 ring-white">
                <Image
                  src="/brand/favicon-source.png"
                  alt=""
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </span>

              <span className="text-2xl font-black tracking-tight text-slate-950">
                AfiyaPal
              </span>
            </div>

            <p className="text-sm leading-7 text-slate-600">
              AI-assisted first-step health guidance for African communities.
              Clear language, trusted education, and pathways to care when you
              need them.
            </p>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                Follow us
              </p>

              <div
                className="flex flex-wrap items-center gap-2.5"
                aria-label="AfiyaPal social links"
              >
                {socialLinks.map((link) => (
                  <SocialIconLink
                    key={link.href}
                    label={link.label}
                    href={link.href}
                  />
                ))}
              </div>
            </div>
          </div>

          <nav aria-label="Quick links" className="lg:pt-2">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Quick links
            </p>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex text-sm font-semibold text-slate-700 underline-offset-4 transition hover:text-brand-700 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rounded-[2rem] border border-brand-100 bg-white/85 p-6 shadow-sm ring-1 ring-white/70">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Trust &amp; safety
            </p>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              AfiyaPal offers educational guidance only. It does not diagnose,
              prescribe, or replace a licensed clinician.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <a
                href="mailto:afiyapal01@gmail.com"
                className="flex items-center gap-2.5 font-bold text-brand-700 transition hover:text-brand-800 hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                afiyapal01@gmail.com
              </a>

              <p className="flex items-center gap-2.5">
                <MapPin
                  className="h-4 w-4 shrink-0 text-brand-600"
                  aria-hidden
                />
                Built for Kenya and Africa
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-emerald-100/90 pt-8 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="flex flex-wrap items-center gap-1">
            © {copyright} AfiyaPal. Built with{" "}
            <Heart
              className="h-3 w-3 fill-rose-400 text-rose-400"
              aria-hidden
            />{" "}
            for African communities.
          </p>

          <p className="inline-flex items-center gap-2 md:text-right">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" aria-hidden />
            Available 24/7 in English &amp; Swahili.
          </p>
        </div>
      </div>
    </footer>
  );
}
