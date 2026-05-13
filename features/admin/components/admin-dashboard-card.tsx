import type { ReactNode } from "react";

type AdminDashboardCardProps = {
  label: string;
  value: string;
  helper: string;
  icon?: ReactNode;
};

export function AdminDashboardCard({ label, value, helper, icon }: AdminDashboardCardProps) {
  return (
    <article className="rounded-3xl border border-theme-border bg-theme-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {icon ? <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-theme-primary-light text-theme-primary-dark">{icon}</div> : null}
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight text-theme-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}
