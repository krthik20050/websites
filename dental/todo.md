# Project: Premium Dental Clinic Website

## 0. Context

- **What we're building:** A premium single-doctor dental clinic website. Dark theme. High-trust. Conversion-first. Not a portfolio — a patient acquisition machine.
- **Design direction:** Near-black background (#0A0C0F range), surgical glowing white typography, single accent (cold blue or warm gold — pick one, lock it). Two signature visuals: a glowing white organic tree (SVG, draw-on animation) and a 3D rotating tooth (WebGL, rim-lit like enamel). Scroll-triggered reveals throughout. Editorial layout, not clinic brochure.
- **Stack decision (make this call before Phase 1):** Next.js (App Router) + Tailwind + GSAP + Three.js. If team is smaller or timeline is tight: Astro + vanilla JS + GSAP. Do not use a page builder.
- **Target:** Lighthouse score 90+ on mobile. LCP < 2.5s. CLS < 0.1. Everything else is secondary to these.

---

## 1. Setup Phase

> ⚠️ Do not write any component code until this entire phase is checked off.

### Project Structure

- [ ] Create root project folder: `dental-clinic/`
- [ ] Subdirectory structure:

```
dental-clinic/
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── doctor/
│   │   ├── clinic/
│   │   ├── before-after/
│   │   └── team/
│   ├── models/          ← 3D tooth .glb file goes here
│   └── icons/
├── src/
│   ├── components/
│   │   ├── ui/          ← buttons, inputs, cards (atomic)
│   │   ├── sections/    ← hero, services, testimonials (page-level)
│   │   └── layout/      ← navbar, footer, page wrapper
│   ├── pages/ (or app/ if Next.js App Router)
│   ├── styles/
│   │   ├── globals.css
│   │   └── tokens.css   ← all CSS variables: colors, spacing, type
│   ├── lib/             ← utility functions, animation helpers
│   └── data/            ← services.json, testimonials.json, faq.json
├── .env.local
├── .gitignore
└── README.md
```

### Naming Conventions

- [ ] Components: PascalCase (`HeroSection.jsx`, `ServiceCard.jsx`)
- [ ] CSS classes: kebab-case (`hero-section`, `service-card`)
- [ ] Data files: camelCase keys (`serviceName`, `doctorBio`)
- [ ] Images: lowercase-hyphenated (`dr-sharma-portrait.jpg`, `before-veneer-01.jpg`)
- [ ] No abbreviations in file names. Ever.

### Version Control

- [ ] `git init`
- [ ] Create `.gitignore` — include `node_modules/`, `.env.local`, `.DS_Store`, `/public/models/*.glb` if large (use Git LFS for 3D assets over 50MB)
- [ ] Initial commit: project scaffold only, zero code
- [ ] Branch strategy: `main` (production), `dev` (integration), feature branches off `dev` named `feat/hero-section`, `feat/booking-form`, etc.
- [ ] Set up remote (GitHub/GitLab). Private repo.

### Routing / Pages Structure

- [ ] Lock these routes before writing any page:

| Route | Page |
|---|---|
| `/` | Homepage |
| `/about` | Doctor + Clinic |
| `/services` | Services overview |
| `/services/[slug]` | Individual service detail |
| `/book` | Appointment booking |
| `/contact` | Contact + Map |
| `/blog` (optional) | Articles — add only if content plan exists |
| `/privacy` | Required for booking form compliance |

> ⚠️ Do not create a route without knowing exactly what content fills it. Empty pages destroy SEO and trust.

---

## 2. Research Lock-in

> ⚠️ Skip this and the UI will be built on assumptions. Don't skip.

### Competitor Analysis

- [ ] Open 8–10 dental clinic websites (mix of global premium + local competitors)
- [ ] For each site, document in a spreadsheet:
  - Homepage sections (in order, top to bottom)
  - Where is the first CTA
  - Mobile experience rating (1–5)
  - Page load feel (fast / acceptable / slow)
  - What they do that works
  - What they do that doesn't

**Sites worth analyzing:**
- Pacific Dental Services
- Bupa Dental (UK)
- Aspen Dental
- Smile Stylist NYC
- Any 3–4 local competitors in the same city as the client

- [ ] Note every section type that appears in 5+ sites — those are non-negotiable inclusions
- [ ] Note every section type that appears in 1–2 sites — evaluate if worth including

### Booking Flow Documentation

- [ ] Complete a real booking flow on at least 3 competitor sites (go all the way through)
- [ ] Document: number of steps, fields required, mobile usability, confirmation behavior
- [ ] Define our maximum: 3 fields on the first screen (name, phone, service). That's it.

### Trust Element Audit

- [ ] List every trust signal seen across competitor sites
- [ ] Categorize: certification logos / review widgets / patient photos / video testimonials / procedure counts / doctor credentials
- [ ] Mark which the client can actually provide — do not design around trust elements you don't have assets for

### Section Finalization

- [ ] Lock the definitive list of sections for homepage (no changes after this)
- [ ] Lock the section order
- [ ] Get client sign-off on section list before moving to Phase 3

---

## 3. UI Structure Planning

### Homepage Section Breakdown

Document each section with:
- Section name
- Component(s) it contains
- Data source (static / CMS / API)
- Priority (above fold / first scroll / deep scroll)

| # | Section | Key Components | Data Source | Priority |
|---|---|---|---|---|
| 1 | Navbar | Logo, NavLinks, BookCTA | Static | Above fold |
| 2 | Hero | Headline, SubCopy, DualCTA, TrustStrip, HeroVisual (tree + tooth) | Static | Above fold |
| 3 | Services Grid | ServiceCard ×6–8 | `services.json` | First scroll |
| 4 | About Doctor | DoctorPhoto, BioText, CredentialBadges | Static / CMS | First scroll |
| 5 | Trust Cluster | AccreditationLogos, StatCounters, TechBadges | Static | Mid scroll |
| 6 | Testimonials | TestimonialCard, GoogleRatingWidget, BeforeAfterGallery | `testimonials.json` + Google API | Mid scroll |
| 7 | Booking CTA Band | Headline, BookingForm (minimal) | Form handler | Mid scroll |
| 8 | Location + Hours | Map (lazy), AddressBlock, HoursTable | Static | Deep scroll |
| 9 | Footer | NavLinks, ContactInfo, LegalLinks, EmergencyStrip | Static | Footer |

### Component Inventory

- [ ] Map every reusable component before building anything:

**Atomic (ui/):**
- `Button` — variants: primary, secondary, ghost, emergency
- `Input` — text, tel, select, date
- `Card` — variants: service, testimonial, blog
- `Badge` — credential, accreditation
- `Tag` — service category label

**Section (sections/):**
- `HeroSection`
- `ServicesGrid`
- `ServiceCard`
- `DoctorBio`
- `TrustCluster`
- `TestimonialsRow`
- `BookingForm`
- `LocationBlock`

**Layout (layout/):**
- `Navbar` (sticky, transparent → solid on scroll)
- `Footer`
- `PageWrapper` (handles scroll listeners, page transition)
- `SectionWrapper` (handles scroll-reveal for any child section)

- [ ] For each component, note: accepts props? has animation? has mobile variant?
- [ ] No component should do more than one thing. If it's doing two things, split it.

### Layout Hierarchy

- [ ] Define max-width container: recommend `1280px` centered, `1440px` max for hero
- [ ] Define vertical section rhythm: consistent `padding-block` values — `5rem` mobile, `8rem` desktop minimum
- [ ] Define grid system: 12-column for desktop, 4-column for mobile
- [ ] Define z-index layers: background (0), content (10), sticky nav (100), modals (200), toasts (300)

---

## 4. Design Direction Lock

> ⚠️ Nothing gets built until every item in this phase is agreed and documented. Changing colors or typography after build begins is expensive.

### Color System

- [ ] Define and document in `tokens.css`:

```
Background layers:
  --bg-base: #0A0C0F
  --bg-surface: #141618
  --bg-elevated: #1C1F23

Text:
  --text-primary: #FFFFFF
  --text-secondary: rgba(255,255,255,0.65)
  --text-muted: rgba(255,255,255,0.35)

Accent (choose ONE, lock it):
  Option A — Cold blue: #4A9FFF (trust, precision)
  Option B — Warm gold: #C9A96E (luxury, premium)

Glow:
  --glow-white: rgba(255,255,255,0.08) — ambient
  --glow-accent: [accent color at 0.15 opacity] — on CTAs

Borders:
  --border-subtle: rgba(255,255,255,0.08)
  --border-visible: rgba(255,255,255,0.15)

Status:
  --emergency: #FF4D4D
```

- [ ] Confirm contrast ratios meet WCAG AA: text-secondary on bg-base must pass 4.5:1

### Typography System

- [ ] Select and load display font — options worth considering:
  - Cormorant Garamond (heritage, elegant) — use for hero headline only
  - DM Serif Display (modern editorial)
  - Syne (geometric, clinical)
  - Avoid: Inter, Roboto, Open Sans, Poppins — all overused

- [ ] Select body font — options:
  - DM Sans (readable on dark, warm)
  - Plus Jakarta Sans (clean, contemporary)
  - Outfit (slightly clinical, works well here)

- [ ] Lock type scale (define in `tokens.css`):

```
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem (16px minimum body)
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 2rem
--text-4xl: 2.75rem
--text-5xl: 3.75rem
--text-hero: clamp(3rem, 6vw, 5.5rem)
```

- [ ] Font weights on dark: minimum 400 body, 600 subheadings, 700 CTAs. Nothing below 400 on dark bg.
- [ ] Line height: 1.6–1.75 for body. 1.1–1.2 for display headings.

### Animation Style

- [ ] Document animation rules:

```
Standard reveal duration: 600ms
Standard reveal easing: cubic-bezier(0.22, 1, 0.36, 1)
Delay stagger between cards: 80ms
Hover transition: 250ms ease
Tree draw-on duration: 2400ms total (staggered per path)
Tooth entry: 1200ms ease-out, no bounce
Navbar scroll transition: 300ms
Page transition (if used): 400ms fade
```

- [ ] Confirm: scroll reveals are triggered at 20% element visibility (not 0%)
- [ ] Confirm: all animations respect `prefers-reduced-motion` — document this in code comments when building

### Hero Visual Concepts

**Tree:**
- [ ] Decide: SVG drawn in Figma / Illustrator or programmatically generated
- [ ] Tree is composed of multiple SVG `<path>` elements, each animated with `stroke-dashoffset`
- [ ] Tree occupies right 40% of desktop hero, full background (opacity 0.15) on mobile
- [ ] Animation trigger: on page load, after 400ms delay (let headline render first)
- [ ] Total path count: keep under 30 paths for performance

**Tooth:**
- [ ] Source a real dental 3D model (.glb format) — see Resources section
- [ ] Material: physically-based, enamel-like (slight subsurface scatter, specular highlight)
- [ ] Lighting: single key light (cool white, 3 o'clock position), rim light (accent color, warm)
- [ ] Animation: auto-rotate Y-axis, 0.3 rad/s, loop. Pause on hover.
- [ ] Canvas size: 400×400 desktop, 280×280 mobile
- [ ] WebGL context: destroy and rebuild on visibility (don't keep GPU active when off-screen)

### UI Consistency Rules

- [ ] All cards: `border-radius: 12px`, `border: 1px solid var(--border-subtle)`, `background: var(--bg-surface)`
- [ ] All primary buttons: accent color bg, white text, no border-radius above 8px (clinic = precision, not bubbly)
- [ ] All section headlines: display font, centered on mobile, left-aligned on desktop
- [ ] No pure black (#000000) anywhere. No pure white (#FFFFFF) for backgrounds. Ever.
- [ ] Shadows: `box-shadow: 0 4px 24px rgba(0,0,0,0.4)` — dark theme shadows must be opaque-dark, not light

---

## 5. Resource Collection

### 🔗 GitHub Repos

| Repo | What It Is | Why We're Using It | When to Use |
|---|---|---|---|
| `pmndrs/react-three-fiber` | React renderer for Three.js | Cleaner component-based 3D integration if using React | When building the 3D tooth component |
| `mrdoob/three.js` | Core WebGL/3D library | Industry standard for 3D in browser | Base layer under react-three-fiber or direct use |
| `pmndrs/drei` | Three.js helpers (OrbitControls, Environment, etc.) | Saves hours on lighting/controls setup | Environment maps, camera control for tooth |
| `greensock/GSAP` | Professional JS animation | Most reliable scroll + timeline animation library | Tree draw-on, scroll reveals, navbar transitions |
| `juliangarnier/anime` | Lighter animation alternative | Smaller bundle if GSAP is overkill | Only if performance budget is very tight |
| `studio-freight/lenis` | Smooth scroll library | Elevates scroll feel significantly on desktop | Wrap entire site — initialize once in layout |
| `formkit/auto-animate` | Auto list/DOM animations | Zero-config entrance animations for simple lists | Testimonial rotation, FAQ accordion |

### 🎨 UI Inspiration

| Source | What to Look At |
|---|---|
| Awwwards.com | Filter: medical, clinic, luxury — study dark-theme nominees |
| Dribbble (search "dental clinic dark UI") | Card layouts, hero structures, color usage |
| Behance (search "medical website dark") | Full case studies with rationale |
| Cosmos (design system examples) | Motion and interaction patterns |
| Dark Design (darkdesign.app) | Curated dark UI references |

### 🦷 3D Tooth Assets

| Source | What It Is | Notes |
|---|---|---|
| Sketchfab.com | Search "molar tooth" — many free .glb files | Filter by license: CC0 or CC-BY for commercial use |
| TurboSquid | Paid, higher quality | Worth it for a ₹5L project |
| CGTrader | Mid-range paid options | Good quality/price ratio |
| Custom commissioned | Freelance 3D artist via Fiverr/Upwork | Only if none of the above look premium enough |

> After sourcing: open in Blender, clean topology, apply PBR enamel material, export as compressed .glb. Target file size: under 800KB.

### 🎞️ Animation Libraries

| Library | Purpose | Bundle Size | When to Use |
|---|---|---|---|
| GSAP (core + ScrollTrigger) | Scroll animations, timeline sequences | ~60KB gzipped | Primary animation engine |
| Three.js | 3D tooth rendering | ~600KB — load async | WebGL context only |
| Lenis | Smooth scroll behavior | ~4KB | Wrap entire app |
| Framer Motion | React-specific component animations | ~50KB | If using Next.js, for page transitions and component reveals |
| CSS (native) | Hover states, simple transitions | 0KB | Always try CSS first |

### 🔤 Fonts

| Font | Use Case | Source |
|---|---|---|
| Cormorant Garamond | Hero headline display | Google Fonts |
| DM Sans | Body text, UI labels | Google Fonts |
| Variable font versions | Preferred — single file, weight axis | Google Fonts variable API |

> Load fonts via `font-display: swap`. Self-host if performance allows — eliminates Google Fonts DNS lookup.

### 🔷 Icons

| Library | Notes |
|---|---|
| Lucide Icons | Clean, consistent, tree-shakeable. Best choice. |
| Phosphor Icons | More variety, also tree-shakeable |
| Custom SVG icons | For service category icons — commission or illustrate for uniqueness |

---

## 6. Page-by-Page Planning

### Homepage

**Hero Section**
- [ ] Headline: short, bold, specific claim (max 8 words)
- [ ] Sub-headline: one sentence addressing patient's emotional state
- [ ] CTA layout: primary button left, secondary link right — side by side on desktop, stacked on mobile
- [ ] Trust strip: 4 items — Google Rating / Years Experience / Procedures Done / Insurance Accepted — horizontal strip below CTA block
- [ ] Hero visual: tree SVG (right side, desktop) + tooth canvas (floating, overlapping tree slightly)
- [ ] Background: near-black with very subtle radial gradient from center (adds depth, not color)
- [ ] Mobile: tree becomes background element at 15% opacity, tooth hides or scales down below hero text

**Scroll Flow Planning**
- [ ] Confirm scroll order communicates: Trust → Recognition → Proof → Relationship → Action
- [ ] Define which sections get scroll-triggered entrance (all of them) vs auto-visible (hero, navbar)
- [ ] Map exact scroll percentage at which each section animates in

---

### About Page

- [ ] Doctor portrait: full viewport height on desktop, warm but professional — not in scrubs staring at camera
- [ ] Bio structure: Personal hook (why dentistry) → Credentials (listed clearly) → Philosophy statement → Team (if applicable)
- [ ] Credentials layout: use a grid of badge cards — clean, scannable, not a wall of text
- [ ] Add one quote pulled out in large display type — something the doctor actually said, not marketing copy
- [ ] CTA: "Meet [Doctor Name] — Book a Consultation" at bottom of page

---

### Services Page

**Category Structure**
- [ ] Preventive Care
- [ ] Cosmetic Dentistry
- [ ] Restorative Dentistry
- [ ] Emergency Dental
- [ ] Orthodontics (if offered)
- [ ] Pediatric Dentistry (if offered)

**Services Overview Layout**
- [ ] Category tabs or horizontal filter at top
- [ ] Service cards below (icon + name + one-liner + Learn More link)
- [ ] Cards animate in on tab switch (not page reload)

**Individual Service Page (`/services/[slug]`)**
- [ ] Template sections (same for all services):
  1. Service name + category breadcrumb
  2. What is this (2–3 sentences, plain language)
  3. Who needs it
  4. What to expect — step by step (numbered, not bullets)
  5. Duration + recovery
  6. Cost range (optional — client decision)
  7. Testimonial specific to this service
  8. Related services (2–3 cards)
  9. Sticky bottom bar on mobile: "Book [Service Name]" button

- [ ] All service pages use the same template component — data from `services.json`
- [ ] Each service page must have unique meta title and description — define these in `services.json`

---

### Contact / Booking Page

**Form Structure**
- [ ] Step 1 (first screen): Name, Phone Number, Service Needed (dropdown)
- [ ] Step 2 (after submit or on same screen): Preferred Date, Preferred Time, Notes (optional)
- [ ] No more than 5 fields total. Ever.
- [ ] Validation: phone number format, required fields only
- [ ] Submit: POST to backend or form service (Formspree / custom API endpoint)
- [ ] On success: confirmation message on page + auto WhatsApp message trigger (if client has WhatsApp Business API set up)

**UX Flow**
- [ ] Form must be usable in one hand on mobile
- [ ] Date picker: native `<input type="date">` on mobile (native is faster and more accessible than custom pickers)
- [ ] Service dropdown: pre-select if user arrived from a service page (pass query param)
- [ ] Loading state on submit: button shows spinner, disabled during request
- [ ] Error state: inline field errors, not a modal or toast

**Map**
- [ ] Embedded Google Map — lazy loaded only when section enters viewport
- [ ] Alternative for performance: static map image that links to Google Maps on click
- [ ] Show parking/transport info as text below map — patients hate guessing where to park

---

## 7. Feature Planning

### Appointment Booking Flow
- [ ] Booking form on `/book` page (full) + compact version embedded in homepage
- [ ] Homepage form: name + phone + service only — submits to same endpoint
- [ ] On mobile: booking CTA in navbar opens a bottom sheet modal, not a page redirect
- [ ] Form data goes to: email notification to clinic + CRM/spreadsheet if client has one
- [ ] Response time promise displayed on form: "We'll confirm within 2 hours during working hours"
- [ ] After booking: send SMS/WhatsApp confirmation (requires Twilio or WhatsApp Business API — confirm with client)

### Contact System
- [ ] Emergency phone number: always visible in header, styled differently (red/accent)
- [ ] WhatsApp button: fixed position bottom-right on all pages (mobile only)
- [ ] Contact form on `/contact` (separate from booking — this is for general enquiries)
- [ ] Response to contact form: auto-reply email acknowledging receipt

### Testimonials System
- [ ] Static testimonials from `testimonials.json` — 3 featured on homepage, full list on `/testimonials` or about page
- [ ] Google Reviews widget: embed via Google My Business API or use a third-party widget (Elfsight, ReviewsOnMyWebsite)
- [ ] Before/After gallery: `/gallery` page or modal — images served as WebP, lazy loaded, click to expand
- [ ] Each testimonial must have: patient first name, neighborhood, treatment received, photo (real or avatar if no photo)

### Navigation Behavior
- [ ] Desktop: transparent on hero, transitions to solid `--bg-surface` on scroll past hero
- [ ] Mobile: hamburger → full-screen overlay menu (not a sidebar — sidebars are dated)
- [ ] Active link indicator: subtle accent underline, not bold or color change
- [ ] "Book Now" button in nav: always accent-colored, never transparent
- [ ] Scroll-to-top button: appears after 2 viewport heights of scrolling

### Mobile Responsiveness Plan
- [ ] Build mobile layout first, then expand to desktop (mobile-first CSS)
- [ ] Breakpoints: 375px (small mobile), 768px (tablet), 1024px (small desktop), 1280px (standard)
- [ ] Touch targets: minimum 44×44px for all tappable elements
- [ ] Test on real devices: iPhone SE (smallest), Android mid-range, iPad
- [ ] Disable Three.js tooth on devices with `navigator.hardwareConcurrency <= 4` (low-end devices)

---

## 8. Animation Planning

### Scroll Animation Mapping

| Section | Animation | Trigger | Duration |
|---|---|---|---|
| Hero headline | Fade up + slight blur clear | On load, 200ms delay | 700ms |
| Hero sub-copy | Fade up | On load, 400ms delay | 600ms |
| Hero CTAs | Fade up | On load, 600ms delay | 500ms |
| Trust strip | Fade in left-to-right stagger | On load, 800ms delay | 400ms each |
| Services cards | Staggered fade up | Scroll: 20% section visible | 500ms, 80ms stagger |
| Doctor bio | Slide in from left (photo) + fade right (text) | Scroll | 700ms |
| Trust stats | Counter tick up | Scroll: number enters viewport | 1200ms |
| Testimonials | Fade up, staggered | Scroll | 500ms, 120ms stagger |
| Booking form | Fade in + slight scale from 0.97 | Scroll | 600ms |
| Footer | No animation — just renders | — | — |

### Hero Animation Concept
- [ ] Sequence (milliseconds from page load):
  - 0ms: Page renders, background visible
  - 200ms: Headline fades up
  - 400ms: Sub-copy fades up
  - 600ms: CTAs fade up
  - 800ms: Trust strip fades in
  - 1000ms: Tree SVG begins drawing (paths animate stroke-dashoffset over 2400ms)
  - 1200ms: Tooth canvas fades in and begins rotation

- [ ] If user has slow connection: tree and tooth are progressive enhancement — site functions fully without them

### 3D Tooth Interaction Planning
- [ ] Default: auto-rotate Y-axis, continuous, slow
- [ ] On hover: pause rotation, allow manual orbit (OrbitControls with limited polar angle)
- [ ] On mobile: no orbit control — just auto-rotate (touch orbit feels clunky)
- [ ] On scroll past hero: tooth canvas pauses render to save GPU cycles
- [ ] Camera: fixed position, orthographic-feel (FOV 30–35 degrees) — makes tooth look precise, not distorted
- [ ] Post-processing: subtle bloom on specular highlights — adds the "glow" without being heavy

### Micro-interactions
- [ ] Buttons: background lightens 15% on hover, scale 1.02, shadow strengthens — all 250ms
- [ ] Service cards: translate Y -6px on hover, border color shifts to accent — 250ms
- [ ] Nav links: underline draws left-to-right on hover — CSS only, no JS
- [ ] Doctor photo: very subtle scale 1.02 on hover — 400ms ease
- [ ] Input fields: border shifts from `--border-subtle` to `--border-visible` on focus, accent color on valid state
- [ ] WhatsApp button: gentle pulse animation (scale 1.0 → 1.08 → 1.0) every 4s — draws attention without being annoying

### Performance Rules for Animations
- [ ] All GSAP ScrollTrigger instances: use `once: true` for one-time reveals (no re-trigger on scroll-up)
- [ ] Three.js render loop: only call `renderer.render()` inside `requestAnimationFrame`, stop loop when canvas off-screen
- [ ] Tree SVG: total DOM path elements under 30. More than that, merge paths in vector editor.
- [ ] Test all animations with Chrome DevTools "Rendering" panel — FPS must stay above 55 on a mid-range machine
- [ ] Wrap all animations in `prefers-reduced-motion` media query check — fallback to instant state

---

## 9. Optimization Planning

### Performance Strategy
- [ ] Images: convert all to WebP format. Serve responsive sizes with `srcset`.
- [ ] Before/after gallery: load thumbnails only, full-res on lightbox open
- [ ] Three.js: dynamically import — do not include in initial JS bundle
- [ ] GSAP ScrollTrigger: import only ScrollTrigger, not all GSAP plugins
- [ ] Fonts: subset to Latin characters only (remove unused glyphs — reduces font file ~60%)
- [ ] Google Maps: replace embed with static screenshot image linking to maps (saves ~300KB on load)
- [ ] Third-party scripts (chat widget, reviews): load with `defer` attribute, initialize after `load` event
- [ ] Target metrics: LCP < 2.5s, FID < 100ms, CLS < 0.1, TBT < 200ms

### Accessibility Considerations
- [ ] All images: meaningful `alt` text (not "image1.jpg")
- [ ] Color contrast: test every text/background combination against WCAG 2.1 AA
- [ ] Keyboard navigation: test entire booking flow without mouse
- [ ] Focus indicators: visible, styled to match accent color (browsers default is acceptable but custom is better)
- [ ] Form labels: always use `<label>` elements — no placeholder-as-label
- [ ] Tooth canvas: `aria-hidden="true"` — it's decorative, not informational
- [ ] Skip link: `<a href="#main-content">` as first focusable element in page
- [ ] Reduced motion: wrap all GSAP and CSS transition logic in motion preference check

### SEO Basics (Structure Level)
- [ ] One `<h1>` per page — never more
- [ ] Page title format: `[Page Name] | [Clinic Name] | [City]`
- [ ] Meta descriptions: unique per page, 140–160 characters, include primary keyword
- [ ] Semantic HTML: `<header>`, `<main>`, `<section>`, `<article>`, `<footer>` — not `<div>` for everything
- [ ] Structured data: `LocalBusiness` schema on homepage, `MedicalBusiness` subtype, `FAQPage` schema on FAQ section
- [ ] Canonical tags: on all pages
- [ ] XML sitemap: generate and submit to Google Search Console
- [ ] `robots.txt`: block `/book/confirmation` from indexing (thin page, no SEO value)
- [ ] Image file names: descriptive and keyword-relevant before upload

### Mobile-First Adjustments
- [ ] Write all CSS mobile-first: base styles for 375px, `@media (min-width: 768px)` upward
- [ ] Hero: on mobile, tree SVG is background layer at low opacity — not a dominant element
- [ ] Navigation: hamburger menu tested on 320px width minimum
- [ ] Booking form: single-column layout, large touch targets, native date/time inputs
- [ ] Three.js tooth: render at 50% resolution on mobile (`renderer.setPixelRatio(1)` regardless of device pixel ratio)
- [ ] Typography: no text below 14px on mobile (ever)
- [ ] Tap-to-call: phone numbers as `<a href="tel:...">` — not plain text

---

## 10. Final Checklist Before Build

### Content

- [ ] Doctor's real photos received from client (minimum: 1 hero portrait, 3 candid/clinic shots)
- [ ] Clinic interior photos received (minimum: 4 clean shots)
- [ ] Before/after photos received (minimum: 6 pairs, patient consent confirmed)
- [ ] Doctor bio written and approved by doctor
- [ ] All service descriptions written (plain language, no jargon)
- [ ] Testimonials collected (name, neighborhood, treatment, photo or consent for avatar)
- [ ] Clinic address, hours, phone confirmed in writing
- [ ] Insurance / payment information confirmed
- [ ] Google Business profile verified (for review widget integration)

### Design

- [ ] Color tokens finalized and documented
- [ ] Typography locked (fonts loaded, scale defined)
- [ ] Component designs reviewed (at least Figma wireframes for: hero, services grid, booking form, mobile nav)
- [ ] Animation behavior documented (timings, easing, triggers)
- [ ] 3D tooth asset sourced and tested in browser
- [ ] Tree SVG created and path structure confirmed

### Technical

- [ ] Project scaffold committed to git
- [ ] All dependencies listed and version-locked in `package.json`
- [ ] Environment variables defined (form endpoint, Google Maps API key, any CMS API keys)
- [ ] Hosting platform decided (Vercel recommended for Next.js — deploy preview on every PR)
- [ ] Domain confirmed, DNS access available
- [ ] SSL: confirm HTTPS (automatic on Vercel/Netlify)
- [ ] Form submission endpoint ready (backend route or Formspree project created)

### UX

- [ ] Complete user flow tested on paper/wireframe: land → scroll → book
- [ ] Mobile booking flow tested on wireframe: tap → form → submit → confirmation
- [ ] Emergency contact visible in every screen test
- [ ] No section is missing a CTA (every section has a next step)

### Team

- [ ] Everyone on the dev team has read this doc
- [ ] Design tokens committed to repo before any component work starts
- [ ] Code review process defined (who reviews PRs before merge to `dev`)
- [ ] Client communication channel established (weekly update, change request process)

---

## ⚠️ Developer Notes

**Animations:**
- Three animations max that the user consciously notices: tree draw-on, tooth rotation, scroll reveals. Everything else is micro.
- Test every animation on a 5-year-old mid-range Android on 4G. If it stutters, cut it.
- GSAP is not the answer to everything. Most hover states and simple transitions should be CSS only.

**Homepage:**
- The homepage is not a site tour. It is a conversion path.
- Every section must have one job. If a section is doing two things, it's doing neither well.
- Resist adding sections because the client asked for them without a conversion reason.

**Booking:**
- The booking form is the most important piece of code on the site.
- It will be tested last but it should be planned first.
- Every field you add costs you bookings. Every field you remove earns you bookings.
- Submit → confirmation must happen in under 1 second perceived time. Use optimistic UI if needed.

**Performance:**
- Dark themes feel premium only when fast. A slow dark website feels broken.
- Never load Three.js in the initial bundle. It is an enhancement. Split it.
- Lighthouse score is not vanity — it directly correlates to Google ranking for local search.

**Content:**
- The website is only as good as the photography.
- If the client hasn't delivered real photos by Phase 6, pause and push back. Hard.
- No stock photography. Not even "temporarily."

**Scope:**
- Blog and multilingual support are Phase 2 features. Don't plan them into Phase 1.
- Virtual consultation is a Phase 2 feature. Don't build it until Phase 1 is live and converting.
- Build the best possible version of the essentials first. Then expand.

---

## 🧠 Rule While Executing

**One phase at a time.**

If Phase 2 (Research) is not complete, Phase 3 (UI Planning) does not begin.
If Phase 4 (Design Lock) is not complete, Phase 5 (Resources) and Phase 6 (Page Planning) do not begin.
If Phase 8 (Animation Planning) is not signed off, no animation code gets written.

**The cost of going back is always higher than the cost of going slow.**

No component is "done" until it's responsive, accessible, and tested on a real mobile device.

Commit early. Commit often. Write commit messages that describe what changed and why.

---

*Maintained by: Tech Lead | Last reviewed: project kickoff | Version: 1.0*