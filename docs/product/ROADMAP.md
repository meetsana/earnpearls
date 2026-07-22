# EarnPearls Roadmap

Statuses: `Completed`, `External gate`, `Planned`, or `Deferred`. “Completed” means the
repository implementation and automated acceptance evidence exist; it does not authorize
a production or live-money launch.

## Milestone 1 — Product and accounting foundation

Status: **Completed**

- [x] Constitution-aligned scope and immutable product rules
- [x] TypeScript workspace, shared runtime contracts, modular monolith
- [x] PostgreSQL 17 migrations, exact points and USD micro-unit model
- [x] RBAC, capability denials, country availability, audit/security records
- [x] CI, CodeQL, OpenAPI drift check, dependency audits, Docker build

Acceptance: fresh migrations pass; financial facts and evidence logs resist mutation;
all contracts use integer strings for values that can exceed JavaScript safe integers.

## Milestone 2 — Identity, member account, and trust

Status: **Completed**

- [x] Registration country gate, email verification, login, logout, password reset
- [x] Opaque revocable sessions, CSRF, rate limits, password policy, security events
- [x] Profile, completion score, notification preferences, password change, activity
- [x] Maintenance mode, feature gates, stable errors, responsive/accessibility tests

Acceptance: capability visibility equals direct API authorization; recovery tokens are
encrypted in the outbox and never returned by public APIs.

## Milestone 3 — Surveys, wallet, and withdrawals

Status: **Completed** for application logic; **External gate** for live activation

- [x] Provider registry and adapter interface
- [x] Survey catalog/detail/start/history and signed idempotent events
- [x] Pending → Validated → Mature → Withdrawable ledger with explanations
- [x] Withdrawal reservation, cancellation/rejection return, encrypted destination
- [x] Admin reconciliation, settlement actions, payout-method configuration
- [ ] Contract and credentials for first live survey provider
- [ ] Finance-approved thresholds, fees, reserves, payout vendor, and operations owner
- [ ] Enable one real adapter/method and global withdrawals after evidence review

Acceptance: no elapsed-time validation; no negative available balance; every transition
has evidence; disabled integrations cannot be reached through direct API calls.

## Milestone 4 — Full member experience

Status: **Completed**

- [x] Public trust homepage, authentication, dashboard, surveys, wallet, withdrawals
- [x] Notifications, support center, FAQ, CMS pages, blog, and dynamic sitemap
- [x] Weekly/monthly/seasonal leaderboards and privacy-safe exclusions
- [x] Loading/empty/error/offline/maintenance/feature-unavailable states
- [x] Canonical `/admin`, `/dashboard`, and `/index.html` route handling

Acceptance: direct route loads work; feature/maintenance state is enforced server-side;
frontend accessibility scans and route regression tests pass.

## Milestone 5 — Super Admin operations

Status: **Completed**

- [x] Operational dashboard and platform health
- [x] User search/export/detail, moderation, roles, Limit Templates, session actions
- [x] Settings, countries, providers, payout methods, jobs, and security events
- [x] Support queue, CMS/blog/FAQ, announcements, broadcasts, and email templates
- [x] Analytics, reconciliation, withdrawal review, leaderboards, and audit search
- [x] Scheduled content, daily rollups, rankings, retention, and notification workers

Acceptance: high-risk actions require CSRF, capability, reason, and audit evidence;
operations worker runs fail-fast against PostgreSQL in CI.

## Milestone 6 — Staging acceptance

Status: **In progress / External gate**

- [x] Render/Neon/SMTP-compatible staging topology
- [x] Synthetic payout-disabled seed and CI verification
- [x] API/database health and static route behavior
- [ ] Complete controlled-mailbox verification/reset/notification test
- [ ] Execute the full browser acceptance matrix on the final release SHA
- [ ] Record sanitized evidence and sign-off

Dependencies: hosting access, SMTP sender, final staging secrets, and deployment owner.

## Milestone 7 — Production readiness

Status: **External gate**

- [ ] Owner-approved terms/privacy/cookies/eligibility and consent evidence
- [ ] Production vendor/region, DNS, secret manager, SMTP, uptime/error monitoring
- [ ] Automated database backups and a timed restore drill into an isolated target
- [ ] Approved RPO/RTO, incident roles, escalation contacts, and status communication
- [ ] Penetration/security review and provider webhook verification with real sandbox
- [ ] Financial liability/reconciliation rehearsal and payout dry run without member funds
- [ ] Release approval using `docs/operations/RELEASE-CHECKLIST.md`

No unchecked item is implied by a successful software build.

## Milestone 8 — Closed beta

Status: **Planned**

- [ ] Invite-only eligible cohort and conservative volume caps
- [ ] One approved provider and one approved payout route
- [ ] Daily provider, reversal, liability, support, and fraud review
- [ ] Baseline funnel, task success, accessibility, and unit economics
- [ ] Go/no-go review based on evidence, not calendar date

## Milestone 9 — Expansion

Status: **Deferred**

- [ ] Additional providers and countries
- [ ] Referral domain
- [ ] Offerwalls and partner offers
- [ ] Cashback, gift cards, campaigns, and loyalty
- [ ] Mobile clients and push notifications
- [ ] Localization

Each expansion requires a domain design, threat/privacy review, accounting mapping,
provider/legal approval, feature flag defaulting off, tests, documentation, and rollback.
