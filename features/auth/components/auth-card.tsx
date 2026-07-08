import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  type LucideIcon
} from "lucide-react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Highlight = { icon: LucideIcon; text: string };

type AuthCardVariant = "default" | "patient" | "doctor" | "facility";

const greenPanel = "from-[#056636] via-brand-700 to-[#008958]";

const variantConfig: Record<
  AuthCardVariant,
  { panel: string; highlights: Highlight[]; tagline: string; badge?: string; wide?: boolean }
> = {
  default: {
    panel: greenPanel,
    tagline: "AI-powered health guidance built for African communities.",
    highlights: [
      { icon: MessageCircle, text: "AI symptom checker in English & Swahili" },
      { icon: ShieldCheck, text: "Safe, evidence-aware health guidance" },
      { icon: UserCheck, text: "Pathways to verified healthcare providers" }
    ]
  },
  patient: {
    panel: greenPanel,
    tagline: "Free first-step health guidance — whenever you need it.",
    badge: "For patients & families",
    highlights: [
      { icon: MessageCircle, text: "Ask health questions in English or Swahili" },
      { icon: ShieldCheck, text: "Evidence-aware AI symptom guidance" },
      { icon: UserCheck, text: "Request consultations with verified doctors" }
    ]
  },
  doctor: {
    panel: greenPanel,
    tagline: "Join a verified network serving communities across Africa.",
    badge: "Health professionals",
    highlights: [
      { icon: Stethoscope, text: "Reach patients seeking trusted care" },
      { icon: ShieldCheck, text: "Complete your profile after sign-up" },
      { icon: UserCheck, text: "Publish education and accept consultations" }
    ]
  },
  facility: {
    panel: greenPanel,
    tagline: "Register your facility and connect with local communities.",
    badge: "Hospitals, clinics & NGOs",
    wide: true,
    highlights: [
      { icon: Building2, text: "Showcase your facility to nearby patients" },
      { icon: CalendarDays, text: "List community health events and outreach" },
      { icon: ShieldCheck, text: "Verified facility profile for trust" }
    ]
  }
};

function BrandMark({ compact = false, onDark = false }: { compact?: boolean; onDark?: boolean }) {
  return (
    <Link
      href={routes.home}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        onDark
          ? "focus-visible:ring-white/60 focus-visible:ring-offset-transparent"
          : "focus-visible:ring-brand-500 focus-visible:ring-offset-white"
      )}
    >
      <span className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg", compact ? "h-9 w-9" : "h-10 w-10", onDark ? "ring-2 ring-white/30" : "ring-2 ring-brand-100")}>
        <Image src="/brand/favicon-source.png" alt="" width={40} height={40} className="h-full w-full object-cover" priority />
      </span>
      <span className={cn("font-bold tracking-tight", compact ? "text-lg" : "text-xl", onDark ? "text-white" : "text-slate-900 group-hover:text-brand-700")}>
        AfiyaPal
      </span>
    </Link>
  );
}

export function AuthCard({
  title,
  description,
  children,
  variant = "default"
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  variant?: AuthCardVariant;
}) {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "flex w-full overflow-hidden rounded-3xl shadow-[0_24px_80px_-12px_rgb(23_163_107_/_0.18)] ring-1 ring-slate-200/60",
        config.wide ? "max-w-4xl" : "max-w-3xl"
      )}
    >
      {/* Left brand panel */}
      <div className={cn("hidden w-[42%] flex-col justify-between bg-gradient-to-br p-8 text-white lg:flex", config.panel)}>
        <div>
          <BrandMark onDark />
          {config.badge && (
            <p className="mt-5 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/95 ring-1 ring-white/20">
              {config.badge}
            </p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-white/85">{config.tagline}</p>
        </div>

        <ul className="space-y-4">
          {config.highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="text-sm text-white/85">{text}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-white/60">© {new Date().getFullYear()} AfiyaPal. Informational guidance only.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-white/95 p-6 backdrop-blur-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <BrandMark compact />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
