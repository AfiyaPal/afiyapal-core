import type { ChatReference } from "./chat-reference";

export type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
  references?: ChatReference[];
};
