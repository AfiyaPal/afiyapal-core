import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";

type ContactSubmissionWriteDelegate = {
  count(args: unknown): Promise<number>;
  create(args: unknown): Promise<unknown>;
};

const contactSubmission = (prisma as unknown as { contactSubmission: ContactSubmissionWriteDelegate }).contactSubmission;

const MAX_IP_PER_HOUR = Number(process.env.CONTACT_RATE_LIMIT_IP_PER_HOUR ?? 5);
const MAX_EMAIL_PER_HOUR = Number(process.env.CONTACT_RATE_LIMIT_EMAIL_PER_HOUR ?? 3);
const MIN_FORM_SECONDS = Number(process.env.CONTACT_MIN_FORM_SECONDS ?? 2);

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(1200),
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

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return json("Please check the contact form and try again.", 400);
  }

  const input = parsed.data;

  // Honeypot: bots get a success-shaped response, but nothing is stored.
  if (input.website) {
    return NextResponse.json({ message: "Thanks for contacting AfiyaPal. Our team will get back to you soon." }, { status: 202 });
  }

  if (input.startedAt && Date.now() - input.startedAt < MIN_FORM_SECONDS * 1000) {
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

  await contactSubmission.create({
    data: {
      fullName: input.fullName,
      email: normalizedEmail,
      phone: input.phone || null,
      subject: input.subject,
      jobPosition: null,
      services: "",
      message: input.message,
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 255) ?? null,
      source: "HOME_CONTACT_FORM",
      status: "NEW"
    }
  });

  return NextResponse.json({ message: "Thanks for contacting AfiyaPal. Our team will get back to you soon." }, { status: 201 });
}
