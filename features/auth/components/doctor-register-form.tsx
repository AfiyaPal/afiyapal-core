"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { doctorRegisterAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";

const initialState = { ok: false, message: null as string | null };

export function DoctorRegisterForm() {
  const [state, formAction, pending] = useActionState(doctorRegisterAction, initialState);

  return (
    <AuthCard title="Join as a health professional" description="Create your professional account and submit for verification.">
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
          <legend className="px-2 text-sm font-semibold text-slate-700">Professional details</legend>
          <Input name="fullName" type="text" placeholder="Full name" required />
          <Input name="licenseNumber" type="text" placeholder="License number" required />
          <Input name="specialty" type="text" placeholder="Specialty (e.g. Cardiology)" required />
          <Input name="yearsOfExperience" type="number" min="0" max="100" placeholder="Years of experience (optional)" />
          <Input name="country" type="text" placeholder="Country (optional)" />
          <Input name="cityRegion" type="text" placeholder="City / Region (optional)" />
          <Input name="languagesSpoken" type="text" placeholder="Languages spoken (optional)" />
          <Input name="bio" type="text" placeholder="Short bio (optional)" />
        </fieldset>
        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
        <Button disabled={pending} className="w-full">{pending ? "Submitting..." : "Submit for verification"}</Button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</a>
        </p>
      </form>
    </AuthCard>
  );
}
