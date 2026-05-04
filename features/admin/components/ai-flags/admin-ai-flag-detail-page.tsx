import type { ReactNode } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { getAdminAiFlagDetail } from "@/features/admin/queries/get-admin-ai-flags";
import { assignAiFlagReviewerAction, escalateAiFlagToConsultationAction, updateAiFlagNotesAction, updateAiFlagStatusAction } from "@/features/admin/actions/admin-ai-flag-actions";
import { AI_FLAG_PRIORITIES, AI_FLAG_STATUSES } from "@/server/services/ai-safety-flag-service";

function formatDateTime(date: Date | null | undefined) {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function label(value: string | null | undefined) {
  if (!value) return "Not set";
  return value.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function statusTone(status: string) {
  if (status === "ESCALATED") return "red" as const;
  if (status === "RESOLVED") return "green" as const;
  if (status === "IN_REVIEW") return "blue" as const;
  return "amber" as const;
}

function priorityTone(priority: string) {
  if (priority === "CRITICAL") return "red" as const;
  if (priority === "HIGH") return "amber" as const;
  if (priority === "MEDIUM") return "blue" as const;
  return "slate" as const;
}

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-950">{title}</h2><div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">{children}</div></section>;
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return <div><p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p><div className="mt-1 font-semibold text-slate-800">{value}</div></div>;
}

export async function AdminAiFlagDetailPage({ flagId }: { flagId: number }) {
  const data = await getAdminAiFlagDetail(flagId);

  if (!data) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
        <Link href={routes.adminAiFlags} className="text-sm font-bold text-brand-700 hover:text-brand-600">← Back to AI flags</Link>
        <h1 className="mt-6 text-2xl font-black text-slate-950">AI flag not found</h1>
        <p className="mt-2 text-sm text-slate-600">This flag may have been removed or the identifier is invalid.</p>
      </div>
    );
  }

  const { flag, user, assignedReviewer, symptomCheck, consultation, eligibleReviewers } = data;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
        <Link href={routes.adminAiFlags} className="text-sm font-bold text-brand-700 hover:text-brand-600">← Back to AI flags</Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <AdminSectionHeader eyebrow="AI safety review" title={flag.title} description="This page shows a privacy-safe summary for review. It avoids exposing raw full conversations by default while still giving reviewers enough context to act." />
          <div className="flex flex-wrap gap-2">
            <AdminStatusBadge tone={priorityTone(flag.priority)}>{flag.priority}</AdminStatusBadge>
            <AdminStatusBadge tone={statusTone(flag.status)}>{label(flag.status)}</AdminStatusBadge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <DetailCard title="Flag summary">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Category" value={label(flag.category)} />
              <Field label="Trigger" value={label(flag.trigger)} />
              <Field label="Created" value={formatDateTime(flag.createdAt)} />
              <Field label="Updated" value={formatDateTime(flag.updatedAt)} />
              <Field label="Resolved" value={formatDateTime(flag.resolvedAt)} />
              <Field label="Reviewer" value={assignedReviewer ? `${assignedReviewer.username} (${assignedReviewer.role})` : "Unassigned"} />
            </div>
            {flag.summary ? <p className="rounded-2xl bg-emerald-50 p-4 text-slate-700">{flag.summary}</p> : null}
          </DetailCard>

          <DetailCard title="Privacy-safe symptom check context">
            {symptomCheck ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Language" value={symptomCheck.language === "sw" ? "Swahili" : "English"} />
                  <Field label="Symptom category" value={symptomCheck.symptomCategory ?? "General symptoms"} />
                  <Field label="Risk level" value={<AdminStatusBadge tone={symptomCheck.riskLevel === "EMERGENCY" ? "red" : symptomCheck.riskLevel === "HIGH" ? "amber" : symptomCheck.riskLevel === "MEDIUM" ? "blue" : "green"}>{symptomCheck.riskLevel}</AdminStatusBadge>} />
                  <Field label="Escalation suggested" value={symptomCheck.escalationSuggested ? "Yes" : "No"} />
                </div>
                <Field label="Symptoms summary" value={<p className="rounded-2xl bg-slate-50 p-4 font-medium leading-7 text-slate-700">{symptomCheck.symptomsSummary}</p>} />
                <Field label="AI response summary" value={<p className="rounded-2xl bg-slate-50 p-4 font-medium leading-7 text-slate-700">{symptomCheck.aiResponseSummary ?? "No AI summary stored."}</p>} />
                <Field label="Recommended next step" value={symptomCheck.recommendedNextStep ?? "No next step stored."} />
                <Link href={`${routes.adminSymptomChecks}/${symptomCheck.id}`} className="inline-flex rounded-full border border-emerald-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">Open symptom-check summary</Link>
              </div>
            ) : <p className="text-slate-500">No symptom-check log is attached to this flag.</p>}
          </DetailCard>

          <DetailCard title="User context">
            {user ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" value={<Link href={`${routes.adminUsers}/${user.id}`} className="text-brand-700 hover:text-brand-600">{user.username}</Link>} />
                <Field label="Email" value={user.email} />
                <Field label="Preferred language" value={user.preferredLanguage === "sw" ? "Swahili" : "English"} />
                <Field label="Account status" value={user.status} />
              </div>
            ) : <p className="text-slate-500">This flag is linked to a guest or unavailable user.</p>}
          </DetailCard>
        </div>

        <div className="space-y-6">
          <DetailCard title="Review actions">
            <form action={updateAiFlagStatusAction} className="space-y-3 rounded-2xl bg-slate-50 p-4">
              <input type="hidden" name="flagId" value={flag.id} />
              <label className="block text-sm font-bold text-slate-700">Status</label>
              <select name="status" defaultValue={flag.status} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100">
                {AI_FLAG_STATUSES.map((status) => <option key={status} value={status}>{label(status)}</option>)}
              </select>
              <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">Update status</button>
            </form>

            <form action={assignAiFlagReviewerAction} className="space-y-3 rounded-2xl bg-slate-50 p-4">
              <input type="hidden" name="flagId" value={flag.id} />
              <label className="block text-sm font-bold text-slate-700">Assigned reviewer</label>
              <select name="assignedReviewerId" defaultValue={flag.assignedReviewerId ?? ""} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100">
                <option value="">Unassigned</option>
                {eligibleReviewers.map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.username} · {label(reviewer.role)}</option>)}
              </select>
              <button className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-black text-white transition hover:bg-brand-700">Assign reviewer</button>
            </form>
          </DetailCard>

          <DetailCard title="Notes and priority">
            <form action={updateAiFlagNotesAction} className="space-y-4">
              <input type="hidden" name="flagId" value={flag.id} />
              <label className="space-y-2 block text-sm font-bold text-slate-700"><span>Priority</span><select name="priority" defaultValue={flag.priority} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100">{AI_FLAG_PRIORITIES.map((priority) => <option key={priority} value={priority}>{label(priority)}</option>)}</select></label>
              <label className="space-y-2 block text-sm font-bold text-slate-700"><span>Admin notes</span><textarea name="adminNotes" defaultValue={flag.adminNotes ?? ""} rows={4} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
              <label className="space-y-2 block text-sm font-bold text-slate-700"><span>Reviewer notes</span><textarea name="reviewerNotes" defaultValue={flag.reviewerNotes ?? ""} rows={4} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
              <label className="space-y-2 block text-sm font-bold text-slate-700"><span>Resolution notes</span><textarea name="resolutionNotes" defaultValue={flag.resolutionNotes ?? ""} rows={4} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
              <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800">Save notes</button>
            </form>
          </DetailCard>

          <DetailCard title="Escalate to consultation request">
            {consultation ? (
              <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-800">
                <p className="font-black">Already escalated</p>
                <p className="mt-1">Consultation #{consultation.id} · {consultation.urgencyLevel} · {consultation.status}</p>
              </div>
            ) : (
              <form action={escalateAiFlagToConsultationAction} className="space-y-4">
                <input type="hidden" name="flagId" value={flag.id} />
                <label className="space-y-2 block text-sm font-bold text-slate-700"><span>Requested specialty</span><input name="requestedSpecialty" defaultValue={symptomCheck?.symptomCategory ?? "General clinician"} className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <label className="space-y-2 block text-sm font-bold text-slate-700"><span>Escalation notes</span><textarea name="adminNotes" rows={4} placeholder="Briefly explain why this should become a consultation request." className="w-full rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600 focus:ring-4 focus:ring-emerald-100" /></label>
                <button className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white transition hover:bg-rose-700">Create consultation request</button>
              </form>
            )}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
