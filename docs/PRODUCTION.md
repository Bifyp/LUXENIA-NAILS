# Production deployment and launch gates

This hardening branch is not a deployed release. Preserve the existing UI and SQLite architecture. The supported deployment is a **single Node.js instance** with persistent local SQLite storage, behind an HTTPS reverse proxy. Do not deploy the SQLite file to ephemeral/serverless storage or multiple independent replicas.

## Local development

- Node.js 22 LTS (Node 24 also supported), npm, writable disk.
- `npm ci`, copy `.env.example` to `.env`, generate a unique `AUTH_SECRET`.
- Set `DATABASE_URL=file:./dev.db`, then `npm run db:deploy`.
- Configure SMTP before testing email registration/reset. `npm run dev` uses a bounded in-process rate limiter.
- To create an administrator: set a real `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of 12–72 UTF-8 bytes, run `npm run seed`. No default credentials exist. Remove `ADMIN_PASSWORD` from runtime afterwards. Do not run seeds against the wrong database.

## Before deploying to an existing installation

1. Back up the database using SQLite's online backup API or `sqlite3 DATABASE_PATH '.backup BACKUP_PATH'`. Encrypt/access-restrict backups; **do not copy a live SQLite file without its WAL state**. Verify a restore into a separate directory.
2. Set `DATABASE_URL` to the existing absolute database path. Run `npx prisma migrate status` and `npm run db:preflight`. Preflight reports counts only and changes no data. Reconcile active duplicate slots and non-midnight dates manually after owner review; do not automatically delete reservations.
3. Resolve schema drift from earlier manual `db push` operations before applying migrations. Do not rewrite already applied migration files.
4. `npm run db:deploy`. The email-code migration intentionally invalidates old short-lived codes; users can request new ones. The slot index rejects concurrent active reservations and frees cancelled slots.
5. Never use `prisma migrate reset` or development seeds on production.

## Required production configuration

Use a secret manager or protected environment file (not Git). `.env.example` is only a template.

- `DATABASE_URL=file:/var/lib/luxenia/app.db` on a persistent, backed-up volume.
- A unique random `AUTH_SECRET` (at least 32 characters) and canonical HTTPS `AUTH_URL`.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`. SMTP enforces TLS certificate verification and connection timeouts.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: route/auth policies use distributed storage; missing/unreachable Redis **fails closed** in production rather than silently falling back to unrestricted requests.
- `TRUST_PROXY=1` only when the reverse proxy replaces `X-Forwarded-For`/`X-Real-IP` and direct Node ingress is blocked. Configure request body limits (6 MB for upload, e.g. 128 KB for JSON) and general IP limits at the reverse proxy/WAF.
- Cloudinary server credentials for gallery uploads. `DEEPL_API_KEY` for automatic translations. Without DeepL, source translations save but target translation errors are reported.
- `INTERNAL_LOG_SECRET` only if internal logging is used; keep that endpoint inaccessible externally. Security log buffers are temporary, not a durable audit trail.

Run `npm run check:env`, build with `npm run build`, start with `npm start` (which validates configuration before startup). If using PM2/systemd/container entrypoints, run the same validation explicitly; do not bypass it with a raw `next start` command.

The application reads translations as a database overlay on bundled defaults. Editing no longer depends on writing source JSON into a built artifact. Keep exported JSON generation an offline maintenance tool.

## Validation and release gates

- `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm audit --omit=dev --audit-level=high`, `npm run build`.
- Tests always migrate an isolated temporary SQLite database, never the configured application database. Email delivery is mocked in these tests.
- Test real registration/code delivery, reset delivery, login, logout, password-change session invalidation, admin demotion and booking/status notifications on **staging** with real service credentials.
- Test Cloudinary uploads/deletion and DeepL responses; monitor rate-limit service availability. These external integrations cannot be declared verified by mocked tests.
- Check desktop/mobile rendering in each locale and provide real catalogue/gallery records. Replace sample phone/contact details and review skincare-oriented copy against the actual nail studio services. The booking schedule currently mirrors the existing UI (Warsaw time, half-hour start slots); confirm opening hours, service durations, staff/resource capacity and cancellation policy with the studio before accepting customers. Unique start slots do not model overlapping service durations or multiple staff.
- `/api/health` checks database connectivity; monitor it and configure error logs/alerts, SMTP delivery monitoring and Redis monitoring separately. JSON logs redact top-level credentials/email/phone and no longer log SQL queries.

