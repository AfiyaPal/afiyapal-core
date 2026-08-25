import "server-only";
import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/prisma";
import { createUser, findUserByEmail, findUserByUsernameNormalized } from "@/server/repositories/user-repository";
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
  return { ok: true, message: "Login successful.", role: user.role };
}

type FacilityRegisterInput = {
  username: string;
  email: string;
  phone?: string;
  password: string;
  facilityName: string;
  facilityType: string;
  country: string;
  region?: string;
  city?: string;
  address?: string;
  description?: string;
};

export async function registerFacilityUser(input: FacilityRegisterInput) {
  const existing = await findUserByEmail(input.email).catch(() => null);
  if (existing) return { ok: false, message: "An account with this email already exists." };

  const nameTaken = await findUserByUsernameNormalized(input.username).catch(() => null);
  if (nameTaken) return { ok: false, message: "That username is already taken." };

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createUser({ username: input.username, email: input.email, phone: input.phone, passwordHash, role: "FACILITY_ADMIN" });

  await prisma.facility.create({
    data: {
      name: input.facilityName,
      type: input.facilityType,
      country: input.country,
      region: input.region || null,
      city: input.city || null,
      address: input.address || null,
      description: input.description || null,
      adminId: user.id,
      email: input.email,
      phone: input.phone || null,
      verificationStatus: "PENDING"
    }
  });

  await createUserSession(user.id);
  return { ok: true, message: "Facility application submitted. Awaiting verification." };
}

type DoctorRegisterInput = {
  username: string;
  email: string;
  phone?: string;
  password: string;
};

export async function registerDoctorUser(input: DoctorRegisterInput) {
  const existing = await findUserByEmail(input.email).catch(() => null);
  if (existing) return { ok: false, message: "An account with this email already exists." };

  const nameTaken = await findUserByUsernameNormalized(input.username).catch(() => null);
  if (nameTaken) return { ok: false, message: "That username is already taken." };

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await createUser({ username: input.username, email: input.email, phone: input.phone, passwordHash, role: "DOCTOR" });

  await createDoctorApplication({
    userId: user.id,
    fullName: input.username,
    email: input.email,
    phone: input.phone
  });

  await createUserSession(user.id);
  return { ok: true, message: "Doctor application submitted. Awaiting verification." };
}

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export async function requestPasswordReset(email: string) {
  const user = await findUserByEmail(email).catch(() => null);

  // Always return the same message to prevent user enumeration.
  if (!user) return { ok: true, message: "If an account exists, password reset instructions will be sent." };

  // Invalidate any previous unused tokens for this user.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() }
  });

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt }
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/password-reset-confirm?token=${rawToken}`;

  const { sendEmail } = await import("./email-service");
  await sendEmail({
    to: user.email,
    subject: "Reset your AfiyaPal password",
    html: `<p>Hi ${user.username},</p>
<p>You requested a password reset. Click the link below to set a new password. This link expires in 1 hour.</p>
<p><a href="${resetLink}">Reset my password</a></p>
<p>If you did not request this, you can safely ignore this email.</p>`
  }).catch((error) => {
    console.error("Failed to send password reset email", error);
  });

  return { ok: true, message: "If an account exists, password reset instructions will be sent." };
}

export async function resetPassword(input: { token: string; password: string }) {
  const tokenHash = hashToken(input.token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true }
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false, message: "This reset link is invalid or has expired. Please request a new one." };
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } })
  ]);

  return { ok: true, message: "Password has been reset. You can now log in." };
}
