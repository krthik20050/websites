import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
  primaryKey,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/* ── Better Auth tables ──────────────────────────────────────── */
export const authUser = pgTable("auth_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  role: text("role").default("customer"),
  phone: text("phone").unique(),
  razorpayCustomerId: text("razorpay_customer_id"),
  idProofUrl: text("id_proof_url"),
  rentalCount: integer("rental_count").default(0),
  totalSpentCents: integer("total_spent_cents").default(0),
  status: text("status").default("active"),
  adminNotes: text("admin_notes"),
});

export const authSession = pgTable("auth_session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" }),
});

export const authAccount = pgTable("auth_account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const authVerification = pgTable("auth_verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* ── Type unions for status fields ──────────────────────────── */
export type ProductCategory = "camera_body" | "lens" | "accessory" | "kit";
export type InventoryStatus = "available" | "rented" | "maintenance" | "retired" | "lost";
export type BookingStatus = "pending" | "confirmed" | "active" | "returned" | "cancelled" | "no_show";
export type PaymentMode = "online" | "offline";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
export type UserRole = "customer" | "admin";
export type MaintenanceType = "inspection" | "cleaning" | "repair" | "damage";

/* ── product_models ─────────────────────────────────────────── */
export const productModels = pgTable("product_models", {
  id: uuid("id").defaultRandom().primaryKey(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  category: text("category").$type<ProductCategory>().notNull(),
  slug: text("slug").unique().notNull(),
  dailyRateCents: integer("daily_rate_cents").notNull(),
  weeklyRateCents: integer("weekly_rate_cents"),
  monthlyRateCents: integer("monthly_rate_cents"),
  depositCents: integer("deposit_cents").notNull(),
  description: text("description"),
  specs: jsonb("specs").$type<Record<string, string>>(),
  defaultImageUrl: text("default_image_url"),
  condition: text("condition").default("good"),
  isActive: boolean("is_active").default(true),
  totalQuantity: integer("total_quantity").default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  activeIdx: index("idx_product_active").on(table.isActive).where(sql`${table.isActive} = true`),
  brandIdx: index("idx_product_brand").on(table.brand),
  categoryIdx: index("idx_product_category").on(table.category),
  slugIdx: uniqueIndex("idx_product_slug").on(table.slug),
}));

/* ── inventory_items ────────────────────────────────────────── */
export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  productModelId: uuid("product_model_id")
    .references(() => productModels.id)
    .notNull(),
  serialNumber: text("serial_number").unique().notNull(),
  status: text("status").$type<InventoryStatus>().default("available"),
  conditionNote: text("condition_note"),
  purchaseDate: date("purchase_date"),
  purchasePriceCents: integer("purchase_price_cents"),
  rentalCount: integer("rental_count").default(0),
  lastReturnedAt: timestamp("last_returned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  modelIdx: index("idx_inventory_model").on(table.productModelId),
  statusIdx: index("idx_inventory_status").on(table.status),
}));

/* ── bookings ───────────────────────────────────────────────── */
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingNumber: text("booking_number").unique().notNull(),
  userId: text("user_id")
    .references(() => authUser.id)
    .notNull(),
  productModelId: uuid("product_model_id")
    .references(() => productModels.id)
    .notNull(),
  status: text("status").$type<BookingStatus>().default("pending"),
  paymentMode: text("payment_mode").$type<PaymentMode>(),
  paymentStatus: text("payment_status").$type<PaymentStatus>().default("pending"),
  pickupDate: date("pickup_date").notNull(),
  returnDate: date("return_date").notNull(),
  operationalStart: timestamp("operational_start", { withTimezone: true }),
  operationalEnd: timestamp("operational_end", { withTimezone: true }),
  rentalDates: text("rental_dates"),
  quantity: integer("quantity").default(1),
  dailyRateCents: integer("daily_rate_cents").notNull(),
  totalRentalCents: integer("total_rental_cents").notNull(),
  depositCents: integer("deposit_cents"),
  lateFeeCents: integer("late_fee_cents").default(0),
  damageWaiverCents: integer("damage_waiver_cents").default(0),
  grandTotalCents: integer("grand_total_cents"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  paidAtStore: boolean("paid_at_store").default(false),
  depositCollected: boolean("deposit_collected").default(false),
  depositReturned: boolean("deposit_returned").default(false),
  damageNotes: text("damage_notes"),
  inspectionPhotos: text("inspection_photos").array(),
  noShowMarkedAt: timestamp("no_show_marked_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  // ponytail: GIST exclusion constraint for double-booking prevention
  // Applied via raw SQL in migration:
  //   ALTER TABLE bookings ADD CONSTRAINT no_overlap
  //   EXCLUDE USING GIST (product_model_id WITH =, rental_dates WITH &&)
  // upgrade: add btree_gist extension if not available, then run the ALTER TABLE above

  datesIdx: index("idx_bookings_dates").on(table.rentalDates),
  userIdx: index("idx_bookings_user").on(table.userId),
  productIdx: index("idx_bookings_product").on(table.productModelId),
  statusIdx: index("idx_bookings_status").on(table.status),
  // ponytail: partial index for active bookings — most common query filter
  activeStatusIdx: index("idx_bookings_active_status")
    .on(table.status)
    .where(sql`${table.status} IN ('confirmed', 'active')`),
  // ponytail: FK indexes — productModelId indexed above, userId indexed above
}));

/* ── booking_items ──────────────────────────────────────────── */
export const bookingItems = pgTable("booking_items", {
  bookingId: uuid("booking_id")
    .references(() => bookings.id)
    .notNull(),
  itemId: uuid("item_id")
    .references(() => inventoryItems.id)
    .notNull(),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.bookingId, table.itemId] }),
}));

/* ── damage_waivers ─────────────────────────────────────────── */
export const damageWaivers = pgTable("damage_waivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .references(() => bookings.id)
    .unique()
    .notNull(),
  feeCents: integer("fee_cents").notNull(),
  liabilityCapCents: integer("liability_cap_cents"),
  purchasedAt: timestamp("purchased_at", { withTimezone: true }).defaultNow(),
});

/* ── maintenance_logs ───────────────────────────────────────── */
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  itemId: uuid("item_id")
    .references(() => inventoryItems.id)
    .notNull(),
  bookingId: uuid("booking_id").references(() => bookings.id),
  type: text("type").$type<MaintenanceType>().notNull(),
  description: text("description"),
  costCents: integer("cost_cents"),
  imageUrls: text("image_urls").array(),
  loggedBy: text("logged_by").references(() => authUser.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
  itemIdx: index("idx_maintenance_item").on(table.itemId),
}));

/* ── reviews ────────────────────────────────────────────────── */
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .references(() => bookings.id)
    .unique()
    .notNull(),
  userId: text("user_id")
    .references(() => authUser.id)
    .notNull(),
  productModelId: uuid("product_model_id")
    .references(() => productModels.id)
    .notNull(),
  rating: integer("rating").notNull(),
  body: text("body"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* ── late_fee_rules ─────────────────────────────────────────── */
export const lateFeeRules = pgTable("late_fee_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  dailyRateCents: integer("daily_rate_cents").notNull(),
  graceHours: integer("grace_hours").default(4),
  maxFeeCents: integer("max_fee_cents"),
  isActive: boolean("is_active").default(true),
});
