"use server";

import { loginSchema, passwordResetConfirmSchema, passwordResetSchema, registerSchema, doctorRegisterSchema, facilityRegisterSchema } from "../schemas/auth-schemas";
import { loginUser, registerUser, requestPasswordReset, resetPassword, registerDoctorUser, registerFacilityUser } from "@/server/services/auth-service";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please check your email and password." };
  return loginUser(parsed.data);
}

export async function registerAction(_: unknown, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid registration details." };
  return registerUser(parsed.data);
}

export async function facilityRegisterAction(_: unknown, formData: FormData) {
  const parsed = facilityRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid registration details." };
  const result = await registerFacilityUser(parsed.data);
  if (result.ok) redirect(routes.facilityDashboard);
  return result;
}

export async function doctorRegisterAction(_: unknown, formData: FormData) {
  const parsed = doctorRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid registration details." };
  const result = await registerDoctorUser(parsed.data);
  if (result.ok) redirect(routes.dashboard);
  return result;
}

export async function passwordResetAction(_: unknown, formData: FormData) {
  const parsed = passwordResetSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please enter a valid email." };
  return requestPasswordReset(parsed.data.email);
}

export async function passwordResetConfirmAction(_: unknown, formData: FormData) {
  const parsed = passwordResetConfirmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid password reset details." };
  return resetPassword(parsed.data);
}
