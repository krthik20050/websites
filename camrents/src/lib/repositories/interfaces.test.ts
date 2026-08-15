import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  ProductRepository,
  BookingRepository,
  InventoryRepository,
} from './interfaces';
import type {
  ProductModel,
  InventoryUnit,
  PricedProduct,
  BookingRequest,
  BookingConfirmation,
} from '../domain/types';

describe('Repository Interfaces', () => {
  let mockProductRepo: ProductRepository;
  let mockBookingRepo: BookingRepository;
  let mockInventoryRepo: InventoryRepository;

  beforeEach(() => {
    mockProductRepo = {
      findAllActive: vi.fn(),
      findBySlug: vi.fn(),
      findById: vi.fn(),
      search: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockBookingRepo = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      findByProductModelId: vi.fn(),
      findActiveByProductModelId: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      getBookedRanges: vi.fn(),
      findWithDetails: vi.fn(),
    };

    mockInventoryRepo = {
      findAvailableByProductModelId: vi.fn(),
      countAvailableByProductModelId: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
    };
  });

  it('ProductRepository has all required methods', () => {
    expect(typeof mockProductRepo.findAllActive).toBe('function');
    expect(typeof mockProductRepo.findBySlug).toBe('function');
    expect(typeof mockProductRepo.findById).toBe('function');
    expect(typeof mockProductRepo.search).toBe('function');
    expect(typeof mockProductRepo.create).toBe('function');
    expect(typeof mockProductRepo.update).toBe('function');
    expect(typeof mockProductRepo.delete).toBe('function');
  });

  it('BookingRepository has all required methods', () => {
    expect(typeof mockBookingRepo.findById).toBe('function');
    expect(typeof mockBookingRepo.findByUserId).toBe('function');
    expect(typeof mockBookingRepo.findByProductModelId).toBe('function');
    expect(typeof mockBookingRepo.findActiveByProductModelId).toBe('function');
    expect(typeof mockBookingRepo.create).toBe('function');
    expect(typeof mockBookingRepo.updateStatus).toBe('function');
    expect(typeof mockBookingRepo.getBookedRanges).toBe('function');
    expect(typeof mockBookingRepo.findWithDetails).toBe('function');
  });

  it('InventoryRepository has all required methods', () => {
    expect(typeof mockInventoryRepo.findAvailableByProductModelId).toBe('function');
    expect(typeof mockInventoryRepo.countAvailableByProductModelId).toBe('function');
    expect(typeof mockInventoryRepo.create).toBe('function');
    expect(typeof mockInventoryRepo.updateStatus).toBe('function');
  });

  it('ProductRepository.findBySlug returns ProductModel or null', async () => {
    const product: ProductModel = {
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
      defaultImageUrl: 'https://example.com/sony.jpg',
      condition: 'good',
      isActive: true,
      totalQuantity: 2,
      createdAt: new Date(),
    };

    mockProductRepo.findBySlug = vi.fn().mockResolvedValue(product);

    const result = await mockProductRepo.findBySlug('sony-a7iv');

    expect(result).toEqual(product);
    expect(mockProductRepo.findBySlug).toHaveBeenCalledWith('sony-a7iv');
  });

  it('BookingRepository.create returns BookingConfirmation', async () => {
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

    const request: BookingRequest = {
      userId: 'user-123',
      productModelId: 'model-123',
      pickupDate: '2026-07-01',
      returnDate: '2026-07-05',
      paymentMode: 'online',
      hasWaiver: true,
    };

    mockBookingRepo.create = vi.fn().mockResolvedValue(confirmation);

    const result = await mockBookingRepo.create(request);

    expect(result).toEqual(confirmation);
    expect(mockBookingRepo.create).toHaveBeenCalledWith(request);
  });

  it('InventoryRepository.countAvailableByProductModelId returns number', async () => {
    mockInventoryRepo.countAvailableByProductModelId = vi.fn().mockResolvedValue(3);

    const count = await mockInventoryRepo.countAvailableByProductModelId('model-123');

    expect(count).toBe(3);
    expect(mockInventoryRepo.countAvailableByProductModelId).toHaveBeenCalledWith('model-123');
  });
});