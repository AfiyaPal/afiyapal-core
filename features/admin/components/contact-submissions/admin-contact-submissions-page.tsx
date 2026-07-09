import { Inbox, Mail, ShieldCheck } from "lucide-react";
import { AdminDashboardCard } from "@/features/admin/components/admin-dashboard-card";
import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminFilters } from "@/features/admin/components/admin-filters";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { updateContactSubmissionStatusAction } from "@/features/admin/actions/admin-contact-submission-actions";
import { CONTACT_SUBMISSION_STATUSES, getAdminContactSubmissions, type ContactSubmissionFilters } from "@/features/admin/queries/get-admin-contact-submissions";

type ContactSubmissionRow = Awaited<ReturnType<typeof getAdminContactSubmissions>>["submissions"][number];

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function statusTone(status: string) {
  if (status === "NEW") return "amber" as const;
  if (status === "REVIEWED") return "green" as const;
  if (status === "SPAM") return "red" as const;
  return "slate" as const;
}

function truncate(value: string, limit = 220) {
  return value.length > limit ? `${value.slice(0, limit - 1).trim()}…` : value;
}

function StatusAction({ submission, status, label }: { submission: ContactSubmissionRow; status: string; label: string }) {
  if (submission.status === status) return null;
  return (
    <form action={updateContactSubmissionStatusAction}>
      <input type="hidden" name="submissionId" value={submission.id} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-700 transition hover:border-theme-primary hover:text-theme-primary">
        {label}
      </button>
    </form>
  );
}

export async function AdminContactSubmissionsPage({ filters }: { filters: ContactSubmissionFilters }) {
  const data = await getAdminContactSubmissions(filters);

  const columns: readonly AdminTableColumn<ContactSubmissionRow>[] = [
    {
      key: "date",
      header: "Date",
      render: (submission) => <span className="text-slate-600">{formatDateTime(submission.createdAt)}</span>
    },
    {
      key: "contact",
      header: "Contact",
      render: (submission) => (
        <div className="min-w-64">
          <p className="font-black text-slate-950">{submission.fullName}</p>
          <a href={`mailto:${submission.email}`} className="mt-1 block text-xs font-bold text-brand-700 underline-offset-4 hover:underline">{submission.email}</a>
          {submission.phone ? <p className="mt-1 text-xs text-slate-500">{submission.phone}</p> : null}
        </div>
      )
    },
    {
      key: "subject",
      header: "Subject",
      render: (submission) => (
        <div className="min-w-64">
          <p className="font-black text-slate-900">{submission.subject || "General enquiry"}</p>
          <p className="mt-2 rounded-full bg-theme-primary-light px-3 py-1 text-xs font-black text-theme-primary-dark ring-1 ring-theme-border">
            {submission.source.replaceAll("_", " ").toLowerCase()}
          </p>
        </div>
      )
    },
    {
      key: "message",
      header: "Message",
      render: (submission) => <p className="min-w-80 max-w-xl whitespace-pre-wrap text-sm leading-6 text-slate-700">{truncate(submission.message)}</p>
    },
    { key: "status", header: "Status", render: (submission) => <AdminStatusBadge tone={statusTone(submission.status)}>{statusLabel(submission.status)}</AdminStatusBadge> },
    {
      key: "actions",
      header: "Actions",
      render: (submission) => (
        <div className="flex min-w-52 flex-wrap gap-2">
          <StatusAction submission={submission} status="REVIEWED" label="Mark reviewed" />
          <StatusAction submission={submission} status="ARCHIVED" label="Archive" />
          <StatusAction submission={submission} status="SPAM" label="Spam" />
          {submission.status !== "NEW" ? <StatusAction submission={submission} status="NEW" label="Reopen" /> : null}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Contact inbox"
        title="Review homepage contact submissions"
        description="View enquiries from the homepage contact form, read the subject and message, and move each message through a simple follow-up workflow. Requests are stored with a hashed IP for privacy-preserving rate-limit audit context."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AdminDashboardCard label="Matching messages" value={String(data.total)} helper="Submissions returned by current filters." icon={<Inbox className="size-5" aria-hidden />} />
        <AdminDashboardCard label="New" value={String(data.newCount)} helper="Unreviewed contact requests waiting for follow-up." icon={<Mail className="size-5" aria-hidden />} />
        <AdminDashboardCard label="Reviewed" value={String(data.reviewedCount)} helper="Messages already moved into the reviewed state." icon={<ShieldCheck className="size-5" aria-hidden />} />
      </div>

      <AdminFilters
        filters={[
          { key: "search", label: "Search", type: "search", placeholder: "Search name, email, phone, subject, or message..." },
          { key: "status", label: "Status", type: "select", options: [{ value: "", label: "All statuses" }, ...CONTACT_SUBMISSION_STATUSES.map((status) => ({ value: status, label: statusLabel(status) }))] },
          { key: "startDate", label: "Start date", type: "date" },
          { key: "endDate", label: "End date", type: "date" }
        ]}
        values={filters}
        submitLabel="Filter messages"
      />

      <AdminDataTable
        title={`Contact submissions (${data.submissions.length} shown / ${data.total} total)`}
        description={`Showing up to ${data.pageSize} homepage contact form requests matching the current filters.`}
        columns={columns}
        rows={data.submissions}
        emptyMessage="No contact submissions match the current filters."
      />
    </div>
  );
}
