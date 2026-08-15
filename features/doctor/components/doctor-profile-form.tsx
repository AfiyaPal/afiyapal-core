"use client";

import { useActionState } from "react";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { updateDoctorProfileAction } from "../actions/doctor-profile-actions";

type ProfileData = {
  fullName: string | null;
  specialty: string | null;
  verificationStatus: string;
  country: string | null;
  cityRegion: string | null;
  licenseNumber: string | null;
  phone: string | null;
  yearsOfExperience: number | null;
  languagesSpoken: string | null;
  bio: string | null;
  rejectionReason: string | null;
  suspensionReason: string | null;
};

const initialState = { ok: false, message: null as string | null };

export function DoctorProfileForm({ profile, username }: { profile: ProfileData | null; username: string }) {
  const [state, formAction, pending] = useActionState(updateDoctorProfileAction, initialState);
  const isSuspended = profile?.verificationStatus === "SUSPENDED";

  return (
    <form action={formAction} className="space-y-6">
      {profile?.rejectionReason ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Your previous application was not approved: {profile.rejectionReason}. Update your details and resubmit.
        </p>
      ) : null}
      {profile?.suspensionReason ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          This profile is suspended: {profile.suspensionReason}.
        </p>
      ) : null}

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Input
              name="fullName"
              placeholder="Full name (as on license)"
              defaultValue={profile?.fullName ?? username}
              required
              disabled={isSuspended}
            />
            <p className="text-xs text-slate-400">Your display name is separate — this legal name is used for verification.</p>
          </div>
          <Input name="specialty" placeholder="Specialty (e.g. Paediatrics)" defaultValue={profile?.specialty ?? ""} disabled={isSuspended} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="licenseNumber" placeholder="License number" defaultValue={profile?.licenseNumber ?? ""} disabled={isSuspended} />
          <Input
            name="yearsOfExperience"
            type="number"
            min={0}
            max={80}
            placeholder="Years of experience"
            defaultValue={profile?.yearsOfExperience ?? ""}
            disabled={isSuspended}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="country" placeholder="Country" defaultValue={profile?.country ?? ""} disabled={isSuspended} />
          <Input name="cityRegion" placeholder="City / region" defaultValue={profile?.cityRegion ?? ""} disabled={isSuspended} />
        </div>
        <Input
          name="languagesSpoken"
          placeholder="Languages spoken (comma-separated): English, Swahili"
          defaultValue={profile?.languagesSpoken ?? ""}
          disabled={isSuspended}
        />
        <Input name="phone" type="tel" placeholder="Phone number" defaultValue={profile?.phone ?? ""} disabled={isSuspended} />
        <textarea
          name="bio"
          placeholder="Short professional bio"
          defaultValue={profile?.bio ?? ""}
          rows={5}
          disabled={isSuspended}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/80 px-4 py-3 text-sm text-brand-900">
        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden />
        <p>Your details are reviewed by our team before you go live. Verified professionals can publish articles and vote on content.</p>
      </div>

      <FormMessage message={state.message} type={state.ok ? "success" : "error"} />
      <Button disabled={pending || isSuspended} className="w-full md:w-auto">
        {pending ? "Saving..." : profile ? "Save profile changes" : "Submit for verification"}
      </Button>
    </form>
  );
}
