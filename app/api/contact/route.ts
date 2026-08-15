import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";
import { notifyAdminsContactSubmissionSubmitted } from "@/server/services/notification-service";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 64 * 1024;

function boundedEnvNumber(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

const MAX_IP_PER_HOUR = boundedEnvNumber(process.env.CONTACT_RATE_LIMIT_IP_PER_HOUR, 5, 1, 1000);
const MAX_EMAIL_PER_HOUR = boundedEnvNumber(process.env.CONTACT_RATE_LIMIT_EMAIL_PER_HOUR, 3, 1, 1000);
const MIN_FORM_SECONDS = boundedEnvNumber(process.env.CONTACT_MIN_FORM_SECONDS, 2, 0, 60);

type ContactSubmissionWriteDelegate = {
  count(args: unknown): Promise<number>;
  create(args: unknown): Promise<{ id: number }>;
};

const contactSubmission = (prisma as unknown as { contactSubmission: ContactSubmissionWriteDelegate }).contactSubmission;

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(5).max(1200),
  website: z.string().trim().max(120).optional().or(z.literal("")),
  startedAt: z.number().optional()
});

function firstValidIp(value: string | null) {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  if (!first) return null;
  const normalized = first.replace(/^::ffff:/, "");
  if (!/^[a-zA-Z0-9:.%-]+$/.test(normalized)) return null;
  return normalized.slice(0, 80);
}

function getTrustedClientIp(request: NextRequest) {
  const headers = request.headers;

  // Vercel owns these edge headers in production. We intentionally do not accept
  // a client-provided IP from the request body, which prevents trivial spoofing.
  if (process.env.VERCEL === "1" || process.env.VERCEL === "true") {
    return (
      firstValidIp(headers.get("x-vercel-forwarded-for")) ??
      firstValidIp(headers.get("x-real-ip")) ??
      firstValidIp(headers.get("x-forwarded-for")) ??
      "unknown-vercel-client"
    );
  }

  // Local/dev fallback: do not trust random x-forwarded-for chains from clients.
  return firstValidIp(headers.get("x-real-ip")) ?? "local-development";
}

function hashIp(ip: string) {
  const pepper = process.env.AUTH_SECRET || process.env.CONTACT_IP_HASH_SECRET || "afiyapal-contact-rate-limit";
  return createHash("sha256").update(`${pepper}:${ip}`).digest("hex");
}

function json(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

const SUCCESS_MESSAGE = "Thanks for contacting AfiyaPal. Our team will get back to you soon.";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return json("Please check the contact form and try again.", 400);
  }

  let body: unknown = null;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json("Please check the contact form and try again.", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json("Please check the contact form and try again.", 400);
  }

  const input = parsed.data;

  // Honeypot: bots get a success-shaped response, but nothing is stored.
  if (input.website) {
    return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 201 });
  }

  // Time-to-submit heuristic. A real browser always sends a positive startedAt, so a
  // missing/invalid value or an unrealistically fast submit is treated as a bot.
  const startedAt = input.startedAt;
  const submittedTooFast =
    startedAt == null ||
    !Number.isFinite(startedAt) ||
    startedAt <= 0 ||
    Date.now() - startedAt < MIN_FORM_SECONDS * 1000;

  if (submittedTooFast) {
    return json("Please wait a moment before submitting the form.", 429);
  }

  const ipHash = hashIp(getTrustedClientIp(request));
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const normalizedEmail = input.email.toLowerCase();

  const [ipRecentCount, emailRecentCount] = await Promise.all([
    contactSubmission.count({ where: { ipHash, createdAt: { gte: since } } }),
    contactSubmission.count({ where: { email: normalizedEmail, createdAt: { gte: since } } })
  ]);

  if (ipRecentCount >= MAX_IP_PER_HOUR || emailRecentCount >= MAX_EMAIL_PER_HOUR) {
    return json("Too many contact requests. Please try again later.", 429);
  }

  let created: { id: number };
  try {
    created = await contactSubmission.create({
      data: {
        fullName: input.fullName,
        email: normalizedEmail,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        ipHash,
        userAgent: request.headers.get("user-agent")?.slice(0, 255) ?? null,
        source: "HOME_CONTACT_FORM",
        status: "NEW"
      }
    });
  } catch (error) {
    console.error("Failed to store contact submission", error);
    return json("We could not submit your message. Please try again.", 500);
  }

  notifyAdminsContactSubmissionSubmitted({
    submissionId: created.id,
    fullName: input.fullName,
    subject: input.subject
  }).catch((error) => {
    console.error("Failed to notify admins about contact submission", error);
  });

  return NextResponse.json({ message: SUCCESS_MESSAGE }, { status: 201 });
}
