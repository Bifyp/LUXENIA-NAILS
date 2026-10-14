# Luxenia editorial UI

## Scope

- Redesigned home, service catalog, booking page, shared navigation and footer.
- Warm ivory canvas, muted terracotta accent, Cormorant display type and Inter controls. Existing font dependencies are reused; no new npm packages or lockfile changes.
- Public theme is scoped under `.salon-site`; the admin interface and backend access controls are not restyled.
- Home and service cards read the live admin-managed service catalog. Cards pass a service ID to booking for preselection. No sample services, prices, ratings or client counts are inserted into the database.
- Booking keeps the existing API contract. Adds a review sidebar, labelled fields, autocomplete, readable calendar controls, package tabs, unavailable-slot states and collapsible FAQs. Aborts stale slot requests and disables submission until the current availability request completes. A 409 marks the conflicting slot unavailable, clears the selection and asks for another time.
- New UI copy uses `BrandUI` in all four locales: Polish, English, Russian and Ukrainian. Other existing content and admin translations are preserved.
- Mobile menu is an inline disclosure, not a modal. Closed links are unmounted, the trigger exposes its state, Escape closes it and restores trigger focus. Routes and locale changes close it automatically.
- Login links retain the selected language; mobile recovery and remember controls have enough space.

## Editorial visual

`public/brand/editorial-manicure.svg` contains one locally embedded compressed WebP photograph generated for the brand mood. It is **illustrative imagery**, not a photograph of the salon, its staff or a real client's result. Its caption and alt text describe inspiration, not a portfolio. The SVG has no JavaScript, event handlers, external resource URLs or user text.

The asset is self-contained so previews do not rely on a third-party image host. Replace it with approved original photography when available. Actual gallery/studio photos remain separately managed in the existing admin.

## Validation

- Clean `npm ci`: passed. It still reports the previously documented five high-severity development-tool dependency advisories; these are not install failures. No `npm audit fix --force` or dependency downgrades were applied.
- `npm run lint`: zero warnings/errors.
- `npm run typecheck`: passed.
- `npm test`: 28 tests passed, including five new translation/image-contract regressions.
- Production build: passed.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- Local Chromium against the production build: `/pl`, `/ru/booking`, `/en/services`, `/uk/login`, `/pl/shop` returned 200 at 1440×900 and 390×900, without uncaught page errors or horizontal overflow.
- Browser interaction checks: mobile menu, Escape, locale switching, service-ID preselection, labelled contact fields, date/time selection, package selection, price review, FAQ expansion, conflict feedback and success view passed.
- Catalog and submission interaction tests use intercepted **browser-only fixtures**; they do not write customer records or send real email. Empty-catalog screenshots use the unmodified clean local database.
- Visual inspection covers desktop/mobile home, catalog and booking, mobile navigation, selected service/time, selected package, conflict and success states, plus login/shop compatibility.
- Core contrast pairs: accent on white 6.19:1; secondary text on ivory 5.39:1; primary text on ivory 13.77:1. Keyboard focus and reduced-motion styles are included. This is not a claim of a full accessibility certification.

## Before public launch

This is a UI update, not a completed deployment or a substitute for the launch checklist in `PRODUCTION.md`. Populate and review the actual catalog, upload approved salon/portfolio photographs, verify the existing contact details/social links and business policies, and configure real deployment integrations. Existing unrelated page copy is not newly verified by this change. Database translation overrides can supersede bundled text and should be reviewed on the target environment.
