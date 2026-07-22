# Change Log

## 1.0 full-build candidate — 2026-07-22

### Product

- Completed public CMS/blog/FAQ/SEO surface, member profile/preferences/activity,
  notifications, support center, and weekly/monthly/seasonal leaderboards.
- Completed the Super Admin operations surface for users, roles, Limit Templates, settings,
  countries, providers, payout-method definitions, content, communications, email templates,
  support, jobs, analytics, security, reconciliation, withdrawals, and leaderboards.
- Added feature and maintenance enforcement at both navigation and direct API boundaries.

### Platform and integrity

- Added the product-domain migration with revisions, append-only evidence, operational jobs,
  provider settlements, analytics, and dynamic database-backed sitemap.
- Added operations worker for scheduled publishing, analytics, rankings, broadcasts, and
  retention; CI runs it fail-fast against PostgreSQL 17.
- Corrected leaderboard aggregation to prevent reward/survey join multiplication and keep
  current materializations refreshable while finalized history remains durable.
- Added audited disabled-first payout-method configuration without enabling real payout or
  the global withdrawal switch.
- Added versioned allow-listed email templates and secure worker interpolation.

### Quality and documentation

- Expanded route, policy, migration, ledger, sitemap, template, payout, feature, maintenance,
  accessibility, and exact-accounting regression coverage.
- Replaced obsolete parallel handoffs with implementation-aligned business/product/system/
  database/API/security/admin/user/backup/monitoring/release/growth documentation.
- Preserved all external launch gates: legal, provider, payout, monitoring, and proved restore.

## Unreleased — 2026-07-21 MVP checkpoint

### Added

- Contract-integrated React/TypeScript frontend with public auth flows, authenticated
  app shell, dashboard, surveys, wallet, withdrawals, session management, and admin views.
- Capability-absent navigation, exact-money helpers, session CSRF forwarding, canonical
  API error parsing, and stable withdrawal idempotency-key reuse for identical retries.
- Frontend unit, API-boundary, route-contract, accessibility, and disabled-withdrawal tests.
- TypeScript npm workspace and shared TypeBox API contracts.
- Fastify API with stable error envelopes, OpenAPI, health checks, CORS allowlist,
  security headers, body limits, rate limits, structured logging, and secret redaction.
- PostgreSQL foundation for users, sessions, RBAC, Limit Templates, country policy,
  providers, surveys, participations, wallet ledger, withdrawals, settings, audit and
  security events, announcements, idempotency records, and the email outbox.
- Email verification, password reset, opaque revocable sessions, session-bound CSRF,
  memory-hard password hashing, and administrative session revocation.
- Event-driven survey earnings and append-only wallet bucket transitions.
- Configurable, default-off withdrawals with serializable reservations, exact integer
  accounting, encrypted destinations, and idempotency-key protection.
- Super Admin dashboard, user moderation history, withdrawal decisions, verified
  survey reconciliation, and searchable audit log API.
- Independent SMTP outbox worker with encrypted token payloads, leases, retry backoff,
  and dead-letter status.
- Unit, API-shell, wallet-state, crypto, exact-money, PostgreSQL-WASM migration, and
  conditional external PostgreSQL integration tests.
- Docker build/Compose baseline, GitHub Actions CI, production dependency audit, CodeQL,
  deployment guide, security policy, and 24-hour build control document.
- Initial frontend handoff archived after repository consolidation.

### Security and integrity

- Financial facts, wallet entries/events, audit logs, security events, and account-state
  events are protected from mutation at the PostgreSQL layer.
- Pending earnings cannot become Validated through elapsed time.
- Permission visibility and direct API authorization use the same effective-capability model;
  Limit Template denials override role grants and never grant new privileges.
- Production configuration rejects placeholder cryptographic secrets, HTTP app origins,
  exposed development tokens, and non-TLS PostgreSQL.

### Not activated

- No real survey provider adapter or credential.
- No real payout method, threshold, fee, or processing integration.
- No KYC/age policy, provider-specific maturity rule, exchange-rate source, production
  hosting vendor, region, backup retention, RTO, or RPO.
