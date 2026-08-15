import { z } from "zod";

export const productSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  category: z.enum(["camera_body", "lens", "accessory", "kit"]),
  slug: z.string().min(1, "Slug is required"),
  dailyRateCents: z.number().int().positive("Daily rate must be positive"),
  weeklyRateCents: z.number().int().positive().optional(),
  monthlyRateCents: z.number().int().positive().optional(),
  depositCents: z.number().int().nonnegative("Deposit must be non-negative"),
  description: z.string().optional(),
  specs: z.record(z.string(), z.string()).optional(),
  condition: z.string().optional().default("good"),
  totalQuantity: z.number().int().positive().optional().default(1),
});

export const productUpdateSchema = productSchema.partial();
