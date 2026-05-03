"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { passwordResetAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";

const initialState = { ok: false, message: null as string | null };

export function PasswordResetForm() {
  const [state, formAction, pending] = useActionState(passwordResetAction, initialState);

  return (
    <AuthCard title="Reset password" description="Enter your email and we will send reset instructions.">
      <form action={formAction} className="space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
        <Button disabled={pending} className="w-full">{pending ? "Please wait..." : "Continue"}</Button>
      </form>
    </AuthCard>
  );
}
