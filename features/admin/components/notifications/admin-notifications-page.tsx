import { AdminDataTable, type AdminTableColumn } from "@/features/admin/components/admin-data-table";
import { AdminSectionHeader } from "@/features/admin/components/admin-section-header";
import { AdminStatusBadge } from "@/features/admin/components/admin-status-badge";
import { markAllNotificationsReadAction, markNotificationReadAction } from "@/features/admin/actions/admin-notification-actions";
import { notificationPriorityLabels, notificationTypeLabels } from "@/features/admin/data/notification-management";

export type AdminNotificationRow = {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  targetType: string | null;
  targetId: string | null;
  readAt: Date | null;
  createdAt: Date;
};

function priorityTone(priority: string) {
  if (priority === "CRITICAL") return "red" as const;
  if (priority === "HIGH") return "amber" as const;
  if (priority === "NORMAL") return "blue" as const;
  return "slate" as const;
}

function statusTone(status: string) {
  return status === "UNREAD" ? "green" as const : "slate" as const;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(value);
}

export function AdminNotificationsPage({ notifications, unreadCount }: { notifications: AdminNotificationRow[]; unreadCount: number }) {
  const columns: AdminTableColumn<AdminNotificationRow>[] = [
    {
      key: "createdAt",
      header: "Date",
      render: (row) => <span className="whitespace-nowrap text-xs font-semibold text-slate-500">{formatDate(row.createdAt)}</span>
    },
    {
      key: "message",
      header: "Notification",
      render: (row) => (
        <div className="max-w-xl">
          <p className="font-black text-slate-950">{row.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{row.message}</p>
          <p className="mt-2 text-xs font-bold text-slate-400">{notificationTypeLabels[row.type] ?? row.type}</p>
        </div>
      )
    },
    {
      key: "priority",
      header: "Priority",
      render: (row) => <AdminStatusBadge tone={priorityTone(row.priority)}>{notificationPriorityLabels[row.priority] ?? row.priority}</AdminStatusBadge>
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <AdminStatusBadge tone={statusTone(row.status)}>{row.status}</AdminStatusBadge>
    },
    {
      key: "target",
      header: "Target",
      render: (row) => <span className="text-xs font-bold text-slate-500">{row.targetType && row.targetId ? `${row.targetType} #${row.targetId}` : "—"}</span>
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) =>
        row.status === "UNREAD" ? (
          <form action={markNotificationReadAction}>
            <input type="hidden" name="notificationId" value={row.id} />
            <button type="submit" className="rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white transition hover:bg-slate-800">
              Mark read
            </button>
          </form>
        ) : (
          <span className="text-xs font-semibold text-slate-400">Read</span>
        )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        eyebrow="Notification center"
        title="My admin notifications"
        description="Track important doctor, safety, consultation, content, and report events routed to your admin role."
      />

      <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Unread notifications</p>
            <p className="mt-1 text-3xl font-black text-slate-950">{unreadCount}</p>
          </div>
          <form action={markAllNotificationsReadAction}>
            <button type="submit" className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-brand-600 hover:text-brand-700">
              Mark all as read
            </button>
          </form>
        </div>
      </section>

      <AdminDataTable
        title="Notification history"
        description="Recent notifications created by AFIYAPAL workflows. Notifications are stored as summaries, not raw health conversations."
        rows={notifications}
        columns={columns}
        emptyMessage="You do not have notifications yet."
      />
    </div>
  );
}
