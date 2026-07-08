"use client";

import Link from "next/link";
import { useActionState } from "react";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { registerAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";
import { AuthFormField } from "./auth-form-field";
import { AuthFormSection } from "./auth-form-section";
import { PasswordField } from "./password-field";
import { RegisterTypeNav } from "./register-type-nav";
import { routes } from "@/lib/routes";

const initialState = { ok: false, message: null as string | null };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <AuthCard
      variant="patient"
      title="Create your account"
      description="Join AfiyaPal for free AI health guidance, trusted articles, and pathways to verified care."
    >
      <RegisterTypeNav active="patient" />

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
