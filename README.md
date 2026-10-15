# Hotel Panorama — website

Production website for **Hotel Panorama, Anandnagar Cross Road, Satellite, Ahmedabad** — rooms, conference and banquet.

Built with Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · React Hook Form + Zod · Prisma (optional PostgreSQL) · Nodemailer · Lucide icons · `next/image`.

---

## Quick start

```bash
cd web
npm install          # also runs `prisma generate`
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Requires Node.js 20.9 or newer.

The optimised photographs (`public/images/**`) and their manifest (`src/content/images.json`) are already generated, so the site runs without the original camera files.

## Pages

| Route | Contents |
| --- | --- |
| `/` | Cinematic hero, about, sticky "experience" story, rooms, banquets, facilities, dining, pinned horizontal gallery, location + map, booking CTA |
| `/rooms`, `/rooms/[slug]` | Royal Crest, Elegance, Twin Elegance — overview, detail pages, photo galleries |
| `/banquets` | Rivazz Hall and Horizon Hall, set-ups, occasions, catering note, celebration/corporate enquiry form |
| `/dining` | Hotel Panorama Restaurant |
| `/gallery` | All 124 photographs, filterable, with an accessible lightbox |
| `/facilities` | Services and spaces |
| `/about` | Philosophy, what to expect, highlights, location |
| `/contact` | Verified contact details, map, contact form |
| `/enquire` | Room and banquet enquiry forms (`?type=room|banquet&room=…&venue=…`) |
| `/privacy`, `/terms` | Policies (review before publishing — see checklist) |

Also generated: `sitemap.xml`, `robots.txt`, favicon, Open Graph image, and `schema.org/Hotel` JSON-LD.

## Where things live

```
src/content/site.ts        ← every business fact (address, phones, rooms, halls, facilities)
src/content/images.json    ← generated image manifest (do not edit by hand)
src/content/images.ts      ← typed helpers + gallery categories
scripts/process-images.mjs ← image pipeline + curated list with alt text
src/components/motion/     ← Reveal, ParallaxImage, ScrollRefresh (GSAP)
src/components/sections/   ← Hero, StickyStory, RoomShowcase, BanquetShowcase, HorizontalGallery, …
src/components/gallery/    ← GalleryGrid + Lightbox
src/components/forms/      ← BookingEnquiryForm, BanquetEnquiryForm, ContactForm
src/lib/enquiry-schema.ts  ← Zod schemas shared by browser and API
src/app/api/enquiries/     ← POST endpoint (validation, rate limit, honeypot)
src/lib/enquiry-service.ts ← email + database delivery
prisma/schema.prisma       ← Enquiry model
```

**To change any business detail, edit `src/content/site.ts`.** Fields set to `null` (room sizes, occupancy, rates, hall capacities, restaurant hours) are hidden on the site and replaced with "on enquiry" — fill them in once confirmed and they appear automatically.

## Photographs

The supplied Google Drive exports (`Baquet`, `Conference Hall`, `Exterior`, `Reception Aeria`, `Restaurant`, `Rooms/1–7`) were reviewed one by one. Room and hall assignments follow the hotel's own categorisation on hotelpanorama.co.in:

| Supplied folder | Used as |
| --- | --- |
| Rooms 3 + 7 | Royal Crest |
| Rooms 1 + 5 | Elegance |
| Rooms 2 + 6 | Twin Elegance |
| Rooms 4 | General "guest room" photos (not assigned to a category) |
| Baquet | Rivazz Hall |
| Conference Hall | Horizon Hall |
| Restaurant | Hotel Panorama Restaurant |
| Reception Aeria | Lobby & interiors |
| Exterior | Exterior, drone and night views |

124 of 171 originals are used; the rest are near-duplicate frames. To add or swap images, edit the `IMAGES` list in `scripts/process-images.mjs` and run:

```bash
# originals expected in ../_source (or set SOURCE_DIR)
npm run images            # only new/changed images
npm run images -- --force # re-encode everything
```

Each master is auto-rotated and resized to 2200 px on the long edge (mozjpeg q80). `next/image` serves AVIF/WebP at responsive sizes with blur placeholders and fixed dimensions, so pages load without layout shift.

## Logo

The official logo artwork is kept at `assets/brand/hotel-panorama-logo.jpg`. Running `npm run logo` removes its white background and generates:

- `public/brand/logo-mark-{light,dark}.png` — sunburst and name, used in the navigation
- `public/brand/logo-full-{light,dark}.png` — complete logo with "Rooms – Banquet", used in the footer
- `src/app/icon.png` and `src/app/apple-icon.png` — sunburst favicons

`light` versions have ivory lettering for dark backgrounds; `dark` versions keep the original black. If you receive a vector (SVG) logo, replace the artwork and re-run the script, or point `Logo.tsx` at the SVG.

## Enquiry forms

- Validated in the browser and again on the server with the same Zod schemas.
- Honeypot field and per-IP rate limit (6 per 10 minutes) against spam.
- Messages always say an enquiry **is not a booking confirmation**.

Delivery depends on configuration (`.env.local`):

| Configured | Behaviour |
| --- | --- |
| `SMTP_*` | Email to `ENQUIRY_TO_EMAIL` (defaults to thepanorama.ahmedabad@gmail.com), with Reply-To set to the guest. Optional acknowledgement email to the guest. |
| `DATABASE_URL` | Stored in PostgreSQL (`Enquiry` table) — run `npm run db:push` once. Email failures are still recorded with `notified = false`. |
| both | Both of the above (recommended). |
| neither, development | Saved to `.data/enquiries.jsonl`. |
| neither, production | The form shows an error asking the guest to call or email instead — enquiries are never silently lost. |

For Gmail/Google Workspace, use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=true` and an App Password.

## Animation & accessibility

- **Zoom-through heroes** (Home, Rooms, Banquets, Dining — `ZoomHero.tsx`): the hero pins, the headline splits apart and the photograph grows from a framed card to full screen before the main headline rises in.
- **Smooth scrolling** with Lenis, driven by GSAP's ticker so it stays in sync with every ScrollTrigger (`SmoothScroll.tsx`). Touch devices keep native scrolling.
- GSAP + ScrollTrigger: hero word reveal, clip-path image reveals, parallax, a sticky storytelling section with an ivory→charcoal background shift, a pinned horizontal gallery (desktop only), staggered cards and a scaling booking CTA.
- Everything is wrapped in `gsap.matchMedia`, so **`prefers-reduced-motion` disables all motion, including smooth scrolling and the zoom heroes**, and content is fully visible without JavaScript.
- Skip link, landmark regions, labelled form fields with `aria-invalid`/`aria-describedby`, focus-trapped lightbox and menu (Esc to close), visible focus rings, WCAG-AA colour pairs (`gold-deep` is used for small gold text on ivory), and click-to-call links.

## Deployment

Any Node.js host works (Vercel, Render, Railway, a VPS with `npm run build && npm start`, …).

1. Set the environment variables from `.env.example`.
2. `npm run build`, then `npm start`.
3. If you use a database, run `npm run db:push` against it once.

The in-memory rate limiter is per server instance. If you scale to many instances, swap it for a shared store such as Redis.

## Before going live

Work through **[CONTENT-CHECKLIST.md](./CONTENT-CHECKLIST.md)**. It lists every fact that is still unconfirmed.
