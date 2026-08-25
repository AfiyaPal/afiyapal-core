"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { routes } from "@/lib/routes";
import { notifyAdminsDoctorApplied } from "@/server/services/notification-service";
import { findUserByUsernameNormalized } from "@/server/repositories/user-repository";
import { doctorProfileSchema } from "../schemas/doctor-profile-schema";
import { usernameSchema } from "../schemas/username-schema";

function normalizeText(value: string | null | undefined, maxLength: number) {
  if (!value) return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return null;
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export async function updateUsernameAction(_: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const parsed = usernameSchema.safeParse(formData.get("username"));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid username." };
  }

  const username = parsed.data;

  const taken = await findUserByUsernameNormalized(username, user.id).catch(() => null);
  if (taken) {
    return { ok: false, message: "That username is already taken." };
  }

  if (username === user.username) {
    return { ok: true, message: "Username unchanged." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { username } });
    const profile = await tx.doctorProfile.findUnique({ where: { userId: user.id } });
    if (profile?.fullName === user.username) {
      await tx.doctorProfile.update({ where: { userId: user.id }, data: { fullName: username } });
    }
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { ok: true, message: "Username updated." };
}

const AVAILABILITY_VALUES = ["AVAILABLE", "UNAVAILABLE"] as const;
type AvailabilityValue = (typeof AVAILABILITY_VALUES)[number];

export async function toggleAvailabilityAction(_: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const raw = formData.get("availability");
  if (typeof raw !== "string" || !AVAILABILITY_VALUES.includes(raw as AvailabilityValue)) {
    return { ok: false, message: "Invalid availability value." };
  }

  const next = raw as AvailabilityValue;

  const profile = await prisma.doctorProfile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    return { ok: false, message: "Professional profile not found. Complete your profile first." };
  }

  if (profile.availabilityStatus === next) {
    return { ok: true, message: next === "AVAILABLE" ? "You are already marked as available." : "You are already marked as unavailable." };
  }

  await prisma.doctorProfile.update({ where: { userId: user.id }, data: { availabilityStatus: next } });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  revalidatePath("/professionals");
  return { ok: true, message: next === "AVAILABLE" ? "You are now marked as available." : "You are now marked as unavailable." };
}

export async function updateDoctorProfileAction(_: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "DOCTOR") redirect(routes.login);

  const parsed = doctorProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid profile details." };
  }

  const data = parsed.data;

  const existing = await prisma.doctorProfile.findUnique({ where: { userId: user.id } });

  if (existing?.verificationStatus === "SUSPENDED") {
    return { ok: false, message: "This profile is suspended. Contact support for assistance." };
  }

  const resubmitting = !existing || existing.verificationStatus === "REJECTED";

  const profile = await prisma.doctorProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      fullName: normalizeText(data.fullName, 180) ?? user.username,
      email: user.email,
      phone: normalizeText(data.phone, 60),
      country: normalizeText(data.country, 120),
      cityRegion: normalizeText(data.cityRegion, 120),
      licenseNumber: normalizeText(data.licenseNumber, 120),
      specialty: normalizeText(data.specialty, 120),
      languagesSpoken: normalizeText(data.languagesSpoken, 240),
      yearsOfExperience: data.yearsOfExperience ?? null,
      bio: normalizeText(data.bio, 1200),
      verificationStatus: "PENDING",
      availabilityStatus: "UNAVAILABLE"
    },
    update: {
      fullName: normalizeText(data.fullName, 180) ?? undefined,
      phone: normalizeText(data.phone, 60),
      country: normalizeText(data.country, 120),
      cityRegion: normalizeText(data.cityRegion, 120),
      licenseNumber: normalizeText(data.licenseNumber, 120),
      specialty: normalizeText(data.specialty, 120),
      languagesSpoken: normalizeText(data.languagesSpoken, 240),
      yearsOfExperience: data.yearsOfExperience ?? null,
      bio: normalizeText(data.bio, 1200),
      ...(resubmitting
        ? { verificationStatus: "PENDING" as const, rejectionReason: null, verifiedById: null, verifiedAt: null }
        : {})
    }
  });

  if (resubmitting) {
    notifyAdminsDoctorApplied({ doctorProfileId: profile.id, doctorName: profile.fullName, email: user.email }).catch((error) =>
      console.error("Failed to notify admins about professional profile review", error)
    );
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { ok: true, message: resubmitting ? "Profile submitted for verification." : "Profile updated." };
}
