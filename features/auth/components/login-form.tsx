"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { loginAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";

const initialState = { ok: false, message: null as string | null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <AuthCard title="Sign in" description="Access your AfiyaPal account.">
      <form action={formAction} className="space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
        <Button disabled={pending} className="w-full">{pending ? "Please wait..." : "Continue"}</Button>
        <p className="text-center text-sm text-slate-500">
          New here?{" "}
          <a href="/register" className="font-semibold text-brand-600 hover:text-brand-700">Create account</a>
          {" \u00B7 "}
          <a href="/register/doctor" className="font-semibold text-brand-600 hover:text-brand-700">Join as doctor</a>
        </p>
      </form>
    </AuthCard>
  );
}
