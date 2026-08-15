import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DrizzleProductRepository,
  DrizzleBookingRepository,
  DrizzleInventoryRepository,
} from './implementation';
import type { BookingRequest } from '../domain/types';

function createDb() {
  let currentData: any[] = [];

  const terminal = new Proxy({} as any, {
    get(_, prop) {
      if (prop === 'then') return (resolve: any) => Promise.resolve(currentData).then(resolve);
      return (...args: any[]) => terminal;
    },
  });

  const db: any = {};
  for (const m of ['select', 'from', 'where', 'limit', 'orderBy', 'insert', 'values', 'update', 'set', 'delete', 'returning']) {
    db[m] = vi.fn(() => terminal);
  }

  return { db, setData: (d: any[]) => { currentData = d; } };
}

const makeProductRow = (overrides = {}) => ({
  id: '123',
  brand: 'Sony',
  model: 'A7IV',
  category: 'camera_body',
  slug: 'sony-a7iv',
  dailyRateCents: 500000,
  weeklyRateCents: 3000000,
  monthlyRateCents: 10000000,
  depositCents: 1000000,
  description: 'Great camera',
  specs: { mount: 'E-mount' },
  defaultImageUrl: null,
  condition: 'good',
  isActive: true,
  totalQuantity: 2,
  createdAt: new Date('2026-01-01'),
  ...overrides,
});

const makeBookingRow = (overrides = {}) => ({
  id: 'b1',
  bookingNumber: 'CAM-2026-ABCD',
  userId: 'u1',
  productModelId: 'p1',
  status: 'confirmed',
  pickupDate: '2026-07-01',
  returnDate: '2026-07-05',
  dailyRateCents: 500000,
  totalRentalCents: 2400000,
  depositCents: 1000000,
  damageWaiverCents: 240000,
  grandTotalCents: 2640000,
  paymentMode: 'online',
  paymentStatus: 'pending',
  createdAt: new Date('2026-06-01'),
  ...overrides,
});

const makeInventoryRow = (overrides = {}) => ({
  id: 'i1',
  productModelId: 'p1',
  serialNumber: 'SN001',
  status: 'available',
  conditionNote: null,
  purchaseDate: null,
  purchasePriceCents: null,
  rentalCount: 0,
  lastReturnedAt: null,
  createdAt: new Date('2026-01-01'),
  ...overrides,
});

describe('DrizzleProductRepository', () => {
  let { db, setData } = createDb();

  beforeEach(() => {
    const r = createDb();
    db = r.db;
    setData = r.setData;
  });

  it('findAllActive returns active products', async () => {
    const rows = [makeProductRow()];
    setData(rows);
    const repo = new DrizzleProductRepository(db);

    const result = await repo.findAllActive();

    expect(result).toHaveLength(1);
    expect(result[0].brand).toBe('Sony');
    expect(db.select).toHaveBeenCalled();
  });

  it('findBySlug returns product or null', async () => {
    const rows = [makeProductRow()];
    setData(rows);
    const repo = new DrizzleProductRepository(db);

    const found = await repo.findBySlug('sony-a7iv');
    expect(found?.slug).toBe('sony-a7iv');

    setData([]);
    const notFound = await repo.findBySlug('nonexistent');
    expect(notFound).toBeNull();
  });

  it('findById returns product or null', async () => {
    const rows = [makeProductRow()];
    setData(rows);
    const repo = new DrizzleProductRepository(db);

    const found = await repo.findById('123');
    expect(found?.id).toBe('123');

    setData([]);
    const notFound = await repo.findById('nonexistent');
    expect(notFound).toBeNull();
  });

  it('search filters by query, brand, category', async () => {
    const rows = [makeProductRow(), makeProductRow({ brand: 'Canon', model: 'R5', slug: 'canon-r5' })];
    setData(rows);
    const repo = new DrizzleProductRepository(db);

    const all = await repo.search({});
    expect(all).toHaveLength(2);

    setData([makeProductRow()]);
    const byBrand = await repo.search({ brand: 'Sony' });
    expect(byBrand).toHaveLength(1);

    setData([makeProductRow()]);
    const byCategory = await repo.search({ category: 'camera_body' });
    expect(byCategory).toHaveLength(1);

    setData([]);
    const byCategoryAll = await repo.search({ category: 'all' });
    expect(byCategoryAll).toHaveLength(0);
  });

  it('create inserts and returns product', async () => {
    const row = makeProductRow();
    setData([row]);
    const repo = new DrizzleProductRepository(db);

    const result = await repo.create({
      brand: 'Sony',
      model: 'A7IV',
      category: 'camera_body',
      slug: 'sony-a7iv',
      dailyRateCents: 500000,
      weeklyRateCents: 3000000,
      monthlyRateCents: 10000000,
      depositCents: 1000000,
      description: 'Great camera',
      specs: { mount: 'E-mount' },
      defaultImageUrl: null,
      condition: 'good',
      isActive: true,
      totalQuantity: 2,
    });

    expect(result.id).toBe('123');
    expect(db.insert).toHaveBeenCalled();
  });

  it('update modifies and returns product', async () => {
    const row = makeProductRow({ model: 'A7V' });
    setData([row]);
    const repo = new DrizzleProductRepository(db);

    const result = await repo.update('123', { model: 'A7V' });
    expect(result.model).toBe('A7V');
  });

  it('delete removes product', async () => {
    const repo = new DrizzleProductRepository(db);

    await repo.delete('123');
    expect(db.delete).toHaveBeenCalled();
  });
});

