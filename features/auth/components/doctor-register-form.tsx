"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BadgeCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { doctorRegisterAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";
import { AuthFormField } from "./auth-form-field";
import { AuthFormSection } from "./auth-form-section";
import { PasswordField } from "./password-field";
import { RegisterTypeNav } from "./register-type-nav";
import { routes } from "@/lib/routes";

const initialState = { ok: false, message: null as string | null };

export function DoctorRegisterForm() {
  const [state, formAction, pending] = useActionState(doctorRegisterAction, initialState);

  return (
    <AuthCard
      variant="doctor"
      title="Join as a health professional"
      description="Create your account now. You'll complete your professional profile from your dashboard after signing up."
    >
      <RegisterTypeNav active="doctor" />

      <form action={formAction} className="mt-6 space-y-6">
        <AuthFormSection title="Account details" description="Sign-in credentials for your professional account." icon={UserRound}>
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
          {pending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="typing-dot bg-white" />
              <span className="typing-dot bg-white" />
              <span className="typing-dot bg-white" />
            </span>
          ) : (
            "Create account"
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href={routes.login} className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
