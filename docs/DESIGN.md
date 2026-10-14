# LUXENIA / independent nail atelier

## Art direction — second iteration

The original warm-ivory / serif / spa-style proposal was rejected as too generic. This iteration changes the composition and identity, not just the colours.

- The home page is a typographic campaign poster: oversized Inter wordmark, a lilac photographic field, deep-ink type, purple accents and sharp citrus appointment tickets.
- A custom vector signature is made from **four pointed nail silhouettes**. It is used consistently in the masthead, header, manifesto and footer. It is not an emoji or generated pseudo-logo.
- A flash-lit oxblood manicure replaces the soft nude/linen campaign visual. The image is locally embedded and used as illustrative brand inspiration, not a real client's result or a picture of the salon.
- The service catalog is a structured price list, not repeated rounded marketing cards. Service title, description, price and booking action have their own columns; on mobile they reorganise without losing information.
- A compact, print-inspired booking ticket replaces the usual three marketing-card process section. The actual booking form stays familiar and usable, with a lime review panel and readable square calendar controls.
- The copy is concise, about nails and personal style, and available in Polish, English, Russian and Ukrainian. It does not add fabricated reviews, ratings, certifications or customer counts.
- The public theme is scoped to `.salon-site`; the private admin theme, access controls and API contracts remain unchanged. No npm dependencies or lockfile changes are introduced.

## Actual content and functionality

- Home and catalog read the admin-managed service data. Cards/list rows pass the service ID to booking for preselection. No sample services or prices are inserted into the database.
- Empty catalog and network errors have explicit states.
- Booking retains labelled contact fields, autocomplete, service/package tabs, availability checks, price review and collapsible FAQ.
- Old availability requests are aborted. Submission is disabled while current availability is loading. A 409 marks the conflicting time unavailable and clears the selection.
- Mobile navigation is an inline disclosure. Closed links are unmounted; Escape closes the menu and restores focus. Locale changes preserve the route and query string.
- Keyboard focus, 44px interactive calendar controls and reduced-motion support are retained.
- Existing business text, policies and DB translation overrides still need review on the target environment.

## Visual asset provenance

`public/brand/editorial-manicure.svg` contains a compressed WebP campaign photograph generated for the mood of the brand. It is **illustrative**, not documentary, and the caption/alt text describe inspiration. It contains no scripts, event handlers or external resources. Replace it with approved original campaign photography when available. Real gallery and salon photos remain separately managed in the admin.

`components/AtelierMark.tsx` is a code-native brand mark, designed as four nail-shaped strokes. It uses `currentColor` and has no external image dependency.

## Validation

- Strict lint, typecheck and production build: passed.
- 28 tests passed, including all four `BrandUI` locales and the self-contained visual asset.
- The same dependencies were already verified with clean `npm ci`. Five previously documented development-tool advisories remain; the runtime audit had zero vulnerabilities. No forced dependency changes.
- Local production Chromium checks passed at 1440×900 and 390×900: home, booking, catalog, login and shop; filled/empty catalog; menu/Escape; locale switch; service-ID preselection; date/time; package/price review; FAQ; 409 and success.
- An additional 16 home checks (four locales at 320, 390, 768 and 1440px) passed, with no horizontal overflow or masthead/mark overlap.
- Browser-only catalog/submission fixtures do not write real appointments or send email.
- Visual review is required after every composition change, especially long Polish/Russian headings, masthead fit, mobile price rows, photo crop and the booking ticket.
- CI on the PR is the authoritative result for the latest committed revision, including the Docker build, migration, non-root start and health smoke test.

## Launch boundaries

This is a UI revision, not a deployment. Follow `PRODUCTION.md` for real hosting/secrets, catalog, business contact/social links, policies, SMTP and other integration validation. This revision does not certify the accuracy of unrelated existing page content or make the generated image a portfolio photograph.
