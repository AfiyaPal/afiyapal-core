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

export const doctorRegisterSchema = z.object({
  username: z.string().trim().min(3).max(50),
  email: z.string().email(),
  phone: z.string().trim().max(20).optional(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  fullName: z.string().trim().min(2).max(180),
  licenseNumber: z.string().trim().min(1).max(120),
  specialty: z.string().trim().min(1).max(120),
  yearsOfExperience: z.coerce.number().int().min(0).max(100).optional(),
  country: z.string().trim().max(120).optional(),
  cityRegion: z.string().trim().max(120).optional(),
  languagesSpoken: z.string().trim().max(240).optional(),
  bio: z.string().trim().max(1200).optional()
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
