import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findUserById } from "@/server/repositories/user-repository";

export const SESSION_COOKIE_NAME = "afiyapal_session";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "afiyapal-local-development-secret";
}

function signSessionValue(userId: number) {
  return createHmac("sha256", getSessionSecret()).update(String(userId)).digest("hex");
}

function buildSessionCookieValue(userId: number) {
  return `${userId}.${signSessionValue(userId)}`;
}

function readUserIdFromSignedSession(value: string | undefined) {
  if (!value) return null;

  const [rawUserId, signature] = value.split(".");
  const userId = Number(rawUserId);
  if (!Number.isInteger(userId) || userId <= 0 || !signature) return null;

  const expected = signSessionValue(userId);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length) return null;
  if (!timingSafeEqual(expectedBuffer, actualBuffer)) return null;

  return userId;
}

export async function createUserSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, buildSessionCookieValue(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = readUserIdFromSignedSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!userId) return null;

  return findUserById(userId).catch(() => null);
}
