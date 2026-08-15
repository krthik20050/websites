import { describe, it, expect } from 'vitest';
import type {
  ProductModel,
  InventoryUnit,
  PricedProduct,
  BookingRequest,
  BookingConfirmation,
} from './types';

describe('Domain Types', () => {
  it('ProductModel has required fields', () => {
    const product: ProductModel = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      brand: 'Sony',
      model: 'A7IV',
      category: 'camera_body',
      slug: 'sony-a7iv',
      dailyRateCents: 500000,
      weeklyRateCents: 3000000,
      monthlyRateCents: 10000000,
      depositCents: 1000000,
      description: 'Great camera',
      specs: { mount: 'E-mount', sensor: 'Full Frame' },
      defaultImageUrl: 'https://example.com/sony-a7iv.jpg',
      condition: 'good',
      isActive: true,
      totalQuantity: 2,
      createdAt: new Date(),
    };

    expect(product.brand).toBe('Sony');
    expect(product.category).toBe('camera_body');
    expect(product.dailyRateCents).toBe(500000);
    expect(product.specs?.mount).toBe('E-mount');
  });

  it('InventoryUnit has required fields', () => {
    const unit: InventoryUnit = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      productModelId: '123e4567-e89b-12d3-a456-426614174000',
      serialNumber: 'SN123456',
      status: 'available',
      conditionNote: 'Excellent',
      purchaseDate: new Date('2023-01-15'),
      purchasePriceCents: 20000000,
      rentalCount: 0,
      lastReturnedAt: null,
      createdAt: new Date(),
    };

    expect(unit.status).toBe('available');
    expect(unit.serialNumber).toBe('SN123456');
  });

  it('PricedProduct extends ProductModel with computed pricing', () => {
    const priced: PricedProduct = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      brand: 'Canon',
      model: 'R5',
      category: 'camera_body',
      slug: 'canon-r5',
      dailyRateCents: 800000,
      weeklyRateCents: 4500000,
      monthlyRateCents: 15000000,
      depositCents: 1500000,
      description: 'Flagship camera',
      specs: { mount: 'RF', sensor: 'Full Frame' },
      defaultImageUrl: 'https://example.com/canon-r5.jpg',
      condition: 'excellent',
      isActive: true,
      totalQuantity: 1,
      createdAt: new Date(),
      priceForDays: (days: number) => 800000 * days,
      weeklyDiscount: 0.1,
      monthlyDiscount: 0.2,
    };

    expect(priced.priceForDays(3)).toBe(2400000);
    expect(priced.weeklyDiscount).toBe(0.1);
  });

  it('BookingRequest has all required fields', () => {
    const request: BookingRequest = {
      userId: 'user-123',
      productModelId: 'model-123',
      pickupDate: '2026-07-01',
      returnDate: '2026-07-05',
      paymentMode: 'online',
      hasWaiver: true,
    };

    expect(request.paymentMode).toBe('online');
    expect(request.hasWaiver).toBe(true);
    expect(request.pickupDate).toBe('2026-07-01');
  });

  it('BookingConfirmation has booking details', () => {
    const confirmation: BookingConfirmation = {
      id: 'booking-123',
      bookingNumber: 'CAM-2026-ABCD',
      status: 'confirmed',
      pickupDate: '2026-07-01',
      returnDate: '2026-07-05',
      totalRentalCents: 2400000,
      depositCents: 1500000,
      damageWaiverCents: 240000,
      grandTotalCents: 2640000,
      paymentMode: 'online',
      paymentStatus: 'pending',
      productName: 'Canon R5',
      productSlug: 'canon-r5',
    };

    expect(confirmation.bookingNumber).toBe('CAM-2026-ABCD');
    expect(confirmation.grandTotalCents).toBe(2640000);
  });
});