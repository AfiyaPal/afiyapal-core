"use server";

import { loginSchema, passwordResetConfirmSchema, passwordResetSchema, registerSchema } from "../schemas/auth-schemas";
import { loginUser, registerUser, requestPasswordReset, resetPassword } from "@/server/services/auth-service";

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
