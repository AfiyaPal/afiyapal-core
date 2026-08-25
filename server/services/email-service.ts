import "server-only";
import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured — skipping email send");
    return false;
  }

  const from = process.env.SMTP_FROM || `AfiyaPal <${process.env.SMTP_USER}>`;

  await transporter.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    replyTo: input.replyTo
  });

  return true;
}
