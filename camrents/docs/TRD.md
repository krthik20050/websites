# CamRents — Technical Requirement Document

> **Version:** 1.0  
> **Project:** CamRents — Camera Rental Website for Thrissur, Kerala  
> **Stack:** Next.js 15 (App Router) · Tailwind CSS v4 · Drizzle ORM · Neon PostgreSQL

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌──────────────────────┐     ┌─────────────────────────┐     ┌─────────────────┐
│  Customer Browser    │────▶│  Next.js 15 (Vercel)    │────▶│  Neon PostgreSQL │
│  (Mobile / Desktop)  │     │                         │     │  (Mumbai Region) │
└──────────────────────┘     │  - React Server Pages    │     └─────────────────┘
                             │  - Server Actions        │
┌──────────────────────┐     │  - API Routes            │     ┌─────────────────┐
│  Admin Browser       │────▶│  - Middleware (auth)     │────▶│  External APIs   │
│  (Mobile-first)      │     │  - Static Generation     │     │  - Razorpay      │
└──────────────────────┘     └─────────────────────────┘     │  - Fast2SMS      │
                                                              │  - Meta WhatsApp  │
                                                              │  - Resend (Email) │
                                                              └─────────────────┘
```

### 1.2 Rendering Strategy

| Page Type | Rendering | Rationale |
|---|---|---|
| Home (`/`) | Static (SSG) | Content rarely changes, SEO-critical |
| Catalog (`/cameras`) | Static (SSG) | Product list, SEO-critical |
| Product Detail (`/cameras/[slug]`) | Static (SSG) | One page per product, SEO-critical |
| Checkout (`/checkout`) | Client | Dynamic pricing, payment integration |
| Auth (`/auth/*`) | Client | Session-dependent |
| Account (`/account/*`) | Client | User-specific data |
| Admin (`/admin/*`) | Client | Auth-protected, real-time data |
| How It Works (`/how-it-works`) | Static (SSG) | Content page |
| Contact (`/contact`) | Static (SSG) | Shop info, map embed |

### 1.3 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, metadata, analytics)
│   ├── globals.css               # Tailwind v4 base styles
│   ├── page.tsx                  # Home — hero, featured, CTA
│   ├── cameras/
│   │   ├── page.tsx              # Catalog — grid, filters, search
│   │   └── [slug]/page.tsx       # Product detail — specs, calendar, CTA
│   ├── checkout/page.tsx         # Checkout — summary, payment method
│   ├── how-it-works/page.tsx     # Process explanation
│   ├── contact/page.tsx          # Shop address, WhatsApp, map
│   ├── auth/
│   │   ├── login/page.tsx        # Phone OTP login
│   │   └── register/page.tsx     # Phone + name registration
│   ├── account/
│   │   ├── layout.tsx            # Account nav sidebar
│   │   ├── page.tsx              # Profile/settings
│   │   └── bookings/
│   │       ├── page.tsx          # Booking history list
│   │       └── [id]/page.tsx     # Single booking detail + actions
│   └── admin/
│       ├── layout.tsx            # Bottom tab nav (Home/Jobs/Stock/People/More)
│       ├── page.tsx              # Dashboard KPIs, timeline, FAB
│       ├── products/
│       │   ├── page.tsx          # Inventory list
│       │   ├── new/page.tsx      # Add product form
│       │   └── [id]/edit/page.tsx # Edit product form
│       ├── bookings/
│       │   ├── page.tsx          # Booking list with filters
│       │   └── [id]/page.tsx     # Booking detail + actions panel
│       ├── customers/
│       │   └── page.tsx          # Customer list, search, history
│       └── settings/
│           └── page.tsx          # Shop info, late fee rules
├── db/
│   ├── index.ts                  # DB connection (Neon serverless)
│   ├── schema.ts                 # All Drizzle table definitions
│   └── seed.ts                   # Sample data for development
├── lib/
│   ├── utils.ts                  # Formatting helpers (₹, dates)
│   ├── actions/                  # Server Actions
│   │   ├── products.ts           # Product CRUD
│   │   ├── bookings.ts           # Booking CRUD + availability
│   │   ├── auth.ts               # Login/register/logout
│   │   └── admin.ts              # Admin dashboard + management
│   ├── providers/                # Service abstractions (ponytail)
│   │   ├── payment.ts            # Interface: Razorpay / Stripe
│   │   ├── sms.ts                # Interface: Fast2SMS / MSG91
│   │   ├── whatsapp.ts           # Interface: Meta Cloud / Interakt
│   │   ├── email.ts              # Interface: Resend / SendGrid
│   │   └── storage.ts            # Interface: Uploadthing / R2
│   └── middleware.ts             # Auth middleware for admin routes
└── components/                   # Shared React components
    ├── ui/                       # Base UI primitives
    ├── layout/                   # Header, Footer, Nav
    ├── product/                  # ProductCard, ProductGrid, Filters
    ├── booking/                  # AvailabilityCalendar, PriceCalculator
    ├── checkout/                 # PaymentForm, OrderSummary
    └── admin/                    # Admin-specific: KPICard, BookingCard
```

---

## 2. Data Flow

### 2.1 Read Path (Customer Browsing)

```
Browser Request
    ↓
Next.js (Edge/Vercel CDN)
    ↓
[RSC] → Static page served from cache → HTML
[RSC] → Server Action → DB query → JSON → Client component renders
            ↓
        Neon PostgreSQL
            ↓
        Returns: product_models, inventory_items, bookings
```

**ponytail:** For V1, catalog pages are fully static with `generateStaticParams`. Dynamic data (availability) fetched via client-side Server Action after page load.

### 2.2 Write Path (Creating a Booking)

```
Customer fills form → Client validates (Zod)
    ↓
Server Action (createBooking)
    ↓
Server validates input (Zod)
    ↓
BEGIN TRANSACTION
    ├─ Check availability: SELECT ... WHERE rental_dates && [pickup, return]
    │                        AND product_model_id = ?
    ├─ Insert booking (status: pending)
    ├─ If online payment: Create Razorpay order
    └─ COMMIT / ROLLBACK
    ↓
Razorpay Checkout opens (client-side)
    ↓
Payment success → Razorpay webhook → UPDATE booking SET status = 'confirmed'
    ↓
Dispatch: WhatsApp + SMS + Email notifications
```

### 2.3 Price Calculation

```
Input: productId, pickupDate, returnDate, hasWaiver
    ↓
1. Calculate days = ceil((returnDate - pickupDate) / day)
2. Fetch dailyRateCents, weeklyRateCents, monthlyRateCents from product_models
3. If days >= 30: use monthlyRateCents
   Elif days >= 7: use weeklyRateCents
   Else: use dailyRateCents
4. rentalCents = rate × days
5. waiverCents = hasWaiver ? rentalCents × 10% : 0
6. totalCents = rentalCents + waiverCents
    ↓
Return: { dailyRateCents, rentalCents, waiverCents, totalCents, depositCents }
```

---

## 3. Database Schema Reference

> **Actual implementation:** `src/db/schema.ts`

### 3.1 Entity Relationships

```
product_models  1──N  inventory_items    (one model → many physical units)
product_models  1──N  bookings           (one model → many bookings)
inventory_items 1──N  maintenance_logs   (one unit → many logs)
users           1──N  bookings           (one user → many bookings)
bookings        1──1  damage_waivers     (optional, one per booking)
bookings        1──N  booking_items      (assignment of serial numbers at pickup)
bookings        1──1  reviews            (optional, one per booking)
```

### 3.2 Core Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `product_models` | What customers browse & book | brand, model, category, slug, daily_rate_cents, specs (JSONB) |
| `inventory_items` | Individual physical units | product_model_id, serial_number, status |
| `users` | Customers + admins | phone (unique), name, role |
| `bookings` | Every rental transaction | booking_number, user_id, product_model_id, status, rental_dates (TSTZRANGE), payment fields |
| `booking_items` | Serial # assignment at pickup | booking_id, item_id, assigned_at |
| `damage_waivers` | Optional liability cap | booking_id, fee_cents, liability_cap_cents |
| `maintenance_logs` | Cleaning, repairs, damage | item_id, type, description, cost_cents |
| `reviews` | Post-return ratings | booking_id, user_id, product_model_id, rating |
| `late_fee_rules` | Configurable late penalties | daily_rate_cents, grace_hours, is_active |

### 3.3 Critical Constraints

```sql
-- Double-booking prevention (applied via raw migration)
EXCLUDE USING GIST (product_model_id WITH =, rental_dates WITH &&)
-- This is a database-level guarantee, not application-level

-- Booking number format: CAM-{YEAR}-{SEQUENCE}
-- e.g., CAM-2024-0042
```

### 3.4 Indexes (defined in schema.ts)

| Index | Table | Type | Why |
|---|---|---|---|
| `idx_product_active` | product_models | Partial B-tree | Only active products in catalog queries |
| `idx_product_brand` | product_models | B-tree | Brand filter |
| `idx_product_category` | product_models | B-tree | Category filter |
| `idx_bookings_dates` | bookings | GIST | Range overlap queries for availability |
| `idx_bookings_active_status` | bookings | Partial B-tree | Most common admin query (active/confirmed only) |
| `idx_bookings_user` | bookings | B-tree | User booking history lookup |
| `idx_bookings_product` | bookings | B-tree | Product booking history |
| `idx_inventory_model` | inventory_items | B-tree | Items by product model |
| `idx_maintenance_item` | maintenance_logs | B-tree | Maintenance history by item |

---

## 4. API Contracts (Server Actions)

### 4.1 Public Actions

```typescript
// ── Products ──
searchProducts(query: { q?: string; brand?: string; category?: string; })
  → Promise<ProductModel[]>

getProductBySlug(slug: string)
  → Promise<ProductModel & { available: boolean }>

// ── Availability ──
checkAvailability(input: { productModelId: string; pickupDate: string; returnDate: string })
  → Promise<{ available: boolean; availableUnits: number; totalUnits: number }>

calculatePrice(input: { productId: string; pickupDate: string; returnDate: string; hasWaiver?: boolean })
  → Promise<{ dailyRate: number; rentalCents: number; waiverCents: number; totalCents: number; depositCents: number }>

// ── Bookings ──
createBooking(input: CreateBookingInput, idempotencyKey: string)
  → Promise<{ booking: Booking; razorpayOrder?: RazorpayOrder }>

getUserBookings()
  → Promise<Booking[]>

getBookingById(id: string)
  → Promise<Booking>

// ── Reviews ──
createReview(input: { bookingId: string; rating: number; body?: string })
  → Promise<Review>

// ── Auth ──
loginWithPhone(input: { phone: string; password?: string; otp?: string })
  → Promise<Session>

registerUser(input: { phone: string; name: string; email?: string })
  → Promise<Session>

sendOTP(phone: string)
  → Promise<void>
```

### 4.2 Admin Actions

```typescript
adminGetProducts()
  → Promise<ProductModel[]>

adminCreateProduct(input: CreateProductInput)
  → Promise<ProductModel>

adminUpdateProduct(id: string, input: Partial<CreateProductInput>)
  → Promise<ProductModel>

adminDeleteProduct(id: string)
  → Promise<void>  // Soft delete: sets isActive = false

adminGetBookings(filters?: { status?: string; dateFrom?: string; dateTo?: string })
  → Promise<Booking[]>

adminUpdateBookingStatus(input: { id: string; status: string; notes?: string })
  → Promise<Booking>

adminAssignSerialNumbers(input: { bookingId: string; itemIds: string[] })
  → Promise<void>

adminGetCustomers(search?: string)
  → Promise<User[]>

adminGetDashboard()
  → Promise<{
      activeRentals: number;
      overdueItems: number;
      dueToday: number;
      revenueMonth: number;
      timeline: TimelineEvent[];
    }>

adminCreateOfflineBooking(input: CreateOfflineBookingInput)
  → Promise<Booking>

adminProcessReturn(input: {
    bookingId: string;
    damageNotes?: string;
    inspectionPhotos?: string[];
    depositReturned: boolean;
  })
  → Promise<Booking>
```

### 4.3 Webhook Handlers

```
POST /api/webhooks/razorpay
  Events: payment.captured, payment.failed, order.paid
  → Signature verification required
  → Confirm booking / mark payment status

POST /api/webhooks/whatsapp
  Events: message_delivered, message_read, incoming_message
  → Delivery tracking, customer replies
```

---

## 5. Component Design

### 5.1 Component Hierarchy (Public Site)

```
RootLayout
├── Header
│   ├── Logo
│   ├── NavLinks (Cameras, How It Works, Contact)
│   ├── SearchBar
│   └── AuthButtons (Login / Account)
├── Page Content
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── FeaturedProducts
│   │   ├── HowItWorksSection
│   │   └── CTASection
│   ├── CatalogPage
│   │   ├── FilterSidebar (brand, category, price)
│   │   ├── SearchBar
│   │   ├── ProductGrid
│   │   │   └── ProductCard (image, name, price, deposit, badge)
│   │   └── Pagination
│   ├── ProductDetailPage
│   │   ├── ImageGallery
│   │   ├── SpecsTable
│   │   ├── AvailabilityCalendar
│   │   ├── PriceCalculator
│   │   └── BookNowCTA
│   ├── CheckoutPage
│   │   ├── OrderSummary
│   │   ├── DateRangeDisplay
│   │   ├── PaymentMethodSelector (Online UPI / Pay at Store)
│   │   └── RazorpayCheckoutButton
│   └── ContactPage
│       ├── ShopInfo (address, phone, hours)
│       ├── WhatsAppClickToChat
│       └── MapEmbed
└── Footer
    ├── ShopDetails
    ├── QuickLinks
    └── SEOMetadata
```

### 5.2 Component Hierarchy (Admin)

```
AdminLayout
├── Header (shop name, sync status, logout)
├── TabContent (switches based on active tab)
│   ├── DashboardTab
│   │   ├── KPI cards (Active, Overdue, Due Today, Revenue)
│   │   ├── TodayTimeline
│   │   └── FAB (+ New Booking)
│   ├── BookingsTab
│   │   ├── FilterTabs (All, Active, Due Today, Overdue, This Week)
│   │   └── BookingCardList
│   │       └── BookingCard (status badge, customer, dates, deposit, actions)
│   ├── ProductsTab
│   │   ├── ProductCardList
│   │   │   └── ProductCard (image, name, units, rate, edit btn)
│   │   └── AddProductButton
│   ├── CustomersTab
│   │   ├── SearchBar
│   │   └── CustomerCardList
│   │       └── CustomerCard (name, phone, bookings, total)
│   └── MoreTab
│       ├── Settings (shop info, late fee rules)
│       └── Logout
├── BottomNavBar (Home | Jobs | Stock | People | More)
└── WalkInBookingSheet (bottom sheet modal)
    ├── ProductSearch (autocomplete)
    ├── DatePickers (pickup + return)
    ├── PricePreview (auto-calculated)
    ├── CustomerFields (name, phone, auto-fill)
    ├── DepositToggle (collected / not collected)
    ├── SerialNumberSelector
    └── CreateBookingButton
```

---

## 6. State Management

### 6.1 Data Fetching Strategy

```
┌──────────────────────────────────────────────────────────┐
│                    React Server Components                │
│  - Fetch data on the server, send HTML to client          │
│  - Used for: catalog pages, product detail, static pages  │
│  - No client-side loading state needed                    │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│                    Server Actions                         │
│  - Call from client components, run on server             │
│  - Used for: booking creation, auth, form submissions     │
│  - Returns typed responses (success | error)              │
└──────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────┐
│                    Client State (React state)             │
│  - Availability calendar selected dates                   │
│  - Price calculator live updates                          │
│  - Filter/sort selections (URL params for shareability)   │
│  - Form input state (controlled components)               │
└──────────────────────────────────────────────────────────┘
```

### 6.2 No Global State Library

**ponytail:** No Redux, Zustand, or Context for global state. All state is:
- **Server state** → React Server Components + Server Actions (no cache layer needed)
- **URL state** → Search params for filters, pagination
- **Form state** → Local React state in form components
- **Auth state** → Next.js cookies (server-side session)

If cross-component state is needed (e.g., booking flow), pass props or use URL params. Add a state library only when there's a measurable performance problem.

---

## 7. Error Handling Strategy

### 7.1 Error Boundaries

| Layer | Error Type | Handling |
|---|---|---|
| Server Component | DB connection failure, not found | `notFound()`, `error.tsx` with shop contact info |
| Server Action | Validation failure | Return `{ error: string, fieldErrors?: Record<string, string> }` |
| Webhook | Signature verification fail | Return 401, log and alert admin |
| Client Component | Payment failure, network timeout | Toast notification, retry button, fallback to "call to book" |
| Admin | Offline/sync failure | Optimistic UI + pending queue indicator |

### 7.2 Error UI States

**ponytail:** Every error state has exactly one user action — either retry, go back, or contact the shop.

| Scenario | Display | Action |
|---|---|---|
| Product not found | "This camera isn't in our catalog." | "Browse all cameras" link |
| Dates unavailable | Calendar shows red, CTA disabled | "These dates aren't available. Try different dates." |
| Payment fails | Razorpay error screen | "Payment failed. Try again or choose Pay at Store." |
| Network timeout | Skeleton loader + retry button | "Connection issue. Tap to retry." |
| 500 server error | Error page with shop WhatsApp | "Something went wrong. Contact us on WhatsApp to book." |
| No search results | "No cameras found" + suggestions | Brand suggestions shown as quick filters |
| Admin offline | Subtle offline indicator | "Changes saved locally. Will sync when connected." |

---

## 8. Security Model

### 8.1 Auth Flow

```
1. Customer enters phone number
2. Server sends OTP via SMS (Fast2SMS)
   - OR: Customer uses password (if set)
3. Verify OTP → create session (NextAuth v5, database sessions)
4. Session cookie: HTTP-only, Secure, SameSite=Lax
5. Admin routes: middleware checks session.user.role === 'admin'
   → 401 redirect if not admin
```

**ponytail:** For V1, skip OTP and use a simple password-based phone login. Add OTP in V1.1.

### 8.2 Data Validation

```
Client Input → Zod schema → SafeParse
    ↓
Server Action → Zod schema → SafeParse (re-validate)
    ↓
Drizzle ORM → Parameterized query → PostgreSQL
```

All inputs validated twice — once client-side for UX, once server-side for security. No raw SQL queries. No `dangerouslySetInnerHTML`.

### 8.3 Payment Security

```
1. Server creates Razorpay order → returns order_id
2. Client opens Razorpay Checkout (card data never touches our server)
3. Webhook: Razorpay POST to /api/webhooks/razorpay
   → Verify HMAC signature with RAZORPAY_WEBHOOK_SECRET
   → If valid: update booking status
4. Idempotency-Key prevents duplicate charges
```

### 8.4 Admin Route Protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = await getSession(request);
  if (request.nextUrl.pathname.startsWith('/admin') && session?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}
```

---

## 9. Caching Strategy

| Content | Cache | Revalidation |
|---|---|---|
| Product catalog HTML | Next.js Full Route Cache | On-demand revalidation when admin updates product |
| Product detail HTML | Next.js Full Route Cache | On-demand revalidation when product changes |
| Home page HTML | Next.js Full Route Cache | On-demand revalidation |
| Product images | CDN (Vercel Edge) | Until new upload |
| Availability data | No cache (real-time) | Fetched fresh on every request |
| Booking data | No cache | Fetched fresh |
| Static pages (how-it-works, contact) | CDN (Vercel Edge) | Manual redeploy |

---

## 10. Notification Dispatch Pipeline

```
Trigger Event (booking confirmed / return due / overdue)
    ↓
Notification Service
    ├─ Channel 1: WhatsApp (Meta Cloud API)
    │   → Template: booking_confirmation / pickup_reminder / return_reminder / overdue_alert
    │   → Variables: {{name}}, {{booking_no}}, {{product}}, {{dates}}
    ├─ Channel 2: SMS (Fast2SMS) — fallback if WhatsApp fails
    │   → Template: CAMRENT with {#var#} placeholders
    └─ Channel 3: Email (Resend) — only if customer provided email
        → Template: confirmation + PDF receipt link
    ↓
Delivery receipt logged → webhook updates notification status
```

**ponytail:** For V1, implement WhatsApp only (most important channel in India). SMS and Email can be added when the shop needs them.

---

## 11. Offline-First Admin Architecture

```
User Action → Update local state (optimistic)
    ↓
Queue action in localStorage
    ↓
Attempt sync with server
    ├─ Success: Remove from queue, update UI
    └─ Failure: Keep in queue, show pending indicator
    ↓
Retry queue on:
  - Network reconnection
  - Periodic interval (every 30s)
  - Manual "Sync" button
```

**ponytail:** V1 doesn't need full offline support. Start with online-only admin, add offline sync if network issues are reported.

---

## 12. Migration Plan

```bash
# 1. Set up Neon PostgreSQL and get connection string
# 2. Add DATABASE_URL to .env.local
# 3. Generate migration
pnpm db:generate

# 4. Apply migration
pnpm db:migrate

# 5. Seed with sample products
pnpm db:seed

# 6. Manual step: Add exclusion constraint
# Run in Neon SQL editor:
#   CREATE EXTENSION IF NOT EXISTS btree_gist;
#   ALTER TABLE bookings ADD CONSTRAINT no_overlap
#   EXCLUDE USING GIST (product_model_id WITH =, rental_dates WITH &&);

# 7. Deploy to Vercel
vercel --prod
```

---

## 13. Dependencies (Why Each Exists)

| Package | Purpose | ponytail check |
|---|---|---|
| `next` | Framework — SSR, RSC, routing | ✅ Required |
| `react` / `react-dom` | UI library | ✅ Required |
| `tailwindcss` / `@tailwindcss/postcss` | Styling | ✅ Required (user chose it) |
| `drizzle-orm` | Type-safe SQL, migrations | ✅ Required (exclusion constraints) |
| `@neondatabase/serverless` | Neon PostgreSQL driver | ✅ Required (serverless) |
| `postgres` | Raw driver for Drizzle | ✅ Required (peer dep) |
| `drizzle-kit` | Migration generation | ✅ Dev only |
| `tsx` | Run TypeScript files directly | ✅ For seed script |
| `typescript` / `@types/*` | Type safety | ✅ Dev standard |
| `eslint` / `eslint-config-next` | Code quality | ✅ Dev standard |

**Not yet installed (added when needed):**
- `react-hook-form` + `zod` → for forms
- `@radix-ui/*` + `shadcn/ui` → for UI components
- `razorpay` → for payments
- `auth.js` / `next-auth` → for auth
- `pdfkit` → for receipts

---

## 14. V1 vs Future Scope

| Feature | V1 | V1.1 | Future |
|---|---|---|---|
| Product catalog | ✅ Static, hardcoded data | + DB-driven | + Search |
| Product detail | ✅ Static pages | + Dynamic availability | + Reviews |
| Availability calendar | — | + Basic date check | + Interactive 90-day view |
| Online booking | — | + Server Action create | + Razorpay integration |
| Pay at Store | — | + Booking creation | + Admin confirmation |
| Customer accounts | — | + Phone + password | + OTP login |
| WhatsApp | — | + Manual send | + Automated templates |
| SMS | — | — | + Fast2SMS integration |
| Admin dashboard | — | + Basic product CRUD | + Full dashboard + offline booking |
| Admin: Walk-in booking | — | — | + Bottom sheet <30s flow |
| Admin: Return workflow | — | — | + Inspection + deposit release |
| PDF Receipt | — | — | + Auto-generated |
| Reviews | — | — | + Post-return rating |
| SEO | ✅ Meta tags, slugs | + OG images | + Structured data |
| Mobile responsive | ✅ Tailwind base | + Admin mobile-first | + Touch gestures |

---

*This TRD reflects the actual project scaffold in `src/` and the decisions in `PRD.md`. It is a living document — update as implementation choices change.*
