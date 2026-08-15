import { eq, and, like, desc, sql, inArray } from 'drizzle-orm';
import * as schema from '@/db/schema';
import type { ProductModel, InventoryUnit, BookingConfirmation, BookingStatus } from '../domain/types';
import type {
  ProductRepository,
  BookingRepository,
  InventoryRepository,
} from './interfaces';
import type { BookingRequest } from '../domain/types';

type Db = {
  select: Function;
  insert: Function;
  update: Function;
  delete: Function;
};

const asProductModel = (row: typeof schema.productModels.$inferSelect): ProductModel => ({
  id: row.id,
  brand: row.brand,
  model: row.model,
  category: row.category as ProductModel['category'],
  slug: row.slug,
  dailyRateCents: row.dailyRateCents,
  weeklyRateCents: row.weeklyRateCents,
  monthlyRateCents: row.monthlyRateCents,
  depositCents: row.depositCents,
  description: row.description,
  specs: row.specs,
  defaultImageUrl: row.defaultImageUrl,
  condition: row.condition ?? 'good',
  isActive: row.isActive ?? true,
  totalQuantity: row.totalQuantity ?? 1,
  createdAt: row.createdAt ?? new Date(),
});

const asInventoryUnit = (row: typeof schema.inventoryItems.$inferSelect): InventoryUnit => ({
  id: row.id,
  productModelId: row.productModelId,
  serialNumber: row.serialNumber,
  status: row.status as InventoryUnit['status'],
  conditionNote: row.conditionNote,
  purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : null,
  purchasePriceCents: row.purchasePriceCents,
  rentalCount: row.rentalCount ?? 0,
  lastReturnedAt: row.lastReturnedAt,
  createdAt: row.createdAt ?? new Date(),
});

const asConfirmation = (row: typeof schema.bookings.$inferSelect): BookingConfirmation => ({
  id: row.id,
  bookingNumber: row.bookingNumber,
  status: row.status as BookingConfirmation['status'],
  pickupDate: row.pickupDate,
  returnDate: row.returnDate,
  totalRentalCents: row.totalRentalCents,
  depositCents: row.depositCents ?? 0,
  damageWaiverCents: row.damageWaiverCents ?? 0,
  grandTotalCents: row.grandTotalCents ?? 0,
  paymentMode: row.paymentMode as BookingConfirmation['paymentMode'],
  paymentStatus: row.paymentStatus as BookingConfirmation['paymentStatus'],
  productName: '',
  productSlug: '',
});

export class DrizzleProductRepository implements ProductRepository {
  constructor(private db: Db) {}

  async findAllActive(): Promise<ProductModel[]> {
    const rows = await this.db
      .select()
      .from(schema.productModels)
      .where(eq(schema.productModels.isActive, true));
    return rows.map(asProductModel);
  }

  async findBySlug(slug: string): Promise<ProductModel | null> {
    const rows = await this.db
      .select()
      .from(schema.productModels)
      .where(eq(schema.productModels.slug, slug))
      .limit(1);
    return rows.length ? asProductModel(rows[0]) : null;
  }

  async findById(id: string): Promise<ProductModel | null> {
    const rows = await this.db
      .select()
      .from(schema.productModels)
      .where(eq(schema.productModels.id, id))
      .limit(1);
    return rows.length ? asProductModel(rows[0]) : null;
  }

  async search(params: {
    q?: string;
    brand?: string;
    category?: schema.ProductCategory | 'all';
  }): Promise<ProductModel[]> {
    const conditions = [eq(schema.productModels.isActive, true)];
    if (params.q) conditions.push(like(schema.productModels.model, `%${params.q}%`));
    if (params.brand) conditions.push(eq(schema.productModels.brand, params.brand));
    if (params.category && params.category !== 'all') conditions.push(eq(schema.productModels.category, params.category));
    const rows = await this.db.select().from(schema.productModels).where(and(...conditions));
    return rows.map(asProductModel);
  }

  async create(data: Omit<ProductModel, 'id' | 'createdAt'>): Promise<ProductModel> {
    const rows = await this.db
      .insert(schema.productModels)
      .values(data)
      .returning();
    return asProductModel(rows[0]);
  }

