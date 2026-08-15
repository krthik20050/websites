# CamRents

Camera rental e-commerce website for a camera shop in Thrissur, Kerala — customers browse inventory, check live availability, and book camera equipment for store pickup; the shop owner manages everything through an admin dashboard.

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, Base UI (shadcn-style components)
- Drizzle ORM + PostgreSQL (Neon serverless)
- better-auth (email + Google), Zod validation
- Vitest + Testing Library (unit tests for domain/repositories)

## What's Done

- Product catalog: browse cameras/lenses by category, product detail pages
- Booking flow: availability calendar, date picker, checkout with online/offline payment modes
- Auth: better-auth setup, demo user login (`mock-auth`), middleware-protected routes
- Admin dashboard: products CRUD, bookings management, customers, settings
- Customer account area: bookings list + detail
- Drizzle schema (products, bookings, auth tables), seed script, migration runner
- Docs: PRD.md, DESIGN.md (dark-canvas design system), docs/ (TRD, USER-FLOW, Google auth setup)

## What's Not Done / Next Steps

- Real Razorpay integration — schema has `razorpay_order_id`/`razorpay_payment_id` fields but no payment SDK call in actions; checkout currently records `paymentMode`/`paymentStatus` only
- WhatsApp / SMS / email notifications (env vars defined in `.env.example`, not wired)
- Production deployment (project is mostly uncommitted — `git status` shows almost everything untracked)

## How to Run

```bash
pnpm install
cp .env.example .env   # fill DATABASE_URL (Neon), AUTH_SECRET, Razorpay keys
pnpm db:migrate
pnpm db:seed
pnpm dev               # http://localhost:3000
pnpm test              # vitest
pnpm lint
```