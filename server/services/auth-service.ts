import "server-only";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "@/server/repositories/user-repository";
import { createUserSession } from "@/server/auth/session";
import { isActiveUserStatus } from "@/server/auth/roles";
import { createDoctorApplication } from "@/server/services/doctor-application-service";

export async function loginUser(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email).catch(() => null);
  if (!user) return { ok: false, message: "Invalid email or password." };

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) return { ok: false, message: "Invalid email or password." };

  if (!isActiveUserStatus(user.status)) {
    return { ok: false, message: "This account is not active. Please contact support." };
  }

  await createUserSession(user.id);
  return { ok: true, message: "Login successful." };
}

export async function registerUser(input: { username: string; email: string; phone?: string; password: string }) {
  const existing = await findUserByEmail(input.email).catch(() => null);
  if (existing) return { ok: false, message: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(input.password, 12);
  await createUser({ username: input.username, email: input.email, phone: input.phone, passwordHash });
  return { ok: true, message: "Account created. Add email verification/session sign-in next." };
}

type DoctorRegisterInput = {
  username: string;
  email: string;
  phone?: string;
  password: string;
  fullName: string;
  licenseNumber: string;
  specialty: string;
  yearsOfExperience?: number;
  country?: string;
  cityRegion?: string;
  languagesSpoken?: string;
  bio?: string;
};

export async function registerDoctorUser(input: DoctorRegisterInput) {
  const existing = await findUserByEmail(input.email).catch(() => null);
  if (existing) return { ok: false, message: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createUser({ username: input.username, email: input.email, phone: input.phone, passwordHash, role: "DOCTOR" });

  await createDoctorApplication({
    userId: user.id,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    country: input.country,
    cityRegion: input.cityRegion,
    licenseNumber: input.licenseNumber,
    specialty: input.specialty,
    languagesSpoken: input.languagesSpoken,
    yearsOfExperience: input.yearsOfExperience,
    bio: input.bio
  });

  await createUserSession(user.id);
  return { ok: true, message: "Doctor application submitted. Awaiting verification." };
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
