"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { PROFESSIONAL_ROLES } from "@/features/facility/data/facility-management";
import { addFacilityProfessionalAction } from "@/features/facility/actions/facility-actions";

type DoctorOption = { id: number; fullName: string; specialty: string | null };

const initialState = { ok: false, message: null as string | null };

export function AddProfessionalForm({ availableDoctors }: { availableDoctors: DoctorOption[] }) {
  const [state, formAction, pending] = useActionState(addFacilityProfessionalAction, initialState);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
      <div className="min-w-[200px] flex-1 space-y-1">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Doctor</label>
        <select
          name="doctorProfileId"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          <option value="">Select a doctor...</option>
          {availableDoctors.map((d) => (
            <option key={d.id} value={d.id}>{d.fullName}{d.specialty ? ` (${d.specialty})` : ""}</option>
          ))}
        </select>
      </div>
      <div className="min-w-[150px] flex-1 space-y-1">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Role</label>
        <select
          name="role"
          defaultValue="STAFF_DOCTOR"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        >
          {PROFESSIONAL_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>
      <Button disabled={pending}>{pending ? "Adding..." : "Add"}</Button>
      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
    </form>
  );
}


