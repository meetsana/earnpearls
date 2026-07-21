# EarnPearls Staging Deployment Runbook

## Purpose and release boundary

The approved temporary free-tier implementation and its documented deviations are in
`STAGING-FREE-TIER.md`. This runbook remains the production-like target topology.

This runbook prepares a production-like staging environment without activating real
survey providers, payouts, or live-money withdrawals. Staging must exercise the same
security checks, container images, migrations, cookies, and browser/API boundary that
production will use.

Do not deploy until the hosting owner supplies the unresolved items in the sign-off
section. Do not copy real user data, provider credentials, payout destinations, or
production secrets into staging.

## Required topology

Deploy these independently replaceable units:

1. A static frontend built from the approved Git commit.
2. The API container built from `infra/docker/api.Dockerfile`.
3. One release job that runs database migrations before the API rollout.
4. The independent email-outbox worker using the same API image.
5. A PostgreSQL 17 database with TLS, automated backups, and point-in-time recovery if
   the selected service supports it.

The browser client calls relative `/v1` paths and uses secure, SameSite=Lax cookies.
The staging edge must therefore expose the frontend and `/v1` API on one HTTPS origin,
or provide an equivalent same-origin reverse proxy. Route `/health/live` and
`/health/ready` to the API without exposing database credentials or internal details.

## Owner inputs required before deployment

Record these outside the repository:

| Decision | Required value |
|---|---|
| Hosting provider and account | Pending owner selection |
| Region | Pending owner selection |
| Staging HTTPS origin and DNS owner | Pending owner selection |
| PostgreSQL service and connection policy | Pending owner selection |
| Secret manager | Pending owner selection |
| SMTP sandbox/transactional provider | Pending owner selection |
| Log, error, and uptime monitoring | Pending owner selection |
| Backup retention, RPO, and RTO | Pending owner selection |
| Deployment approver and incident owner | Pending owner assignment |

Real provider and payout accounts are not required for safe staging. They must remain
disabled until their contracts, credentials, maturity rules, thresholds, fees, and
operational owners are approved.

## Staging configuration

Run staging with production code paths:

