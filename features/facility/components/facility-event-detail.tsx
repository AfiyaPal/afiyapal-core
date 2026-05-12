"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { EVENT_TYPES } from "@/features/facility/data/facility-management";
import { deleteEventAction, updateEventStatusAction } from "@/features/facility/actions/facility-actions";

const statusBadge: Record<string, { tone: string; label: string }> = {
  UPCOMING: { tone: "bg-sky-50 text-sky-700 ring-sky-100", label: "Upcoming" },
  ONGOING: { tone: "bg-emerald-50 text-brand-700 ring-emerald-100", label: "Ongoing" },
  COMPLETED: { tone: "bg-slate-50 text-slate-700 ring-slate-100", label: "Completed" },
  CANCELLED: { tone: "bg-rose-50 text-rose-700 ring-rose-100", label: "Cancelled" }
};

type FacilityEvent = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  isPublic: boolean;
  createdAt: Date;
};

export function FacilityEventDetail({ event }: { event: FacilityEvent }) {
  const router = useRouter();
  const badge = statusBadge[event.status] ?? statusBadge.UPCOMING;
  const typeLabel = EVENT_TYPES.find((t) => t.value === event.type)?.label ?? event.type;

  async function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    const fd = new FormData();
    fd.set("eventId", String(event.id));
    const result = await deleteEventAction(fd);
    if (result.ok) router.push("/facility/events");
  }

  async function handleStatusChange(status: string) {
    const fd = new FormData();
    fd.set("eventId", String(event.id));
    fd.set("status", status);
    await updateEventStatusAction(null, fd);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/facility/events" className="text-sm font-semibold text-brand-600 hover:text-brand-700">&larr; All events</Link>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{event.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${badge.tone}`}>{badge.label}</span>
            <span className="text-sm text-slate-600">{typeLabel}</span>
            {event.location && <span className="text-sm text-slate-600">{event.location}</span>}
            <span className="text-sm text-slate-600">{event.isPublic ? "Public" : "Private"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/facility/events/${event.id}/edit`}
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Start date</p>
          <p className="mt-1 text-lg font-bold text-slate-950">{new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
        {event.endDate && (
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">End date</p>
            <p className="mt-1 text-lg font-bold text-slate-950">{new Date(event.endDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        )}
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Visibility</p>
          <p className="mt-1 text-lg font-bold text-slate-950">{event.isPublic ? "Public" : "Private"}</p>
        </div>
      </div>

      {event.description && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Description</p>
          <p className="mt-3 leading-relaxed text-slate-700">{event.description}</p>
        </div>
      )}

      {event.status !== "COMPLETED" && event.status !== "CANCELLED" && (
        <div className="flex flex-wrap gap-3">
          {event.status === "UPCOMING" && (
            <button onClick={() => handleStatusChange("ONGOING")} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Mark as ongoing
            </button>
          )}
          {event.status === "ONGOING" && (
            <button onClick={() => handleStatusChange("COMPLETED")} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Mark as completed
            </button>
          )}
          <button onClick={() => handleStatusChange("CANCELLED")} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">
            Cancel event
          </button>
        </div>
      )}
    </div>
  );
}
