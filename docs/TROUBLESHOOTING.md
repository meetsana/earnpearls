# Troubleshooting Guide

Start with the exact release SHA, environment, timestamp, request ID, health responses,
and sanitized logs. Never paste credentials, cookies, reset tokens, provider signatures,
database URLs, or payout destinations.

## Browser route shows Page not found

- Use `/admin` or `/app/admin` for administration; both should canonicalize correctly.
- Confirm the static host has the final `/* → /index.html` history rewrite after `/v1`,
  `/health`, and `/sitemap.xml` rewrites.
- Confirm the deployed asset hash matches the intended Git SHA.
- Hard refresh after a static deployment. Do not repeatedly alter a working Blueprint.

## API health fails

- `/health/live` failure: process/container problem; inspect startup and bind port.
- live succeeds but `/health/ready` fails: database URL, TLS, reachability, pool, migration,
  or provider suspension problem.
- verify `NODE_ENV`, `DATABASE_SSL`, HTTPS origins, and production secrets; startup fails
  closed on insecure values.

## Login or mutation fails

- 401: session absent/expired/revoked; sign in again.
- 403 `CSRF_INVALID`: cookies/header are not same session or reverse proxy changed origin.
- 403 access denied: inspect session capabilities/account Limit Template; UI hiding is not
  an authorization fix.
- 429: honor `Retry-After`; do not automate repeated attempts.

## Feature unavailable or maintenance

Read public settings and Admin → Platform settings. Feature gates intentionally return 404
for hidden modules; maintenance returns 503 to member product routes. Admin paths remain
available. Do not bypass the hook or enable future modules to remove the message.

## No surveys

Check provider is enabled, visible policy, adapter registration, provider health, survey
active schedule, country array, and user country. Safe staging intentionally has a hidden
demo provider only when demo seed is enabled. A blank catalog can be correct.

## Withdrawals unavailable

Both global `withdrawals.enabled` and the method’s `enabled` must be true; method country,
minimum, account capability, verified email, and withdrawable balance must pass. Staging
keeps global and every method off. Do not enable them merely to test the screen.

## Mail not delivered

- API queues mail even without SMTP; inspect outbox counts in System health.
- ensure SMTP URL, sender verification, TLS, and worker process.
- inspect failed/dead rows and sanitized `last_error`.
- verify the email template is enabled and preserves required variables.
- retry only after fixing cause; avoid duplicate manual sends of security links.

## Jobs fail or backlog grows

Inspect Admin → Background jobs, attempt count, schedule, and last error. Check operations
worker is running once per intended service group. Retry eligible jobs with a reason after
the root cause is fixed. Repeated dead jobs require an incident, not endless retries.

## Migration fails

Stop rollout. Check PostgreSQL 17, permissions, connectivity, migration advisory lock, and
applied checksum. Never edit an applied migration or run an improvised down script. Restore
the prior application artifact if schema remains compatible or deploy a reviewed forward fix.

## OpenAPI drift

Run `npm run openapi:generate`, inspect the semantic route/schema change, update frontend
and documentation, and commit the generated file. Do not suppress the drift check.

## Escalation evidence

Provide release SHA, service, safe timestamp/range, request/job/user UUID when appropriate,
error code, request ID, steps, expected/actual outcome, and redacted log excerpt. Use the
monitoring/incident runbook for security, financial, or availability impact.
