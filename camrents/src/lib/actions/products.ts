"use server";

import { db } from "@/db";
import { productModels } from "@/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import type { ProductCategory } from "@/db/schema";
import { productSchema, productUpdateSchema } from "../validations/products";
import { z } from "zod";

export type ProductRow = typeof productModels.$inferSelect;

export async function getAllProducts(): Promise<ProductRow[]> {
  return db
    .select()
    .from(productModels)
    .where(eq(productModels.isActive, true));
}

export async function getProductBySlug(slug: string): Promise<ProductRow | undefined> {
  const validatedSlug = z.string().trim().min(1).parse(slug);
  
  const [row] = await db
    .select()
    .from(productModels)
    .where(and(eq(productModels.slug, validatedSlug), eq(productModels.isActive, true)))
    .limit(1);
  return row;
}

export async function searchProducts(params: {
  q?: string;
  brand?: string;
  category?: string;
}): Promise<ProductRow[]> {
  const searchParamsSchema = z.object({
    q: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),
  });
  
  const validated = searchParamsSchema.parse(params);
  
  const conditions = [eq(productModels.isActive, true)];
  if (validated.category && validated.category !== "all") {
    conditions.push(eq(productModels.category, validated.category as ProductCategory));
  }
  if (validated.brand && validated.brand !== "all") {
    conditions.push(eq(productModels.brand, validated.brand));
  }
  if (validated.q) {
    conditions.push(
      or(
        ilike(productModels.model, `%${validated.q}%`),
        ilike(productModels.brand, `%${validated.q}%`)
      )!
    );
  }
  return db.select().from(productModels).where(and(...conditions));
}

export async function createProduct(data: {
  brand: string;
  model: string;
  category: ProductCategory;
  slug: string;
  dailyRateCents: number;
  weeklyRateCents?: number;
  monthlyRateCents?: number;
  depositCents: number;
  description?: string;
  specs?: Record<string, string>;
  condition?: string;
  totalQuantity?: number;
}): Promise<ProductRow> {
  const validated = productSchema.parse(data);

  const [row] = await db
    .insert(productModels)
    .values({
      brand: validated.brand,
      model: validated.model,
      category: validated.category,
      slug: validated.slug,
      dailyRateCents: validated.dailyRateCents,
      weeklyRateCents: validated.weeklyRateCents,
      monthlyRateCents: validated.monthlyRateCents,
      depositCents: validated.depositCents,
      description: validated.description,
      specs: validated.specs,
      condition: validated.condition ?? "good",
      totalQuantity: validated.totalQuantity ?? 1,
    })
    .returning();
  return row;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    brand: string;
    model: string;
    category: ProductCategory;
    slug: string;
    dailyRateCents: number;
    weeklyRateCents: number;
    monthlyRateCents: number;
    depositCents: number;
    description: string;
    specs: Record<string, string>;
    condition: string;
    totalQuantity: number;
  }>
): Promise<ProductRow> {
  const validatedId = z.string().uuid("Invalid product ID format").parse(id);
  const validated = productUpdateSchema.parse(data);

  const [row] = await db
    .update(productModels)
    .set(validated)
    .where(eq(productModels.id, validatedId))
    .returning();
  return row;
}

export async function deleteProduct(id: string): Promise<void> {
  const validatedId = z.string().uuid("Invalid product ID format").parse(id);

  await db
    .update(productModels)
    .set({ isActive: false })
    .where(eq(productModels.id, validatedId));
}
