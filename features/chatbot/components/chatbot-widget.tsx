"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "../types/chat-message";

const medicalDisclaimer = "AfiyaPal provides informational health guidance only and does not diagnose or replace a qualified clinician.";
const emergencyDisclaimer = "For severe symptoms or emergencies, seek urgent local medical care immediately.";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "Habari, I am AfiyaPal. Tell me what you are feeling, and I will share careful first-step guidance. For emergencies, visit the nearest facility immediately."
  }
];

export function ChatbotWidget({ mode = "page" }: { mode?: "page" | "frame" }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = message.trim();
    if (!clean || isSending) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), sender: "user", text: clean };
    setMessages((items) => [...items, userMessage]);
    setMessage("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean })
      });
      const body = await res.json();
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: body.text ?? body.error ?? "Sorry, I could not respond right now."
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
      <header className="border-b border-emerald-100 bg-brand-600 px-6 py-5 text-white">
        <h1 className="text-xl font-bold">AfiyaPal Health Assistant</h1>
        <p className="mt-1 text-sm text-emerald-50">{medicalDisclaimer}</p>
      </header>

      <div className="border-b border-emerald-100 bg-amber-50 px-6 py-3 text-xs font-semibold leading-5 text-amber-900">
        <p>{medicalDisclaimer}</p>
        <p className="mt-1">{emergencyDisclaimer}</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#f8fffb] p-5">
        {messages.map((item) => (
          <div key={item.id} className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${item.sender === "user" ? "bg-brand-600 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-3 border-t border-emerald-100 bg-white p-4">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type your health question..."
          className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
        <Button disabled={isSending} aria-label="Send message"><Send className="h-4 w-4" /></Button>
      </form>
    </section>
  );
}