describe('DrizzleBookingRepository', () => {
  let { db, setData } = createDb();

  beforeEach(() => {
    const r = createDb();
    db = r.db;
    setData = r.setData;
  });

  it('findById returns booking or null', async () => {
    setData([makeBookingRow()]);
    const repo = new DrizzleBookingRepository(db);

    const found = await repo.findById('b1');
    expect(found?.bookingNumber).toBe('CAM-2026-ABCD');

    setData([]);
    const notFound = await repo.findById('nonexistent');
    expect(notFound).toBeNull();
  });

  it('findByUserId returns user bookings', async () => {
    const rows = [makeBookingRow(), makeBookingRow({ id: 'b2', bookingNumber: 'CAM-2026-EFGH' })];
    setData(rows);
    const repo = new DrizzleBookingRepository(db);

    const result = await repo.findByUserId('u1');
    expect(result).toHaveLength(2);
  });

  it('findByProductModelId returns model bookings', async () => {
    setData([makeBookingRow()]);
    const repo = new DrizzleBookingRepository(db);

    const result = await repo.findByProductModelId('p1');
    expect(result).toHaveLength(1);
  });

  it('findActiveByProductModelId filters active bookings', async () => {
    setData([makeBookingRow()]);
    const repo = new DrizzleBookingRepository(db);

    const result = await repo.findActiveByProductModelId('p1');
    expect(result).toHaveLength(1);
  });

  it('create inserts booking with generated number', async () => {
    setData([makeBookingRow()]);
    const repo = new DrizzleBookingRepository(db);

    const request: BookingRequest = {
      userId: 'u1',
      productModelId: 'p1',
      pickupDate: '2026-07-01',
      returnDate: '2026-07-05',
      paymentMode: 'online',
    };

    const result = await repo.create(request);
    expect(result.bookingNumber).toMatch(/^CAM-2026-/);
    expect(db.insert).toHaveBeenCalled();
  });

  it('updateStatus updates and returns booking', async () => {
    setData([makeBookingRow({ status: 'active' })]);
    const repo = new DrizzleBookingRepository(db);

    const result = await repo.updateStatus('b1', 'active');
    expect(result.status).toBe('active');
  });

  it('getBookedRanges returns date ranges', async () => {
    setData([{ pickupDate: '2026-07-01', returnDate: '2026-07-05' }]);
    const repo = new DrizzleBookingRepository(db);

    const ranges = await repo.getBookedRanges('p1');
    expect(ranges).toHaveLength(1);
    expect(ranges[0].pickupDate).toBe('2026-07-01');
  });

  it('findWithDetails delegates to findById', async () => {
    setData([makeBookingRow()]);
    const repo = new DrizzleBookingRepository(db);

    const result = await repo.findWithDetails('b1');
    expect(result?.id).toBe('b1');
  });
});

describe('DrizzleInventoryRepository', () => {
  let { db, setData } = createDb();

  beforeEach(() => {
    const r = createDb();
    db = r.db;
    setData = r.setData;
  });

  it('findAvailableByProductModelId returns available units', async () => {
    setData([makeInventoryRow()]);
    const repo = new DrizzleInventoryRepository(db);

    const result = await repo.findAvailableByProductModelId('p1');
    expect(result).toHaveLength(1);
    expect(result[0].serialNumber).toBe('SN001');
  });

  it('countAvailableByProductModelId returns count', async () => {
    setData([{ count: 3 }]);
    const repo = new DrizzleInventoryRepository(db);

    const count = await repo.countAvailableByProductModelId('p1');
    expect(count).toBe(3);
  });

  it('create inserts and returns inventory unit', async () => {
    setData([makeInventoryRow()]);
    const repo = new DrizzleInventoryRepository(db);

    const result = await repo.create({
      productModelId: 'p1',
      serialNumber: 'SN001',
      status: 'available',
      conditionNote: null,
      purchaseDate: null,
      purchasePriceCents: null,
      lastReturnedAt: null,
    });

    expect(result.serialNumber).toBe('SN001');
  });

  it('updateStatus updates and returns unit', async () => {
    setData([makeInventoryRow({ status: 'rented' })]);
    const repo = new DrizzleInventoryRepository(db);

    const result = await repo.updateStatus('i1', 'rented');
    expect(result.status).toBe('rented');
  });
});
