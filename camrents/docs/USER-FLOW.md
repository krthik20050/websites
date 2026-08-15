# CamRents — User Flow Document

> **Version:** 1.0  
> **Covers:** Customer flows · Admin flows · Booking state machine · Edge cases

---

## 1. Customer Journey: Online Booking (UPI Payment)

### Flow Diagram

```
                    ┌──────────────────────┐
                    │  Google Search /       │
                    │  Direct Visit          │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Home Page            │
                    │  - Hero section       │
                    │  - Featured cameras   │
                    │  - "How It Works"     │
                    │  - CTA                │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Catalog (/cameras)   │
                    │  - Browse all items   │
                    │  - Filter by brand/   │
                    │    category/price     │
                    │  - Search by name     │
                    └──────────┬───────────┘
                               │  Click product card
                    ┌──────────▼───────────┐
                    │  Product Detail       │
                    │  (/cameras/[slug])    │
                    │  - Photos & specs     │
                    │  - Price: ₹/day       │
                    │  - Availability cal   │
                    │  - "Book Now" CTA     │
                    └──────────┬───────────┘
                               │  Tap "Book Now"
                    ┌──────────▼───────────┐
                    │  Date Selector        │
                    │  (inline / modal)     │
                    │  - Pickup date        │
                    │  - Return date        │
                    │  - Live price calc    │
                    │  - Availability check │
                    └──────────┬───────────┘
                               │  Dates selected
                    ┌──────────▼───────────┐
                    │  Auth Check           │
                    │  ┌─────────────────┐  │
                    │  │ Logged in?      │  │
                    │  │  ├─ Yes → Continue│
                    │  │  └─ No  → Login   │
                    │  └─────────────────┘  │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Checkout (/checkout)  │
                    │  - Order summary       │
                    │  - Payment method:     │
                    │    ○ Pay Online (UPI)  │
                    │    ○ Pay at Store      │
                    └──────────┬───────────┘
                               │  Select "Pay Online"
                    ┌──────────▼───────────┐
                    │  Razorpay Checkout    │
                    │  - UPI (GPay/PhonePe) │
                    │  - Card / Netbanking  │
                    │  - QR code scan       │
                    └──────────┬───────────┘
                    ┌──────────┼───────────┐
                    │          │           │
               ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
               │Success │ │Failure │ │Timeout │
               │        │ │        │ │        │
               │ Booking│ │ Retry  │ │ Retry  │
               │ confrmd│ │ prompt │ │ prompt │
               └────┬───┘ └────┬───┘ └────┬───┘
                    │          └─────┬─────┘
                    │                │
                    │         Try again or
                    │         switch to
                    │         "Pay at Store"
               ┌────▼────────────┐
               │  Thank You Page  │
               │  - Booking #     │
               │  - Pickup instr. │
               │  - Shop address  │
               │  - WhatsApp btn  │
               └────────┬────────┘
                        │
               ┌────────▼────────┐
               │  Notification    │
               │  (WhatsApp + SMS)│
               │  "Booking #CAM- │
               │   2024-0042     │
               │   confirmed"    │
               └─────────────────┘
```

### Step-by-Step

| # | Page | User Action | System Response |
|---|---|---|---|
| 1 | Home | Clicks "Browse Cameras" | Navigate to `/cameras` |
| 2 | Catalog | Filters by "Sony", sees A7III | Grid updates with matching products |
| 3 | Catalog | Clicks Sony A7III card | Navigate to `/cameras/sony-a7iii` |
| 4 | Product Detail | Views specs, pricing | Static page with product data |
| 5 | Product Detail | Taps "Book Now" | Date selector opens (inline) |
| 6 | Date Selector | Selects pickup: Fri 14 Jun, return: Mon 17 Jun | Price auto-calculates: ₹3,600 |
| 7 | Auth | If not logged in → login form | Phone number input + OTP/password |
| 8 | Checkout | Reviews order, selects "Pay Online (UPI)" | Razorpay checkout opens |
| 9 | Razorpay | Pays via GPay scan | Payment processed |
| 10 | Webhook | — | Razorpay notifies server → booking confirmed |
| 11 | Thank You | Sees booking #, pickup info | WhatsApp + SMS sent to phone |
| **Next day** | — | Gets pickup reminder via WhatsApp | System sends automated reminder |
| **At shop** | — | Shows booking # at counter | Admin marks "picked up" |
| **Return day** | — | Gets return reminder via WhatsApp | System sends automated reminder |
| **After return** | — | Gets PDF receipt via WhatsApp | Admin marks "returned" → PDF generated |

