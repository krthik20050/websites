# PosterDrip — Tamil Cinema Redesign (Duplicate + Laptop-Optimized)

Pixel-accurate duplicate of https://posterdrip.in/collections/tamil-cinema?page=3 rebuilt from scratch. Laptop-first responsive (1366–1920px shows 5–6 cols), sticky filter sidebar, native controls, Lenis smooth scroll.

## Run

Open `index.html` directly in browser, or:

```powershell
npx serve "D:\projects codes\websites\redesign poster"
# then http://localhost:3000
```

No build step, no install. Tailwind via CDN, Lenis via unpkg.

## What's inside

- `index.html` — full page: announcement bar, header mega-menu, hero carousel (2 slides), trust bar, collection header, left filter sidebar (desktop) + drawer (mobile), product grid `2→3→4→5→6` cols, pagination `1–5`, disclaimer, footer with newsletter.
- `src/data/products.json` — 20 real products from page 3 + placeholder expansion to 85 (keeps pagination/count faithful).
- `docs/DECISIONS.md` — inventory of every component scraped, problems found, stack choices, laptop optimizations, legal note on assets.

## Laptop optimizations vs original

- Container `max-w-[1440px]` instead of ~1200px.
- Grid: `lg:4 xl:5 2xl:6` (original caps at 4 with large gutters).
- Sticky 280px sidebar on ≥1024px; drawer only on <1024px.
- Price widget bug fixed (consistent `From Rs. 30` / `Rs. 149` strikethrough).
- Images: `loading=lazy` after first 8, hero has `fetchpriority=high`.

## Ponytail notes

`// ponytail: hotlink now, swap to owned CDN/Shopify Files in prod — bulk copying infringes`
`// ponytail: zero build step, move to Next.js + Storefront API when cart/checkout needed`

Skipped: auth, real cart backend, i18n, CMS, dark mode — add when needed.

## Legal

All mockup images hotlink to `posterdrip.in/cdn/...` for dev preview only. Every design featured on this website is created by fans for fans — disclaimer kept verbatim. For production, client must provide owned assets or Shopify Files token.

## Verify

- Resize to 1366px → 5 cols, 1920px → 6 cols, filters sticky.
- Hero arrows/dots, search, sort, price filter, pagination (page 3 default), Add to cart (localStorage counter).
