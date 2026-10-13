# Validation record — 2026-10-13

Validated locally on Node.js 24, using the repository lockfile. CI targets Node.js 22 LTS. No production services or customer data were used.

| Check | Result |
| --- | --- |
| Clean `npm ci` | Passed, including the explicit Nodemailer override |
| Migrations into empty isolated SQLite database | All migrations applied |
| TypeScript `npm run typecheck` | Passed |
| `npm test` | 21 tests passed across four test files |
| `npm run build` | Production build passed |
| `npm run lint` | 0 errors, 74 warnings; enumerated legacy lint debt remains |
| Runtime `npm audit --omit=dev --audit-level=high` | 0 reported vulnerabilities |
| Full dependency audit | 5 high development-only findings remain in the ESLint glob dependency chain |
| Production HTTP/browser smoke test | 18 checks passed |

## Test coverage

- Exact-origin CSRF checks including missing/null/lookalike origins.
- Calendar dates, Warsaw-local future slots, configured half-hour start times.
- HTML escaping, prototype pollution rejection, translation overlay preservation.
- Password UTF-8 byte bounds, hashed purpose-separated verification codes.
- Per-policy rate limits and fail-closed production behavior without Redis.
- Anonymous sensitive reads/admin writes denied; stale administrator role denied after demotion.
- No registration bypass; single-use/expired code checks; password reset cannot consume registration codes.
- Concurrent booking collision, cancelled-slot reuse, blocked conflicting reactivation.
- Verified-account booking association and package/benefit update/delete behavior.
- JWT invalidation after password change and role refresh (unit test captures Auth.js callbacks).
- Production configuration validation.

## Browser and HTTP smoke scope

Local production server; synthetic empty application database, no external service credentials. Desktop 1440×900 and mobile 390×844:

- `/pl`, `/ru/booking`, `/en/register`, `/uk/forgot-password`, `/pl/shop` returned 200 without page exceptions or horizontal overflow.
- Password-reset form progressed to code/password entry with an intercepted successful request; **this is a UI test, not proof of email delivery**.
- `/api/health` returned 200.
- Anonymous booking/template/translation admin reads returned 401.
- Cross-origin booking write returned 403.
- Same-origin booking write without production Redis configuration returned 429 (fail closed).

## Not verified / release gates

- GitHub-hosted CI execution has not yet been checked in this local validation record.
- Real SMTP delivery, Upstash behavior/outages, Cloudinary upload/delete, DeepL translation, full real Auth.js cookie/sign-in flows and operational monitoring require staging.
- Restore exercise against real deployment backups, reconciliation of existing reservations and any schema drift require deployment access.
- Public launch requires actual studio contacts, content/catalogue, confirmed schedule/capacity and legal/privacy policies. Existing sample contact details and skincare-oriented copy need business review.
- Previously committed database/journal files remain in historical commits. Removing them from the branch is not incident remediation.

See [PRODUCTION.md](PRODUCTION.md) for deployment, migration, security and rollback instructions.
