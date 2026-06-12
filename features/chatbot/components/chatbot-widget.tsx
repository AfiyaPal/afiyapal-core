"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MaternalEmergencyButton } from "@/features/maternal/components/maternal-emergency-button";
import type { ChatMessage } from "../types/chat-message";

const DISCLAIMER = "AfiyaPal provides informational health guidance only and does not diagnose or replace a qualified clinician.";
const EMERGENCY  = "For severe symptoms or emergencies, seek urgent local medical care immediately.";

const SUGGESTIONS = [
  "I have a headache and fever",
  "I feel anxious and stressed",
  "What are malaria symptoms?",
  "Tips for better sleep"
];

const WELCOME: ChatMessage = {
  id: "welcome",
  sender: "ai",
  text: "Habari! I am AfiyaPal 👋 Tell me how you are feeling and I will share careful first-step guidance.\n\nFor emergencies, please visit the nearest facility immediately."
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatbotWidget({ mode = "page" }: { mode?: "page" | "frame" }) {
  const [messages, setMessages]     = useState<ChatMessage[]>([WELCOME]);
  const [message, setMessage]       = useState("");
  const [isSending, setIsSending]   = useState(false);
  const [isTyping, setIsTyping]     = useState(false);
  const [timestamps]                = useState<Map<string, Date>>(() => new Map([["welcome", new Date()]]));
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const MAX = 500;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || isSending) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), sender: "user", text: clean };
    timestamps.set(userMsg.id, new Date());
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsSending(true);
    setIsTyping(true);

    try {
      const res  = await fetch("/api/chatbot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: clean }) });
      const body = await res.json();
      setIsTyping(false);
      const aiMsg: ChatMessage = { id: crypto.randomUUID(), sender: "ai", text: body.text ?? body.error ?? "Sorry, I could not respond right now." };
      timestamps.set(aiMsg.id, new Date());
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setIsTyping(false);
      const errMsg: ChatMessage = { id: crypto.randomUUID(), sender: "ai", text: "Sorry, I am having trouble connecting right now. Please try again later." };
      timestamps.set(errMsg.id, new Date());
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    send(message);
  }

  const isNearLimit = message.length > MAX * 0.85;

  return (
    <section
      className={`mx-auto flex ${
        mode === "frame" ? "h-[calc(100vh-2rem)] max-w-3xl" : "min-h-[700px] max-w-4xl"
      } flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_24px_80px_-12px_rgb(23_163_107_/_0.18)]`}
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-emerald-100 bg-gradient-to-r from-brand-600 to-teal-600 px-6 py-4 text-white">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/30">
          <span className="text-base font-black">A</span>
        </div>
        <div className="flex-1">
          <h1 className="text-base font-bold leading-tight">AfiyaPal Health Assistant</h1>
          <p className="flex items-center gap-1.5 text-xs text-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" aria-hidden />
            Online · English &amp; Swahili
          </p>
        </div>
      </header>

      {/* Disclaimer banner */}
      <div className="flex items-start gap-2 border-b border-amber-100 bg-amber-50 px-5 py-3 text-xs leading-5 text-amber-900">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" aria-hidden />
        <div>
          <p className="font-semibold">{DISCLAIMER}</p>
          <p className="mt-0.5">{EMERGENCY}</p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fffb] p-5">
        {messages.map((item) => (
          <div key={item.id} className={`flex flex-col ${item.sender === "user" ? "items-end" : "items-start"}`}>
            <div className={`flex items-end gap-2 ${item.sender === "user" ? "flex-row-reverse" : ""}`}>
              {item.sender === "ai" && (
                <div className="mb-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-600 text-xs font-black text-white shadow-sm">
                  A
                </div>
              )}
              <p
                className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                  item.sender === "user"
                    ? "rounded-br-sm bg-gradient-to-br from-brand-600 to-brand-700 text-white"
                    : "rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-100"
                }`}
              >
                {item.text}
              </p>
            </div>
            {timestamps.get(item.id) && (
              <p className="mt-1 px-2 text-[10px] text-slate-400">{formatTime(timestamps.get(item.id)!)}</p>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-600 text-xs font-black text-white shadow-sm">A</div>
            <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-1 text-slate-400" aria-label="AfiyaPal is typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips — only shown when chat is at welcome */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 border-t border-emerald-50 bg-white/80 px-5 py-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={onSubmit} className="flex items-end gap-3 border-t border-emerald-100 bg-white p-4">
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
            placeholder="Type your health question..."
            disabled={isSending}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-14 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 disabled:opacity-60"
          />
          {message.length > 0 && (
            <span className={`absolute bottom-2.5 right-3 text-[10px] font-medium ${isNearLimit ? "text-amber-500" : "text-slate-400"}`}>
              {message.length}/{MAX}
            </span>
          )}
        </div>
        <Button disabled={isSending || !message.trim()} aria-label="Send message" className="flex-shrink-0 rounded-2xl px-4 py-3">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </section>
  );
}
