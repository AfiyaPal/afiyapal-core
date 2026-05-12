import Link from "next/link";
import { EVENT_TYPES } from "@/features/facility/data/facility-management";
import { CalendarDays, MapPin, Building2, Clock } from "lucide-react";

type PublicEventDetail = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  facility: {
    id: number;
    name: string;
    type: string;
    city: string | null;
    country: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    description: string | null;
  };
};

export function PublicEventDetailPage({ event }: { event: PublicEventDetail }) {
  const typeInfo = EVENT_TYPES.find((t) => t.value === event.type);

  return (
    <div className="space-y-8">
      <Link href="/events" className="inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">&larr; All events</Link>

      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700 ring-1 ring-brand-100">
            {typeInfo?.label ?? event.type}
          </span>
          {event.status === "ONGOING" && (
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
              Ongoing
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">{event.title}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600">
            <CalendarDays aria-hidden="true" className="size-4" />
            Event details
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Start</p>
              <p className="mt-1 font-semibold text-slate-950">
                {new Date(event.startDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            {event.endDate && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">End</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {new Date(event.endDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            )}
            {event.location && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</p>
                <p className="mt-1 font-semibold text-slate-950">{event.location}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600">
            <Building2 aria-hidden="true" className="size-4" />
            Host facility
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-lg font-black text-slate-950">{event.facility.name}</p>
            <p className="text-slate-600">{event.facility.type.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
            {(event.facility.city || event.facility.country) && (
              <p className="flex items-center gap-2 text-slate-600">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                {event.facility.city ? `${event.facility.city}, ${event.facility.country}` : event.facility.country}
              </p>
            )}
            {event.facility.phone && <p className="text-slate-600">{event.facility.phone}</p>}
            {event.facility.email && <p className="text-slate-600">{event.facility.email}</p>}
          </div>
        </div>
      </div>

      {event.description && (
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600">About this event</h2>
          <p className="mt-4 leading-relaxed text-slate-700">{event.description}</p>
        </div>
      )}
    </div>
  );
}
