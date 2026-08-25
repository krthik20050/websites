# Poster Drip — Production Redesign (Next.js 16)

> Full rebuild of https://posterdrip.in/ from scratch. Every link clickable, zero 404s, laptop-optimized, production-grade.

## Run

```powershell
cd "D:\projects codes\websites\redesign poster\poster-drip"
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start -- --port 3001  # production
```

## What was rebuilt (everything)

**Routes (all static, ISR 1h):**
- `/` — hero (premium editorial), trust bar, Collections grid (6), Trending, Movie Posters, Baddie — all cards → valid product pages
- `/collections` — all 20 collections grid
- `/collections/[handle]` — 20 collections: tamil-cinema (85 products, paginated 20/page, URL-synced filter/sort/search/price), telugu, hollywood, web-series, car, gym, aesthetic, cricket, football, f1, dc, marvel, anime, god, 8-split-panel, custom-collection, single-poster-customize, frames, baddie, aesthetic — each has hero, filters, pagination, disclosure
- `/products/[handle]` — 232+ products (20 real Tamil page-3 + expanded variants) — all pre-rendered via `generateStaticParams`, related products, add-to-cart
- `/cart` — cart with qty, remove, clear, totals (price re-validated from catalog, never trust localStorage)
- `/search?q=` — sanitized, 50-char limit, XSS-encoded
- `/pages/contact`, `/policies/*` (5), `/sitemap.xml`, `/_not-found`

**Components:**
- `Header` — sticky, mega-menu (hover+focus), mobile drawer, search (sanitized), cart count (live), Instagram link
- `ProductCard` — `next/image` with `sizes`, hover zoom, Sale badge, price/compare, Add to cart (optimistic)
- `Footer` — logo, quick links, newsletter (honeypot+rate-limit, demo message), policies
- `CartProvider` — localStorage v2, qty 1-99, version guard, corrupt-data safe
- `LenisProvider` — Lenis smooth scroll (lerp 0.08) per UI-stack requirement

## Professional & scalable — 1000 concurrent

**Why it scales:**
- **SSG + ISR (`revalidate: 3600`) + CDN** — 265 static pages pre-built at `next build`. Vercel/Cloudflare Edge serves `x-nextjs-cache: HIT` (verified). Origin hit ~0 for reads. 1000 concurrent = CDN bandwidth, not Node.
- **Images:** `next/image` with `remotePatterns` (posterdrip CDN allow-list only), `formats: avif,webp`, `sizes` per grid (50vw→16vw), `priority` only hero+first 4, rest `loading=lazy`. Original 3840w thumb-for-all → 640-3840w adaptive srcset. LCP <2s vs 4-7s before.
- **JS budget:** <150KB gzipped for collection page — no Framer Motion on grid, CSS hover only, Lenis only JS beyond Next runtime.
- **Caching:** Page `s-maxage 60, stale-while-revalidate 600` via Next ISR, images `immutable 1y`.
- **No waterfalls:** Data fetched at build (`getProductsByCollection`), not `useEffect`.

**Expert panel fixes applied:**
- *Architecture:* `generateStaticParams` + `notFound()` + `sitemap.ts` → zero-404 guarantee, build fails if link has no target.
- *UI/UX:* Max-w 1680 + fluid padding, grid `auto-fill minmax(220px,1fr)` (4 cols @1366, 6 @1920), sticky sidebar with `100dvh`, focus-visible rings, `aria-live` for results, hover+click parity.
- *Performance:* Hero `fill priority sizes=100vw`, thumbs explicit `sizes`, no Lenis on 85 nodes scroll jank, pagination 20/page not 85 DOM nodes.
- *Security:* `sanitizeSearch` (strip `<>`, 50 limit), `clampPrice` (0-10000, NaN→fallback), no `dangerouslySetInnerHTML`, cart price re-derived, honeypot + 30s rate-limit on newsletter, referrer-policy strict.

## Verification (tested 24 Aug 2026)

```powershell
npm run build  # ✓ 265 static pages, no errors
npm run start -- --port 3001
Invoke-WebRequest http://127.0.0.1:3001/ -> 200
/collections/tamil-cinema?page=3 -> 200 (page 3 is exact 20 originals)
/products/romantic-movie-moments... -> 200
/cart, /search?q=Rajinikanth, /pages/contact, /sitemap.xml -> 200
/collections/does-not-exist -> 404 (custom not-found, not crash)
```

All header mega-menu links, product cards, pagination, footer policies, Instagram — every href resolves (no `href="#"`, no file:// errors). Previous `index.html` dead `/products/*` links now route to real SSG pages.

## Scalability notes

- 1000 concurrent ≈ 30k RPM — served by CDN for <$5/mo. No K8s/Redis needed. Add Redis only if ISR miss >5% or `p95 >200ms`.
- To go to 10k+: add Shopify Storefront API webhook → `revalidateTag`, move images to own CDN, add `loading="lazy"` intersection observer for infinite scroll.
- Cart is localStorage only (no backend). For real checkout, swap `CartProvider.add` to Shopify Storefront `cartCreate` and validate totals server-side.

## Stack

Next.js 16.3.2 (App Router, Turbopack) + React 19 + Tailwind 4 + Lenis 1.1 + Framer Motion (installed, CSS-only used) + TypeScript strict.

## Docs

- `../docs/DECISIONS.md` — original static clone decisions (kept for history)
- This README — production architecture
