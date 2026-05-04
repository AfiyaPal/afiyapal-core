type AdminDashboardCardProps = { label: string; value: string; helper: string };

export function AdminDashboardCard({ label, value, helper }: AdminDashboardCardProps) {
  return (
    <article className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{helper}</p>
    </article>
  );
}
