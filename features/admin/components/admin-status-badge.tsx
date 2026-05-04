import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "green" | "blue" | "amber" | "red" | "slate";
const toneClasses: Record<Tone, string> = { green: "bg-emerald-50 text-brand-700 ring-emerald-100", blue: "bg-sky-50 text-sky-700 ring-sky-100", amber: "bg-amber-50 text-amber-700 ring-amber-100", red: "bg-rose-50 text-rose-700 ring-rose-100", slate: "bg-slate-50 text-slate-700 ring-slate-100" };

export function AdminStatusBadge({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-black ring-1", toneClasses[tone])}>{children}</span>;
}
