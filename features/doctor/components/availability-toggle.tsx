"use client";

import { useActionState } from "react";
import { CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { toggleAvailabilityAction } from "../actions/doctor-profile-actions";

const initialState = { ok: false, message: null as string | null };

export function AvailabilityToggle({
  availabilityStatus,
  verificationStatus
}: {
  availabilityStatus: string;
  verificationStatus: string;
}) {
  const [state, formAction, pending] = useActionState(toggleAvailabilityAction, initialState);
  const isAvailable = availabilityStatus === "AVAILABLE";
  const isVerified = verificationStatus === "VERIFIED";

  return (
    <form action={formAction} className="rounded-3xl border border-theme-border bg-theme-surface p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-theme-primary-light">
          <CircleDot className="size-5 text-theme-primary-dark" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-black text-theme-foreground">Availability</h2>
          <p className="mt-1 text-sm text-slate-600">
            Mark yourself as available so patients and reviewers can find you in the professionals directory.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1 ${
            isAvailable ? "bg-emerald-50 text-emerald-700 ring-emerald-100" : "bg-slate-100 text-slate-600 ring-slate-200"
          }`}
        >
          <span className={`size-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-slate-400"}`} aria-hidden />
          {isAvailable ? "Available" : "Unavailable"}
        </span>
        <input type="hidden" name="availability" value={isAvailable ? "UNAVAILABLE" : "AVAILABLE"} />
        <Button disabled={pending} className="sm:w-auto">
          {pending ? "Saving..." : isAvailable ? "Mark as unavailable" : "Mark as available"}
        </Button>
      </div>

      {!isVerified ? (
        <p className="mt-3 text-xs text-slate-500">
          You&apos;ll appear in the professionals directory once your profile is verified.
        </p>
      ) : null}

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
    </form>
  );
}