---

## 2. Customer Journey: Pay at Store (No Online Payment)

```
Standard flow through Catalog → Product Detail → Date Selector → Auth → Checkout
                                                                        │
                                                              ┌─────────▼─────────┐
                                                              │ Select             │
                                                              │ "Pay at Store"     │
                                                              └─────────┬─────────┘
                                                                        │
                                                              ┌─────────▼─────────┐
                                                              │  Booking Created   │
                                                              │  Status: confirmed │
                                                              │  Payment: pending  │
                                                              │  (no online charge) │
                                                              └─────────┬─────────┘
                                                                        │
                                                              ┌─────────▼─────────┐
                                                              │  Thank You Page    │
                                                              │  + WhatsApp conf.  │
                                                              └─────────┬─────────┘
                                                                        │
                                                  At shop → pays cash/UPI at counter
                                                  → admin marks "paid" in admin panel
```

### Key Difference from Online Payment

| Aspect | Pay Online | Pay at Store |
|---|---|---|
| Payment collected | At checkout (Razorpay UPI) | At shop (cash/UPI) |
| Booking status | Confirmed after webhook | Confirmed immediately |
| Payment status | `paid` | `pending` → admin marks `paid` |
| Cancellation risk | Higher (payment dispute) | Lower (in-person) |
| Gateway fee | 2% + GST | ₹0 |

---

## 3. Customer Journey: Walk-in Booking (Admin Creates)

```
Customer walks into shop
    │
    ▼
Shop owner opens admin panel on phone
    │
    ▼
[Admin Dashboard — FAB "+" tapped]
    │
    ▼
[Walk-In Booking Bottom Sheet]
    │
    ├─ Step 1: Search product → autocomplete
    │           "Sony" → shows Sony A7III, ₹1,200/day
    │
    ├─ Step 2: Select dates
    │           Pickup: Today, Return: Mon 17-Jun
    │           Price auto-calc: ₹3,600
    │
    ├─ Step 3: Customer details
    │           Name: Rajesh
    │           Phone: 99999 99999  (auto-fills if existing)
    │
    ├─ Step 4: Payment + Deposit
    │           ☑ Deposit collected (₹15,000 cash)
    │           ☑ Payment at store (₹3,600 paid)
    │
    ├─ Step 5: Serial number
    │           ▼ A7IV-2024-003 (Available)
    │
    └─ Tap "Create Booking"
    │
    ▼
Booking created → WhatsApp sent to customer
    │
    ▼
Customer gets gear → admin marks "picked up" manually
```

**Target:** <30 seconds from FAB tap to booking created.

---

## 4. Admin Journey: Return Processing

```
[Admin Booking Detail]
    │
    ▼
Customer returns gear → admin taps "Process Return"
    │
    ▼
[Return Form — bottom sheet]
    ├─ Condition inspection
    │   [No Damage]  [Minor]  [Major Damage]
    │
    ├─ Damage notes (if any)
    │   "Slight scratch on barrel, minor scuff on LCD"
    │
    ├─ Damage photos (optional)
    │   [Take Photo] [Upload from Gallery]
    │
    ├─ Deposit handling
    │   ☑ Return deposit to customer  (₹15,000)
    │   ☐ Deduct from deposit (₹______)
    │
    └─ Tap "Complete Return"
    │
    ▼
Booking status → "returned"
Deposit released (or partially deducted)
PDF receipt generated → sent via WhatsApp + email
Customer invited to leave a review (WhatsApp link)
```

---

## 5. Admin Journey: No-Show Handling

```
[Admin Booking Detail — customer didn't arrive by end of pickup date]
    │
    ▼
Admin taps "Mark No-Show"
    │
    ▼
Confirmation dialog:
  "Mark Sony A7III as no-show?
   This will release inventory for these dates."
    │
    ├─ [Cancel]
    └─ [Confirm No-Show]
    │
    ▼
Booking status → "no_show"
Inventory released for pickup_date → return_date
If online payment → auto-refund via Razorpay
WhatsApp notification to customer:
  "Your booking was marked as no-show. 
   Please contact us to reschedule."
```

