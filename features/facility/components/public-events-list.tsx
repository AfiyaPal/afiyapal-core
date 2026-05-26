import Link from "next/link";
import { EVENT_TYPES } from "@/features/facility/data/facility-management";
import { CalendarDays, MapPin, Building2 } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/schema";

type PublicEvent = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  facility: { name: string; city: string | null; country: string; type: string };
};

export function PublicEventsList({ events }: { events: PublicEvent[] }) {
  return (
    <main className="container-page space-y-8 py-12">
      <JsonLd
        data={[
          ...medicalWebPageSchema({
            path: "/events",
            title: "AfiyaPal Health Events and Medical Camps",
            description: "Community health events, medical camps, free checkups, and health screenings.",
            breadcrumbs: [{ name: "Events", path: "/events" }]
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" }
          ])
        ]}
      />
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-700">Community Health</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Health events &amp; medical camps</h1>
        <p className="mt-2 max-w-3xl text-slate-700">Find free checkups, medical camps, health talks, screenings, and healthcare outreach events from facilities and health organizations.</p>
      </section>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-sm">
          <CalendarDays aria-hidden="true" className="mx-auto size-10 text-slate-400" />
          <p className="mt-4 text-lg font-bold text-slate-700">No upcoming events</p>
          <p className="mt-1 text-sm text-slate-500">Check back later for health events and medical camps in your area.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const typeInfo = EVENT_TYPES.find((t) => t.value === event.type);
            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-brand-500 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">
                    {typeInfo?.label ?? event.type}
                  </span>
                  {event.status === "ONGOING" && (
                    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                      Ongoing
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-lg font-black text-slate-950 group-hover:text-brand-600">{event.title}</h2>
                {event.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{event.description}</p>
                )}
                <div className="mt-4 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                    <time dateTime={event.startDate.toISOString()}>{new Date(event.startDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 aria-hidden="true" className="size-4 shrink-0" />
                    <span>{event.facility.name}</span>
                  </div>
                  {(event.location || event.facility.city) && (
                    <div className="flex items-center gap-2">
                      <MapPin aria-hidden="true" className="size-4 shrink-0" />
                      <span>{event.location ?? `${event.facility.city}${event.facility.city ? ", " : ""}${event.facility.country}`}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
