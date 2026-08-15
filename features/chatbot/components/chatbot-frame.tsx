import { ChatbotWidget } from "./chatbot-widget";

export function ChatbotFrame() {
  return (
    <main className="min-h-screen bg-brand-950 p-4">
      <ChatbotWidget mode="frame" />
    </main>
  );
}
