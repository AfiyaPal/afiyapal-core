import { FileText, PenLine, Plus } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  PENDING: { label: "Pending verification", tone: "bg-amber-50 text-amber-700 ring-amber-100" as const },
  VERIFIED: { label: "Verified", tone: "bg-emerald-50 text-brand-700 ring-emerald-100" as const },
  REJECTED: { label: "Rejected", tone: "bg-rose-50 text-rose-700 ring-rose-100" as const },
  SUSPENDED: { label: "Suspended", tone: "bg-rose-50 text-rose-700 ring-rose-100" as const }
} as const;

export function DoctorDashboardPage({
  profile,
  name,
  blogCount
}: {
  profile: {
    verificationStatus: string;
    specialty: string | null;
    country: string | null;
    cityRegion: string | null;
    fullName: string;
  } | null;
  name: string;
  blogCount: number;
}) {
  const status = profile ? statusConfig[profile.verificationStatus as keyof typeof statusConfig] ?? statusConfig.PENDING : statusConfig.PENDING;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Doctor Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Welcome, {profile?.fullName || name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${status.tone}`}>{status.label}</span>
              {profile?.specialty && <span className="text-sm text-slate-500">{profile.specialty}</span>}
              {profile?.cityRegion && <span className="text-sm text-slate-500">{profile.cityRegion}{profile?.country ? `, ${profile.country}` : ""}</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/blogs/new" className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-soft">
          <Plus aria-hidden="true" className="size-6 text-brand-600" />
          <h2 className="mt-3 text-lg font-black text-slate-950">Write new article</h2>
          <p className="mt-1 text-sm text-slate-600">Create a health education blog post.</p>
        </Link>
        <Link href="/dashboard/blogs" className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-soft">
          <FileText aria-hidden="true" className="size-6 text-brand-600" />
          <h2 className="mt-3 text-lg font-black text-slate-950">My articles</h2>
          <p className="mt-1 text-sm text-slate-600">{blogCount} article{blogCount === 1 ? "" : "s"} written.</p>
        </Link>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <PenLine aria-hidden="true" className="size-6 text-brand-600" />
          <h2 className="mt-3 text-lg font-black text-slate-950">Profile</h2>
          <p className="mt-1 text-sm text-slate-600">Verification: {status.label}</p>
        </div>
      </div>
    </div>
  );
}
