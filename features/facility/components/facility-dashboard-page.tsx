import { AlertTriangle, Building2, CalendarDays, Clock, Stethoscope } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; tone: string }> = {
  PENDING: { label: "Pending verification", tone: "bg-amber-50 text-amber-700 ring-amber-100" },
  VERIFIED: { label: "Verified", tone: "bg-emerald-50 text-brand-700 ring-emerald-100" },
  REJECTED: { label: "Rejected", tone: "bg-rose-50 text-rose-700 ring-rose-100" },
  SUSPENDED: { label: "Suspended", tone: "bg-rose-50 text-rose-700 ring-rose-100" }
};

type FacilityData = {
  name: string;
  type: string;
  verificationStatus: string;
  country: string;
  city: string | null;
  rejectionReason: string | null;
  suspensionReason: string | null;
  professionals: unknown[];
  events: unknown[];
};

export function FacilityDashboardPage({
  facility
}: {
  facility: FacilityData | null;
}) {
  if (!facility) {
    return (
      <div className="space-y-8">
        <section className="rounded-3xl border border-theme-border bg-gradient-to-br from-theme-primary-light via-theme-surface to-theme-accent/10 p-6 shadow-sm md:p-8">
          <h1 className="text-3xl font-black tracking-tight text-theme-foreground">Facility Portal</h1>
          <p className="mt-2 text-slate-600">Your facility registration is being processed.</p>
        </section>
      </div>
    );
  }

  const st = statusConfig[facility.verificationStatus] ?? statusConfig.PENDING;
  const isVerified = facility.verificationStatus === "VERIFIED";
  const professionalCount = facility.professionals.length;
  const eventCount = facility.events.length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-theme-border bg-gradient-to-br from-theme-primary-light via-theme-surface to-theme-accent/10 p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-primary-dark">Facility Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-theme-foreground">{facility.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${st.tone}`}>{st.label}</span>
              <span className="text-sm text-slate-500">{facility.type.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
              <span className="text-sm text-slate-500">{facility.city ?? facility.country}</span>
            </div>
          </div>
        </div>

        {!isVerified && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex items-start gap-3">
              <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-amber-900">Feature access limited</p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  {facility.verificationStatus === "PENDING" && (
                    <>Your facility is under review. You will be able to create events and manage professionals once verified. This typically takes 1–2 business days.</>
                  )}
                  {facility.verificationStatus === "REJECTED" && (
                    <>Your facility verification was not approved{facility.rejectionReason ? `: ${facility.rejectionReason}` : ". Please contact support for more information."}</>
                  )}
                  {facility.verificationStatus === "SUSPENDED" && (
                    <>Your facility has been suspended{facility.suspensionReason ? `: ${facility.suspensionReason}` : ". Please contact support for more information."}</>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {isVerified ? (
          <Link href="/facility/events" className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm transition hover:border-theme-primary hover:shadow-soft">
            <CalendarDays aria-hidden="true" className="size-6 text-theme-primary" />
            <h2 className="mt-3 text-lg font-black text-theme-foreground">Events</h2>
            <p className="mt-1 text-sm text-slate-600">{eventCount} event{eventCount === 1 ? "" : "s"}</p>
          </Link>
        ) : (
          <div className="rounded-3xl border border-theme-border bg-theme-surface/50 p-6 opacity-60">
            <CalendarDays aria-hidden="true" className="size-6 text-slate-400" />
            <h2 className="mt-3 text-lg font-black text-slate-400">Events</h2>
            <p className="mt-1 text-sm text-slate-400">Available after verification</p>
          </div>
        )}

        {isVerified ? (
          <Link href="/facility/professionals" className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm transition hover:border-theme-primary hover:shadow-soft">
            <Stethoscope aria-hidden="true" className="size-6 text-theme-primary" />
            <h2 className="mt-3 text-lg font-black text-theme-foreground">Professionals</h2>
            <p className="mt-1 text-sm text-slate-600">{professionalCount} professional{professionalCount === 1 ? "" : "s"}</p>
          </Link>
        ) : (
          <div className="rounded-3xl border border-theme-border bg-theme-surface/50 p-6 opacity-60">
            <Stethoscope aria-hidden="true" className="size-6 text-slate-400" />
            <h2 className="mt-3 text-lg font-black text-slate-400">Professionals</h2>
            <p className="mt-1 text-sm text-slate-400">Available after verification</p>
          </div>
        )}

        {facility.verificationStatus === "REJECTED" || facility.verificationStatus === "SUSPENDED" ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6">
            <AlertTriangle aria-hidden="true" className="size-6 text-rose-600" />
            <h2 className="mt-3 text-lg font-black text-rose-900">Verification</h2>
            <p className="mt-1 text-sm text-rose-700">
              {facility.verificationStatus === "REJECTED" ? "Not approved" : "Suspended"}
              {facility.rejectionReason || facility.suspensionReason ? `: ${facility.rejectionReason ?? facility.suspensionReason}` : ""}
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm">
            <Building2 aria-hidden="true" className="size-6 text-theme-primary" />
            <h2 className="mt-3 text-lg font-black text-theme-foreground">Verification</h2>
            <p className="mt-1 text-sm text-slate-600">Status: {st.label}</p>
          </div>
        )}
      </div>
    </div>
  );
}
