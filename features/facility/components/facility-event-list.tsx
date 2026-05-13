"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { EVENT_TYPES } from "@/features/facility/data/facility-management";
import { deleteEventAction } from "@/features/facility/actions/facility-actions";

const statusBadge: Record<string, { tone: string; label: string }> = {
  UPCOMING: { tone: "bg-sky-50 text-sky-700 ring-sky-100", label: "Upcoming" },
  ONGOING: { tone: "bg-emerald-50 text-brand-700 ring-emerald-100", label: "Ongoing" },
  COMPLETED: { tone: "bg-slate-50 text-slate-700 ring-slate-100", label: "Completed" },
  CANCELLED: { tone: "bg-rose-50 text-rose-700 ring-rose-100", label: "Cancelled" }
};

type EventItem = {
  id: number;
  title: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isPublic: boolean;
};

export function FacilityEventList({ events, verificationStatus }: { events: EventItem[]; verificationStatus: string }) {
  const router = useRouter();
  const isVerified = verificationStatus === "VERIFIED";

  async function handleDelete(eventId: number) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const fd = new FormData();
    fd.set("eventId", String(eventId));
    await deleteEventAction(fd);
    router.refresh();
  }

  if (!isVerified) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Events</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your facility&apos;s health events and announcements.</p>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-8 text-center shadow-sm">
          <Lock aria-hidden="true" className="mx-auto size-8 text-amber-500" />
          <h2 className="mt-4 text-lg font-black text-amber-900">Events — Pending Verification</h2>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            {verificationStatus === "PENDING" && <>Your facility is under review. Event management will be available once your facility is verified. This typically takes 1–2 business days.</>}
            {verificationStatus === "REJECTED" && <>Your facility verification was not approved. Please contact support for more information.</>}
            {verificationStatus === "SUSPENDED" && <>Your facility has been suspended. Please contact support for more information.</>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">Events</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your facility&apos;s health events and announcements.</p>
        </div>
        <Link
          href="/facility/events/new"
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
        >
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-700">No events yet</p>
          <p className="mt-1 text-sm text-slate-500">Create your first health event or announcement.</p>
          <Link
            href="/facility/events/new"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            Create event
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
            <thead className="bg-emerald-50/70 text-xs uppercase tracking-wide text-brand-700">
              <tr>
                <th className="px-5 py-3 font-black">Title</th>
                <th className="px-5 py-3 font-black">Type</th>
                <th className="px-5 py-3 font-black">Status</th>
                <th className="px-5 py-3 font-black">Date</th>
                <th className="px-5 py-3 font-black">Public</th>
                <th className="px-5 py-3 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {events.map((event) => {
                const badge = statusBadge[event.status] ?? statusBadge.UPCOMING;
                const typeLabel = EVENT_TYPES.find((t) => t.value === event.type)?.label ?? event.type;
                return (
                  <tr key={event.id} className="transition hover:bg-emerald-50/40">
                    <td className="px-5 py-4">
                      <Link href={`/facility/events/${event.id}`} className="font-bold text-slate-950 hover:text-brand-600">
                        {event.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{typeLabel}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${badge.tone}`}>{badge.label}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{new Date(event.startDate).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-slate-600">{event.isPublic ? "Yes" : "No"}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link href={`/facility/events/${event.id}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                          View
                        </Link>
                        <Link href={`/facility/events/${event.id}/edit`} className="text-sm font-semibold text-slate-600 hover:text-slate-700">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(event.id)} className="text-sm font-semibold text-rose-600 hover:text-rose-700">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
