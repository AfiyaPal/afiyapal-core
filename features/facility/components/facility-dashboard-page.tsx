import { Building2, CalendarDays, Stethoscope } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; tone: string }> = {
  PENDING: { label: "Pending verification", tone: "bg-amber-50 text-amber-700 ring-amber-100" },
  VERIFIED: { label: "Verified", tone: "bg-emerald-50 text-brand-700 ring-emerald-100" },
  REJECTED: { label: "Rejected", tone: "bg-rose-50 text-rose-700 ring-rose-100" },
  SUSPENDED: { label: "Suspended", tone: "bg-rose-50 text-rose-700 ring-rose-100" }
};

export function FacilityDashboardPage({
  facility
}: {
  facility: {
    name: string;
    type: string;
    verificationStatus: string;
    country: string;
    city: string | null;
    _count?: { professionals: number; events: number };
    professionals: unknown[];
    events: unknown[];
  } | null;
}) {
  if (!facility) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Facility Portal</h1>
          <p className="mt-2 text-slate-600">Your facility registration is being processed.</p>
        </section>
      </div>
    );
  }

  const st = statusConfig[facility.verificationStatus] ?? statusConfig.PENDING;
  const professionalCount = facility.professionals.length;
  const eventCount = facility.events.length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Facility Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{facility.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${st.tone}`}>{st.label}</span>
              <span className="text-sm text-slate-500">{facility.type.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
              <span className="text-sm text-slate-500">{facility.city ?? facility.country}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/facility/events" className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-soft">
          <CalendarDays aria-hidden="true" className="size-6 text-brand-600" />
          <h2 className="mt-3 text-lg font-black text-slate-950">Events</h2>
          <p className="mt-1 text-sm text-slate-600">{eventCount} event{eventCount === 1 ? "" : "s"}</p>
        </Link>
        <Link href="/facility/professionals" className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-soft">
          <Stethoscope aria-hidden="true" className="size-6 text-brand-600" />
          <h2 className="mt-3 text-lg font-black text-slate-950">Professionals</h2>
          <p className="mt-1 text-sm text-slate-600">{professionalCount} professional{professionalCount === 1 ? "" : "s"}</p>
        </Link>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <Building2 aria-hidden="true" className="size-6 text-brand-600" />
          <h2 className="mt-3 text-lg font-black text-slate-950">Verification</h2>
          <p className="mt-1 text-sm text-slate-600">Status: {st.label}</p>
        </div>
      </div>
    </div>
  );
}
