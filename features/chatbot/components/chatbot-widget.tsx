"use client";

import { FormEvent, useState, useEffect, useCallback } from "react";
import { Send, Baby, AlertTriangle, Phone, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MaternalEmergencyButton } from "@/features/maternal/components/maternal-emergency-button";
import type { ChatMessage } from "../types/chat-message";

const medicalDisclaimer = "AfiyaPal provides informational health guidance only and does not diagnose or replace a qualified clinician.";
const emergencyDisclaimer = "For severe symptoms or emergencies, seek urgent local medical care immediately.";

const MATERNAL_KEYWORDS = [
  "pregnancy", "pregnant", "contraction", "labour", "labor", "maternal",
  "antenatal", "prenatal", "postnatal", "breastfeeding", "expecting",
  "due date", "trimester", "water broke", "amniotic", "placenta",
  "foetus", "fetus", "newborn", "baby due", "birth", "caesarean",
  "c-section", "midwife", "obstetric", "gestation", "miscarriage",
  "ectopic", "morning sickness", "baby bump",
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "Habari, I am AfiyaPal. Tell me what you are feeling, and I will share careful first-step guidance. For emergencies, visit the nearest facility immediately."
  }
];

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("afiyapal-session-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("afiyapal-session-id", id);
  }
  return id;
}

function containsMaternalKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return MATERNAL_KEYWORDS.some((kw) => lower.includes(kw));
}

type EmergencyState = {
  active: true;
  type: "maternal" | "medical";
  phone?: string | null;
  timestamp: number;
};

export function ChatbotWidget({ mode = "page" }: { mode?: "page" | "frame" }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [emergency, setEmergency] = useState<EmergencyState | null>(null);
  const [showMaternalPrompt, setShowMaternalPrompt] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [maternalPhone, setMaternalPhone] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("afiyapal-emergency");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.active && Date.now() - data.timestamp < 1800000) {
          setEmergency(data);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.active) {
        setEmergency({ active: true, type: detail.type, phone: detail.phone, timestamp: detail.timestamp });
      }
    }
    window.addEventListener("afiyapal:emergency", handler);
    return () => window.removeEventListener("afiyapal:emergency", handler);
  }, []);

  const handleMaternalPromptDismiss = useCallback(() => {
    setShowMaternalPrompt(false);
  }, []);

  const handleSaveMaternalPhone = useCallback(() => {
    if (maternalPhone.trim()) {
      localStorage.setItem("afiyapal-maternal-contact", maternalPhone.trim());
    }
    setShowMaternalPrompt(false);
    setShowPhoneForm(false);
    setMaternalPhone("");
  }, [maternalPhone]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = message.trim();
    if (!clean || isSending) return;

    if (!emergency && containsMaternalKeyword(clean)) {
      const alreadySaved = localStorage.getItem("afiyapal-maternal-contact");
      if (!alreadySaved) {
        setShowMaternalPrompt(true);
      }
    }

    const userMessage: ChatMessage = { id: crypto.randomUUID(), sender: "user", text: clean };
    setMessages((items) => [...items, userMessage]);
    setMessage("");
    setIsSending(true);

    try {
      const body: Record<string, unknown> = { message: clean };
      if (emergency) {
        body.emergency = { active: true, type: emergency.type };
      }

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: data.text ?? data.error ?? "Sorry, I could not respond right now."
      };
      setMessages((items) => [...items, aiMessage]);
    } catch {
      setMessages((items) => [
        ...items,
        { id: crypto.randomUUID(), sender: "ai", text: "Sorry, I am having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className={`mx-auto flex ${mode === "frame" ? "h-[calc(100vh-2rem)] max-w-3xl" : "min-h-[680px] max-w-4xl"} flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-soft`}>
      <MaternalEmergencyButton />
      <header className={cn("border-b px-6 py-5", emergency ? "bg-rose-700 text-white" : "bg-brand-600 text-white")}>
        <h1 className="text-xl font-bold">
          {emergency ? "Maternal Emergency — Help is on the way" : "AfiyaPal Health Assistant"}
        </h1>
        <p className="mt-1 text-sm text-emerald-50">{medicalDisclaimer}</p>
      </header>

      {emergency && (
        <div className="flex items-center gap-2 border-b border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-900">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Emergency alert active. Responders have been notified. The chatbot is now in emergency guidance mode.</span>
        </div>
      )}

      <div id="chatbot-safety-note" className="border-b border-emerald-100 bg-amber-50 px-6 py-3 text-xs font-semibold leading-5 text-amber-900">
        <p>{medicalDisclaimer}</p>
        <p className="mt-1">{emergencyDisclaimer}</p>
      </div>

      {showMaternalPrompt && !showPhoneForm && (
        <div className="flex items-center justify-between gap-3 border-b border-rose-100 bg-rose-50 px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-rose-800">
            <Baby className="h-4 w-4 shrink-0" />
            <span>It sounds like you're asking about maternal health. Want to save an emergency contact so we can reach someone quickly if needed?</span>
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => setShowPhoneForm(true)} className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700">
              Save Contact
            </button>
            <button onClick={handleMaternalPromptDismiss} className="rounded-full p-1.5 text-rose-400 transition hover:bg-rose-100 hover:text-rose-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showPhoneForm && (
        <div className="flex items-center gap-3 border-b border-rose-100 bg-white px-6 py-3">
          <Phone className="h-4 w-4 shrink-0 text-rose-500" />
          <input
            value={maternalPhone}
            onChange={(e) => setMaternalPhone(e.target.value)}
            placeholder="+254 7XX XXX XXX"
            type="tel"
            className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
          />
          <button onClick={handleSaveMaternalPhone} className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700">
            Save
          </button>
          <button onClick={() => { setShowPhoneForm(false); setShowMaternalPrompt(false); }} className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fffb] p-5">
        {messages.map((item) => (
          <div key={item.id} className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}>
            {item.sender === "user" ? (
              <p className="max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 bg-brand-600 text-white">
                {item.text}
              </p>
            ) : (
              <div className="prose prose-sm prose-emerald max-w-[82%] rounded-2xl bg-white px-4 py-3 text-slate-700 shadow-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {item.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-3 border-t border-emerald-100 bg-white p-4">
        <label htmlFor="chatbot-message" className="sr-only">Type your health question for AfiyaPal</label>
        <input
          id="chatbot-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={emergency ? "Describe what is happening..." : "Type your health question..."}
          aria-describedby="chatbot-safety-note"
          className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
        <Button disabled={isSending} aria-label="Send message"><Send className="h-4 w-4" /></Button>
      </form>
    </section>
  );
}
