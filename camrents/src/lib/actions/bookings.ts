"use server";

import { db } from "@/db";
import { bookings, productModels, inventoryItems, authUser } from "@/db/schema";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import type { BookingStatus, PaymentMode } from "@/db/schema";
import { calcDays } from "@/lib/format";
import { availabilityCheckSchema, checkoutSchema } from "../validations/bookings";
import { z } from "zod";

export type BookingRow = typeof bookings.$inferSelect;

export interface PriceBreakdown {
  dailyRateCents: number;
  days: number;
  rentalCents: number;
  waiverCents: number;
  totalCents: number;
  depositCents: number;
}

/**
 * Generates a randomized unique booking reference number.
 */
function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CAM-${year}-${seq}`;
}

/**
 * Calculates rental and waiver pricing breakdown based on dates and product model.
 * Inputs are validated before executing the database query.
 */
export async function calculatePrice(params: {
  productId: string;
  pickupDate: string;
  returnDate: string;
  hasWaiver?: boolean;
}): Promise<PriceBreakdown> {
  // WHAT: Validate pricing input arguments using Zod.
  // WHY: Protect against incorrect or malicious date formats and malformed product IDs.
  const validated = z.object({
    productId: z.string().uuid("Invalid product ID format"),
    pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pickup date must be in YYYY-MM-DD format"),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Return date must be in YYYY-MM-DD format"),
    hasWaiver: z.boolean().optional(),
  }).parse(params);

  const [product] = await db
    .select()
    .from(productModels)
    .where(eq(productModels.id, validated.productId))
    .limit(1);

  if (!product) throw new Error("Product not found");

  const days = calcDays(validated.pickupDate, validated.returnDate);
  const rate = product.dailyRateCents;
  const rentalCents = rate * days;
  const waiverCents = validated.hasWaiver ? Math.round(rentalCents * 0.1) : 0;

  return {
    dailyRateCents: rate,
    days,
    rentalCents,
    waiverCents,
    totalCents: rentalCents + waiverCents,
    depositCents: product.depositCents,
  };
}

/**
 * Checks physical inventory availability for a model ID during a date range.
 * Inputs are validated via availabilityCheckSchema before querying database.
 */
export async function checkAvailability(params: {
  productModelId: string;
  pickupDate: string;
  returnDate: string;
}): Promise<{ available: boolean; availableUnits: number; totalUnits: number }> {
  // WHAT: Validate date ranges and model ID formats.
  // WHY: Avoid running database checks for overlapping bookings with invalid data.
  const validated = availabilityCheckSchema.parse(params);

  const overlapping = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.productModelId, validated.productModelId),
        inArray(bookings.status, ["confirmed", "active"] as BookingStatus[])
      )
    );

  const totalUnitsResult = await db
    .select()
    .from(inventoryItems)
    .where(
      and(
        eq(inventoryItems.productModelId, validated.productModelId),
        eq(inventoryItems.status, "available")
      )
    );

  const totalUnits = totalUnitsResult.length;
  const booked = overlapping.length;
  const availableUnits = Math.max(0, totalUnits - booked);

  return {
    available: availableUnits > 0,
    availableUnits,
    totalUnits,
  };
}

/**
 * Creates a new booking record inside the database after full schema validation.
 */
export async function createBooking(data: {
  userId: string;
  productModelId: string;
  pickupDate: string;
  returnDate: string;
  paymentMode: PaymentMode;
  hasWaiver?: boolean;
}): Promise<BookingRow> {
  // WHAT: Validate incoming request parameters using checkoutSchema and UUID check.
  // WHY: Prevent dirty write injections and verify user references.
  const validatedUserId = z.string().min(1, "Invalid user ID").parse(data.userId);
  const validated = checkoutSchema.parse({
    productModelId: data.productModelId,
    pickupDate: data.pickupDate,
    returnDate: data.returnDate,
    paymentMode: data.paymentMode,
    hasWaiver: data.hasWaiver,
  });

  // Verify customer is not suspended
  const [userRecord] = await db
    .select({ status: authUser.status })
    .from(authUser)
    .where(eq(authUser.id, validatedUserId))
    .limit(1);

  if (userRecord && userRecord.status === "suspended") {
    throw new Error("Your account has been suspended by administration. Please contact support.");
  }

  const price = await calculatePrice({
    productId: validated.productModelId,
    pickupDate: validated.pickupDate,
    returnDate: validated.returnDate,
    hasWaiver: validated.hasWaiver,
  });

  const [product] = await db
    .select()
    .from(productModels)
    .where(eq(productModels.id, validated.productModelId))
    .limit(1);

  if (!product) throw new Error("Product not found");

  const [row] = await db
    .insert(bookings)
    .values({
      bookingNumber: generateBookingNumber(),
      userId: validatedUserId,
      productModelId: validated.productModelId,
      status: validated.paymentMode === "online" ? "pending" : "confirmed",
      paymentMode: validated.paymentMode,
      paymentStatus: "pending",
      pickupDate: validated.pickupDate,
      returnDate: validated.returnDate,
      dailyRateCents: price.dailyRateCents,
      totalRentalCents: price.rentalCents,
      depositCents: price.depositCents,
      damageWaiverCents: price.waiverCents,
      grandTotalCents: price.totalCents,
      paidAtStore: validated.paymentMode === "offline",
    })
    .returning();

  return row as BookingRow;
}

/**
 * Retrieves a booking record by ID with validation.
 */
export async function getBookingById(id: string): Promise<BookingRow | undefined> {
  const validatedId = z.string().uuid("Invalid booking ID format").parse(id);

  const [row] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, validatedId))
    .limit(1);
  return row as BookingRow | undefined;
}

/**
 * Retrieves bookings associated with a specific user.
 */
export async function getUserBookings(userId: string): Promise<BookingRow[]> {
  const validatedUserId = z.string().min(1, "Invalid user ID").parse(userId);

  return db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, validatedUserId))
    .orderBy(bookings.createdAt)
    .then((rows: any) => rows as BookingRow[]);
}

/**
 * Admin action to retrieve bookings with optional filters.
 */
export async function adminGetBookings(filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  // WHAT: Validate filter options for search actions.
  // WHY: Mitigate SQL injection risks on input parameters.
  const filtersSchema = z.object({
    status: z.string().optional(),
    dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid dateFrom format").optional().or(z.literal("")),
    dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid dateTo format").optional().or(z.literal("")),
  }).optional();

  const validatedFilters = filtersSchema.parse(filters);

  const conditions = [];
  if (validatedFilters?.status && validatedFilters.status !== "all") {
    conditions.push(eq(bookings.status, validatedFilters.status as BookingStatus));
  }
  if (validatedFilters?.dateFrom) {
    conditions.push(gte(bookings.pickupDate, validatedFilters.dateFrom));
  }
  if (validatedFilters?.dateTo) {
    conditions.push(lte(bookings.returnDate, validatedFilters.dateTo));
  }

  const query = db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      status: bookings.status,
      pickupDate: bookings.pickupDate,
      returnDate: bookings.returnDate,
      totalRentalCents: bookings.totalRentalCents,
      grandTotalCents: bookings.grandTotalCents,
      brand: productModels.brand,
      model: productModels.model,
      customerName: authUser.name,
      customerPhone: authUser.phone,
    })
    .from(bookings)
    .innerJoin(productModels, eq(bookings.productModelId, productModels.id))
    .innerJoin(authUser, eq(bookings.userId, authUser.id));

  const filteredQuery = conditions.length > 0
    ? query.where(and(...conditions))
    : query;

  const rows = await filteredQuery.orderBy(bookings.createdAt);

  return rows.map((r: any) => ({
    id: r.id,
    bookingNumber: r.bookingNumber,
    status: r.status,
    pickupDate: r.pickupDate,
    returnDate: r.returnDate,
    totalRentalCents: r.totalRentalCents,
    grandTotalCents: r.grandTotalCents,
    productName: `${r.brand} ${r.model}`,
    customerName: r.customerName,
    customerPhone: r.customerPhone,
  }));
}

/**
 * Updates status of a booking with validation.
 */
export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<BookingRow> {
  const validatedId = z.string().uuid("Invalid booking ID format").parse(id);
  const validatedStatus = z.enum([
    "pending",
    "confirmed",
    "active",
    "returned",
    "cancelled",
    "no_show"
  ] as const).parse(status);

  const [row] = await db
    .update(bookings)
    .set({ status: validatedStatus, updatedAt: new Date() })
    .where(eq(bookings.id, validatedId))
    .returning();
  return row as BookingRow;
}

/**
 * Fetches bookings for a user, returning product details for displaying to customer.
 */
export async function getUserBookingsWithDetails(userId: string) {
  const validatedUserId = z.string().min(1, "Invalid user ID").parse(userId);

  const rows = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      pickupDate: bookings.pickupDate,
      returnDate: bookings.returnDate,
      status: bookings.status,
      totalRentalCents: bookings.totalRentalCents,
      grandTotalCents: bookings.grandTotalCents,
      brand: productModels.brand,
      model: productModels.model,
    })
    .from(bookings)
    .innerJoin(productModels, eq(bookings.productModelId, productModels.id))
    .where(eq(bookings.userId, validatedUserId))
    .orderBy(bookings.createdAt);

  return rows.map((r: any) => ({
    id: r.id,
    bookingNumber: r.bookingNumber,
    pickupDate: r.pickupDate,
    returnDate: r.returnDate,
    status: r.status,
    totalRentalCents: r.totalRentalCents,
    grandTotalCents: r.grandTotalCents,
    productName: `${r.brand} ${r.model}`,
  }));
}

/**
 * Returns all booked date ranges for a product model. Used by the availability calendar.
 */
export async function getBookedRanges(productModelId: string): Promise<{ pickupDate: string; returnDate: string }[]> {
  const validatedId = z.string().uuid("Invalid product model ID format").parse(productModelId);

  const activeBookings = await db
    .select({ pickupDate: bookings.pickupDate, returnDate: bookings.returnDate })
    .from(bookings)
    .where(
      and(
        eq(bookings.productModelId, validatedId),
        inArray(bookings.status, ["confirmed", "active"] as BookingStatus[])
      )
    );

  return activeBookings.map((b: any) => ({
    pickupDate: b.pickupDate,
    returnDate: b.returnDate,
  }));
}

/**
 * Fetches detail of a single booking including client and product model data.
 */
export async function getBookingWithDetails(id: string) {
  const validatedId = z.string().uuid("Invalid booking ID format").parse(id);

  const [row] = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      userId: bookings.userId,
      status: bookings.status,
      pickupDate: bookings.pickupDate,
      returnDate: bookings.returnDate,
      totalRentalCents: bookings.totalRentalCents,
      depositCents: bookings.depositCents,
      damageWaiverCents: bookings.damageWaiverCents,
      grandTotalCents: bookings.grandTotalCents,
      paymentMode: bookings.paymentMode,
      paymentStatus: bookings.paymentStatus,
      paidAtStore: bookings.paidAtStore,
      depositCollected: bookings.depositCollected,
      depositReturned: bookings.depositReturned,
      brand: productModels.brand,
      model: productModels.model,
      slug: productModels.slug,
      customerName: authUser.name,
      customerPhone: authUser.phone,
    })
    .from(bookings)
    .innerJoin(productModels, eq(bookings.productModelId, productModels.id))
    .innerJoin(authUser, eq(bookings.userId, authUser.id))
    .where(eq(bookings.id, validatedId))
    .limit(1);

  if (!row) return undefined;

  return {
    ...row,
    productName: `${row.brand} ${row.model}`,
  };
}

