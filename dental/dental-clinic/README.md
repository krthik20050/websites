# Dental Clinic Website

Premium dark-themed marketing site for a single-doctor dental clinic — a patient-acquisition site (hero with animated tree + 3D tooth visuals, services, booking form), per the plan in `../todo.md`.

## Tech Stack

- Next.js 16 (App Router) + React 19 + Tailwind CSS v4
- GSAP (scroll animations), Three.js + @react-three/fiber + drei (3D tooth), Lenis (smooth scroll), lucide-react

## What's Done

- Scaffold only: `create-next-app` starter (`src/app/page.js` is the default boilerplate page)
- Dependencies installed for the planned design direction (GSAP, R3F, Lenis)

## What's Not Done / Next Steps

- Everything in `../todo.md` — homepage sections (hero, services grid, doctor bio, trust cluster, testimonials, booking band, location), `/about`, `/services/[slug]`, `/book`, `/contact` routes
- Hero visuals: glowing tree SVG draw-on animation + WebGL 3D tooth
- Booking form (max 5 fields), testimonial system, Google Maps, SEO/structured data
- Performance targets: Lighthouse 90+, LCP < 2.5s

## How to Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```