# PosterDrip Redesign — Decisions & Documentation

> Source: https://posterdrip.in/collections/tamil-cinema?page=3 (Shopify, 24 Aug 2026 snapshot)
> Scope: Full rebuild from scratch, pixel-accurate duplicate → then laptop-optimized
> Owner: redesign poster /

## 1. What we cloned (inventory)

**Global Chrome**
- Announcement bar: `Free Shipping on Prepaid Orders Above ₹250` (sticky top, 36px black bg, white text)
- Header: logo `PD_LOGO_e64d00da...png`, nav mega-menus, search icon, `Log in`, cart (`/cart` + count), Instagram link
- Nav tree (2 levels):
  - `Home`
  - `Posters` → `Movies` → [Tamil, Telugu, Hollywood, Web Series] / `Car` / `Motivation` → [Gym, Qoutes] / `Gym` / `Sports` → [Cricket, Football, F1] / `F1` / `Comics` → [DC, Marvel] / `Anime` / `God` / `3 Split Panel`
  - `Custom` → [Custom Collection, Single Poster Customize, Frame]
  - `Frames` / `Contact`
- Footer: logo, tagline `Premium posters & wall art delivered...`, India pin, email `posterdrip.in@gmail.com`, WhatsApp `+91 94933 44060`, Quick links [Home, Posters, Custom, Frames, Contact], Newsletter `Get Exclusive Poster Drops First` (email input), Instagram, © 2026 Poster Drip, Powered by Shopify, policies [Privacy, Refund, Terms, Shipping, Contact info], disclaimer `Every design featured... created by fans... posterdrip.in@gmail.com`
- Trust bar (homepage): 4 cols — Free Shipping / Best Prices / No exchange / Rated 4.7/5

**Collection: Tamil Cinema (page 3 / paginated)**
- Hero carousel: 2 slides `Untitled-132.jpg` + `Untitled-1.jpg` (3840w, full-bleed, 1/2 dots)
- Title `Collection: Tamil Cinema`, count `85 products`
- Filters: Availability [In stock (85) / Out of stock (0)], Price `[₹ From] [₹ To]` (highest ₹79 observed on this page, but product cards show ₹149→₹30 — price widget is broken/cached), `Remove all / Reset / Clear / Apply`
- Sort: `Featured | Best selling | A-Z | Z-A | Price low-high | Price high-low | Date old-new | Date new-old`
- Filter+Sort drawer (mobile) + `Filter and sort` button
- Product grid card (repeated 20 per page, 85 total):
  - Image `cdn/shop/files/Mockup_*.jpg?width=533` (533w thumb, ~4:3), hover zoom
  - Title link `/products/<slug>` e.g. `Ok Kanamani | Romantic Movie Moments Collage Poster | Aesthetic Wall Art`
  - Badge `Sale`, `Regular price Rs. 149.00 INR` → `Sale price From Rs. 30.00 INR`, `Unit price / per`
  - Examples p3: Ok Kanamani, Mouna Ragam Vintage, Jigarthanda Boxing, Rajinikanth Orange Swirl, Dhanush Rooftop Candid, Chiyaan Characters Illustration, Maaran Dhanush, Ajith Smoking Monochrome, Rajinikanth Tamil Script Tribute, Ajith Candid Smoke, Rajinikanth Super Starboy Bio, Varumaiyin Niram Sivappu, Kadhalum Kadandhu Pogum, Ilaiyaraaja Maestro, Vada Chennai Dhanush, NAYAKAN Kamal Hassan, Just Chillin Mohanlal, Chiyaan Vikram Sunglasses, Mouna Raagam Cinematic, Aaro Nenju Lyric
- Pagination: `← 1 2 [3] 4 5 →` (`?page=N`)
- Infographics/assets to preserve: all `cdn/shop/files/*` mockups, `PD_LOGO`, `IMG_8440_1.png` hero, collection card images

**Other page sections (global, reused on homepage)**
- Collections grid (6): Gym, F1, Car, Custom, Anime, Aesthetic
- Trending Right Now, Movie Posters, Baddie Collection, Featured collection — all same card component

## 2. Problems found (why "laptop-optimized" matters)

