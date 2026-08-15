import type {
  ProductModel,
  InventoryUnit,
  PricedProduct,
  BookingRequest,
  BookingConfirmation,
  ProductCategory,
  BookingStatus,
} from '../domain/types';

export interface ProductRepository {
  findAllActive(): Promise<ProductModel[]>;
  findBySlug(slug: string): Promise<ProductModel | null>;
  findById(id: string): Promise<ProductModel | null>;
  search(params: { q?: string; brand?: string; category?: ProductCategory | 'all' }): Promise<ProductModel[]>;
  create(data: Omit<ProductModel, 'id' | 'createdAt'>): Promise<ProductModel>;
  update(id: string, data: Partial<ProductModel>): Promise<ProductModel>;
  delete(id: string): Promise<void>;
}

export interface BookingRepository {
  findById(id: string): Promise<BookingConfirmation | null>;
  findByUserId(userId: string): Promise<BookingConfirmation[]>;
  findByProductModelId(productModelId: string): Promise<BookingConfirmation[]>;
  findActiveByProductModelId(productModelId: string): Promise<BookingConfirmation[]>;
  create(request: BookingRequest): Promise<BookingConfirmation>;
  updateStatus(id: string, status: BookingStatus): Promise<BookingConfirmation>;
  getBookedRanges(productModelId: string): Promise<{ pickupDate: string; returnDate: string }[]>;
  findWithDetails(id: string): Promise<BookingConfirmation | null>;
}

export interface InventoryRepository {
  findAvailableByProductModelId(productModelId: string): Promise<InventoryUnit[]>;
  countAvailableByProductModelId(productModelId: string): Promise<number>;
  create(data: Omit<InventoryUnit, 'id' | 'createdAt' | 'rentalCount'>): Promise<InventoryUnit>;
  updateStatus(id: string, status: string): Promise<InventoryUnit>;
}