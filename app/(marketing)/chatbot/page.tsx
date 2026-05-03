import { ChatbotWidget } from "@/features/chatbot/components/chatbot-widget";

export const metadata = { title: "Chatbot" };

export default function Page() {
  return (
    <main className="container-page py-10">
      <ChatbotWidget mode="page" />
    </main>
  );
}
