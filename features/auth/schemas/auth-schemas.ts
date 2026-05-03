import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().email(),
  phone: z.string().trim().max(20).optional(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});

export const passwordResetSchema = z.object({ email: z.string().email() });

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(8),
  password: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});
