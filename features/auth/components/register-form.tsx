"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { registerAction } from "../actions/auth-actions";
import { AuthCard } from "./auth-card";

const initialState = { ok: false, message: null as string | null };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  return (
    <AuthCard title="Create account" description="Join AfiyaPal — free health guidance for everyone.">
      <form action={formAction} className="space-y-4">
        <Input name="username" type="text" placeholder="Username" required />
        <Input name="email"    type="email" placeholder="Email address" required />
        <Input name="phone"    type="tel"   placeholder="Phone (optional)" />

        <div className="relative">
          <Input name="password" type={showPw ? "text" : "password"} placeholder="Password" required className="pr-11" />
          <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none">
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Input name="confirmPassword" type={showCpw ? "text" : "password"} placeholder="Confirm password" required className="pr-11" />
          <button type="button" onClick={() => setShowCpw((v) => !v)} aria-label={showCpw ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none">
            {showCpw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <FormMessage message={state.message} type={state.ok ? "success" : "error"} />

        <Button disabled={pending} className="w-full">
          {pending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="typing-dot bg-white" />
              <span className="typing-dot bg-white" />
              <span className="typing-dot bg-white" />
            </span>
          ) : "Create account"}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Are you a health professional?{" "}
          <a href="/register/doctor" className="font-semibold text-brand-600 hover:text-brand-700">Register here</a>
        </p>
      </form>
    </AuthCard>
  );
}
