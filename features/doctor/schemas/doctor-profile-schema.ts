import { z } from "zod";

export const doctorProfileSchema = z.object({
  fullName: z.string().trim().min(3).max(180),
  phone: z.string().trim().max(60).optional(),
  country: z.string().trim().max(120).optional(),
  cityRegion: z.string().trim().max(120).optional(),
  licenseNumber: z.string().trim().max(120).optional(),
  specialty: z.string().trim().max(120).optional(),
  languagesSpoken: z.string().trim().max(240).optional(),
  yearsOfExperience: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.coerce.number().int().min(0).max(80).optional()
  ),
  bio: z.string().trim().max(1200).optional()
});
