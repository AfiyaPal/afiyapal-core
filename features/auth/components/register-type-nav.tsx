import Link from "next/link";
import { Building2, Stethoscope, UserRound } from "lucide-react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const registerTypes = [
  { key: "patient", label: "Patient", href: routes.register, icon: UserRound },
  { key: "doctor", label: "Doctor", href: routes.registerDoctor, icon: Stethoscope },
  { key: "facility", label: "Facility", href: routes.registerFacility, icon: Building2 }
] as const;

export type RegisterType = (typeof registerTypes)[number]["key"];

export function RegisterTypeNav({ active }: { active: RegisterType }) {
  return (
    <nav aria-label="Registration type" className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100/80 p-1.5 ring-1 ring-slate-200/80">
      {registerTypes.map(({ key, label, href, icon: Icon }) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition sm:text-sm",
              isActive
                ? "bg-white text-brand-700 shadow-sm ring-1 ring-brand-100"
                : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