  async update(id: string, data: Partial<ProductModel>): Promise<ProductModel> {
    const rows = await this.db
      .update(schema.productModels)
      .set(data)
      .where(eq(schema.productModels.id, id))
      .returning();
    return asProductModel(rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(schema.productModels).where(eq(schema.productModels.id, id));
  }
}

export class DrizzleBookingRepository implements BookingRepository {
  constructor(private db: Db) {}

  async findById(id: string): Promise<BookingConfirmation | null> {
    const rows = await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.id, id))
      .limit(1);
    return rows.length ? asConfirmation(rows[0]) : null;
  }

  async findByUserId(userId: string): Promise<BookingConfirmation[]> {
    const rows = await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.userId, userId))
      .orderBy(desc(schema.bookings.createdAt));
    return rows.map(asConfirmation);
  }

  async findByProductModelId(productModelId: string): Promise<BookingConfirmation[]> {
    const rows = await this.db
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.productModelId, productModelId));
    return rows.map(asConfirmation);
  }

  async findActiveByProductModelId(productModelId: string): Promise<BookingConfirmation[]> {
    const rows = await this.db
      .select()
      .from(schema.bookings)
      .where(
        and(
          eq(schema.bookings.productModelId, productModelId),
          inArray(schema.bookings.status, ['confirmed', 'active']),
        ),
      );
    return rows.map(asConfirmation);
  }

  async create(request: BookingRequest): Promise<BookingConfirmation> {
    const bookingNumber = `CAM-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase().slice(0, 6)}`;
    const rows = await this.db
      .insert(schema.bookings)
      .values({
        bookingNumber,
        userId: request.userId,
        productModelId: request.productModelId,
        pickupDate: request.pickupDate,
        returnDate: request.returnDate,
        paymentMode: request.paymentMode,
        status: 'pending',
        dailyRateCents: 0,
        totalRentalCents: 0,
        grandTotalCents: 0,
      })
      .returning();
    return asConfirmation(rows[0]);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<BookingConfirmation> {
    const rows = await this.db
      .update(schema.bookings)
      .set({ status })
      .where(eq(schema.bookings.id, id))
      .returning();
    return asConfirmation(rows[0]);
  }

  async getBookedRanges(
    productModelId: string,
  ): Promise<{ pickupDate: string; returnDate: string }[]> {
    const rows = await this.db
      .select({
        pickupDate: schema.bookings.pickupDate,
        returnDate: schema.bookings.returnDate,
      })
      .from(schema.bookings)
      .where(
        and(
          eq(schema.bookings.productModelId, productModelId),
          inArray(schema.bookings.status, ['confirmed', 'active', 'pending']),
        ),
      );
    return rows;
  }

  async findWithDetails(id: string): Promise<BookingConfirmation | null> {
    return this.findById(id);
  }
}

export class DrizzleInventoryRepository implements InventoryRepository {
  constructor(private db: Db) {}

  async findAvailableByProductModelId(productModelId: string): Promise<InventoryUnit[]> {
    const rows = await this.db
      .select()
      .from(schema.inventoryItems)
      .where(
        and(
          eq(schema.inventoryItems.productModelId, productModelId),
          eq(schema.inventoryItems.status, 'available'),
        ),
      );
    return rows.map(asInventoryUnit);
  }

  async countAvailableByProductModelId(productModelId: string): Promise<number> {
    const rows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.inventoryItems)
      .where(
        and(
          eq(schema.inventoryItems.productModelId, productModelId),
          eq(schema.inventoryItems.status, 'available'),
        ),
      );
    return Number(rows[0]?.count ?? 0);
  }

  async create(
    data: Omit<InventoryUnit, 'id' | 'createdAt' | 'rentalCount'>,
  ): Promise<InventoryUnit> {
    const rows = await this.db
      .insert(schema.inventoryItems)
      .values(data)
      .returning();
    return asInventoryUnit(rows[0]);
  }

  async updateStatus(id: string, status: string): Promise<InventoryUnit> {
    const rows = await this.db
      .update(schema.inventoryItems)
      .set({ status })
      .where(eq(schema.inventoryItems.id, id))
      .returning();
    return asInventoryUnit(rows[0]);
  }
}