---

## 6. Booking State Machine

```
                        ┌──────────────┐
                        │   PENDING    │  (online payment in progress)
                        │  (no payment)│
                        └──────┬───────┘
                               │
          ┌────────────────────┼───────────────────┐
          │                    │                   │
    ┌─────▼──────┐    ┌───────▼───────┐    ┌──────▼──────┐
    │ Razorpay   │    │ Pay at Store  │    │ Admin       │
    │ webhook    │    │ (no payment)  │    │ confirms    │
    │ succeeds   │    │               │    │ (walk-in)   │
    └─────┬──────┘    └───────┬───────┘    └──────┬──────┘
          │                   │                   │
          └───────────┬───────┴───────────────────┘
                      │
              ┌───────▼───────┐
              │  CONFIRMED    │  --- Can be cancelled by admin
              │  (available)  │       (refund if online payment)
              └───────┬───────┘
                      │  Customer arrives, admin marks picked up
                      │  (serial numbers assigned)
                      ▼
              ┌───────────────┐
              │    ACTIVE     │  --- Item is with customer
              │  (on rental)  │
              └───────┬───────┘
                      │
          ┌───────────┼────────────┐
          │           │            │
    ┌─────▼────┐ ┌────▼────┐ ┌────▼────┐
    │ Returned │ │ No-Show │ │Overdue  │
    │(on time) │ │(never   │ │(late)   │
    │          │ │picked)  │ │         │
    └─────┬────┘ └────┬────┘ └────┬────┘
          │           │           │ (when finally returned)
          │           │           │
          └───────────┼───────────┘
                      │
              ┌───────▼───────┐
              │   RETURNED    │  --- Return processed, deposit handled
              │  (completed)  │       PDF receipt sent
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │   REVIEW      │  --- Customer can leave rating
              │  (optional)   │       (via WhatsApp link)
              └───────────────┘

Cancelled at any state (before pickup):
  ┌──────────────┐
  │  CANCELLED   │  --- Refund if paid online
  │              │       Inventory released
  └──────────────┘
```

### State Transitions

| From | To | Trigger | Conditions |
|---|---|---|---|
| PENDING | CONFIRMED | Razorpay webhook `payment.captured` | Valid signature, order exists |
| PENDING | CONFIRMED | Admin confirms (walk-in) | Admin role, offline payment marked |
| PENDING | CANCELLED | Admin cancels | Any time before confirmation |
| CONFIRMED | ACTIVE | Admin marks picked up | Customer at shop, serial assigned |
| CONFIRMED | CANCELLED | Admin cancels | Refund processed if online |
| CONFIRMED | NO_SHOW | Admin marks no-show | Past pickup date + end of day |
| ACTIVE | RETURNED | Admin processes return | Inspection completed, deposit handled |
| ACTIVE | OVERDUE | Auto (cron job) | Past return_date + 2h grace |
| OVERDUE | RETURNED | Admin processes return | Late fee calculated, deposit adjusted |
| NO_SHOW | — | Terminal | Inventory released, refund (if applicable) |

---

## 7. Auth Flows

### 7.1 Customer Registration (Phone-First)

```
1. Enter phone number (+91XXXXXXXXXX)
2. Validation: Indian mobile format (10 digits after +91)
3. Server sends OTP via SMS (or use password if set)
4. Enter OTP → Verify → Create account
5. Optional: name, email
6. Session created → redirect to previous page
```

### 7.2 Customer Login

```
1. Enter phone number
2. Enter password (or request OTP)
3. Verify → Session created → redirect
```

### 7.3 Admin Login

```
Same as customer login, but:
- Admin accounts are pre-seeded (not self-registerable)
- After login, middleware checks role === 'admin'
- Redirects to /admin/dashboard
```

---

## 8. Navigation Structure

### 8.1 Public Site (Desktop Header)

```
[Logo]  [Cameras]  [How It Works]  [Contact]  [🔍]  [Login / Account]
```

### 8.2 Public Site (Mobile Hamburger)

```
☰
├─ Home
├─ Cameras
├─ How It Works
├─ Contact
└─ Login / Account
```

### 8.3 Admin (Mobile Bottom Tab Bar) — Always Visible

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 📊 Home  │ 📋 Jobs  │ 📦 Stock │ 👥 People│ ⚙️ More  │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

