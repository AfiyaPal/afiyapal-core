"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { EVENT_TYPES } from "@/features/facility/data/facility-management";
import { createEventAction, updateEventAction } from "@/features/facility/actions/facility-actions";

type Props = {
  event?: {
    id: number;
    title: string;
    description: string | null;
    type: string;
    startDate: Date;
    endDate: Date | null;
    location: string | null;
    isPublic: boolean;
  };
};

const initialState = { ok: false, message: null as string | null };

export function FacilityEventForm({ event }: Props) {
  const action = event ? updateEventAction : createEventAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  function formatDate(date: Date | string | null | undefined) {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  return (
    <form action={formAction} className="space-y-6">
      {event && <input type="hidden" name="eventId" value={event.id} />}

      <div className="space-y-4">
        <Input name="title" type="text" placeholder="Event title" defaultValue={event?.title} required />
        <textarea
          name="description"
          placeholder="Event description (optional)"
          defaultValue={event?.description ?? ""}
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Event type</label>
          <select
            name="type"
            defaultValue={event?.type ?? "HEALTH_TALK"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          >
            {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Location (optional)</label>
          <Input name="location" type="text" placeholder="Venue or online link" defaultValue={event?.location ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Start date *</label>
          <Input name="startDate" type="datetime-local" defaultValue={formatDate(event?.startDate)} required />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-600">End date (optional)</label>
          <Input name="endDate" type="datetime-local" defaultValue={formatDate(event?.endDate)} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="isPublic" defaultChecked={event?.isPublic ?? true} className="rounded border-slate-300" />
        Public event (visible to users)
      </label>

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
      <Button disabled={pending} className="w-full">{pending ? "Saving..." : event ? "Update event" : "Create event"}</Button>
    </form>
  );
}
