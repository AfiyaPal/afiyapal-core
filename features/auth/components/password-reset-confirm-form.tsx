"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { passwordResetConfirmAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";
import { routes } from "@/lib/routes";

const initialState = { ok: false, message: null as string | null };

export function PasswordResetConfirmForm({ token }: { token?: string }) {
  const [state, formAction, pending] = useActionState(passwordResetConfirmAction, initialState);

  return (
    <AuthCard title="Set new password" description="Choose a new password for your account.">
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token ?? ""} />
        <Input name="password" type="password" placeholder="New password" required minLength={8} />
        <Input name="confirmPassword" type="password" placeholder="Confirm password" required minLength={8} />
        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
        <Button disabled={pending} className="w-full">{pending ? "Please wait..." : "Reset password"}</Button>
        {!token && (
          <p className="text-center text-sm text-muted-foreground">
            No reset link? <a href={routes.passwordReset} className="text-brand-600 hover:underline">Request a new one</a>
          </p>
        )}
      </form>
    </AuthCard>
  );
}
