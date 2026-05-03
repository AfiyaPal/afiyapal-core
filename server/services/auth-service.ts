import "server-only";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "@/server/repositories/user-repository";

export async function loginUser(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email).catch(() => null);
  if (!user) return { ok: false, message: "Invalid email or password." };

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) return { ok: false, message: "Invalid email or password." };

  // Replace with Auth.js signIn or secure session cookie creation.
  return { ok: true, message: "Login validated. Wire this to Auth.js/session creation next." };
}

export async function registerUser(input: { username: string; email: string; phone?: string; password: string }) {
  const existing = await findUserByEmail(input.email).catch(() => null);
  if (existing) return { ok: false, message: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(input.password, 12);
  await createUser({ username: input.username, email: input.email, phone: input.phone, passwordHash });
  return { ok: true, message: "Account created. Add email verification/session sign-in next." };
}

export async function requestPasswordReset(email: string) {
  // Generate token, store hashed token, and email the user in production.
  await findUserByEmail(email).catch(() => null);
  return { ok: true, message: "If an account exists, password reset instructions will be sent." };
}

export async function resetPassword(_: { token: string; password: string }) {
  // Verify hashed token and update password in production.
  return { ok: true, message: "Password reset flow placeholder. Connect token storage/email next." };
}
