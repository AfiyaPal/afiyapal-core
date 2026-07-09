"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  User,
  X,
} from "lucide-react";

type SubmitState = "idle" | "submitting" | "success" | "error";

function fieldClasses() {
  return "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";
}

export function ContactSection() {
  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const startedAt = useMemo(() => Date.now(), []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: text,
      website: String(formData.get("website") ?? ""),
      startedAt,
    };

    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(
          result.message ||
            "We could not submit your message. Please try again.",
        );
      }
      setStatus("success");
      setMessage(
        result.message ||
          "Thanks for contacting AfiyaPal. Our team will get back to you soon.",
      );
      form.reset();
      setText("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  const remaining = Math.max(0, 1200 - text.length);

  return (
    <section id="contact" className="container-page pb-24 pt-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-brand-700/10 backdrop-blur md:p-10 lg:p-14">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-teal-200/45 blur-3xl"
        />

        <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.35fr] lg:gap-16">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700 ring-1 ring-brand-100">
              <Sparkles className="h-4 w-4" aria-hidden />
              Contact us
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Let&apos;s get in touch.
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-slate-600">
              Talk to AfiyaPal about partnerships, care access, facility
              onboarding, public health intelligence, or general support.
            </p>
            <div className="mt-8 rounded-3xl bg-gradient-to-br from-brand-50 to-emerald-50 p-5 ring-1 ring-brand-100">
              <p className="text-sm font-bold text-slate-900">Prefer email?</p>
              <a
                href="mailto:afiyapal01@gmail.com"
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-brand-700 underline-offset-4 hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden />
                afiyapal01@gmail.com
              </a>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                For emergencies, contact local emergency services or visit the
                nearest health facility immediately.
              </p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/5 md:p-7"
          >
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Full name
                </span>
                <span className="relative block">
                  <User
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <input
                    name="fullName"
                    required
                    minLength={2}
                    maxLength={120}
                    placeholder="Enter your full name..."
                    className={`${fieldClasses()} pl-10`}
                  />
                </span>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Email address
                </span>
                <span className="relative block">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={160}
                    placeholder="Enter your email address..."
                    className={`${fieldClasses()} pl-10`}
                  />
                </span>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Phone number
                </span>
                <span className="relative block">
                  <Phone
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <input
                    name="phone"
                    maxLength={40}
                    placeholder="Enter your phone number..."
                    className={`${fieldClasses()} pl-10`}
                  />
                </span>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wide text-slate-600">
                  Subject
                </span>
                <span className="relative block">
                  <MessageSquare
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                  <input
                    name="subject"
                    required
                    minLength={3}
                    maxLength={160}
                    placeholder="What should we help with?"
                    className={`${fieldClasses()} pl-10`}
                  />
                </span>
              </label>
            </div>

            <label className="mt-5 block space-y-2">
              <span className="text-xs font-black uppercase tracking-wide text-slate-600">
                Message
              </span>
              <span className="relative block">
                <MessageSquare
                  className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-400"
                  aria-hidden
                />
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={1200}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={6}
                  placeholder="Enter your main text here..."
                  className={`${fieldClasses()} pl-10 leading-7`}
                />
              </span>
              <span className="block text-right text-xs font-semibold text-slate-400">
                {remaining}/1200
              </span>
            </label>

            {status === "error" && message ? (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-100">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-brand-600 to-teal-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-brand-600/20 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? "Submitting..." : "Submit form"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      </div>

      {status === "success" && message ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close success message"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-8 ring-brand-50/60">
              <CheckCircle2 className="h-9 w-9" aria-hidden />
            </div>
            <h3
              id="contact-success-title"
              className="mt-5 text-2xl font-black text-slate-950"
            >
              Message received
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Great, thanks
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