| Tab | Badge | Content |
|---|---|---|
| Home | — | Dashboard KPIs, timeline, FAB |
| Jobs | Overdue count | Bookings list with filters |
| Stock | — | Products with availability counts |
| People | — | Customer list with search |
| More | — | Settings, shop info, logout |

### 8.4 Admin FAB (Floating Action Button)

Persistent "+" button at bottom-right on Home and Jobs tabs. Tapping opens the Walk-In Booking bottom sheet.

---

## 9. Edge Case Flows

### 9.1 Browser Back Button After Payment

```
User: Clicks browser back after successful Razorpay payment
System: Idempotency-Key prevents duplicate booking
Result: User sees "You already have a booking" message with booking # and details
```

### 9.2 Payment Webhook Delayed

```
User: Paid via UPI, redirected to thank you page
System: Booking is "pending" (waiting for Razorpay webhook)
If webhook arrives: status → "confirmed", notifications sent
If webhook doesn't arrive (rare): Admin sees "pending" in panel
  → Admin taps "Check Payment Status" → manually confirms
```

### 9.3 Partial Availability

```
User: Searches for Canon R5 for June 10-12
System: 2 of 3 units are already booked for those dates
Result: Calendar shows:
  - 1 unit available → green with "(1 unit available)"
  - User can still book
  - If 0 units available → red with "Sold out for these dates"
```

### 9.4 Customer with No WhatsApp

```
Admin creates booking → tries to send WhatsApp notification
System: WhatsApp API returns "user not on WhatsApp" error
Fallback: Send SMS instead
Result: Customer gets SMS confirmation (not WhatsApp)
```

### 9.5 Booking When Customer Wants Extension

```
Customer: Calls/texts shop "Can I keep the camera 2 more days?"
Admin: Opens booking detail → taps "Extend"
  → Edit return date → system recalculates price
  → If dates are available: extend booking
  → If dates are blocked: "Not available — another booking exists"
    → Admin offers alternative camera or declines
```

### 9.6 Simultaneous Booking Attempts (Concurrency)

```
User A & User B: Both try to book the last Sony A7III for June 10-12 simultaneously
System:
  - Both requests hit `createBooking` Server Action
  - First request: Begins transaction → checks availability → inserts → commits
  - Second request: Begins transaction → checks availability → finds overlap
    → Exclusion constraint violation → ROLLBACK → returns 409
Result: Exactly one booking succeeds. The other sees "Dates no longer available."
```

---

## 10. Page Inventory (Complete)

| Route | Page | User | Type | Purpose |
|---|---|---|---|---|
| `/` | Home | All | Public | Hero, featured, CTA |
| `/cameras` | Catalog | All | Public | Browse + filter products |
| `/cameras/[slug]` | Product Detail | All | Public | Specs, calendar, CTA |
| `/checkout` | Checkout | Customer | Public | Payment + booking |
| `/how-it-works` | How It Works | All | Public | Process explanation |
| `/contact` | Contact | All | Public | Shop info, map |
| `/auth/login` | Login | All | Public | Phone + password/OTP |
| `/auth/register` | Register | All | Public | Create account |
| `/account` | Profile | Customer | Protected | Account settings |
| `/account/bookings` | My Bookings | Customer | Protected | Booking history |
| `/account/bookings/[id]` | Booking Detail | Customer | Protected | Single booking view |
| `/admin` | Dashboard | Admin | Protected | KPIs, timeline, FAB |
| `/admin/products` | Products | Admin | Protected | Inventory management |
| `/admin/products/new` | New Product | Admin | Protected | Add product form |
| `/admin/products/[id]/edit` | Edit Product | Admin | Protected | Edit product form |
| `/admin/bookings` | Bookings | Admin | Protected | All bookings + filters |
| `/admin/bookings/[id]` | Booking Detail | Admin | Protected | Actions + return |
| `/admin/customers` | Customers | Admin | Protected | Customer list |
| `/admin/settings` | Settings | Admin | Protected | Shop info, fees |
| `POST /api/webhooks/razorpay` | Webhook | System | API | Payment events |
| `POST /api/webhooks/whatsapp` | Webhook | System | API | Message status |

---

*This document maps the complete user experience from entry to return. Use it to guide page layout, navigation, and state handling during frontend development.*