## Security and known follow-ups

- `prisma/dev.db`, its journal and `auth.ts.backup` are removed from the proposed branch, **not from Git history**. The repository is public. Treat any previously stored credentials/PII as potentially exposed: rotate applicable credentials, reset affected passwords (especially any old default admin), assess notification/deletion obligations. Coordinate history cleanup with all collaborators; this PR does not rewrite history.
- Auth.js remains a beta dependency. Nodemailer 10 is explicitly overridden to resolve Auth.js's older optional mail-provider peer constraint; this application uses credentials authentication and its own SMTP transport, not an Auth.js email provider. Run staging authentication/mail tests when upgrading either package.
- Runtime dependency audit is clean at validation time. Five high-severity development-only audit findings trace to the `braces`/`micromatch`/`fast-glob` chain under `eslint-config-next`. The current registry exposes no patched `braces` version; do not downgrade Next/ESLint blindly or claim the full audit is clean. Follow upstream remediation.
- ESLint uses strict rules with `--max-warnings=0`. Legacy warning downgrades have been removed after typed contracts, URL-driven locale state, event-driven drafts, abortable loading and dead-code cleanup.
- CSP currently still permits inline Next hydration scripts and inline styles. `unsafe-eval` is development-only; a nonce-based CSP requires a separate tested rollout. Do not claim full XSS elimination.
- Changing an account email is intentionally blocked until a verified email-change flow exists. Name updates still work. Signed-in bookings attach only to the matching verified account email.
- Terms/privacy links currently have no policy pages. Obtain actual business identity, data-retention/consent and GDPR policy text before public launch; do not publish invented legal terms.
- The shop is a catalogue/contact flow, not verified payment checkout. Confirm the intended commercial scope and rights to use/distribute the project under its existing license. License is unchanged.

## Rollback

Keep the previous build and a verified pre-migration backup. Stop writes first. Do not blindly roll back code against a changed database: the old plaintext-code flow is incompatible with hashed purpose-bound codes. Restore database+code together only after reviewing reservations received since backup, or roll forward with a compatible fix. Test recovery in staging before launch.

## Container release path

`Dockerfile` is a multi-stage Node 22 image. Runtime runs as the non-root `node` user and validates configuration before serving. `.dockerignore` excludes environment files, Git history, runtime databases/journals and authentication backups. Docker/Podman is not installed on the local validation computer; the GitHub workflow builds the image and runs migration/health/non-root checks with an isolated volume and disabled runtime network.

1. Provision the actual `.env.production` from `.env.example` using a secret manager. Set the canonical HTTPS domain, service credentials and `TRUST_PROXY=1` only with a correctly configured proxy.
2. `docker compose build` creates the image without production secrets.
3. For an existing installation, stop writes, take/verify a backup and reconcile reservations/schema drift before migrations. For a fresh installation: `docker compose run --rm app migrate`.
4. `docker compose up -d`. Port 3000 binds **loopback only**, SQLite lives in `luxenia-data`, the root filesystem is read-only, temporary/cache mounts are separate, capabilities are dropped.
5. Add the actual HTTPS reverse proxy and certificate using the loopback-safe sample in `deploy/nginx.conf`. It does not automatically expose a public HTTP endpoint or request a certificate for an invented domain.
6. Run staging integration tests and monitor health before routing customers. Do not horizontally scale independent SQLite app replicas.

The container contains the Prisma migration CLI but not developer seed tools. Bootstrap an administrator once with the source checkout and securely provided `ADMIN_EMAIL`/`ADMIN_PASSWORD`; remove the password from persistent runtime configuration afterward. No default account is created by the image.

For host-managed SQLite backups, `python3 scripts/backup_database.py SOURCE_PATH NEW_BACKUP_PATH` uses the SQLite online backup API, refuses overwrite, creates the backup with mode 0600, and runs integrity/foreign-key checks. The included restore test verifies a WAL-backed synthetic database and leaves its source unchanged. For Docker named volumes, use a maintenance host/container with Python and explicit volume mounts; do not copy a live database file by itself.
