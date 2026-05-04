import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { SensitiveHealthAccessPanel } from "@/features/admin/components/sensitive-health-access-panel";
import { getAdminSymptomCheckDetail } from "@/features/admin/queries/get-admin-symptom-checks";
import { ADMIN_PERMISSIONS, hasAdminPermission } from "@/server/auth/admin-permissions";
import { hasActiveSensitiveHealthAccess } from "@/server/services/sensitive-health-access-service";
import type { UserRole } from "@/server/auth/roles";

type AdminUserContext = { id: number; role: UserRole | string; username: string; email: string; status: string };

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

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-black uppercase tracking-wide text-brand-700">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate-700">{children}</div>
    </section>
  );
}

export async function AdminSymptomCheckDetailPage({
  logId,
  adminUser,
  sensitiveRequested
}: {
  logId: number;
  adminUser: AdminUserContext;
  sensitiveRequested?: boolean;
}) {
  const data = await getAdminSymptomCheckDetail(logId);
  if (!data) notFound();

  const { log, user, flags } = data;
  const canRequestSensitiveAccess = hasAdminPermission(adminUser.role, ADMIN_PERMISSIONS.VIEW_SENSITIVE_HEALTH_DETAILS);
  const activeGrant = sensitiveRequested
    ? await hasActiveSensitiveHealthAccess({ adminUserId: adminUser.id, targetType: "SymptomCheckLog", targetId: log.id })
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AdminSectionHeader
          eyebrow="Privacy-safe symptom check summary"
          title={`Symptom check #${log.id}`}
          description="Admin tables and default detail views avoid raw/private health content. Sensitive summaries require Medical Reviewer or Super Admin access, a reason, and an audit log entry."
        />
        <Link href={routes.adminSymptomChecks} className="rounded-full border border-emerald-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
          Back to logs
        </Link>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        <p className="font-black text-amber-950">Privacy and safety rule</p>
        <p className="mt-1">AFIYAPAL stores a summarized symptom-check record for safety review. Full raw health conversations are not stored by default. Viewing the sensitive summary below requires a reason and is audited.</p>
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
          <DetailCard title="Safe overview">
            <dl className="grid gap-4 md:grid-cols-2">
              <div><dt className="font-black text-slate-950">Category</dt><dd>{log.symptomCategory ?? "General symptoms"}</dd></div>
              <div><dt className="font-black text-slate-950">Recommended next step</dt><dd>{log.recommendedNextStep || "No next step was recorded."}</dd></div>
            </dl>
          </DetailCard>

          <DetailCard title="Sensitive health summary access">
            <SensitiveHealthAccessPanel targetType="SymptomCheckLog" targetId={log.id} canRequestAccess={canRequestSensitiveAccess} activeGrant={activeGrant}>
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-black text-slate-950">Symptoms submitted summary</p>
                  <p className="mt-2">{log.symptomsSummary}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-black text-slate-950">AI response summary</p>
                  <p className="mt-2">{log.aiResponseSummary || "No AI response summary was captured."}</p>
                </div>
              </div>
            </SensitiveHealthAccessPanel>
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Request metadata">
            <dl className="space-y-3">
              <div><dt className="font-black text-slate-950">Created</dt><dd>{formatDateTime(log.createdAt)}</dd></div>
              <div><dt className="font-black text-slate-950">Updated</dt><dd>{formatDateTime(log.updatedAt)}</dd></div>
            </dl>
          </DetailCard>

          <DetailCard title="User context">
            {user ? (
              <dl className="space-y-3">
                <div><dt className="font-black text-slate-950">Name</dt><dd><Link href={`${routes.adminUsers}/${user.id}`} className="text-brand-700 hover:text-brand-600">{user.username}</Link></dd></div>
                <div><dt className="font-black text-slate-950">Email</dt><dd>{user.email}</dd></div>
                <div><dt className="font-black text-slate-950">Preferred language</dt><dd>{languageLabel(user.preferredLanguage)}</dd></div>
                <div><dt className="font-black text-slate-950">Account status</dt><dd>{user.status}</dd></div>
              </dl>
            ) : <p className="text-slate-500">This log is linked to a guest or unavailable user.</p>}
          </DetailCard>

          <DetailCard title="Linked AI safety flags">
            {flags.length ? (
              <div className="space-y-3">
                {flags.map((flag) => (
                  <Link key={flag.id} href={`${routes.adminAiFlags}/${flag.id}`} className="block rounded-2xl border border-emerald-100 p-4 transition hover:border-brand-600">
                    <p className="font-black text-slate-950">{flag.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{flag.category} · {flag.priority} · {flag.status}</p>
                  </Link>
                ))}
              </div>
            ) : <p className="text-slate-500">No AI safety flags are linked to this symptom check.</p>}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
