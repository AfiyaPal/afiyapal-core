import type { ReactNode } from "react";
import { requestSensitiveHealthAccessAction } from "@/features/admin/actions/admin-sensitive-health-access-actions";
import type { SensitiveHealthTargetType } from "@/server/services/sensitive-health-access-service";
import { SENSITIVE_ACCESS_DURATION_MINUTES } from "@/server/services/sensitive-health-access-service";

function formatDateTime(date: Date | null | undefined) {
  if (!date) return "Not available";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function SensitiveHealthAccessPanel({
  targetType,
  targetId,
  canRequestAccess,
  activeGrant,
  children
}: {
  targetType: SensitiveHealthTargetType;
  targetId: number;
  canRequestAccess: boolean;
  activeGrant: { id: number; reason: string; expiresAt: Date; createdAt: Date } | null;
  children: ReactNode;
}) {
  if (activeGrant) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-black">Sensitive review access active</p>
          <p className="mt-1">Reason recorded: {activeGrant.reason}</p>
          <p className="mt-1 text-xs font-bold">Expires: {formatDateTime(activeGrant.expiresAt)}</p>
        </div>
        {children}
      </div>
    );
  }

  if (!canRequestAccess) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        <p className="font-black text-slate-800">Sensitive health details are restricted</p>
        <p className="mt-1">Only Medical Reviewers and Super Admins can request temporary access to sensitive health summaries. Raw full conversations are not stored by default.</p>
      </div>
    );
  }

  return (
    <form action={requestSensitiveHealthAccessAction} className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <div>
        <p className="text-sm font-black text-amber-950">Reason required before viewing sensitive health details</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-amber-900">
          Access is limited to {SENSITIVE_ACCESS_DURATION_MINUTES} minutes and will be written to the Super Admin audit trail. AFIYAPAL does not store full raw conversations by default.
        </p>
      </div>
      <label className="block space-y-2 text-sm font-bold text-amber-950">
        <span>Review reason</span>
        <textarea
          name="reason"
          rows={4}
          minLength={12}
          required
          placeholder="Example: Reviewing critical AI flag before deciding whether to escalate to consultation."
          className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
        />
      </label>
      <button className="rounded-2xl bg-amber-700 px-4 py-3 text-sm font-black text-white transition hover:bg-amber-800">
        Request sensitive review access
      </button>
    </form>
  );
}
