export type ProductCategory = 'camera_body' | 'lens' | 'accessory' | 'kit';
export type InventoryStatus = 'available' | 'rented' | 'maintenance' | 'retired' | 'lost';
export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled' | 'no_show';
export type PaymentMode = 'online' | 'offline';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type UserRole = 'customer' | 'admin';
export type MaintenanceType = 'inspection' | 'cleaning' | 'repair' | 'damage';

export interface ProductModel {
  id: string;
  brand: string;
  model: string;
  category: ProductCategory;
  slug: string;
  dailyRateCents: number;
  weeklyRateCents: number | null;
  monthlyRateCents: number | null;
  depositCents: number;
  description: string | null;
  specs: Record<string, string> | null;
  defaultImageUrl: string | null;
  condition: string;
  isActive: boolean;
  totalQuantity: number;
  createdAt: Date;
}

export interface InventoryUnit {
  id: string;
  productModelId: string;
  serialNumber: string;
  status: InventoryStatus;
  conditionNote: string | null;
  purchaseDate: Date | null;
  purchasePriceCents: number | null;
  rentalCount: number;
  lastReturnedAt: Date | null;
  createdAt: Date;
}

export interface PricedProduct extends ProductModel {
  priceForDays: (days: number) => number;
  weeklyDiscount: number;
  monthlyDiscount: number;
}

export interface BookingRequest {
  userId: string;
  productModelId: string;
  pickupDate: string;
  returnDate: string;
  paymentMode: PaymentMode;
  hasWaiver?: boolean;
}

export interface BookingConfirmation {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  pickupDate: string;
  returnDate: string;
  totalRentalCents: number;
  depositCents: number;
  damageWaiverCents: number;
  grandTotalCents: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  productName: string;
  productSlug: string;
}