1. **Wasted laptop width:** Shopify Dawn container caps ~1200px; on 1366–1600px laptops grid stays 2–4 cols with huge side gutters. 5–6 cols would fit without shrinking cards below 180px.
2. **Filter UX:** Drawer-only on desktop hides Availability+Price. Laptop has space for sticky sidebar (280px) → fewer clicks.
3. **Typography scale:** 14px body + 16px headings feels mobile-first; laptop wants 15–16px body, 28–32px H1 for 100–125% zoom users.
4. **Price widget bug:** Highest price shows ₹79 but cards show ₹149→₹30 — inconsistent currency formatting + `From` vs fixed. Confusing.
5. **Image weight:** `width=533` thumbs are served as 533w to all viewports; laptop gets same 533w as phone. No `srcset` tiering → either blurry on Retina or heavy on mobile.
6. **No keyboard/accessibility:** Dropdowns hover-only, no focus trap in drawer, missing `aria-*`.
7. **Carousel:** Autoplay with no pause, no keyboard, images are 3840w JPEGs (~600KB each) with no lazy.

## 3. Decisions

### Stack — ponytail choice
- **Static HTML + Tailwind CDN + vanilla JS** for the duplicate (no build, single `index.html` can be opened). `// ponytail: zero build step, move to Next.js + Shopify Storefront API when dynamic cart/checkout needed`
- No new deps. Native `<input type="number">`, `<details>` for filters on mobile, CSS grid for product layout. Lenis smooth scroll added per UI-stack rule.
- Data: `src/data/products.json` with 85 records (title, handle, image, price, compare_at) — seeded from the p3 fetch; images hotlink to `posterdrip.in/cdn/...` for now.

### Legal / assets
- **Do NOT bulk-copy 85 images to repo.** Hotlink with `referrer` intact for dev; production must use client-owned CDN or Shopify Files API with permission. Disclaimer kept verbatim in footer. If client lacks rights to a poster, replace with placeholder. `// ponytail: hotlink now, `

### Laptop optimization (the "fix")
- Container: `max-w-[1440px] mx-auto px-6 lg:px-8`
- Grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6` gap `16px → 20px` on xl. Card min 168px, max 280px.
- Layout: `lg:flex` → left `aside` 280px sticky `top-[88px] h-[calc(100vh-88px)] overflow-auto` for filters+sort; right flex-1 for grid. Drawer kept for <1024px.
- Header: 88px tall on laptop, mega-menu on hover with 200ms delay + focus support, search/cart sticky.
- Hero: `h-[360px] lg:h-[420px]` object-cover, `srcset` 800/1200/1800, lazy second slide.
- Performance: `loading="lazy"` on cards beyond first 8, `fetchpriority="high"` on hero-1.

### Design tokens (kept from original)
- Colors: `#0a0a0a` (announcement/footer bg), `#ffffff`, `#e11d48` (sale), `#111827` (text), `#f3f4f6` (muted)
- Type: System sans (original uses Shopify Sans/Helvetica). Keep 1 font, no Google Fonts weight bloat.
- Radius: `8px` cards, `9999px` badges
- Price: Show `₹30` sale, `₹149` strikethrough, `Sale` pill — matches original but fixes `From` inconsistency (show `From` only when variant price range).

### What we deliberately SKIP (YAGNI)
- No custom date picker, no UI lib — native controls cover filters.
- No auth / cart backend — cart is `localStorage` mock; wire to Shopify Storefront API later.
- No interface with one implementation (no PosterService factory).
- No i18n, no dark mode toggle, no CMS — add when requested.

### File map
```
redesign poster/
  docs/DECISIONS.md          ← this file
  index.html                 ← pixel-accurate duplicate (laptop-optimized)
  src/data/products.json     ← 85 products (seed = 20 from p3 + 65 placeholder)
  src/js/app.js              ← filter/sort/pagination/cart (vanilla)
  README.md                  ← how to run
```

## 4. Next steps

1. Client confirms asset rights + provides Shopify Storefront token if checkout needed.
2. Swap hotlinked images for optimized `cdn/shop/files` with `?width=360,533,720` srcset.
3. Wire `index.html` → Next.js (`/collections/[handle]`) when SSR/SEO needed.
4. Add Playwright visual diff vs `posterdrip.in/collections/tamil-cinema?page=3` for pixel check.

## 5. How to verify

Open `index.html` directly or `npx serve .` → compare side-by-side at 1366px and 1920px. Grid should show 5 and 6 cols respectively; filters sticky on desktop, drawer on mobile; Lighthouse perf >90 with lazy images.
