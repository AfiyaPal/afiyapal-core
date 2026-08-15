"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AlertTriangle, BookOpen, Send, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ChatMarkdown } from "./chat-markdown";
import { ChatNav } from "./chat-nav";
import { useInstallPrompt } from "../hooks/use-install-prompt";
import { InstallPromptButton, InstallPromptBanner, InstallIosModal } from "./install-prompt";
import type { ChatMessage } from "../types/chat-message";
import type { ChatReference } from "../types/chat-reference";
import { cn } from "@/lib/utils";

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

const STORAGE_KEY = "afiyapal-chat-thread";
const MAX = 500;

type PersistedThread = { messages: ChatMessage[]; timestamps: Record<string, string> };

function loadThread(): PersistedThread | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedThread;
    if (!Array.isArray(parsed?.messages) || parsed.messages.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function Avatar() {
  return (
    <div className="mb-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-600 text-xs font-black text-white shadow-sm">
      A
    </div>
  );
}

function ReferenceCard({ reference, onOpen }: { reference: ChatReference; onOpen: (ref: ChatReference) => void }) {
  const Icon = reference.kind === "blog" ? BookOpen : UserRound;
  return (
    <button
      type="button"
      onClick={() => onOpen(reference)}
      className="group w-full max-w-[85%] rounded-2xl border border-brand-800 bg-brand-900/70 px-4 py-3 text-left transition hover:border-brand-600 hover:bg-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-300">
        <Icon className="size-3" aria-hidden />
        {reference.kind === "blog" ? "AfiyaPal article" : "Verified professional"}
      </span>
      <span className="mt-1 block text-sm font-bold leading-snug text-slate-100 group-hover:text-white">{reference.title}</span>
      {reference.excerpt ? (
        <span className="mt-0.5 block text-xs leading-5 text-slate-400 line-clamp-2">{reference.excerpt}</span>
      ) : null}
    </button>
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatbotWidget({ mode = "page" }: { mode?: "page" | "frame" }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadThread();
    return saved?.messages.length ? saved.messages : [WELCOME];
  });
  const [timestamps, setTimestamps] = useState<Map<string, Date>>(() => {
    const saved = loadThread();
    const map = new Map<string, Date>();
    if (saved?.timestamps) {
      for (const [id, iso] of Object.entries(saved.timestamps)) {
        const date = new Date(iso);
        if (!Number.isNaN(date.getTime())) map.set(id, date);
      }
    }
    return map;
  });
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingRef, setPendingRef] = useState<ChatReference | null>(null);
  const installState = useInstallPrompt();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages,
          timestamps: Object.fromEntries(Array.from(timestamps.entries()).map(([id, date]) => [id, date.toISOString()]))
        })
      );
    } catch {
      /* sessionStorage unavailable — chat simply won't persist */
    }
  }, [messages, timestamps]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || isSending) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), sender: "user", text: clean };
    setTimestamps((prev) => new Map(prev).set(userMsg.id, new Date()));
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsSending(true);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean })
      });
      const body = await res.json();
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: body.text ?? body.error ?? "Sorry, I could not respond right now.",
        references: Array.isArray(body.references) ? body.references : undefined
      };
      setTimestamps((prev) => new Map(prev).set(aiMsg.id, new Date()));
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setIsTyping(false);
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Sorry, I am having trouble connecting right now. Please try again later."
      };
      setTimestamps((prev) => new Map(prev).set(errMsg.id, new Date()));
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function newChat() {
    setMessages([WELCOME]);
    setTimestamps(new Map([["welcome", new Date()]]));
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    inputRef.current?.focus();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(message);
  }

  const isNearLimit = message.length > MAX * 0.85;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-brand-950 text-slate-100",
        mode === "frame" ? "h-[calc(100dvh-2rem)] rounded-3xl border border-brand-800" : "h-dvh"
      )}
    >
      <ChatNav
        mode={mode}
        hasThread={messages.length > 1}
        onNewChat={newChat}
        installAction={<InstallPromptButton installState={installState} />}
      />

      {/* Disclaimer */}
      <div className="flex shrink-0 items-start gap-2 border-b border-amber-800/60 bg-amber-950/70 px-5 py-3 text-xs leading-5 text-amber-100">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-400" aria-hidden />
        <div>
          <p className="font-semibold">{DISCLAIMER}</p>
          <p className="mt-0.5">{EMERGENCY}</p>
        </div>
      </div>

      <InstallPromptBanner installState={installState} />

      {/* Thread */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
          {messages.map((item) => (
            <div key={item.id} className={cn("flex flex-col", item.sender === "user" ? "items-end" : "items-start")}>
              <div className={cn("flex items-end gap-2", item.sender === "user" && "flex-row-reverse")}>
                {item.sender === "ai" && <Avatar />}
                <div className={cn("flex flex-col gap-2", item.sender === "user" ? "items-end" : "items-start")}>
                  {item.sender === "user" ? (
                    <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-gradient-to-br from-brand-600 to-brand-700 px-4 py-3 text-sm leading-6 text-white shadow-lg shadow-black/10">
                      {item.text}
                    </p>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-brand-900 px-4 py-3 text-sm leading-6 text-slate-100 shadow-lg shadow-black/10 ring-1 ring-brand-800">
                      <ChatMarkdown text={item.text} references={item.references} onOpenRef={setPendingRef} />
                    </div>
                  )}
                  {item.sender === "ai" && item.references && item.references.length > 0 && (
                    <div className="flex w-full flex-col gap-2">
                      {item.references.map((ref) => (
                        <ReferenceCard key={ref.href} reference={ref} onOpen={setPendingRef} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {timestamps.get(item.id) && (
                <p className="mt-1 px-2 text-[10px] text-brand-300/60">{formatTime(timestamps.get(item.id)!)}</p>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2">
              <Avatar />
              <div className="rounded-2xl rounded-bl-sm bg-brand-900 px-4 py-3 shadow-lg shadow-black/10 ring-1 ring-brand-800">
                <div className="flex items-center gap-1 text-brand-200" aria-label="AfiyaPal is typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestion chips */}
      {messages.length === 1 && (
        <div className="shrink-0 border-t border-brand-800/60 bg-brand-900/50 px-5 py-3">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-brand-700 bg-brand-900 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-brand-800 hover:text-white active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={onSubmit} className="shrink-0 border-t border-brand-800 bg-brand-900/60 p-4">
        <div className="mx-auto flex w-full max-w-3xl items-end gap-3">
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
              placeholder="Type your health question..."
              disabled={isSending}
              className="w-full rounded-2xl border border-brand-700 bg-brand-950 px-4 py-3 pr-14 text-sm text-slate-100 outline-none transition placeholder:text-brand-300/50 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-60"
            />
            {message.length > 0 && (
              <span className={`absolute bottom-2.5 right-3 text-[10px] font-medium ${isNearLimit ? "text-amber-400" : "text-brand-300/60"}`}>
                {message.length}/{MAX}
              </span>
            )}
          </div>
          <Button disabled={isSending || !message.trim()} aria-label="Send message" className="shrink-0 rounded-2xl px-4 py-3 ring-offset-brand-950">
            <Send className="size-4" />
          </Button>
        </div>
      </form>

      <InstallIosModal installState={installState} />

      <Modal
        open={pendingRef !== null}
        onClose={() => setPendingRef(null)}
        title={pendingRef?.kind === "blog" ? "AfiyaPal article" : "Professional profile"}
      >
        {pendingRef && (
          <div className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-brand-200">
                {pendingRef.kind === "blog" ? <BookOpen className="size-3" aria-hidden /> : <UserRound className="size-3" aria-hidden />}
                {pendingRef.kind === "blog" ? "AfiyaPal article" : "Verified professional"}
              </span>
              <h3 className="mt-3 text-lg font-bold leading-snug text-white">{pendingRef.title}</h3>
              {pendingRef.excerpt && <p className="mt-2 text-sm leading-6 text-slate-300">{pendingRef.excerpt}</p>}
            </div>
            <p className="rounded-xl bg-brand-950/60 px-3 py-2 text-xs leading-5 text-brand-300">
              This opens in a new tab. Your chat stays right here.
            </p>
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingRef(null)}
                className="rounded-full border border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-100 transition hover:bg-brand-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900"
              >
                Close
              </button>
              <Button
                type="button"
                onClick={() => {
                  window.open(pendingRef.href, "_blank", "noopener,noreferrer");
                  setPendingRef(null);
                }}
              >
                Open article
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
