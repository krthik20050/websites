"use server";

import { db } from "@/db";
import { bookings, productModels, authUser } from "@/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import type { BookingStatus } from "@/db/schema";
import { z } from "zod";

const phoneSchema = z.string().trim().regex(/^[6-9]\d{9}$/, "Phone must be a valid 10-digit number");

export interface DashboardStats {
  activeRentals: number;
  overdueItems: number;
  todayPickups: number;
  todayReturns: number;
}

export type CustomerRow = typeof authUser.$inferSelect;

/**
 * Retrieves dashboard performance statistics.
 */
export async function adminGetDashboard(): Promise<DashboardStats> {
  const today = new Date().toISOString().split("T")[0];

  const [activeResult, overdueResult, pickupResult, returnResult] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.status, "active")),
    db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(eq(bookings.status, "active"), lte(bookings.returnDate, today))),
    db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(eq(bookings.pickupDate, today), eq(bookings.status, "confirmed"))),
    db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(eq(bookings.returnDate, today), eq(bookings.status, "active"))),
  ]);

  return {
    activeRentals: activeResult[0]?.count ?? 0,
    overdueItems: overdueResult[0]?.count ?? 0,
    todayPickups: pickupResult[0]?.count ?? 0,
    todayReturns: returnResult[0]?.count ?? 0,
  };
}

/**
 * Retrieves lists of customers with search filters.
 */
export async function adminGetCustomers(search?: string): Promise<CustomerRow[]> {
  const validatedSearch = z.string().optional().parse(search);

  if (validatedSearch) {
    return db
      .select()
      .from(authUser)
      .where(
        and(
          eq(authUser.role, "customer"),
          sql`(${authUser.name} ILIKE ${`%${validatedSearch}%`} OR ${authUser.phone} LIKE ${`%${validatedSearch}%`})`
        )
      );
  }
  return db
    .select()
    .from(authUser)
    .where(eq(authUser.role, "customer"));
}

/**
 * Handles creation of a offline walk-in booking by staff.
 */
export async function adminCreateWalkInBooking(data: {
  productModelId: string;
  customerName: string;
  customerPhone: string;
  pickupDate: string;
  returnDate: string;
  depositCollected?: boolean;
}): Promise<{ id: string; bookingNumber: string }> {
  // WHAT: Validate Walk-In data inputs.
  // WHY: Protect against incorrect date boundaries or invalid phone entries.
  const walkInBookingSchema = z.object({
    productModelId: z.string().uuid("Invalid product model ID format"),
    customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
    customerPhone: phoneSchema,
    pickupDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pickup date must be in YYYY-MM-DD format"),
    returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Return date must be in YYYY-MM-DD format"),
    depositCollected: z.boolean().optional(),
  }).refine((val) => {
    const pickup = new Date(val.pickupDate);
    const returnD = new Date(val.returnDate);
    return returnD >= pickup;
  }, {
    message: "Return date must be equal to or after pickup date",
    path: ["returnDate"],
  });

  const validated = walkInBookingSchema.parse(data);

  // Find or create customer
  let [user] = await db
    .select()
    .from(authUser)
    .where(eq(authUser.phone, validated.customerPhone))
    .limit(1);

  if (!user) {
    [user] = await db
      .insert(authUser)
      .values({
        phone: validated.customerPhone,
        name: validated.customerName,
        role: "customer",
      })
      .returning();
  }

  const [product] = await db
    .select()
    .from(productModels)
    .where(eq(productModels.id, validated.productModelId))
    .limit(1);

  if (!product) throw new Error("Product not found");

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(validated.returnDate).getTime() - new Date(validated.pickupDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );
  const totalRental = product.dailyRateCents * days;
  const year = new Date().getFullYear();
  const seq = Math.random().toString(36).substring(2, 6).toUpperCase();

  const [booking] = await db
    .insert(bookings)
    .values({
      bookingNumber: `CAM-${year}-${seq}`,
      userId: user.id,
      productModelId: validated.productModelId,
      status: "confirmed",
      paymentMode: "offline",
      paymentStatus: "pending",
      pickupDate: validated.pickupDate,
      returnDate: validated.returnDate,
      dailyRateCents: product.dailyRateCents,
      totalRentalCents: totalRental,
      depositCents: product.depositCents,
      grandTotalCents: totalRental,
      paidAtStore: true,
      depositCollected: validated.depositCollected ?? false,
    })
    .returning();

  return { id: booking.id, bookingNumber: booking.bookingNumber };
}

/**
 * Processes inventory returns when products are brought back.
 */
export async function adminProcessReturn(data: {
  bookingId: string;
  condition: "good" | "minor" | "major";
  damageNotes?: string;
  depositDeduction?: number;
}): Promise<void> {
  const processReturnSchema = z.object({
    bookingId: z.string().uuid("Invalid booking ID format"),
    condition: z.enum(["good", "minor", "major"]),
    damageNotes: z.string().optional().or(z.literal("")),
    depositDeduction: z.number().optional(),
  });

  const validated = processReturnSchema.parse(data);

  await db
    .update(bookings)
    .set({
      status: "returned",
      damageNotes: validated.damageNotes || null,
      depositReturned: true,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, validated.bookingId));
}

/**
 * Marks booking as no show when customer fails to pick up.
 */
