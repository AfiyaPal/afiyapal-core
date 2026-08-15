"use server";

import { loginSchema, passwordResetConfirmSchema, passwordResetSchema, doctorRegisterSchema, facilityRegisterSchema } from "../schemas/auth-schemas";
import { loginUser, requestPasswordReset, resetPassword, registerDoctorUser, registerFacilityUser } from "@/server/services/auth-service";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { isAdminRole } from "@/server/auth/roles";

function roleHome(role: string) {
  if (role === "DOCTOR") return routes.dashboard;
  if (role === "FACILITY_ADMIN") return routes.facilityDashboard;
  if (isAdminRole(role)) return routes.admin;
  return routes.home;
}

export async function loginAction(_: unknown, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Please check your email and password." };

  const result = await loginUser(parsed.data);
  if (!result.ok || !result.role) return result;

  const rawNext = formData.get("next");
  const next = typeof rawNext === "string" ? rawNext : null;
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/login")) {
    redirect(next);
  }

  redirect(roleHome(result.role));
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
