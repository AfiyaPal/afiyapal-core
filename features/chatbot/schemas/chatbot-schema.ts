import { z } from "zod";

export const sendChatMessageSchema = z.object({
  message: z.string().trim().min(1).max(2000)
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
