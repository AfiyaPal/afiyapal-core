import { z } from "zod";

export const usernameRule = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters.")
  .max(50, "Username must be 50 characters or fewer.")
  .refine((value) => !value.includes("@"), "Username cannot contain an email address. Use a display name instead.")
  .transform((value) => value.replace(/\s+/g, " ").trim());
