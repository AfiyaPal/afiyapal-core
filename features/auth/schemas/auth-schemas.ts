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

export const doctorRegisterSchema = registerSchema;

export const facilityRegisterSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().email(),
  phone: z.string().trim().max(20).optional(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  facilityName: z.string().trim().min(2).max(200),
  facilityType: z.string().min(1),
  country: z.string().trim().min(1).max(120),
  region: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  address: z.string().trim().max(300).optional(),
  description: z.string().trim().max(1200).optional()
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