export async function adminMarkNoShow(id: string): Promise<void> {
  const validatedId = z.string().uuid("Invalid booking ID format").parse(id);

  await db
    .update(bookings)
    .set({ status: "no_show", updatedAt: new Date() })
    .where(eq(bookings.id, validatedId));
}

/**
 * Cancels a booking.
 */
export async function adminCancelBooking(id: string): Promise<void> {
  const validatedId = z.string().uuid("Invalid booking ID format").parse(id);

  await db
    .update(bookings)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookings.id, validatedId));
}

/**
 * Fetches today's pickup and return schedule for the admin timeline.
 */
export async function adminGetTodaySchedule() {
  const today = new Date().toISOString().split("T")[0];

  const [pickups, returns] = await Promise.all([
    db
      .select({
        id: bookings.id,
        bookingNumber: bookings.bookingNumber,
        status: bookings.status,
        customerName: authUser.name,
        customerPhone: authUser.phone,
        brand: productModels.brand,
        model: productModels.model,
      })
      .from(bookings)
      .innerJoin(authUser, eq(bookings.userId, authUser.id))
      .innerJoin(productModels, eq(bookings.productModelId, productModels.id))
      .where(and(eq(bookings.pickupDate, today), eq(bookings.status, "confirmed"))),
    db
      .select({
        id: bookings.id,
        bookingNumber: bookings.bookingNumber,
        status: bookings.status,
        customerName: authUser.name,
        customerPhone: authUser.phone,
        brand: productModels.brand,
        model: productModels.model,
      })
      .from(bookings)
      .innerJoin(authUser, eq(bookings.userId, authUser.id))
      .innerJoin(productModels, eq(bookings.productModelId, productModels.id))
      .where(and(eq(bookings.returnDate, today), eq(bookings.status, "active"))),
  ]);

  return [
    ...pickups.map((p: any) => ({ ...p, type: "pickup" as const })),
    ...returns.map((r: any) => ({ ...r, type: "return" as const })),
  ];
}

/**
 * Retrieves detailed customer information including their booking history.
 */
export async function adminGetCustomerDetails(customerId: string) {
  const validatedId = z.string().parse(customerId);

  const [user] = await db
    .select()
    .from(authUser)
    .where(eq(authUser.id, validatedId))
    .limit(1);

  if (!user) throw new Error("Customer not found");

  const userBookings = await db
    .select({
      id: bookings.id,
      bookingNumber: bookings.bookingNumber,
      status: bookings.status,
      pickupDate: bookings.pickupDate,
      returnDate: bookings.returnDate,
      grandTotalCents: bookings.grandTotalCents,
      brand: productModels.brand,
      model: productModels.model,
    })
    .from(bookings)
    .innerJoin(productModels, eq(bookings.productModelId, productModels.id))
    .where(eq(bookings.userId, validatedId))
    .orderBy(bookings.createdAt);

  return {
    customer: user,
    bookings: userBookings,
  };
}

/**
 * Retrieves general CRM stats for all customers.
 */
export async function adminGetCrmStats() {
  const users = await db
    .select()
    .from(authUser)
    .where(eq(authUser.role, "customer"));

  const totalCustomers = users.length;
  const totalSpent = users.reduce((sum: number, u: typeof authUser.$inferSelect) => sum + (u.totalSpentCents ?? 0), 0);
  const avgSpent = totalCustomers > 0 ? Math.round(totalSpent / totalCustomers) : 0;
  
  // Sort by spent to get top customers
  const topCustomers = [...users]
    .sort((a: typeof authUser.$inferSelect, b: typeof authUser.$inferSelect) => (b.totalSpentCents ?? 0) - (a.totalSpentCents ?? 0))
    .slice(0, 3);

  // Calculate repeat renter rate
  const repeatCount = users.filter((c: typeof authUser.$inferSelect) => (c.rentalCount ?? 0) > 1).length;
  const repeatRate = totalCustomers > 0 ? Math.round((repeatCount / totalCustomers) * 100) : 0;

  // Fetch active bookings count
  const activeBookings = await db
    .select({ userId: bookings.userId })
    .from(bookings)
    .where(eq(bookings.status, "active"));
  
  const activeRentersCount = new Set(activeBookings.map((b: { userId: string | null }) => b.userId)).size;

  return {
    totalCustomers,
    totalSpent,
    avgSpent,
    topCustomers,
    activeRentersCount,
    repeatRenterRate: repeatRate,
  };
}

/**
 * Updates a customer's status (active vs suspended).
 */
export async function adminUpdateCustomerStatus(
  customerId: string,
  status: "active" | "suspended"
): Promise<void> {
  const validatedId = z.string().parse(customerId);
  const validatedStatus = z.enum(["active", "suspended"]).parse(status);

  await db
    .update(authUser)
    .set({ status: validatedStatus, updatedAt: new Date() })
    .where(eq(authUser.id, validatedId));
}

/**
 * Updates internal admin/staff notes for a customer.
 */
export async function adminUpdateCustomerNotes(
  customerId: string,
  notes: string
): Promise<void> {
  const validatedId = z.string().parse(customerId);
  const validatedNotes = z.string().parse(notes);

  await db
    .update(authUser)
    .set({ adminNotes: validatedNotes, updatedAt: new Date() })
    .where(eq(authUser.id, validatedId));
}




