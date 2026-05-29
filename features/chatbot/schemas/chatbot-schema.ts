import { z } from "zod";

export const emergencyInfoSchema = z.object({
  active: z.literal(true),
  type: z.enum(["maternal", "medical"]),
});

export const sendChatMessageSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  emergency: emergencyInfoSchema.optional(),
});

export type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>;
