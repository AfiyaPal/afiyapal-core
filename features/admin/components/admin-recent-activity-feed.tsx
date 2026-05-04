import Link from "next/link";
import { AdminStatusBadge } from "./admin-status-badge";

export type AdminRecentActivityItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: Date;
  href?: string;
  tone?: "green" | "amber" | "red" | "slate";
};

function formatActivityDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

export function AdminRecentActivityFeed({ items }: { items: readonly AdminRecentActivityItem[] }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Recent activity</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Latest admin-relevant events across users, doctors, AI safety, consultations, and content.</p>
        </div>
        <AdminStatusBadge tone="green">Live MVP feed</AdminStatusBadge>
      </div>

      <div className="mt-5 divide-y divide-emerald-50">
        {items.length > 0 ? (
          items.map((item) => {
            const content = (
              <article className="flex gap-4 py-4">
                <div className="mt-1 size-2.5 shrink-0 rounded-full bg-brand-600" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminStatusBadge tone={item.tone ?? "slate"}>{item.type}</AdminStatusBadge>
                    <span className="text-xs font-semibold text-slate-500">{formatActivityDate(item.createdAt)}</span>
                  </div>
                  <h3 className="mt-2 text-sm font-black text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </article>
            );

            return item.href ? (
              <Link key={item.id} href={item.href} className="block transition hover:bg-emerald-50/40">
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-emerald-100 bg-emerald-50/40 p-6 text-sm leading-6 text-slate-600">
            No recent activity yet. Once users register, doctors apply, symptom checks run, consultations are requested, AI flags are created, or blogs are published, they will appear here.
          </div>
        )}
      </div>
    </section>
  );
}
