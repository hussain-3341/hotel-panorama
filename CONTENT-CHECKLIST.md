# Content checklist — please confirm before launch

All business facts live in `src/content/site.ts`. The website only publishes what could be verified from the hotel's own sources:

- **[SIGN]** — the hotel's signage, legible in the supplied reception photographs (`_BHS13861.jpg`)
- **[SITE]** — the hotel's current website, hotelpanorama.co.in (October 2026)
- **[PHOTO]** — visible in the supplied photographs

## ✅ Verified and published

| Fact | Value | Source |
| --- | --- | --- |
| Address | Nr. Madhur Hall, Anandnagar Cross Road, Satellite, Ahmedabad – 380015 | SITE + SIGN |
| Phones | +91 98241 08440, +91 98241 07440 | SITE (+ SIGN, partly legible) |
| WhatsApp | +91 98241 08440 | SITE |
| Email | thepanorama.ahmedabad@gmail.com | SITE + SIGN |
| Map location | 23.01292, 72.51591 | SITE |
| Instagram / Facebook | @hotelthepanorama / Facebook page | SITE |
| Check-in / check-out | 11:00 AM / 10:00 AM | SIGN |
| Visitor hours | 9:00 AM – 9:00 PM | SIGN |
| Room categories | Royal Crest (king), Elegance (queen), Twin Elegance (two singles) | SITE + PHOTO |
| Event halls | Rivazz Hall, Horizon Hall | SITE + PHOTO |
| Restaurant name | Hotel Panorama Restaurant | SITE |

## ⚠️ Stated on the current website — please re-confirm

These appear on the site, sourced only from hotelpanorama.co.in:

- [ ] Reception open 24 hours, 7 days a week
- [ ] Free Wi-Fi (listed for Elegance and Twin Elegance)
- [ ] 24/7 room service (listed for Twin Elegance)
- [ ] Royal Crest: minibar, city view, "premium décor"
- [ ] Halls suited to weddings, receptions and corporate events

## ❓ Unknown — hidden until you provide them

| Item | Where to add it |
| --- | --- |
| Room rates | `rooms[].price` |
| Maximum occupancy per room | `rooms[].occupancy` |
| Room sizes | `rooms[].size` |
| Rivazz Hall / Horizon Hall capacity per layout | `venues[].capacity` |
| Hall floor area | `venues[].area` |
| Restaurant cuisine, opening hours, breakfast inclusion | `dining.cuisine`, `dining.hours`, `dining.breakfastIncluded` |
| Parking, lift, laundry, power back-up, accessibility | add to `facilities` |
| Banquet catering / décor packages | `/banquets` page copy |
| Booking, payment and cancellation policy | `/terms` page |

## 🚫 Deliberately not used

The current website also shows the following. It was **not** carried over because it can't be verified, and the photographs date from mid-2026, which suggests a recently opened property:

- "1000+ Events Hosted" and "5000+ Happy Guests"
- Guest testimonials (e.g. "Vikram Desai, Mumbai")
- "Over the years, we have grown from a boutique property…" history
- "Up to 500 Guests" — a combined figure with no per-hall breakdown. Add it to `venues[].capacity` if confirmed.
- Sister properties (Hotel Sapphire26, Hotel La Gloria, Hotel Grand Elegance, Hotel Diamond26)
- Breakfast and menu food photographs. These exist on the current website but were not among the supplied files. Upload them and add them to `scripts/process-images.mjs` to show food on the Dining page.

## Location wording

The original brief said **Prahladnagar**. The hotel's own signage and website give **Anandnagar Cross Road, Satellite**, so the site uses that. If you want to mention nearby Prahladnagar, update `hotel.locality` and the copy.

## Legal pages

`/privacy` and `/terms` are sensible starting drafts. Have them reviewed for the hotel's actual practices, including the Digital Personal Data Protection Act 2023, before launch.
