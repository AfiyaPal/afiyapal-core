"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { registerAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";

const initialState = { ok: false, message: null as string | null };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <AuthCard title="Create account" description="Create your AfiyaPal account.">
      <form action={formAction} className="space-y-4">
        <Input name="username" type="text" placeholder="Username" required />
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="phone" type="tel" placeholder="Phone optional" />
        <Input name="password" type="password" placeholder="Password" required />
        <Input name="confirmPassword" type="password" placeholder="Confirm password" required />
        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
        <Button disabled={pending} className="w-full">{pending ? "Please wait..." : "Continue"}</Button>
      </form>
    </AuthCard>
  );
}
