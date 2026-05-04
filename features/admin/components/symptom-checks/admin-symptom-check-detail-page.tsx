import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { getAdminSymptomCheckDetail } from "@/features/admin/queries/get-admin-symptom-checks";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(date);
}

function languageLabel(value: string | null | undefined) {
  if (value === "sw") return "Swahili";
  return "English";
}

function riskTone(riskLevel: string) {
  if (riskLevel === "EMERGENCY") return "red" as const;
  if (riskLevel === "HIGH") return "amber" as const;
  if (riskLevel === "MEDIUM") return "blue" as const;
  return "green" as const;
}

function statusTone(status: string) {
  if (status === "ESCALATED") return "red" as const;
  if (status === "REVIEWED") return "blue" as const;
  if (status === "FAILED") return "amber" as const;
  return "green" as const;
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black uppercase tracking-wide text-brand-700">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

export async function AdminSymptomCheckDetailPage({ logId }: { logId: number }) {
  const data = await getAdminSymptomCheckDetail(logId);
  if (!data) notFound();

  const { log, user, flags } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdminSectionHeader
          eyebrow="Privacy-safe symptom check summary"
          title={`Symptom check #${log.id}`}
          description="This page shows summarized health content only. Full raw health conversations are intentionally not exposed by default."
        />
        <Link href={routes.adminSymptomChecks} className="rounded-full border border-emerald-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
          Back to logs
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Risk level</p>
          <div className="mt-3"><AdminStatusBadge tone={riskTone(log.riskLevel)}>{log.riskLevel}</AdminStatusBadge></div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Status</p>
          <div className="mt-3"><AdminStatusBadge tone={statusTone(log.status)}>{log.status}</AdminStatusBadge></div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Language</p>
          <p className="mt-3 font-black text-slate-950">{languageLabel(log.language)}</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Escalation</p>
          <div className="mt-3"><AdminStatusBadge tone={log.escalationSuggested ? "amber" : "slate"}>{log.escalationSuggested ? "Suggested" : "Not suggested"}</AdminStatusBadge></div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <DetailCard title="Symptoms submitted summary">
            <p>{log.symptomsSummary}</p>
          </DetailCard>
          <DetailCard title="AI response summary">
            <p>{log.aiResponseSummary || "No AI response summary was captured."}</p>
          </DetailCard>
          <DetailCard title="Recommended next step">
            <p>{log.recommendedNextStep || "No next step was recorded."}</p>
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Request metadata">
            <dl className="space-y-3">
              <div><dt className="font-black text-slate-950">Category</dt><dd>{log.symptomCategory ?? "General symptoms"}</dd></div>
              <div><dt className="font-black text-slate-950">Created</dt><dd>{formatDateTime(log.createdAt)}</dd></div>
              <div><dt className="font-black text-slate-950">Updated</dt><dd>{formatDateTime(log.updatedAt)}</dd></div>
            </dl>
          </DetailCard>

          <DetailCard title="User">
            {user ? (
              <div>
                <Link href={`${routes.adminUsers}/${user.id}`} className="font-black text-slate-950 transition hover:text-brand-700">{user.username}</Link>
                <p className="mt-1 text-slate-500">{user.email}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">{user.role} · {user.status}</p>
              </div>
            ) : (
              <p>Guest request or user no longer available.</p>
            )}
          </DetailCard>

          <DetailCard title="Related AI flags">
            {flags.length > 0 ? (
              <div className="space-y-3">
                {flags.map((flag) => (
                  <div key={flag.id} className="rounded-2xl border border-emerald-100 p-3">
                    <p className="font-black text-slate-950">{flag.title}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{flag.category} · {flag.priority} · {flag.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No AI safety flags are attached to this symptom check yet.</p>
            )}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
