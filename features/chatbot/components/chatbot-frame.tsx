import { ChatbotWidget } from "./chatbot-widget";

export function ChatbotFrame() {
  return (
    <main className="min-h-screen bg-white p-4">
      <ChatbotWidget mode="frame" />
    </main>
  );
}
