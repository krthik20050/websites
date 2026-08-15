# Camera Rental E-Commerce Website — Product Requirements Document (PRD)

> **Version:** 1.1
> **Status:** Draft
> **Date:** June 2026
> **Location:** Thrissur, Kerala, India

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Audience & Personas](#3-target-audience--personas)
4. [User Scenarios](#4-user-scenarios)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [Database Schema](#8-database-schema)
9. [API Design](#9-api-design)
10. [UI/UX Design Principles](#10-uiux-design-principles)
11. [Admin Dashboard Specifications](#11-admin-dashboard-specifications)
12. [Security Requirements](#12-security-requirements)
13. [Hosting & Infrastructure Costs](#13-hosting--infrastructure-costs)
14. [Development Phases & Timeline](#14-development-phases--timeline)
15. [Success Metrics](#15-success-metrics)
16. [Risks & Mitigations](#16-risks--mitigations)
17. [Appendices](#17-appendices)

---

## 1. Executive Summary

### Product Vision
A camera rental website for **Thrissur** that lets customers browse, check live availability, and book camera equipment for pickup from a local shop. The shop owner manages everything through a mobile-friendly admin dashboard.

### Value Proposition
- **For customers:** Browse real inventory with live availability, book online via UPI or pay at shop, pickup from store, WhatsApp/SMS confirmations
- **For the shop owner:** Automates booking management, prevents double-booking, enables Google discoverability ("camera rental Thrissur"), reduces phone call chaos

### Business Model
- **Revenue:** Rental fees — pay online via UPI, or pay at store (cash/UPI)
- **Deposits:** Handled at the shop in-person (cash/UPI) — no online deposit capture in V1
- **Optional:** Damage waiver at checkout

---

## 2. Problem Statement

### Current State (Observed)
A real camera shop in **Thrissur, Kerala** has steady business but:
- No online presence — customers discover them only through word-of-mouth or walk-ins
- Phone-based booking leads to missed calls, double-bookings, no record
- Inventory tracking is likely manual (paper or spreadsheet)
- No way for customers to check availability without calling or visiting
- Competitors in larger cities have websites; Thrissur shop is losing potential customers

### Desired State
- Customers can browse the full inventory online, see live availability
- Online booking with automatic double-booking prevention
- Admin dashboard for the shop owner to manage everything
- SEO-optimized to attract new customers searching for "camera rental [city name]"
- Professional image builds trust with customers

### Core User Needs
| User | Need |
|---|---|
| **Customer** | Find camera equipment, check availability, book online (pay via UPI or at store), pick up at shop, return easily, get WhatsApp/SMS confirmations |
| **Shop Owner** | Manage inventory, view bookings, process returns (inspect, mark damage), no-show handling, late return tracking |
| **Walk-in Customer** | Shop owner can create booking in admin panel instantly, no online payment needed

---

## 3. Target Audience & Personas

### Primary Market
- **Location:** **Thrissur, Kerala** (tier 2 city)
- **Population:** ~1.5M metro area
- **Customer base:** Wedding photographers, event organizers, film students (many from nearby film industry), hobbyists, content creators, tourists
- **Language:** Malayalam for shop interactions; English for website (Malayalam support in future)
- **Local SEO target:** "camera rental Thrissur", "camera hire Thrissur", "ക്യാമറ വാടക തൃശൂർ"

### Persona 1: The Wedding Photographer (Primary Customer)
- **Name:** Rajesh
- **Age:** 28
- **Needs:** Rents a Sony A7IV + 24-70mm lens for weekend weddings
- **Behavior:** Books 2-3 days before, picks up Friday, returns Monday
- **Pain points:** Wants to check availability without calling; needs quick pickup

### Persona 2: The Hobbyist (Secondary Customer)
- **Name:** Priya
- **Age:** 24
- **Needs:** Rents beginner gear (Canon 200D) for weekend trips
- **Behavior:** Weekend warrior, books Thursday for Fri-Sun rental
- **Pain points:** Wants clear pricing, easy booking, knows nothing about gear specs

### Persona 3: The Event Organizer (Occasional High-Value Customer)
- **Name:** Amit
- **Age:** 35
- **Needs:** Rents 3-5 camera setups for a 3-day conference
- **Behavior:** Plans weeks ahead, needs multiple items, may negotiate bulk pricing
- **Pain points:** Needs to book multiple items in one order, wants invoice for accounting

### Persona 4: The Shop Owner (Admin)
- **Name:** Shop Owner
- **Age:** 35-50
- **Needs:** Simple dashboard to manage inventory, see bookings, track returns
- **Behavior:** Moderate technical comfort, needs the system to be faster than his current method
- **Pain points:** No time for complex software; needs real-time sync between online and walk-in bookings

---

## 4. User Scenarios

### Scenario A: Online Booking + UPI Payment → Pickup → Return
1. Rajesh visits camera shop website, searches for "Sony A7IV"
2. Sees product page with availability calendar (green = free)
3. Selects pickup (Friday) and return (Monday)
4. Price auto-calculates: 3 days × ₹1,200 = ₹3,600
5. Creates account with phone number (mandatory) + name
6. **Option 1: Pay Online** — Picks UPI via Razorpay, scans QR on phone, pays ₹3,600
7. **Option 2: Pay at Store** — Selects "Pay at Store", no online payment
8. Gets confirmation via: WhatsApp message + SMS + Email with booking number "CAM-2024-0042"
9. Picks up at shop — shop owner marks "picked up" in admin, collects deposit (cash/UPI)
10. 24h before return: gets WhatsApp reminder + SMS reminder
11. Returns on Monday — shop owner inspects gear, marks "returned", releases deposit
12. Rajesh gets PDF receipt via WhatsApp + email
13. Optionally leaves a review

### Scenario B: Walk-in Booking (Detailed — The Make-or-Break Workflow)

**Real Shop Context:** This workflow must be FASTER than the shop owner's current method (notebook + pen). Target: <30 seconds to create a booking.

1. **Customer walks in:** "I need a Sony A7III for the weekend"
2. Shop owner pulls out phone → opens admin panel (Face ID / PIN — instant access)
3. Bottom-right **"+ New Booking" FAB** tapped → Quick Booking form opens as a bottom sheet (not a full page)
4. **Select Product:** Search "Sony" → autocomplete shows Sony A7III with daily rate ₹1,200 — taps it
5. **Select Dates:** Pickup: Fri 14-Jun (today), Return: Mon 17-Jun — price auto-calculates to ₹3,600
6. **Customer Details:** Shop owner asks "Name and phone?" → types "Rajesh", phone "9999999999"
   - If customer already exists, name auto-fills from previous booking
7. **Verification (Real Camera Shop Practice):**
   - Shop owner asks for Aadhaar/PAN for photocopy (standard practice for high-value rentals)
   - Phone number is verified by calling/SMSing the customer immediately
   - For new customers: ask "What project?" and "Local address?" to gauge trustworthiness
8. **Payment + Deposit:**
   - Customer pays ₹3,600 rental fee (cash/UPI at counter, NO online payment needed)
   - Customer gives deposit: ₹15,000 (cash/UPI at counter — **physical deposit, not online**)
   - Shop owner marks "Deposit collected: Yes" in the form (simple toggle)
   - If deposit is cash: tap "Cash Deposit Collected" checkbox
   - If deposit is UPI: tap "UPI Deposit Collected" checkbox
9. **Serial Number Assignment:** Shop owner goes to shelf, picks a specific Sony A7III unit
   - In the form: dropdown of available serial numbers for this model → selects "A7IV-2024-003"
10. **Tap "Create Booking"** → done
11. **Notification sending:**
    - WhatsApp message sent to customer: "Hi Rajesh, Booking #CAM-2024-0042 confirmed for Sony A7III. Pickup: 14-Jun at [Shop Name]. Show this at the counter."
    - SMS sent as fallback: "CAMRENT: Booking CAM-2024-0042 confirmed for Sony A7III. Pickup: 14-Jun at [Shop Name]"
    - **Shop owner also gets WhatsApp notification** (so they have a record)
12. **After pickup:** The booking status is automatically both "confirmed" and "active" (since admin created it at the counter)

**Key Design Decisions for Walk-in Speed:**
- Bottom sheet (not full page navigation) — keeps context, faster to dismiss
- Search autocomplete on product — no scrolling through lists
- Auto-fill returning customer — no re-entering details
- "Book for Walk-in" bypasses all online payment screens — admin handles money at counter
- All form fields on one screen (no multi-step wizard) — in-and-out in 30 seconds
- If customer doesn't have WhatsApp → SMS only, system auto-detects

### Scenario C: Walk-in + Online Inventory Sync
1. Walk-in customer rents the last Canon R5 at 10 AM for 2 days
2. Shop owner marks it "picked up" in admin
3. Website immediately shows the Canon R5 as unavailable for those dates
4. Online customer trying to book the same dates sees it as blocked
5. No double-booking possible

---

## 5. Functional Requirements

### P0: Must-Have (V1 Launch)

| ID | Feature | Description |
|---|---|---|
| F-01 | **Product Catalog** | Browse/search/filter camera equipment by brand, category, price range. Thrissur-specific content |
| F-02 | **Product Detail Page** | Photos, specs (mount, megapixels), daily/weekly/monthly rates, condition, availability calendar |
| F-03 | **Availability Calendar** | Interactive date-range picker showing free/blocked dates with cleaning buffer |
| F-04 | **Booking System** | Select dates → calculate price → create booking → PostgreSQL exclusion constraints prevent double-booking |
| F-05 | **Customer Accounts** | Sign up with **phone number** (mandatory) + name; email optional; booking history, profile |
| F-06 | **Checkout: Online Payment** | Pay via **Razorpay UPI** (Google Pay, PhonePe, Paytm) — UPI is primary; cards/netbanking secondary |
| F-07 | **Checkout: Pay at Store** | Customer selects "Pay at Store" — no online payment required, pays cash/UPI at pickup |
| F-08 | **WhatsApp Notifications** | Booking confirmation, pickup reminder, return reminder via WhatsApp Business API |
| F-09 | **SMS Notifications** | Booking confirmation + reminders via Fast2SMS/MSG91 (for customers without WhatsApp/smartphone) |
| F-10 | **Email Notifications** | Booking confirmation + PDF receipt for customers who provide email |
| F-11 | **PDF Receipt** | Generated PDF receipt (simple, not formal GST invoice) sent via WhatsApp/email after return |
| F-12 | **Admin Dashboard: Inventory** | Add/edit/remove products, upload photos, set pricing, mark available/maintenance |
| F-13 | **Admin Dashboard: Bookings** | View all bookings, change status (pending → confirmed → picked up → returned → cancelled), mark no-show |
| F-14 | **Admin Dashboard: Customers** | View customer list (phone + name), booking history, contact info |
| F-15 | **Admin: Offline Booking** | Create bookings for walk-in customers — no online payment required, mark as "paid offline" |
| F-16 | **Admin: Return Workflow** | Mark as returned, log condition, capture damage photos, release/flag deposit |
| F-17 | **Admin: No-Show Handling** | Mark booking as "no-show" after pickup time passes, auto-release inventory for those dates |
| F-18 | **SEO** | Title tags, meta descriptions, sitemap, OG images, structured data for each product — target "camera rental Thrissur" |
| F-19 | **Mobile-Responsive** | Full functionality on mobile phones — customers and admin both use phones primarily |

### P1: V1.1 (Next Release)

| ID | Feature | Description |
|---|---|---|
| F-20 | **Damage Waiver** | Optional checkout add-on that caps customer liability (~10% of item value) |
| F-21 | **Late Fee Automation** | Admin sets daily late fee; system calculates overdue charges |
| F-22 | **Reviews & Ratings** | Customers can rate gear 1-5 stars after returning |
| F-23 | **Maintenance Tracking** | Log cleaning/inspection/repairs per serial number; flag items after N rentals |
| F-24 | **Booking Extensions** | Customer requests extension via WhatsApp/phone; admin approves in panel |
| F-25 | **Multiple Image Upload** | Admin uploads multiple photos per product; option to use default web photos |
| F-26 | **KYC Upload** | Customer uploads Aadhaar (masked) for high-value rentals — Indian compliance |

### P2: Future

| ID | Feature | Description |
|---|---|---|
| F-27 | **Bulk Bookings (Kits)** | Book body + lens + accessories in one order |
| F-28 | **Malayalam Language** | Full site in Malayalam for local customers |
| F-29 | **Discount Coupons** | Promo codes for returning customers |
| F-30 | **Analytics Dashboard** | Revenue reports, utilization rates, popular items |
| F-31 | **Loyalty Program** | Discounts after N rentals, free rental after 10 |
| F-32 | **Google Business Profile** | Sync availability with Google Business listing |

---

## 6. Non-Functional Requirements

### Performance
| Requirement | Target |
|---|---|
| Page load time (server) | < 300ms for product pages |
| Availability lookup | < 200ms |
| Checkout completion | < 5 seconds |
| Concurrent users supported | 500+ without degradation |
| Database query time (95th percentile) | < 50ms |

### Scalability
- Must handle from 1 user to 10,000+ monthly active users without architecture changes
- Database must prevent double-booking at the database level (exclusion constraints), not just application-level
- Horizontal scaling: Next.js on Vercel auto-scales; PostgreSQL with connection pooling

### Security
| Area | Requirement |
|---|---|
| Payment data | Stripe Elements — card data never touches our server (PCI-DSS compliant by using Stripe) |
| Authentication | Auth.js with bcrypt password hashing, HTTP-only cookies |
| API security | CSRF protection via NextAuth, rate limiting on auth routes |
| Input validation | Zod schemas on all API inputs (both client + server side) |
| XSS | No `dangerouslySetInnerHTML`, sanitize user content with DOMPurify |
| SQL injection | Prevented by Drizzle ORM (parameterized queries) |
| Secrets | .env file never committed, managed via Vercel environment variables |
| Admin routes | Role-based middleware checking `user.role === 'admin'` |
| HTTPS | Auto-managed by Vercel/LetsEncrypt |

### Reliability
- Uptime target: 99.9% (Vercel SLA)
- Database backup: Automated daily + point-in-time recovery (Neon)
- Graceful error handling for all API routes
- Booking integrity: If a Stripe payment succeeds but booking creation fails, the system must reconcile (webhook handler)

### Localization (Thrissur, Kerala — India-Focused)
- **Currency:** Indian Rupee (₹)
- **Date format:** DD/MM/YYYY
- **Time zone:** IST (UTC+5:30)
- **Payment methods:** **Razorpay** (UPI primary — Google Pay, PhonePe, Paytm; cards/netbanking secondary). Pay-at-store option (cash/UPI at counter)
- **GST:** 18% on rental services (SAC 9973). PDF receipt is simple (not formal GST invoice). Shop owner can export booking data for their CA
- **Language:** English website initially; **Malayalam** support in V2 (Thrissur is in Kerala)
- **Phone numbers:** +91 format, mandatory for all accounts

---

## 7. Technical Architecture

### Recommended Stack (Thrissur-Optimized)

| Layer | Choice | Rationale |
|---|---|---|
| **Frontend** | **Next.js 14+ (App Router)** | SSR for SEO, Server Actions for forms, React Server Components |
| **Styling** | **Tailwind CSS v4** | Utility-first, fast, mobile-first responsive |
| **Database** | **Neon PostgreSQL** (Mumbai region) | Serverless, auto-scales, data stays in India |
| **ORM** | **Drizzle ORM** | Lightweight, type-safe, PostgreSQL range type support for exclusion constraints |
| **Auth** | **Auth.js (NextAuth v5)** | Phone + email auth, database sessions |
| **Payments** | **Razorpay** | **UPI-native** (GPay, PhonePe, Paytm), also supports cards + netbanking. Best for India |
| **WhatsApp** | **Meta Cloud API** (direct) or **Interakt** | Booking confirmations + reminders sent via WhatsApp. Interakt if CRM features needed |
| **SMS** | **Fast2SMS** or **MSG91** | Transactional SMS for customers without WhatsApp. Low volume = low cost (~₹0.25/SMS) |
| **Emails** | **Resend** | Transactional emails + PDF receipt attachments |
| **File Storage** | **Uploadthing** (V1, simpler) → **Cloudflare R2** (V2, when scaling) | V1: 5-min setup, free tier 2GB. V2: zero egress for larger volumes |
| **PDF Generation** | **PDFKit** or **jsPDF** (server-side) | Generate simple PDF receipts with booking details + shop info |
| **Forms/Validation** | **React Hook Form + Zod** | Client + server validation |
| **UI Components** | **shadcn/ui** | Accessible, clean, built on Radix UI |
| **Hosting** | **Vercel** | Native Next.js, auto-deploy, CDN, SSL, auto-scales |
| **Domain** | **GoDaddy India** or **Namecheap** | `.in` domain: e.g., `thrissurcamerarental.in` or `[shopname]camera.in` |

### Why This Stack?
- **Razorpay over Stripe:** Thrissur customers pay via UPI (GPay/PhonePe), not cards. Razorpay is built for India — UPI native, supports RuPay, netbanking, Paytm wallet. Stripe's UPI support is limited.
- **WhatsApp + SMS over email-only:** In smaller Indian cities, WhatsApp is how people communicate. Email is secondary. Both are needed.
- **Phone number as primary ID:** Email is optional. Phone is mandatory. This matches how Indian e-commerce works (Amazon India, Flipkart all use phone-first login).

### Architecture Diagram (Text)
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  Browser     │───▶│  Next.js     │───▶│  Neon        │
│  (Customer)  │    │  (Vercel)    │    │  PostgreSQL  │
└─────────────┘    │              │    └──────────────┘
                   │  - SSR Pages │         ▲
┌─────────────┐    │  - API Routes│         │ pooling
│  Browser     │───▶│  - Server    │    ┌──────────────┐
│  (Admin)     │    │    Actions   │    │  Cloudflare  │
└─────────────┘    └──────┬───────┘    │  R2 (images) │
                          │            └──────────────┘
                          ▼
                   ┌──────────────┐
                   │  Stripe      │
                   │  (Payments)  │
                   └──────────────┘
                          │
                   ┌──────────────┐
                   │  Resend      │
                   │  (Emails)    │
                   └──────────────┘
```

### Vercel Configuration (`vercel.json`)
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    { "source": "/stats", "destination": "/api/stats" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

### Environment Variables
```
# Database
DATABASE_URL=postgresql://... (pooled - for app)
DATABASE_URL_UNPOOLED=postgresql://... (direct - for migrations)

# Auth
AUTH_SECRET=...
AUTH_URL=https://thrissurcamerarental.in

# Razorpay (replaces Stripe)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# WhatsApp (Meta Cloud API or Interakt)
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_BUSINESS_ACCOUNT_ID=...

# SMS (Fast2SMS or MSG91)
SMS_API_KEY=...
SMS_SENDER_ID=CAMRENT

# Resend (Email)
RESEND_API_KEY=re_...

# Uploadthing (File storage V1)
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...

# App
NEXT_PUBLIC_APP_URL=https://thrissurcamerarental.in
SHOP_NAME="[Shop Name] Camera Rentals"
SHOP_PHONE=+919999999999
SHOP_ADDRESS="[Address], Thrissur, Kerala"
SHOP_WHATSAPP=+919999999999
```

### WhatsApp & SMS: Architecture & Integration Detail

#### Channel Strategy
| Priority | Channel | When | Cost |
|---|---|---|---|
| **1st** | WhatsApp | Always (customer has WhatsApp) | ₹0.03-0.10/msg (Utility template) |
| **2nd** | SMS | Fallback if WhatsApp fails or customer has no WhatsApp | ₹0.25/SMS |
| **3rd** | Email | Only if customer provided email | ₹0 (Resend free tier: 100/day) |

#### WhatsApp Integration: Meta Cloud API vs BSP (Interakt)

| Factor | Direct Meta Cloud API | Interakt / WATI (BSP) |
|---|---|---|
| **Setup complexity** | Medium — Meta Business Account, WABA setup, System User token | Low — signup, connect WhatsApp number, done |
| **Template management** | Self-manage via Meta Business Manager | Dashboard-based UI for template creation + submission |
| **Cost** | Free (pay only Meta msg fees) | ₹1,500-5,000/mo + Meta msg fees |
| **Inbox/Chat** | Must build your own | Built-in CRM inbox for customer replies |
| **Best for** | Tech team who wants full control | Small business, non-technical admin |
| **Recommendation for V1** | **Direct Meta Cloud API** — save ₹1,500-5,000/mo | Upgrade to BSP if chat features needed in V2 |

**Direct Meta Cloud API Setup (V1 approach):**
1. Create Meta Business Account (GST certificate for verification)
2. Create WhatsApp Business Account (WABA) in Meta Developer Portal
3. Register phone number (must NOT be used with personal WhatsApp)
4. Generate **Permanent Access Token** via System Users (not temporary tokens)
5. Submit **Utility templates** for approval (booking_confirmation, pickup_reminder, return_reminder, receipt)
6. Set up webhook endpoint in Next.js: `POST /api/webhooks/whatsapp` for delivery receipts + incoming messages
7. API endpoint for sending: `POST https://graph.facebook.com/v23.0/{PHONE_NUMBER_ID}/messages`

**WhatsApp Template Categories (Meta's Rules):**
- **Utility templates**: Booking confirmations, reminders, receipts — fastest approval (minutes to hours)
- **Marketing templates**: Promotions, discounts — NOT needed for V1
- **Free-form messages**: Only allowed within 24-hour Customer Service Window (after customer replies)
- **Template variables**: Use `{{1}}`, `{{2}}` placeholders — pre-register with Meta

#### SMS Integration: Fast2SMS vs MSG91

| Factor | Fast2SMS | MSG91 |
|---|---|---|
| **Pricing (low volume)** | ₹0.25/SMS (wallet, min ₹100) | ₹0.25/SMS (bundles, min ₹1,250 + GST for 5,000 SMS) |
| **Setup fee** | None | None (but must buy min bundle) |
| **API quality** | Simple, functional | Professional, well-documented |
| **Best for** | Low/variable volume (our case) | Building a scalable app |
| **Recommendation** | ✅ **Fast2SMS for V1** — ₹100 wallet lasts months | MSG91 when scaling >500 SMS/mo |

**DLT Registration (Mandatory for ALL SMS in India):**
- Cost: ~₹5,900 one-time per telecom portal (Airtel/Jio/BSNL/Vi)
- Documents needed: Business PAN, GST certificate, proof of address, Aadhaar of authorized signatory
- Timeline: 3-7 working days for entity registration
- Then register **Sender ID** (e.g., CAMRENT): ~₹590/yr per Header
- Then register **SMS Templates** (exact message format with `{#var#}` placeholders)
- **TRAI rule:** YOU CANNOT change approved template text — must resubmit for approval

#### WhatsApp + SMS Template Messages (Finalized)

**WhatsApp Templates (Meta Utility — pre-approval required):**
| Template Name | Category | Variables | Content |
|---|---|---|---|
| `booking_confirmation` | Utility | {{1}}=name, {{2}}=booking_no, {{3}}=product, {{4}}=pickup_date, {{5}}=shop_name | "Hi {{1}}, Booking #{{2}} confirmed for {{3}}. Pickup: {{4}} at {{5}}. Show this at the counter." |
| `pickup_reminder` | Utility | {{1}}=name, {{2}}=product, {{3}}=pickup_date, {{4}}=shop_name | "Reminder {{1}}: Pick up {{2}} tomorrow ({{3}}) at {{4}}. Be on time!" |
| `return_reminder` | Utility | {{1}}=name, {{2}}=product, {{3}}=return_date | "Hi {{1}}, {{2}} is due back on {{3}}. Late fee applies after that. Thanks!" |
| `overdue_alert` | Utility | {{1}}=name, {{2}}=product, {{3}}=days_overdue, {{4}}=late_fee | "{{1}}, {{2}} is {{3}} days overdue. Late fee: ₹{{4}}. Please return today." |
| `receipt_ready` | Utility | {{1}}=name, {{2}}=booking_no, {{3}}=link | "Hi {{1}}, receipt for booking #{{2}} is ready. Download: {{3}}. Leave a review too!" |

**SMS Templates (DLT-registered):**
| Template Name | Sender ID | Content |
|---|---|---|
| `booking_confirm` | CAMRENT | "CAMRENT: Booking {#var#} confirmed for {#var#}. Pickup: {#var#} at {#var#}. - [Shop Name]" |
| `return_remind` | CAMRENT | "CAMRENT: Reminder - return {#var#} by {#var#}. Late fee applies. Contact {#var#}" |
| `overdue` | CAMRENT | "CAMRENT: {#var#} is overdue by {#var#} days. Please return immediately. Call {#var#}" |

---

## 8. Database Schema

### Entity Relationship Diagram (Text)

```
product_models 1──N inventory_items
product_models 1──N bookings
kits          N──M product_models (via kit_items)
bookings      1──1 booking_kits (optional)
bookings      1──N booking_items
bookings      N──1 users
bookings      1──1 damage_waivers (optional)
bookings      1──N maintenance_logs
bookings      1──1 reviews (optional)
inventory_items 1──N maintenance_logs
```

### Table Definitions

#### `product_models`
What customers browse and book. One row per product type (e.g., "Canon EOS R5").

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| brand | TEXT | Canon, Sony, Nikon, etc. |
| model | TEXT | EOS R5, A7IV, Z8 |
| category | TEXT | camera_body, lens, accessory, kit |
| slug | TEXT UNIQUE | URL-friendly: "canon-eos-r5" |
| daily_rate_cents | INTEGER | ₹1,500 → 150000 (paise) |
| weekly_rate_cents | INTEGER | Optional weekly discount |
| monthly_rate_cents | INTEGER | Optional monthly discount |
| deposit_cents | INTEGER | Security deposit amount |
| description | TEXT | Detailed description |
| specs | JSONB | { mount: "RF", megapixels: 45, sensor: "Full Frame" } |
| default_image_url | TEXT | Web-sourced default image |
| condition | TEXT | excellent, good, fair |
| is_active | BOOLEAN | Hide from public |
| total_quantity | INTEGER | How many units owned (e.g., 3) |
| created_at | TIMESTAMPTZ | |

#### `inventory_items`
Individual physical units tracked by serial number.

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| product_model_id | UUID FK → product_models | |
| serial_number | TEXT UNIQUE | |
| status | TEXT | available, rented, maintenance, retired, lost |
| condition_note | TEXT | "Slight scratch on barrel" |
| purchase_date | DATE | |
| purchase_price_cents | INTEGER | For ROI tracking |
| rental_count | INTEGER | Auto-incremented |
| last_returned_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

#### `users`
Customers and admins. **Phone number is the primary identifier.**

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| phone | TEXT UNIQUE NOT NULL | Primary identifier: +919999999999 |
| name | TEXT NOT NULL | |
| email | TEXT | Optional — customers may skip |
| password_hash | TEXT | bcrypt (OTP-based login can skip this initially) |
| role | TEXT | customer, admin |
| email_verified | BOOLEAN | |
| phone_verified | BOOLEAN | Verified via OTP |
| razorpay_customer_id | TEXT | Razorpay customer reference |
| id_proof_url | TEXT | Aadhaar/PAN (KYC) |
| rental_count | INTEGER | |
| total_spent_cents | INTEGER | Lifetime revenue from this customer |
| created_at | TIMESTAMPTZ | |

#### `bookings`
The core business table. Supports two payment modes: online (Razorpay UPI) or pay-at-store (offline).

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| booking_number | TEXT UNIQUE | Human-readable: "CAM-2024-0042" |
| user_id | UUID FK → users | |
| product_model_id | UUID FK → product_models | |
| status | TEXT | pending, confirmed, active, returned, cancelled, no_show |
| payment_mode | TEXT | online (Razorpay UPI/card), offline (cash/UPI at store) |
| payment_status | TEXT | pending, paid, refunded, failed |
| pickup_date | DATE | Customer-facing pickup date |
| return_date | DATE | Customer-facing return date |
| operational_start | TIMESTAMPTZ | pickup - 2h buffer |
| operational_end | TIMESTAMPTZ | return + 2h buffer |
| rental_dates | TSTZRANGE | For exclusion constraint |
| quantity | INTEGER | Number of units (for fungible inventory) |
| daily_rate_cents | INTEGER | Rate locked at booking time |
| total_rental_cents | INTEGER | |
| deposit_cents | INTEGER | |
| late_fee_cents | INTEGER | Accrued late fees |
| damage_waiver_cents | INTEGER | 0 if not purchased |
| grand_total_cents | INTEGER | rental + waiver + late fees |
| razorpay_order_id | TEXT | Razorpay order ID (online payments only) |
| razorpay_payment_id | TEXT | Razorpay payment ID (online payments only) |
| paid_at_store | BOOLEAN DEFAULT false | Admin marked as paid offline |
| deposit_collected | BOOLEAN DEFAULT false | Deposit collected at shop |
| deposit_returned | BOOLEAN DEFAULT false | Deposit returned after inspection |
| damage_notes | TEXT | Admin notes on damage |
| inspection_photos | TEXT[] | Photos taken at return |
| no_show_marked_at | TIMESTAMPTZ | When admin marked no-show |
| cancelled_at | TIMESTAMPTZ | |
| notes | TEXT | Admin notes |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

**Critical constraint:**
```sql
EXCLUDE USING GIST (
  product_model_id WITH =,
  rental_dates WITH &&
)
```
This makes it physically impossible to store two overlapping bookings for the same camera model.

#### `booking_items`
Links bookings to specific serial numbers (assigned at pickup time).

| Column | Type | Description |
|---|---|---|
| booking_id | UUID FK → bookings | |
| item_id | UUID FK → inventory_items | |
| assigned_at | TIMESTAMPTZ | When admin assigned serial number |

#### `damage_waivers`
Optional add-on purchased at checkout.

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| booking_id | UUID FK → bookings UNIQUE | |
| fee_cents | INTEGER | |
| liability_cap_cents | INTEGER | |
| purchased_at | TIMESTAMPTZ | |

#### `maintenance_logs`
Tracks cleaning, inspection, and repairs.

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| item_id | UUID FK → inventory_items | |
| booking_id | UUID FK → bookings | Link to rental that caused it |
| type | TEXT | inspection, cleaning, repair, damage |
| description | TEXT | |
| cost_cents | INTEGER | |
| image_urls | TEXT[] | Damage photos |
| logged_by | UUID FK → users | |
| created_at | TIMESTAMPTZ | |

#### `reviews`
Customer reviews posted after returning gear.

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| booking_id | UUID FK → bookings UNIQUE | |
| user_id | UUID FK → users | |
| product_model_id | UUID FK → product_models | |
| rating | INTEGER | 1-5 |
| body | TEXT | |
| created_at | TIMESTAMPTZ | |

#### `late_fee_rules`
Configurable by admin.

| Column | Type | Description |
|---|---|---|
| id | UUID PK | |
| daily_rate_cents | INTEGER | |
| grace_hours | INTEGER | 4h default |
| max_fee_cents | INTEGER | Cap |
| is_active | BOOLEAN | |

### Indexes
```sql
-- Performance indexes
CREATE INDEX idx_product_brand ON product_models(brand);
CREATE INDEX idx_product_category ON product_models(category);
CREATE INDEX idx_product_slug ON product_models(slug);
CREATE INDEX idx_product_active ON product_models(is_active) WHERE is_active = true;

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings USING GIST (rental_dates);
CREATE INDEX idx_bookings_product ON bookings(product_model_id);
CREATE INDEX idx_bookings_active_status ON bookings(status) WHERE status IN ('confirmed', 'active');

CREATE INDEX idx_inventory_model ON inventory_items(product_model_id);
CREATE INDEX idx_inventory_status ON inventory_items(status);

CREATE INDEX idx_maintenance_item ON maintenance_logs(item_id);
```

---

## 9. API Design

### Server Actions (Next.js App Router)

#### Public Actions

| Action | Method | Description |
|---|---|---|
| `searchProducts(query, filters)` | Server Action | Search/filter catalog |
| `getProductBySlug(slug)` | Server Action | Product detail + availability |
| `checkAvailability(productId, startDate, endDate)` | Server Action | Live availability check |
| `calculatePrice(productId, startDate, endDate, hasWaiver)` | Server Action | Price calculation |
| `createBooking(data)` | Server Action | Create booking + initiate Stripe payment |
| `createReview(bookingId, rating, body)` | Server Action | Post-purchase review |
| `getUserBookings()` | Server Action | Customer's booking history |
| `requestExtension(bookingId, newDate)` | Server Action | Request extension |

#### Admin Actions

| Action | Method | Description |
|---|---|---|
| `adminGetProducts()` | Server Action | All products including inactive |
| `adminCreateProduct(data)` | Server Action | Add new product |
| `adminUpdateProduct(id, data)` | Server Action | Update product details |
| `adminDeleteProduct(id)` | Server Action | Soft delete (set inactive) |
| `adminGetBookings(filters)` | Server Action | All bookings with filters |
| `adminUpdateBookingStatus(id, status)` | Server Action | Mark confirmed/picked/returned |
| `adminAssignSerialNumbers(bookingId, itemIds)` | Server Action | Assign gear at pickup |
| `adminGetCustomers()` | Server Action | Customer list |
| `adminUploadImages(productId, files)` | Server Action | Upload product photos |
| `adminGetDashboard()` | Server Action | Dashboard stats |

#### Razorpay Webhook Handlers

| Event | Handler |
|---|---|
| `payment.captured` | Confirm booking, send WhatsApp + SMS + email confirmation |
| `payment.failed` | Mark booking as failed, notify customer |
| `order.paid` | Update payment status to paid |

#### Notification Dispatch (Server Action)
| Notification Type | Channel | Trigger |
|---|---|---|
| Booking confirmation | WhatsApp + SMS + Email | Booking created (online payment success OR admin confirms offline) |
| Pickup reminder | WhatsApp + SMS | 24 hours before pickup date |
| Return reminder | WhatsApp + SMS | 24 hours before return date |
| Overdue alert | WhatsApp + SMS | 2 hours after return time passed |
| Receipt + review request | WhatsApp + Email | Return marked as completed by admin |

---

## 10. UI/UX Design Principles

### Design Philosophy
- **Clean & professional:** Photography is visual — the website must look premium
- **Mobile-first:** Most Thrissur users browse on phones; admin uses phone too
- **Fast:** Sub-second page loads on 4G (Jio/Airtel in Thrissur)
- **Trust-building:** Show real condition, clear pricing (₹), shop address in Thrissur
- **Thrissur-local feel:** Shop address, WhatsApp click-to-chat, phone number prominent

### Admin Mobile-First Design Principles
Inspired by apps like **Khatabook, Vyapar, and OkCredit** — the gold standard for Indian small business mobile tools.

**The Five-Second Rule:** The shop owner should understand their business health (active rentals, overdue returns, today's pickups) within 5 seconds of opening the admin panel.

**Action-Oriented Design:**
- Bottom navigation bar for quick switching: Dashboard | Bookings | Products | Customers
- **Floating Action Button (FAB)** with "+" icon for the most frequent action: "New Booking" (for walk-ins)
- Swipe right on a booking → Call/WhatsApp customer
- Swipe left on a booking → Mark as Returned / Mark No-Show

**Touch-Optimized:**
- All buttons ≥ 44x44pt for fat-finger prevention
- Lists instead of tables (dense tables fail on small screens)
- Color-coded status badges: 🟢 Confirmed, 🔵 Active, 🟡 Due Today, 🔴 Overdue, ⚫ Returned
- Sticky filter tabs at top: "Today" | "This Week" | "All" — one tap to pivot

**Offline-First:**
- **Optimistic UI:** Creating a booking instantly shows in the list (saves to localStorage first)
- **Background sync:** Data syncs to server when connection is available
- **Offline indicator:** Subtle icon shows "Offline" mode so admin knows sync is pending
- Critical because Thrissur may have spotty connectivity in some areas

**Trust & Familiarity:**
- Use familiar Indian small business terminology (not jargon)
- Numbers formatted with Indian comma system: ₹1,42,500 (not ₹142,500)
- Malayalam language support in V2 for the admin interface
- WhatsApp share button on every booking — tap to send booking details via WhatsApp

### Page Structure

#### Public Pages
```
/                          → Home (hero, featured cameras, how it works, city SEO)
/cameras                   → Catalog (grid, filters: brand, category, price)
/cameras/[slug]            → Product Detail (photos, specs, availability calendar, CTA)
/checkout                  → Checkout (date summary, price, **pay online via UPI** or **pay at store**)
/auth/login                → Login with **phone number** (OTP or password)
/auth/register             → Register with phone + name
/account/bookings          → My Bookings (history, status, extend, review)
/account/bookings/[id]     → Booking Detail
/how-it-works              → Process explanation page
/contact                   → Shop address in Thrissur, phone, WhatsApp click-to-chat, map
```

#### Admin Pages (Protected)
```
/admin                     → Dashboard (KPIs: active rentals, overdue, revenue)
/admin/products            → Inventory management (table, add, edit)
/admin/products/new        → Add product form
/admin/products/[id]/edit  → Edit product
/admin/bookings            → Bookings management (table with filters)
/admin/bookings/[id]       → Booking detail + action panel
/admin/customers           → Customer list
/admin/settings            → Late fee rules, shop info, pricing defaults
```

### Key UX Flows

#### Availability Calendar (Product Page)
- Date picker shows 90 days out
- Green dates = fully available
- Red dates = partially/totally booked
- Hover shows: "2 of 3 units available" for partial availability
- Selected range shows total price updating in real-time

#### Checkout Flow (Two Options)

**Option A: Pay Online (UPI):**
1. Review booking summary (dates, item, total)
2. Select "Pay Online" — Razorpay checkout opens
3. Pay via UPI (scan QR in GPay/PhonePe/Paytm), or card/netbanking
4. On success → booking confirmed → WhatsApp + SMS + email sent
5. Success page with booking number, pickup instructions, shop address

**Option B: Pay at Store:**
1. Review booking summary
2. Select "Pay at Store" — no payment collected online
3. Booking created as "confirmed" with payment "pending"
4. Customer picks up at shop, pays cash/UPI there
5. Admin marks "paid" in the panel

**After Return:**
- PDF receipt generated and sent via WhatsApp + email

#### Admin Booking Workflow
1. Booking comes in → status: "confirmed" (immediate, or after Razorpay webhook for online payments)
2. Customer arrives → admin marks "picked up" → assigns serial numbers → collects deposit (cash/UPI)
3. Customer returns → admin inspects gear → logs condition + photos → marks "returned" → releases deposit
4. If damaged → admin logs damage, deducts from deposit, returns remaining
5. **No-show:** If customer doesn't show up by end of pickup date → admin marks "no-show" → inventory auto-released for those dates
6. **Late return:** Admin sees "overdue" badge on booking; can mark late fee manually

---

## 11. Admin Dashboard Specifications (Mobile-First)

### Design Philosophy (Based on Indian Small Business Tools)
Inspired by **Khatabook, Vyapar, OkCredit** — the most successful mobile business management apps in India. The admin IS a mobile app, NOT a scaled-down desktop site.

### Navigation
```
Bottom Tab Bar (Fixed, 5 tabs):
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 📊 Home  │ 📋 Jobs  │ 📦 Stock │ 👥 People │ ⚙️ More  │
└──────────┴──────────┴──────────┴──────────┴──────────┘
```
| Tab | Content |
|---|---|
| **Home** | Dashboard KPIs (cards), Quick Actions (FAB), Today's timeline |
| **Jobs** | All bookings with status filters — this is the PRIMARY screen |
| **Stock** | Inventory list with availability counts |
| **People** | Customer list with search + booking history |
| **More** | Settings, late fee rules, shop info, logout |

### Dashboard Home ("Home" Tab)
**The Five-Second Dashboard:** Cards at top that tell the story instantly:
```
┌─────────────────────────────────────┐
│ 📊 THRISSUR CAMERA RENTALS         │
├──────────────┬──────────────────────┤
│ 🟢 Active    │  🔴 Overdue         │
│ 5 units out  │  2 items late       │
├──────────────┼──────────────────────┤
│ 📅 Due Today │  💰 Revenue (Month) │
│ 3 returns    │  ₹42,500           │
└──────────────┴──────────────────────┘

⬇️ Today's Timeline (scrollable):
┌─────────────────────────────────────┐
│ 10:00 AM  📤 Sony A7III → Rajesh   │ [✅ Returned]
│ 02:00 PM  📤 Canon R5 → Priya      │ [🔵 Active]
│ 04:00 PM  ⬅️ Nikon Z8 due back     │ [🔴 Overdue!]
└─────────────────────────────────────┘
```

**Floating Action Button (FAB):** Persistent "+" button bottom-right — ONE TAP to create a new walk-in booking.

### Bookings Tab ("Jobs" — Most Important Screen)
**Sticky Filter Tabs:**
```
[ All ] [ Active ] [ Due Today ] [ Overdue ] [ This Week ]
```

**Booking Cards (NOT Tables — mobile-friendly list):**
```
┌─────────────────────────────────────────┐
│ 🟢 Active  Sony A7III                   │
│ Rajesh  |  +91 99999 99999  [📞][💬]   │
│ Pickup: 14 Jun  →  Return: 17 Jun       │
│ ₹3,600  |  Deposit: ✅ ₹15,000          │
│                                        │
│ [ ↩️ Return ]  [ ❌ No-Show ]  [ 📄 ]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🔴 Overdue  Nikon Z8                    │
│ Amit  |  +91 88888 88888  [📞][💬]    │
│ Due: 16 Jun (2 days overdue!)           │
│ Late fee: ₹800                          │
│                                        │
│ [ ↩️ Return ]  [ 💰 Collect Fee ]  [ 📄 ]│
└─────────────────────────────────────────┘
```

**Swipe Actions:**
- Swipe RIGHT on a booking → Call Customer | WhatsApp Customer
- Swipe LEFT on a booking → Quick Mark as Returned | Mark as No-Show

### New Walk-In Booking Flow (Bottom Sheet)
The most critical workflow. Accessed via FAB "+" → opens as a **bottom sheet** (not a new page):

```
┌─────────────────────────────────────┐
│         NEW WALK-IN BOOKING         │
│─────────────────────────────────────│
│ Product: [🔍 Search Sony...       ] │
│         Sony A7III  |  ₹1,200/day  │
│         Canon R5   |  ₹2,000/day  │
│─────────────────────────────────────│
│ 📅 Pickup: [14 Jun 2024]  🕐 [10AM]│
│ 📅 Return: [17 Jun 2024]  🕐 [6PM] │
│ 💰 Total: 3 days × ₹1,200 = ₹3,600 │
│─────────────────────────────────────│
│ 👤 Name: [Rajesh                 ] │
│ 📞 Phone: [9999999999            ] │
│     ✓ Customer exists (2 prev bookings)│
│─────────────────────────────────────│
│ 💵 Deposit Collected: [✅ Yes] [No] │
│ 💳 Payment at Store: [✅ Paid] [Pending]│
│─────────────────────────────────────│
│ 🔢 Serial No: [Select... ▼        ] │
│     A7IV-2024-003 (Available)       │
│─────────────────────────────────────│
│ [ ❌ Cancel ]    [ ✅ Create Booking ]│
└─────────────────────────────────────┘
```

### Inventory Management ("Stock" Tab)
**Card-based list (not table):**
```
┌─────────────────────────────────────────┐
│ 📷 Sony A7III                           │
│ 3 units: 2 available, 1 rented         │
│ ₹1,200/day  |  Deposit: ₹15,000        │
│                                        │
│ [ Edit ]  [ + Add Units ]  [ Photos ]  │
└─────────────────────────────────────────┘
```

**Add/Edit Product:** Full-screen form, not bottom sheet (too many fields):
- Brand + Model (autocomplete)
- Category (camera_body, lens, accessory)
- Specs as dynamic key-value pairs
- Daily/Weekly/Monthly rates
- Deposit amount
- Condition (excellent/good/fair)
- Description (rich text)
- Image upload (camera roll / drag-drop)
- "Use default image" toggle

### Customer Management ("People" Tab)
**Search bar at top** — search by phone or name instantly
```
┌─────────────────────────────────────────┐
│ Rajesh    +91 99999 99999  [📞][💬]    │
│ 2 bookings  |  ₹7,200 total  |  ⭐⭐⭐⭐  │
│ Last rental: Sony A7III (10 Jun)        │
└─────────────────────────────────────────┘
```

### Offline-First Architecture
- **Optimistic UI:** Creating a booking instantly shows in the list (localIndexedDB/locastorage cache)
- **Background sync:** Data syncs to server when connection available
- **Pending queue icon** shows in header if there are unsynced changes
- **Critical for Thrissur:** Some areas may have spotty Jio/Airtel 4G

---

## 12. Security & Fraud Controls

### Authentication & Authorization
- Auth.js (NextAuth v5) with database sessions
- Passwords hashed with bcrypt (12 rounds)
- Admin routes protected by middleware checking `session.user.role === 'admin'`
- Session tokens stored in HTTP-only, Secure, SameSite cookies
- Rate limiting: 5 failed login attempts → 15-minute lockout (via Upstash)
- OTP-based login for phone numbers (no password needed if customer prefers)

### Payment Security
- Razorpay Checkout — card/UPI data never touches our server
- **Razorpay webhook signature verification** — every webhook request verified against RAZORPAY_WEBHOOK_SECRET before processing
- **Idempotency keys for all booking creation requests** — prevent duplicate charges if customer refreshes/clicks twice
- **Idempotency-Key header** required on POST /api/bookings — same key = same response, no double charge
- No card/UPI data stored in our database
- PCI-DSS compliance delegated to Razorpay (SAQ A)

### Fraud Controls
- **Rate limiting on booking creation:** Max 5 booking attempts per minute per customer
- **Rate limiting on auth:** Max 5 failed login/OTP attempts → 15-minute lockout
- **Suspicious booking detection:** Same phone number booking for 3+ different dates simultaneously → flag for admin review
- **Maximum active bookings per customer:** Configurable limit (default: 3 active bookings at a time)
- **New customer restrictions:** First-time customers limited to items under ₹15,000 deposit — must build trust
- **Admin override:** Admin can manually approve/block any suspicious booking

### Idempotency Pattern
```typescript
// Every booking creation request MUST include an Idempotency-Key header
// POST /api/bookings
// Header: Idempotency-Key: unique-client-generated-id

// Server-side logic:
1. Check if booking with this Idempotency-Key exists → return existing booking
2. If not: begin transaction
3.   Check availability via exclusion constraint
4.   Create booking (pending status)
5.   Create Razorpay order (if online payment)
6. Commit transaction
7. Return booking + payment client_secret

// If request is retried with same key → same booking returned, no duplicate
```

### Data Protection
- All API inputs validated with Zod schemas (both client + server side)
- SQL injection prevented by Drizzle ORM parameterized queries
- XSS prevention: no dangerouslySetInnerHTML, user content sanitized
- CSRF protection: built into Auth.js
- Environment variables never committed — strict .env.example pattern, Vercel env vars for production
- Database encryption at rest (Neon managed)
- Secrets scanning in CI (prevent committing API keys)

### Audit Logging & Observability
- **Structured audit logs** for all critical actions:
  - Booking created / status changed / cancelled
  - Payment received / refunded / failed
  - Admin login / product added or modified
  - Return processed / damage reported
- **Sentry** for error tracking and performance monitoring
- **Health endpoints:** GET /livez, /readyz for deployment monitoring
- **Correlation IDs** on all log entries for debugging

### Indian Compliance
- KYC: Optional Aadhaar/PAN upload for high-value rentals (stored encrypted)
- PDF receipt is a simple receipt, NOT a formal GST invoice. Shop owner's CA handles GST filing.
- Data stored within India region (Neon Mumbai region)
- Right to erasure: admin can delete user data on request
- Consent for storing photos (inspection photos, ID proof) captured during account creation

---

## 13. Hosting & Infrastructure Costs

### Monthly Operating Costs (₹ INR)

| Service | Plan | 0-500 Users | 500-2K Users |
|---|---|---|---|
| **Vercel** | Pro ($20/mo) | ~₹1,700/mo | ~₹1,700-5,000/mo |
| **Neon PostgreSQL** (Mumbai) | Launch → Scale | ₹0-1,600/mo | ₹1,600-4,000/mo |
| **Uploadthing** | Free → Pro | ₹0/mo | ₹800/mo |
| **Resend (Email)** | Free | ₹0/mo | ₹0-1,600/mo |
| **Fast2SMS (SMS)** | Pay-as-you-go | ₹50-100/mo | ₹100-300/mo |
| **WhatsApp (Meta Cloud)** | Pay-per-conversation | ₹200-500/mo | ₹500-2,000/mo |
| **Razorpay Fees** | 2% + GST | Variable (~₹30-100/mo for UPI) | Variable |
| **Domain (.in)** | Annual | ₹799/yr | ₹799/yr |
| **Total** | | **~₹2,000-4,000/mo** | **~₹5,000-14,000/mo** |

**Key insight:** At early stage, total cost is ~₹2,000-4,000/month ($25-50). Most customers paying at store (cash/UPI) means zero payment gateway fees for those transactions.

### Razorpay Fee Estimates (UPI is Cheaper)
| Monthly Bookings | Avg Order Value | Payment Method | Razorpay Fees (2% + GST) |
|---|---|---|---|
| 20 (early stage) | ₹1,200 | UPI | ~₹28/mo |
| 20 (early stage) | ₹1,200 | Card | ~₹56/mo |
| 100 (growth) | ₹1,200 | UPI | ~₹142/mo |
| 500 (scaled) | ₹1,200 | Mixed | ~₹800-1,000/mo |

**Note:** Many customers will choose "Pay at Store" (cash/UPI at counter) — zero payment gateway fees for those.

### One-Time Development Cost
| Component | Hours | Cost at ₹500/hr | Notes |
|---|---|---|---|
| Project setup + schema | 20 | ₹10,000 | Next.js, Drizzle, Neon, Razorpay, auth |
| Product catalog + search | 35 | ₹17,500 | Browse, filter by brand/category/price |
| Booking system + calendar | 50 | ₹25,000 | Availability check, exclusion constraints |
| Checkout (Razorpay UPI + Pay at Store) | 30 | ₹15,000 | Dual payment flow — online UPI + offline |
| WhatsApp + SMS integration | 25 | ₹12,500 | Meta Cloud API/Fast2SMS templates |
| Auth + customer accounts | 20 | ₹10,000 | Phone-first login, OTP or password |
| Admin dashboard | 70 | ₹35,000 | Inventory, bookings, customers, returns |
| PDF receipt generation | 10 | ₹5,000 | Simple PDF with booking + shop details |
| SEO + polish + testing | 25 | ₹12,500 | Thrissur-local SEO, mobile testing |
| **Total** | **~285 hours** | **~₹1,42,500** | 7-9 weeks full-time |

**Or: Do it yourself** — if you build it yourself, cost is just your time + ~₹2,000-4,000/month hosting.

---

## 14. Development Phases & Timeline

### Pre-Code Checklist
- [ ] PRD + KPIs finalized and signed off
- [ ] Database schema (ERD) drafted and reviewed
- [ ] API contracts defined (Server Action input/output types for all endpoints)
- [ ] Provider accounts created: Razorpay (test), Fast2SMS, Meta WhatsApp Business, Resend, Neon, Vercel
- [ ] Repo skeleton + CI + .env.example created
- [ ] Acceptance tests written for all P0 features (concurrency test, idempotency test, booking conflict test)
- [ ] Docker-compose for local dev: Postgres + Redis (if needed) + MailHog

### Sprint 0: Repo Setup & CI (Week 0-1)

| Day | Tasks |
|---|---|
| 0-1 | Initialize Next.js project, Tailwind, shadcn/ui, Drizzle + Neon |
| 2 | Set up Docker-compose for local dev (Postgres, MailHog for email testing) |
| 3-4 | Set up GitHub Actions CI: lint → typecheck → unit tests → integration tests → build |
| 5 | .env.example, README with exact run steps, Dependabot config, secret scanning |
| 6-7 | Write acceptance tests (Gherkin-style) for all P0 features BEFORE writing code |

### Sprint 1: Foundation + Auth (Week 1-2)

| Day | Tasks |
|---|---|
| 8-9 | Build database schema, run first migration |
| 10-12 | Set up Auth.js with **phone-first** auth (OTP + password), email login |
| 13-14 | Create basic layout (header, footer, navigation, Thrissur shop address) |
| 15 | Set up Uploadthing for image storage |
| 16-17 | Set up **Razorpay** integration with webhooks + signature verification |
| 18-19 | Set up **Fast2SMS** (SMS) + **WhatsApp Cloud API** (WhatsApp) + Resend (email) |
| 20 | Idempotency key middleware + audit logging setup + Sentry |

### Sprint 2: Customer-Facing Pages (Week 3-4)

| Days | Tasks |
|---|---|
| 21-24 | Home page with hero, featured products, Thrissur-local SEO metadata |
| 25-28 | Product catalog page with search, filters (brand, category, price) |
| 29-32 | Product detail page with availability calendar, price calculator (₹) |
| 33-36 | Checkout flow: **Razorpay UPI** integration + **Pay at Store** option (with idempotency) |

### Sprint 3: Notifications + Accounts (Week 5)

| Days | Tasks |
|---|---|
| 37-39 | Customer account pages (register with phone, login via OTP, booking history) |
| 40-42 | WhatsApp notification templates + SMS templates + sending logic |
| 43-44 | Email notifications (confirmation, reminder, receipt with PDF) |
| 45-46 | PDF receipt generation (PDFKit) |
| 47 | Reviews & ratings |

### Sprint 4: Admin Dashboard (Week 6-7)

| Days | Tasks |
|---|---|
| 48-50 | Admin layout + auth protection + dashboard KPIs (active, overdue, revenue) |
| 51-53 | Admin: Inventory management (CRUD, image upload, pricing) |
| 54-56 | Admin: Booking management (status workflow, offline booking creation, mark paid) |
| 57-59 | Admin: Return workflow (inspect, log damage, release deposit, mark no-show) |
| 60-61 | Admin: Customer management, settings (shop info, late fee rules) |

### Sprint 5: Testing, CI Polish, Launch (Week 8-9)

| Days | Tasks |
|---|---|
| 62-64 | **Concurrency test**: 10 simultaneous booking attempts for same dates → only 1 succeeds. Write as automated e2e test |
| 65-66 | **Idempotency test**: Same request with same Idempotency-Key → same booking returned. Automated test |
| 67-69 | Mobile responsive testing, WhatsApp/SMS delivery testing, 4G performance testing |
| 70-72 | SEO: structured data, sitemap, "camera rental Thrissur" keyword optimization |
| 73-74 | Performance optimization, image optimization, caching (Next.js Data Cache) |
| 75-77 | **Seed data**: Add 10-15 real camera products with pricing, specs, photos |
| 78-80 | Deploy to Vercel, configure custom .in domain, SSL, final staging verification |

### Post-Launch
| Week | Tasks |
|---|---|
| 11 | Present to shop owner, train on admin panel, collect feedback |
| 12-14 | Iterate on feedback, fix issues, add missing features |
| 15+ | Marketing: Google Business Profile, WhatsApp broadcast, local SEO

### CI / Dev Environment
- **Local dev:** Docker-compose with services: app (Next.js), postgres, mailhog (email testing)
- **CI (GitHub Actions):** lint → typecheck → unit tests → build → integration tests (docker-compose) → secret scanning
- **Staging:** Auto-deploy on Vercel preview branch for every PR. Staging uses Neon free tier
- **Production:** Manual deploy from main branch. Vercel Production with custom domain
- **Secrets:** Never committed. .env.example tracks required vars. Vercel env vars for production
- **Dependabot:** Auto-PR for dependency updates + security patches

### Monitoring & Observability
- **Sentry:** Error tracking + performance monitoring for all API routes
- **Health endpoints:** GET /livez (process liveness), GET /readyz (DB + Razorpay connectivity)
- **Structured audit logs:** JSON format with correlation IDs for all critical actions
- **Razorpay dashboard:** Payment reconciliation, refunds, dispute management

### Definition of Done (Per Ticket/PR)

Every feature ticket must meet ALL of these before merging:
- [ ] Code compiles with no TypeScript errors
- [ ] Unit tests pass (Jest/Vitest)
- [ ] Integration tests pass (docker-compose for DB-dependent tests)
- [ ] No high/critical npm/yarn audit vulnerabilities
- [ ] Migration scripts included and tested (rollback + reapply)
- [ ] Acceptance test written (Gherkin or Playwright) for the feature's main flow
- [ ] No secrets committed — .env.example updated if new env vars added
- [ ] Mobile-responsive: tested at 375px (iPhone SE) and 768px (iPad)
- [ ] Console errors checked: 0 new console errors or warnings
- [ ] Changes documented in README if they affect setup/run steps

---

## 15. KPIs & Success Metrics

### Primary KPIs (Targets for First 6 Months)

| KPI | Definition | Target (Month 3) | Target (Month 6) |
|---|---|---|---|
| **GMV (Gross Merchandise Value)** | Total ₹ value of completed rentals | ₹50,000/mo | ₹2,00,000/mo |
| **Booking Conversion Rate** | % of unique visitors who create a booking | 3% | 8% |
| **Booking Success Rate** | % of bookings that complete (not cancelled/no-show) | 85% | 92% |
| **Dispute Rate** | % of bookings with a damage/loss dispute | <5% | <2% |
| **Repeat Customer Rate** | % of customers with 2+ bookings | 15% | 30% |
| **Customer LTV (Lifetime Value)** | Avg total ₹ spent per customer | ₹3,600 | ₹8,000 |
| **Utilization Rate** | % of inventory rented on any given day | 30% | 55% |
| **Online Booking Share** | % of bookings created online vs walk-in | 20% | 40% |
| **Chargeback Rate** | % of Razorpay payments disputed | <1% | <0.5% |
| **NPS** | Net Promoter Score (customer satisfaction) | 30 | 50+ |

### Launch Criteria (Gate to Present to Shop)
- [ ] All P0 features functional and tested
- [ ] No security vulnerabilities (auth bypass, payment leak, double-booking)
- [ ] Mobile-responsive on 3 devices (iPhone, Android, tablet)
- [ ] Load time < 2s on 4G connection (Jio/Airtel in Thrissur)
- [ ] SEO: "camera rental Thrissur" ranks on Google within 2 weeks
- [ ] Razorpay UPI payment working end-to-end (test mode + live)
- [ ] WhatsApp booking confirmation sending correctly
- [ ] SMS confirmation sending correctly
- [ ] Admin can: add product → see on site → create booking (online + offline) → process return → generate PDF receipt
- [ ] Seed data: 10-15 camera products with real pricing and photos
- [ ] Concurrency test passes: 10 simultaneous booking attempts for same dates → only 1 succeeds
- [ ] Idempotency test passes: same request twice → only 1 booking created

### Acceptance Criteria per Feature

| Feature ID | Acceptance Test |
|---|---|
| F-01 (Product Catalog) | Search "Sony" → sees all Sony items. Filter by category "Lens" → only lenses shown. Price filter ₹500-₹1000 → items in range only |
| F-02 (Product Detail) | Visit /cameras/sony-a7iii → sees photos, specs, pricing, availability calendar. Calendar shows next 90 days |
| F-03 (Availability Calendar) | Book a camera for June 10-12 → those dates show red. June 13 onward shows green. Also show partial availability ("2 of 3 units free") |
| F-04 (Booking System) | Create booking for disjoint periods → both succeed. Two concurrent attempts for same period → only one succeeds (Postgres exclusion constraint + 409 response) |
| F-05 (Customer Accounts) | Register with phone +91XXXXXXXXXX → account created. Login with same phone → sees booking history. Login without phone → rejected |
| F-06 (Online Payment) | Create booking → select Pay Online → Razorpay checkout opens → pay via UPI → booking confirmed → WhatsApp + SMS sent |
| F-07 (Pay at Store) | Create booking → select Pay at Store → booking created as "confirmed" with payment_status = "pending" → no payment collected |
| F-08 (WhatsApp) | Booking created → WhatsApp message received within 30s with booking number and pickup info |
| F-09 (SMS) | Booking created → SMS received on phone with booking summary |
| F-10 (PDF Receipt) | Return completed → PDF receipt generated → contains shop name, customer name, item, dates, total ₹ |
| F-11 (Admin Inventory) | Add new product → appears on public site. Edit price → updates immediately. Mark inactive → disappears from public |
| F-12 (Admin Bookings) | View all bookings → filter by status → change status from confirmed → picked up → returned. Mark no-show → inventory released |
| F-13 (Offline Booking) | Admin creates booking for walk-in → no online payment → marks "paid offline" → booking confirmed → WhatsApp sent to customer |
| F-14 (Return Workflow) | Admin marks returned → deposit released → PDF receipt generated → customer gets WhatsApp receipt |

### Acceptance: Booking Concurrency Test
```gherkin
Scenario: Two users try to book the same camera for overlapping dates
  Given Camera "Sony A7III" exists with 1 unit available
  And dates June 10-12 are available
  When User A sends booking request for June 10-12
  And User B sends booking request for June 10-12 (at the same time)
  Then Exactly one booking succeeds (HTTP 200)
  And Exactly one booking fails with "dates no longer available" (HTTP 409)
  And The successful booking blocks the calendar for June 10-12

Scenario: Idempotent booking creation
  Given Camera "Canon R5" exists
  When Client sends booking request with Idempotency-Key: "abc-123"
  And Client sends the same request again with Idempotency-Key: "abc-123"
  Then Only one booking is created
  And The second request returns the existing booking (HTTP 200)
```

### Business KPIs (For Shop Owner to Track)
- **Booking conversion rate:** % of visitors who complete a booking
- **Utilization rate:** % of inventory rented out at any time
- **Repeat customer rate:** % of customers who rent more than once
- **Online vs walk-in:** Track which bookings came from the website vs in-person
- **Average rental duration:** Days per booking
- **Revenue per item:** Which gear generates the most revenue
- **Overdue rate:** % of items returned late

---

## 16. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| **Double-booking due to race condition** | Critical | Low | PostgreSQL exclusion constraint at database level — physically impossible |
| **Razorpay webhook fails** | High | Low | Retry logic + manual reconciliation in admin panel |
| **Shop owner doesn't adopt the system** | High | Medium | Build admin as simple as possible; test with real workflows before launch |
| **Customer doesn't return gear** | Critical | Low | Deposit collected at shop (cash/UPI); phone number known; WhatsApp follow-up; admin can mark as lost |
| **Payment fails but booking seems confirmed** | High | Low | Bookings confirmed only after Razorpay webhook validates (online) OR admin marks paid (offline) |
| **Server goes down during peak** | Medium | Low | Vercel auto-scales; Neon connection pooling; static cache for catalog pages |
| **GST compliance** | Medium | Medium | PDF receipt is simple (not formal invoice). Shop owner's CA handles GST filing. Booking data can be exported |
| **Competitor builds similar site** | Low | Medium | Focus on local SEO + admin UX as differentiators; first-mover advantage in city |

### The "Shop Owner WON'T Use It" Risk (Most Important)
This is the biggest risk. Solutions:
1. **Admin must work on phone (mobile-first)** — shop owners in Thrissur check bookings on the go, not on a laptop
2. **Make it faster than their current method** — if it's slower than a notebook, they won't switch. One-click actions for common workflows
3. **Offline booking support** — walk-in customers are common. Admin must create a booking in <30 seconds without needing online payment
4. **WhatsApp-notify the shop too** — send booking confirmations to the shop's own WhatsApp number so they know what's happening
5. **Start with a demo** — add 10-15 products with real data before showing the shop owner. An empty site looks like more work

### Stakeholders & Sign-Off

| Stakeholder | Role | Sign-Off |
|---|---|---|
| **You (Builder)** | Product owner, developer, designer | PRD v1.1 |
| **Camera Shop Owner** | End user of admin panel, beneficiary | After demo (Week 11) |
| **Customers (Thrissur)** | End users of public site | Via usage metrics |
| **Future collaborators** | If handing off to someone else | At handoff |

---

## 17. Compliance & Legal

### Terms of Service (TOS) — Required Before Launch
- **Rental agreement:** Customer agrees to return equipment by the agreed return date/time. Late returns incur the daily late fee.
- **Damage liability:** Customer is responsible for damage beyond normal wear & tear. Deposit covers up to the deposit amount. Optional damage waiver can reduce liability.
- **No-show policy:** If equipment is not picked up by end of pickup date, booking is cancelled, payment (if online) is refunded minus a handling fee.
- **Limitation of liability:** Shop is not liable for any lost revenue, missed events, or consequential damages arising from equipment malfunction or unavailability.

### Privacy Policy
- **Data collected:** Phone number (mandatory), name, email (optional), booking history
- **How data is used:** Booking management, WhatsApp/SMS notifications, customer identification
- **Data sharing:** Phone number may be shared with WhatsApp/Meta (for notification delivery via API). Payment data handled by Razorpay (not stored locally)
- **Data retention:** As per section 18
- **Right to erasure:** Customer can request account deletion at any time
- **Cookies:** Session cookies only (for login), no tracking cookies in V1

### Provider Abstraction Pattern
To avoid vendor lock-in, all third-party services must be wrapped behind an interface:

```typescript
// Each service gets an interface + implementation

// SMS — swap Fast2SMS ↔ MSG91
interface SMSProvider {
  send(phone: string, message: string): Promise<SMSResult>;
  sendTemplate(phone: string, templateId: string, vars: Record<string, string>): Promise<SMSResult>;
}

// WhatsApp — swap Meta Cloud API ↔ Interakt ↔ WATI
interface WhatsAppProvider {
  sendTemplate(phone: string, templateName: string, vars: Record<string, string>): Promise<WhatsAppResult>;
}

// Payments — swap Razorpay ↔ Stripe ↔ Cashfree
interface PaymentProvider {
  createOrder(amount: number, currency: string): Promise<PaymentOrder>;
  verifyPayment(paymentId: string, orderId: string, signature: string): boolean;
  capturePayment(paymentId: string): Promise<PaymentResult>;
}

// Storage — swap Uploadthing ↔ Cloudflare R2 ↔ AWS S3
interface StorageProvider {
  upload(file: Buffer, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string): Promise<string>;
}
```

The implementation is chosen via environment variable (e.g., `SMS_PROVIDER=fast2sms` or `SMS_PROVIDER=msg91`). This means the shop can switch providers without code changes.

### Error & Edge Case UI States
| Scenario | UI Behavior |
|---|---|
| **Date unavailable** | Calendar shows red; checkout button disabled with "Dates not available" message |
| **Payment fails (UPI)** | Razorpay shows failure; booking stays in "pending_payment"; customer can retry |
| **Razorpay webhook doesn't arrive** | Admin sees "pending" bookings; manual reconcile button in admin panel ("Check Payment Status") |
| **No products match search** | "No cameras found. Try a different search." with suggestions (popular brands) |
| **Empty inventory** | Product card shows "Currently Unavailable" badge; hide from search if all units are down |
| **500 error on page** | Custom error page with shop phone number + WhatsApp click-to-chat — book manually |
| **Network timeout (4G slow)** | Loading skeleton + retry button on product page; cached catalog pages remain visible |
| **Browser back button after payment** | Idempotency-Key prevents duplicate charges — customer sees existing booking confirmation |

---

## 18. Data & Retention Policy

### What Data We Store
| Data Type | Purpose | Retention |
|---|---|---|
| User phone number | Booking identification, notifications | Until account deletion |
| User email (optional) | Receipt delivery, login | Until account deletion |
| User name | Booking identification | Until account deletion |
| Password hash | Authentication | Until account deletion or password change |
| Booking history | Operational record, dispute resolution | 3 years (Indian tax law) |
| Payment records | Legal requirement, reconciliation | 6 years (Indian IT Act) |
| Inspection photos | Damage evidence | 1 year after return |
| ID proof (Aadhaar/PAN) | KYC compliance | 1 year after last booking |
| Logs/audit trail | Security, debugging | 90 days |

### Data Deletion
- **Right to erasure:** Customer can request account deletion → anonymize personal data, retain booking records (aggregated)
- **Automatic cleanup:** Logs older than 90 days purged automatically
- **Inspection photos:** Deleted 1 year after return is marked

### Data Security
- All data stored in Neon PostgreSQL (Mumbai region)
- Database encrypted at rest
- Backups: Daily automated + point-in-time recovery (7-day window)
- No payment data stored (Razorpay handles all of it)

---

## 18. Appendices

### Appendix A: Competitor Research Summary

| Platform | Model | Key Features | Cost (INR/mo) |
|---|---|---|---|
| **Booqable** | SaaS | Website + inventory + bookings + payments + POS | ~₹6,000-12,000/mo |
| **EZRentOut** | SaaS | Asset tracking, maintenance, barcode, QuickBooks sync | ~₹3,500-10,000/mo |
| **Rentman** | SaaS | Inventory, planning, invoicing | ~₹6,000-15,000/mo |
| **Custom (this project)** | Custom-built | Thrissur-local SEO, UPI payments, WhatsApp/SMS, ownership | ~₹2,000-4,000/mo hosting |

**Key takeaway:** Custom build is cheaper than SaaS from month 3 onwards (<₹4,000/mo vs ₹3,500-12,000/mo). And you own the code and data.

### Appendix B: Camera Gear for Thrissur Market

**Top Brands Popular in Kerala:**
- **Canon** — Dominates wedding photography market in Kerala (5D Mark IV, R6, R8, 200D)
- **Sony** — Growing fast for video (A7III, A7IV, A6700, FX30)
- **Nikon** — Strong for wildlife/nature photography (Z6 III, Z8, D850)
- **GoPro** — Popular with tourists visiting Thrissur Pooram and Kerala backwaters

**Popular Rental Categories (Thrissur-specific):**
1. Camera bodies: Entry (Canon 200D/150D — ₹300-500/day), Mid (Sony A7III, Canon R8 — ₹800-1,500/day), Pro (Canon R5, Sony A7IV — ₹1,500-2,500/day)
2. Lenses: 24-70mm f/2.8 (most rented, ₹500-800/day), 70-200mm, prime lenses
3. Accessories: Tripods, gimbals (DJI RS3/RSC2), LED lights, microphones (rode)
4. Thrissur Pooram season (April-May): Peak demand — prices may go up 20-30%

**Sample Pricing for Thrissur (Research from local shops):**
| Item | Daily Rate | Weekly Rate | Deposit |
|---|---|---|---|
| Canon 200D + 18-55mm | ₹400 | ₹2,000 | ₹5,000 |
| Sony A7III + 28-70mm | ₹1,200 | ₹6,000 | ₹15,000 |
| Canon R5 Body Only | ₹2,000 | ₹10,000 | ₹30,000 |
| 24-70mm f/2.8 Lens | ₹600 | ₹3,000 | ₹10,000 |
| DJI RS3 Gimbal | ₹500 | ₹2,500 | ₹8,000 |

### Appendix C: Glossary

| Term | Definition |
|---|---|
| **SAC 9973** | Service Accounting Code for leasing/rental services under GST |
| **Authorize & Capture** | Stripe flow: hold funds (authorize), take funds later (capture) |
| **Exclusion Constraint** | PostgreSQL feature preventing overlapping time ranges for same resource |
| **Buffer Time** | Time between rentals for cleaning/inspection |
| **Damage Waiver** | Optional fee capping customer liability for accidental damage |
| **Fungible Inventory** | Multiple identical items (5 of same camera body) treated interchangeably |
| **TSTZRANGE** | PostgreSQL timestamp with timezone range type |
| **Razorpay** | India's leading payment gateway — supports UPI (GPay/PhonePe/Paytm), cards, netbanking |
| **Pay at Store** | Customer books online but pays at the physical shop (cash/UPI). No payment gateway fees |
| **Thrissur** | Cultural capital of Kerala, famous for Thrissur Pooram festival. ~1.5M population metro area |

---

*This PRD is a living document. Targeted at a camera rental shop in Thrissur, Kerala, India.*
