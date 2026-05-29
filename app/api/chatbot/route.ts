import { NextResponse } from "next/server";
import { sendChatMessageSchema } from "@/features/chatbot/schemas/chatbot-schema";
import { generateChatbotReply } from "@/server/services/chatbot-service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = sendChatMessageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid message." }, { status: 400 });
  }

  const reply = await generateChatbotReply(parsed.data.message, parsed.data.emergency);
  return NextResponse.json({ text: reply });
}
