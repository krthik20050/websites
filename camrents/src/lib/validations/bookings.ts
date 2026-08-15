import { z } from "zod";

export const availabilityCheckSchema = z.object({
  productModelId: z.string().min(1, "Product model ID is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  returnDate: z.string().min(1, "Return date is required"),
});

export const checkoutSchema = z.object({
  productModelId: z.string().min(1, "Product model ID is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  returnDate: z.string().min(1, "Return date is required"),
  paymentMode: z.enum(["online", "offline"]),
  hasWaiver: z.boolean().optional().default(false),
});
