import { FileText, PenLine, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  PENDING: { label: "Pending verification", tone: "bg-amber-50 text-amber-700 ring-amber-100" as const },
  VERIFIED: { label: "Verified", tone: "bg-emerald-50 text-brand-700 ring-emerald-100" as const },
  REJECTED: { label: "Rejected", tone: "bg-rose-50 text-rose-700 ring-rose-100" as const },
  SUSPENDED: { label: "Suspended", tone: "bg-rose-50 text-rose-700 ring-rose-100" as const }
} as const;

type CommunityTopic = {
  topicSlug: string;
  topicLabel: string;
  messageCount: number;
  sentimentScore: number;
  summary: string | null;
};

function sentimentLabel(score: number) {
  if (score >= 0.2) return "Positive";
  if (score <= -0.2) return "Negative";
  return "Neutral";
}

function sentimentTone(score: number) {
  if (score >= 0.2) return "bg-emerald-50 text-emerald-700";
  if (score <= -0.2) return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

export function DoctorDashboardPage({
  profile,
  name,
  blogCount,
  topics
}: {
  profile: {
    verificationStatus: string;
    specialty: string | null;
    country: string | null;
    cityRegion: string | null;
    fullName: string;
    licenseNumber: string | null;
  } | null;
  name: string;
  blogCount: number;
  topics: CommunityTopic[];
}) {
  const status = profile ? statusConfig[profile.verificationStatus as keyof typeof statusConfig] ?? statusConfig.PENDING : statusConfig.PENDING;
  const isIncomplete = profile ? !profile.licenseNumber || !profile.specialty : true;
  const needsVerification = !profile || profile.verificationStatus === "PENDING" || profile.verificationStatus === "REJECTED";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-theme-border bg-gradient-to-br from-theme-primary-light via-theme-surface to-theme-accent/10 p-6 shadow-sm md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-primary-dark">Professional Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-theme-foreground">Welcome, {profile?.fullName || name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${status.tone}`}>{status.label}</span>
              {profile?.specialty && <span className="text-sm text-slate-500">{profile.specialty}</span>}
              {profile?.cityRegion && <span className="text-sm text-slate-500">{profile.cityRegion}{profile?.country ? `, ${profile.country}` : ""}</span>}
            </div>
          </div>
        </div>
      </section>

      {needsVerification && (
        <Link
          href="/dashboard/profile"
          className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 transition hover:border-amber-300 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-bold text-amber-900">
              {isIncomplete ? "Complete your professional profile to get verified" : "Your professional profile is awaiting verification"}
            </p>
            <p className="mt-0.5 text-xs text-amber-700">Add your license, specialty, and bio so our team can verify you and unlock publishing.</p>
          </div>
          <span className="shrink-0 rounded-full bg-amber-600 px-3 py-1 text-center text-xs font-bold text-white">Update profile</span>
        </Link>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/blogs/new" className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm transition hover:border-theme-primary hover:shadow-soft">
          <Plus aria-hidden="true" className="size-6 text-theme-primary" />
          <h2 className="mt-3 text-lg font-black text-theme-foreground">Write new article</h2>
          <p className="mt-1 text-sm text-slate-600">Create a health education blog post.</p>
        </Link>
        <Link href="/dashboard/blogs" className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm transition hover:border-theme-primary hover:shadow-soft">
          <FileText aria-hidden="true" className="size-6 text-theme-primary" />
          <h2 className="mt-3 text-lg font-black text-theme-foreground">My articles</h2>
          <p className="mt-1 text-sm text-slate-600">{blogCount} article{blogCount === 1 ? "" : "s"} written.</p>
        </Link>
        <Link href="/dashboard/profile" className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm transition hover:border-theme-primary hover:shadow-soft">
          <PenLine aria-hidden="true" className="size-6 text-theme-primary" />
          <h2 className="mt-3 text-lg font-black text-theme-foreground">Professional profile</h2>
          <p className="mt-1 text-sm text-slate-600">Verification: {status.label}. Update your credentials and bio.</p>
        </Link>
      </div>

      <section className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <TrendingUp aria-hidden="true" className="size-6 text-theme-primary" />
          <div>
            <h2 className="text-lg font-black text-theme-foreground">Community topics to write about</h2>
            <p className="text-sm text-slate-600">What people asked the health chatbot in the last 30 days.</p>
          </div>
        </div>

        {topics.length === 0 ? (
          <p className="mt-5 rounded-2xl border border-dashed border-theme-border bg-theme-surface/50 p-4 text-sm text-slate-600">
            Insights will appear here after the first nightly analysis. Check back tomorrow.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {topics.map((topic) => (
              <li
                key={topic.topicSlug}
                className="flex flex-col gap-3 rounded-2xl border border-theme-border bg-theme-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-bold text-theme-foreground">{topic.topicLabel}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{topic.summary ?? `${topic.messageCount} question${topic.messageCount === 1 ? "" : "s"} in the last 30 days.`}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {topic.messageCount} msg{topic.messageCount === 1 ? "" : "s"}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${sentimentTone(topic.sentimentScore)}`}>
                    {sentimentLabel(topic.sentimentScore)}
                  </span>
                  <Link
                    href={`/dashboard/blogs/new?topic=${encodeURIComponent(topic.topicSlug)}&topicLabel=${encodeURIComponent(topic.topicLabel)}`}
                    className="rounded-full bg-theme-primary px-3 py-1 text-xs font-bold text-white transition hover:bg-theme-primary-dark"
                  >
                    Write article
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
