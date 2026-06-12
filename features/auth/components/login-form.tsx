"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { loginAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";

const initialState = { ok: false, message: null as string | null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPw, setShowPw] = useState(false);

  return (
    <AuthCard title="Welcome back" description="Sign in to your AfiyaPal account.">
      <form action={formAction} className="space-y-4">
        <Input name="email" type="email" placeholder="Email address" required />

        <div className="relative">
          <Input name="password" type={showPw ? "text" : "password"} placeholder="Password" required className="pr-11" />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <a href="/password-reset" className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline underline-offset-4">
            Forgot password?
          </a>
        </div>

        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />

        <Button disabled={pending} className="w-full">
          {pending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="typing-dot bg-white" />
              <span className="typing-dot bg-white" />
              <span className="typing-dot bg-white" />
            </span>
          ) : "Sign in"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <a href="/register" className="font-semibold text-brand-600 hover:text-brand-700">Create one</a>
          {" · "}
          <a href="/register/doctor" className="font-semibold text-brand-600 hover:text-brand-700">Join as doctor</a>
        </p>
      </form>
    </AuthCard>
  );
}
