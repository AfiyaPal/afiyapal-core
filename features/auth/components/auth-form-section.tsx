import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthFormSection({
  title,
  description,
  icon: Icon,
  children,
  className
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 sm:p-6", className)}>
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm ring-1 ring-brand-100">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
