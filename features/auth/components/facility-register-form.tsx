"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { facilityRegisterAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";
import { FACILITY_TYPES } from "@/features/facility/data/facility-management";

const initialState = { ok: false, message: null as string | null };

export function FacilityRegisterForm() {
  const [state, formAction, pending] = useActionState(facilityRegisterAction, initialState);

  return (
    <AuthCard title="Register your facility" description="Create an account and register your health facility for verification.">
      <form action={formAction} className="space-y-4">
        <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-700">Account details</legend>
          <Input name="username" type="text" placeholder="Username" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="phone" type="tel" placeholder="Phone (optional)" />
          <Input name="password" type="password" placeholder="Password" required />
          <Input name="confirmPassword" type="password" placeholder="Confirm password" required />
        </fieldset>
        <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4">
          <legend className="px-2 text-sm font-semibold text-slate-700">Facility details</legend>
          <Input name="facilityName" type="text" placeholder="Facility name" required />
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-600">Facility type</label>
            <select
              name="facilityType"
              defaultValue="CLINIC"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            >
              {FACILITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <Input name="country" type="text" placeholder="Country" required />
          <Input name="region" type="text" placeholder="Region / State (optional)" />
          <Input name="city" type="text" placeholder="City (optional)" />
          <Input name="address" type="text" placeholder="Street address (optional)" />
          <Input name="description" type="text" placeholder="Brief description (optional)" />
        </fieldset>
        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
        <Button disabled={pending} className="w-full">{pending ? "Submitting..." : "Submit for verification"}</Button>
        <p className="text-center text-sm text-slate-500">
          Already registered?{" "}
          <a href="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</a>
        </p>
      </form>
    </AuthCard>
  );
}
