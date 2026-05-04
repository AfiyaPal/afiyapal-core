import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routes } from "@/lib/routes";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { getAdminSafetyReportDetail } from "@/features/admin/queries/get-admin-reports";
import { assignSafetyReportAdminAction, updateSafetyReportPriorityAction, updateSafetyReportResolutionAction, updateSafetyReportStatusAction } from "@/features/admin/actions/admin-report-actions";
import {
  SAFETY_REPORT_PRIORITIES,
  SAFETY_REPORT_STATUSES,
  safetyReportPriorityLabel,
  safetyReportPriorityTone,
  safetyReportStatusLabel,
  safetyReportStatusTone,
  safetyReportTypeLabel
} from "@/features/admin/data/report-management";

function formatDateTime(date: Date | null | undefined) {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-emerald-50/60 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-brand-700">{label}</p>
      <div className="mt-2 break-words text-sm font-bold text-slate-900">{value}</div>
    </div>
  );
}

function FormCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

type SafetyReportHistoryItem = NonNullable<Awaited<ReturnType<typeof getAdminSafetyReportDetail>>>["history"][number];

function ChangeSummary({ item }: { item: SafetyReportHistoryItem }) {
  if (item.actionType === "STATUS_CHANGED") return <span>{item.fromStatus ?? "None"} → {item.toStatus ?? "None"}</span>;
  if (item.actionType === "PRIORITY_CHANGED") return <span>{item.fromPriority ?? "None"} → {item.toPriority ?? "None"}</span>;
  if (item.actionType === "ASSIGNED_ADMIN_CHANGED") return <span>{item.fromAdmin?.username ?? "Unassigned"} → {item.toAdmin?.username ?? "Unassigned"}</span>;
  return <span>{item.note ?? "Action recorded."}</span>;
}

export async function AdminReportDetailPage({ reportId }: { reportId: number }) {
  const detail = await getAdminSafetyReportDetail(reportId);
  if (!detail) notFound();

  const { report, history, adminUsers } = detail;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <AdminSectionHeader
          eyebrow="Safety report detail"
          title={`Report #${report.id}: ${report.title}`}
          description="Safety-center review view with priority, assignment, status, action history, and resolution notes. Keep sensitive health content summarized unless a qualified safety review requires deeper access."
        />
        <Link href={routes.adminReports} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-brand-600 hover:text-brand-700">
          Back to reports
        </Link>
      </div>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-emerald-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Created {formatDateTime(report.createdAt)} · Updated {formatDateTime(report.updatedAt)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <AdminStatusBadge tone={safetyReportPriorityTone(report.priority)}>{safetyReportPriorityLabel(report.priority)}</AdminStatusBadge>
              <AdminStatusBadge tone={safetyReportStatusTone(report.status)}>{safetyReportStatusLabel(report.status)}</AdminStatusBadge>
              <AdminStatusBadge tone="blue">{safetyReportTypeLabel(report.type)}</AdminStatusBadge>
              <AdminStatusBadge tone={report.assignedAdminId ? "green" : "amber"}>{report.assignedAdminId ? "Assigned" : "Unassigned"}</AdminStatusBadge>
            </div>
          </div>
          {report.reporter ? (
            <Link href={`${routes.adminUsers}/${report.reporter.id}`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800">
              View reporter profile
            </Link>
          ) : null}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="Type" value={safetyReportTypeLabel(report.type)} />
          <DetailItem label="Reporter" value={report.reporter ? `${report.reporter.username} (${report.reporter.email})` : "Anonymous/system report"} />
          <DetailItem label="Assigned admin" value={report.assignedAdmin ? `${report.assignedAdmin.username} (${report.assignedAdmin.role})` : "Unassigned"} />
          <DetailItem label="Resolved at" value={formatDateTime(report.resolvedAt)} />
          <DetailItem label="Summary" value={report.summary ?? "No summary provided."} />
          <DetailItem label="Resolution notes" value={report.resolutionNotes ?? "No resolution notes yet."} />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <FormCard title="Update status" description="Move the report through the safety workflow: open, in review, resolved, or dismissed.">
          <form action={updateSafetyReportStatusAction} className="space-y-4">
            <input type="hidden" name="reportId" value={report.id} />
            <select name="status" defaultValue={report.status} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600">
              {SAFETY_REPORT_STATUSES.map((status) => <option key={status} value={status}>{safetyReportStatusLabel(status)}</option>)}
            </select>
            <textarea name="note" rows={3} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600" placeholder="Optional note explaining the status change..." />
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save status</button>
          </form>
        </FormCard>

        <FormCard title="Update priority" description="Prioritize critical safety incidents and urgent platform issues for faster handling.">
          <form action={updateSafetyReportPriorityAction} className="space-y-4">
            <input type="hidden" name="reportId" value={report.id} />
            <select name="priority" defaultValue={report.priority} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600">
              {SAFETY_REPORT_PRIORITIES.map((priority) => <option key={priority} value={priority}>{safetyReportPriorityLabel(priority)}</option>)}
            </select>
            <textarea name="note" rows={3} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600" placeholder="Optional note explaining the priority change..." />
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save priority</button>
          </form>
        </FormCard>

        <FormCard title="Assign admin" description="Assign ownership to an active admin, support admin, medical reviewer, or super admin.">
          <form action={assignSafetyReportAdminAction} className="space-y-4">
            <input type="hidden" name="reportId" value={report.id} />
            <select name="assignedAdminId" defaultValue={report.assignedAdminId ?? ""} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600">
              <option value="">Unassigned</option>
              {adminUsers.map((admin) => <option key={admin.id} value={admin.id}>{admin.username} · {admin.role}</option>)}
            </select>
            <textarea name="note" rows={3} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600" placeholder="Optional assignment note..." />
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save assignment</button>
          </form>
        </FormCard>

        <FormCard title="Resolution notes" description="Document the outcome, corrective action, or reason for dismissal. This is admin-only safety-center context.">
          <form action={updateSafetyReportResolutionAction} className="space-y-4">
            <input type="hidden" name="reportId" value={report.id} />
            <textarea name="resolutionNotes" defaultValue={report.resolutionNotes ?? ""} rows={6} className="w-full rounded-2xl border border-emerald-100 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-brand-600" placeholder="Add resolution notes..." />
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-800">Save resolution</button>
          </form>
        </FormCard>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Action history</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">Timeline of status, priority, assignment, and resolution changes for this report.</p>
        <div className="mt-5 space-y-3">
          {history.length ? history.map((item) => (
            <div key={item.id} className="rounded-2xl border border-emerald-100 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-black text-slate-950">{item.actionType.replaceAll("_", " ")}</p>
                <p className="text-xs font-bold text-slate-500">{formatDateTime(item.createdAt)}</p>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700"><ChangeSummary item={item} /></p>
              <p className="mt-1 text-xs text-slate-500">By {item.actorAdmin ? `${item.actorAdmin.username} (${item.actorAdmin.role})` : "System or unavailable admin"}</p>
              {item.note ? <p className="mt-3 rounded-2xl bg-emerald-50/70 p-3 text-sm leading-6 text-slate-700">{item.note}</p> : null}
            </div>
          )) : <p className="rounded-2xl bg-emerald-50/70 p-4 text-sm text-slate-600">No action history yet. Changes made from this page will be recorded here.</p>}
        </div>
      </section>
    </div>
  );
}
