# Contributing to EarnPearls

## Principles

Preserve user trust, exact accounting, secure defaults, accessibility, evidence, and clear
external gates. A successful test does not authorize a provider, payout method, country,
legal policy, or production vendor.

## Setup

Follow `docs/INSTALLATION.md`. Work on a named branch from the latest target SHA. Never add
real credentials, user data, provider payloads, payout destinations, or production database
copies. Use synthetic fixtures.

## Change workflow

1. State problem, authority, acceptance criteria, security/data/financial impact.
2. Read the relevant contract, migration, service, UI, tests, and documentation.
3. Prefer the smallest domain-consistent change; record an ADR for major architecture.
4. Update TypeBox contract and API/UI together.
5. Add validation, stable errors, authorization, audit/activity evidence, and tests.
6. Update OpenAPI, manuals, roadmap/changelog, monitoring/rollback where affected.
7. Run the full gate and inspect the diff before publication.

## Required local gate

```bash
npm run format
npm run check
npm audit --omit=dev --audit-level=high
npm audit --audit-level=low
git diff --check
```

CI additionally uses PostgreSQL 17, runs the operations worker one-shot, verifies synthetic
staging data, builds Docker, checks OpenAPI drift, and runs CodeQL.

## Code standards

- TypeScript strict mode; runtime validation at every untrusted boundary.
- Parameterized SQL and explicit transactions/locks for state changes.
- Exact integer strings/`BigInt` for points and money; no authoritative floating point.
- Stable nested error envelope with safe request ID; no raw exceptions to users.
- Frontend requests only through the canonical API client.
- Capability checks server-side; frontend visibility mirrors but never grants.
- Feature/maintenance/provider/payout defaults fail closed.
- Accessible labels, keyboard behavior, status feedback, mobile layout, empty/error states.
- No fabricated testimonials, provider relationships, earnings, or live availability.

## Migrations

Never edit an applied migration. Add the next numbered forward migration; use
expand/backfill/contract for destructive changes. Include constraints, indexes, retention,
backward compatibility, migration test, and rollback/recovery explanation. Financial and
audit evidence must not cascade/delete casually.

## Financial/provider changes

Document source and target states, evidence, idempotency, concurrency, reversal/correction,
ledger entries, exact amounts, country/capability/feature switches, audit, and failure tests.
Provider adapters require contract/sandbox/signature/replay/status/amount/reversal/outage
fixtures. Do not enable the integration in the same change without separate approval.

## Security reporting and review

Use private vulnerability reporting described in `SECURITY.md`; never open a public exploit
issue. Review secrets, authentication/session/CSRF, access, injection/XSS, privacy/retention,
logging, abuse/rate limits, dependency risk, and recovery for relevant changes.

## Commit and review

Commits should be intentional and describe outcome. PR/change record includes scope, tests,
screens/contract evidence where useful, database/config impact, external gates, monitoring,
and rollback. Review generated files semantically. Avoid unrelated formatting or user-owned
changes in the same commit.

## Documentation

Documentation is a product surface. Keep paths/settings/status accurate. Use “implemented,”
“external gate,” and “deferred” precisely. Do not mark production-ready before monitoring,
restore, legal, provider, payout, and release approvals are evidenced.
