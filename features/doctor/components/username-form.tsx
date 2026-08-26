"use client";

import { useActionState } from "react";
import { AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { updateUsernameAction } from "../actions/doctor-profile-actions";

const initialState = { ok: false, message: null as string | null };

export function UsernameForm({ username }: { username: string }) {
  const [state, formAction, pending] = useActionState(updateUsernameAction, initialState);

  return (
    <form action={formAction} className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-theme-primary-light">
          <AtSign className="size-5 text-theme-primary-dark" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-black text-theme-foreground">Display name</h2>
          <p className="mt-1 text-sm text-slate-600">
            This is the display name shown across the portal. Use your real name so patients and reviewers can recognise you.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          name="username"
          placeholder="e.g. John Doe"
          defaultValue={username}
          required
          autoComplete="username"
          className="sm:max-w-xs"
        />
        <Button disabled={pending} className="sm:w-auto">
          {pending ? "Saving..." : "Save"}
        </Button>
      </div>

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
    </form>
  );
}
