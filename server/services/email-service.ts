import "server-only";
import { Resend } from "resend";

// ─── Resend (current – for Vercel / serverless deployments) ───
// Uses the Resend HTTP API. Works on any hosting platform.

function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = createResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not configured — skipping email send");
    return false;
  }

  const from = process.env.RESEND_FROM || "noreply@afiyapal.co.ke";

  await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo || process.env.CONTACT_EMAIL_TO || process.env.SMTP_USER
  });

  return true;
}

// ─────────────────────────────────────────────────────────────
// SMTP fallback (uncomment when self-hosting on a dedicated
// server that allows outbound SMTP on ports 465/587).
//
// Steps to switch:
//   1. Uncomment the nodemailer import below
//   2. Comment out or remove the Resend code above (lines 5-34)
//   3. Uncomment the SMTP version of `sendEmail` below
//   4. Set env vars: SMTP_HOST, SMTP_PORT, SMTP_USER,
//      SMTP_PASS, SMTP_FROM
//   5. Run: npm install nodemailer @types/nodemailer
// ─────────────────────────────────────────────────────────────
//
// import nodemailer from "nodemailer";
//
// function createTransporter() {
//   const host = process.env.SMTP_HOST;
//   const port = Number(process.env.SMTP_PORT) || 465;
//   const user = process.env.SMTP_USER;
//   const pass = process.env.SMTP_PASS;
//
//   if (!host || !user || !pass) return null;
//
//   return nodemailer.createTransport({
//     host,
//     port,
//     secure: port === 465,
//     auth: { user, pass }
//   });
// }
//
// export async function sendEmail(input: {
//   to: string;
//   subject: string;
//   html: string;
//   replyTo?: string;
// }) {
//   const transporter = createTransporter();
//   if (!transporter) {
//     console.warn("SMTP not configured — skipping email send");
//     return false;
//   }
//
//   const from = process.env.SMTP_FROM || `AfiyaPal <${process.env.SMTP_USER}>`;
//
//   await transporter.sendMail({
//     from,
//     to: input.to,
//     subject: input.subject,
//     html: input.html,
//     replyTo: input.replyTo || process.env.CONTACT_EMAIL_TO
//   });
//
//   return true;
// }
