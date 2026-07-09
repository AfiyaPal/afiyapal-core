"use client";

import Link from "next/link";
import { useEffect, useState, useActionState } from "react";
import { BadgeCheck, Building2, Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { FACILITY_TYPES } from "@/features/facility/data/facility-management";
import { registerAction, doctorRegisterAction, facilityRegisterAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";
import { AuthFormField } from "./auth-form-field";
import { AuthFormSection } from "./auth-form-section";
import { PasswordField } from "./password-field";
import { isRegisterType, RegisterTypeNav, type RegisterType } from "./register-type-nav";
import { routes } from "@/lib/routes";

const initialState = { ok: false, message: null as string | null };

const cardCopy: Record<RegisterType, { title: string; description: string }> = {
  patient: {
    title: "Create your account",
    description: "Join AfiyaPal for free AI health guidance, trusted articles, and pathways to verified care."
  },
  doctor: {
    title: "Join as a health professional",
    description: "Create your account now. You'll complete your professional profile from your dashboard after signing up."
  },
  facility: {
    title: "Register your facility",
    description: "Create an account and list your health facility. Verified profiles can publish events and reach local communities."
  }
};

function PendingDots() {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="typing-dot bg-white" />
      <span className="typing-dot bg-white" />
      <span className="typing-dot bg-white" />
    </span>
  );
}

function PatientRegistrationPanel() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <AuthFormSection title="Your details" description="We'll use this to set up your personal AfiyaPal account." icon={UserRound}>
        <AuthFormField label="Username" name="username" placeholder="Choose a username" required autoComplete="username" />
        <AuthFormField label="Email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
        <AuthFormField label="Phone" name="phone" type="tel" placeholder="+254 7XX XXX XXX" optional autoComplete="tel" />
      </AuthFormSection>

      <AuthFormSection title="Security" description="Choose a strong password to protect your account.">
        <PasswordField name="password" label="Password" placeholder="At least 8 characters" required autoComplete="new-password" />
        <PasswordField name="confirmPassword" label="Confirm password" placeholder="Re-enter your password" required autoComplete="new-password" />
      </AuthFormSection>

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />

      <Button disabled={pending} className="w-full">
        {pending ? <PendingDots /> : "Create account"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href={routes.login} className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function DoctorRegistrationPanel() {
  const [state, formAction, pending] = useActionState(doctorRegisterAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <AuthFormSection title="Account details" description="Sign-in credentials for your professional account." icon={Stethoscope}>
        <AuthFormField label="Username" name="username" placeholder="Choose a username" required autoComplete="username" />
        <AuthFormField label="Email" name="email" type="email" placeholder="you@clinic.com" required autoComplete="email" />
        <AuthFormField label="Phone" name="phone" type="tel" placeholder="+254 7XX XXX XXX" optional autoComplete="tel" />
        <PasswordField name="password" label="Password" placeholder="At least 8 characters" required autoComplete="new-password" />
        <PasswordField name="confirmPassword" label="Confirm password" placeholder="Re-enter password" required autoComplete="new-password" />
      </AuthFormSection>

      <div className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-3 text-sm text-brand-900">
        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
        <p>Add your license, specialty, and bio from your profile after registration. Your application is reviewed before going live.</p>
      </div>

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />

      <Button disabled={pending} className="w-full">
        {pending ? <PendingDots /> : "Create professional account"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href={routes.login} className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function FacilityRegistrationPanel() {
  const [state, formAction, pending] = useActionState(facilityRegisterAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <AuthFormSection title="Account details" description="Credentials for the facility administrator." icon={UserRound}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthFormField label="Username" name="username" placeholder="Choose a username" required autoComplete="username" />
          <AuthFormField label="Email" name="email" type="email" placeholder="admin@facility.org" required autoComplete="email" />
        </div>
        <AuthFormField label="Phone" name="phone" type="tel" placeholder="+254 7XX XXX XXX" optional autoComplete="tel" />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField name="password" label="Password" placeholder="At least 8 characters" required autoComplete="new-password" />
          <PasswordField name="confirmPassword" label="Confirm password" placeholder="Re-enter password" required autoComplete="new-password" />
        </div>
      </AuthFormSection>

      <AuthFormSection title="Facility details" description="Tell us about your organisation and where you operate." icon={Building2}>
        <AuthFormField label="Facility name" name="facilityName" placeholder="e.g. Sunrise Community Clinic" required />
        <div className="space-y-1.5">
          <label htmlFor="facilityType" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Facility type
          </label>
          <select
            id="facilityType"
            name="facilityType"
            defaultValue="CLINIC"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          >
            {FACILITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthFormField label="Country" name="country" placeholder="Kenya" required />
          <AuthFormField label="Region / state" name="region" placeholder="Nairobi County" optional />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthFormField label="City" name="city" placeholder="Nairobi" optional />
          <AuthFormField label="Street address" name="address" placeholder="123 Health Ave" optional />
        </div>
        <AuthFormField label="Brief description" name="description" placeholder="Services offered, outreach focus, etc." optional />
      </AuthFormSection>

      <div className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-3 text-sm text-brand-900">
        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
        <p>Facility profiles are reviewed before verification. Once approved, you can manage events and your public listing.</p>
      </div>

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />

      <Button disabled={pending} className="w-full">
        {pending ? <PendingDots /> : "Submit for verification"}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link href={routes.login} className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [activeType, setActiveType] = useState<RegisterType>("patient");

  useEffect(() => {
    const requestedType = new URLSearchParams(window.location.search).get("type");
    if (isRegisterType(requestedType)) setActiveType(requestedType);
  }, []);

  function handleTypeChange(type: RegisterType) {
    setActiveType(type);
    const url = type === "patient" ? routes.register : `${routes.register}?type=${type}`;
    window.history.replaceState(null, "", url);
  }

  const copy = cardCopy[activeType];

  return (
    <AuthCard variant={activeType} title={copy.title} description={copy.description}>
      <RegisterTypeNav active={activeType} onChange={handleTypeChange} />
      {activeType === "patient" ? <PatientRegistrationPanel /> : null}
      {activeType === "doctor" ? <DoctorRegistrationPanel /> : null}
      {activeType === "facility" ? <FacilityRegistrationPanel /> : null}
    </AuthCard>
  );
}