| Variable | Staging requirement |
|---|---|
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` inside the container |
| `PORT` | Provider-assigned port or `3001` |
| `DATABASE_URL` | Secret-managed PostgreSQL URL; never commit it |
| `DATABASE_SSL` | `true` |
| `DATABASE_POOL_MAX` | Begin at `10`; tune against provider limits |
| `APP_ORIGINS` | Exact staging HTTPS origin only |
| `PUBLIC_APP_URL` | Exact staging HTTPS origin |
| `TRUST_PROXY` | `true` only behind a trusted provider proxy |
| `SESSION_COOKIE_NAME` | `ep_session` |
| `SESSION_TTL_HOURS` | `24` unless the owner approves another value |
| `AUTH_TOKEN_TTL_MINUTES` | `30` unless the owner approves another value |
| `PASSWORD_PEPPER` | Unique secret of at least 32 characters |
| `IP_HASH_SECRET` | Different unique secret of at least 32 characters |
| `DATA_ENCRYPTION_KEY` | Unique 32-byte random key encoded as base64 |
| `PROVIDER_WEBHOOK_SECRET` | Unique staging-only placeholder secret; no live provider |
| `ENABLE_SWAGGER` | `false`; enable only behind restricted access |
| `ALLOW_DEMO_DATA` | `false`; only the documented temporary free-tier demo may use `true` with a synthetic database |
| `SMTP_URL` | Secret-managed staging SMTP URL |
| `EMAIL_FROM` | Verified staging sender identity |
| `EMAIL_WORKER_POLL_MS` | `5000` initially |

Generate independent secrets through the selected secret manager. A suitable local
operator command for the encryption key is `openssl rand -base64 32`; paste the result
directly into the secret manager, not a shell history file or repository document.

The deployment must fail closed if a development placeholder is supplied, PostgreSQL
TLS is disabled, or an application origin is not HTTPS.

## Pre-deployment gate

Pin one immutable release SHA and record the built image digest. From a clean checkout:

```bash
npm ci --no-audit --no-fund
npm run check
npm audit --audit-level=low
docker build -f infra/docker/api.Dockerfile -t earnpearls-api:$RELEASE_SHA .
```

Require all of the following before continuing:

- CI and CodeQL passed on the same release SHA.
- The frontend, contracts, and API builds passed.
- The complete frontend and backend test suites passed against PostgreSQL 17.
- OpenAPI regeneration produced no Git diff.
- The dependency audit reports zero accepted or unreviewed vulnerabilities.
- No contract placeholders, secrets, build output, or unrelated files are present.
- A database backup or empty-database restore point exists.
- The previous frontend artifact and API image digest are recorded for rollback.

## Deployment sequence

1. Provision the staging database privately with TLS enforced and public access
   restricted to the runtime/release-job network.
2. Store configuration in the provider secret manager. Never bake secrets into an
   image, static frontend, GitHub variable, or repository file.
3. Build the frontend and API from the same immutable release SHA.
4. Run exactly one migration release job:

   ```bash
   node dist/db/migrate.js
   ```

   The API image sets its working directory to `/app/apps/api`. When running the same
   built artifact from the repository root instead, use
   `node apps/api/dist/db/migrate.js`.

5. Stop if migration exits non-zero. Do not start new API instances after a failed
   migration.
6. Deploy the API image and require both probes to pass:

   ```bash
   curl --fail --silent --show-error https://STAGING_ORIGIN/health/live
   curl --fail --silent --show-error https://STAGING_ORIGIN/health/ready
   ```

7. Deploy the static frontend with history fallback enabled and same-origin `/v1`
   routing to the API.
8. Start one email worker only after SMTP connectivity and sender verification pass.
9. Run the administrator seed job once with staging-only credentials and
   `ALLOW_DEMO_DATA=false`. The temporary free-tier exception in
   `STAGING-FREE-TIER.md` uses explicit synthetic data. Remove the seed password from
   the runtime environment after the job succeeds.
10. Keep every provider disabled, every payout method disabled, and the global
    withdrawal feature disabled.

## Staging acceptance tests

Use synthetic staging accounts and a controlled mailbox. Record evidence without
tokens, cookies, passwords, full IP addresses, or payout data.

1. Load `/`, a nested public route, and a nested authenticated route directly; verify
   frontend history fallback returns the application rather than 404.
2. Register an eligible synthetic account, receive the verification email, verify the
   address, log in, log out, request a password reset, and complete the reset.
3. Confirm `ep_session` is Secure, HttpOnly, SameSite=Lax and
   `ep_session_csrf` is Secure, readable by the client, and SameSite=Lax.
4. Confirm an authenticated mutation without the exact CSRF cookie/header pair returns
   403, while the same authorized mutation with the pair succeeds.
5. Confirm `GET /v1/auth/session` drives navigation verbatim: unavailable modules are
   absent, and a legacy or invented capability grants nothing.
6. Confirm dashboard and wallet screens preserve integer-string amounts beyond
   JavaScript's safe integer range and use the API-supplied conversion ratio.
7. Confirm wallet cursor pagination works and withdrawal history is treated as an
   array, not an invented cursor resource.
8. Confirm survey empty states are truthful because no provider is enabled.
9. Confirm withdrawal methods and requests show a truthful disabled state; no payout
   destination should be collected while disabled.
10. Confirm an administrator can view permitted pages, apply an evidenced account-state
    change, and revoke a session; confirm a limited user cannot regain denied
    capabilities through direct API calls.
11. Confirm API errors use the nested error envelope and expose a request ID without
    revealing stack traces or secrets.
12. Confirm rate limits, security headers, health alerts, email retries, and dead-letter
    visibility behave as documented.
13. Confirm logs redact cookies, authorization values, secrets, tokens, passwords, and
    payout destinations.

Any failure blocks promotion. Capture the release SHA, timestamps, test account IDs,
request IDs, and sanitized screenshots/log references in the deployment record.

## Rollback and recovery

Application rollback is artifact-based:

1. Stop the rollout and keep the failed release SHA and logs available for diagnosis.
2. Restore the prior static frontend artifact and prior API image digest.
3. Recheck `/health/live`, `/health/ready`, authentication, and one read-only wallet
   request.
4. Do not run ad hoc down-migrations. Database migrations are forward-oriented; deploy
   a compatibility fix when possible.
5. Restore a database snapshot only under the incident owner's approval after stating
   the exact recovery point and expected data-loss window. Preserve audit evidence.
6. Rotate any secret suspected of exposure and revoke affected sessions.

Before the first production promotion, prove a staging backup restore into a separate
database, record its duration, and compare it with the approved RPO/RTO.

## Release record and sign-off

Record one row per deployment:

| Evidence | Value |
|---|---|
| Release Git SHA | Required |
| Frontend artifact digest | Required |
| API image digest | Required |
| Migration result and timestamp | Required |
| Backup/restore point | Required |
| CI and CodeQL links | Required |
| Acceptance-test evidence | Required |
| Known limitations | Required |
| Deployment approver | Required |
| Rollback owner | Required |

Staging completion does not authorize production. Production requires separate approval
for hosting/region, backups, monitoring, SMTP, launch markets and eligibility, real
providers, payout methods, withdrawal rules, maturity/reversal handling, and incident
ownership.
