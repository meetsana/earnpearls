# Change Log

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
- Parallel Opus 4.8 frontend handoff in the repository and Notion.

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
