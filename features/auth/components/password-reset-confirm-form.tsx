"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { passwordResetConfirmAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";

const initialState = { ok: false, message: null as string | null };

export function PasswordResetConfirmForm() {
  const [state, formAction, pending] = useActionState(passwordResetConfirmAction, initialState);

  return (
    <AuthCard title="Set new password" description="Paste your reset token and choose a new password.">
      <form action={formAction} className="space-y-4">
        <Input name="token" type="text" placeholder="Reset token" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Input name="confirmPassword" type="password" placeholder="Confirm password" required />
        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
        <Button disabled={pending} className="w-full">{pending ? "Please wait..." : "Continue"}</Button>
      </form>
    </AuthCard>
  );
}
