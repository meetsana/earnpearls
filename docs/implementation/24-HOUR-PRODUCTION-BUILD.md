# EarnPearls 24-Hour MVP Production Build

Clock start: **2026-07-21 18:23 PKT**

Status: **SUPERSEDED — retained as an implementation history checkpoint**

## Authorized scope

- Authentication and email verification
- User dashboard
- Append-only wallet and balance lifecycle
- Modular survey discovery/start/provider-event processing
- Configurable withdrawals with safe default-off policy
- RBAC-protected Super Admin operations
- Security controls, auditability, CI, and deployable containers
- Repository-owned frontend implementation and contract integration

## Delivery sequence

| Window | Backend/Platform | Frontend (parallel) | Gate |
| --- | --- | --- | --- |
| 0–4h | Runtime, schema, migrations, auth/session security | App shell, auth screens, tokens | Compile + auth contract |
| 4–8h | Wallet ledger, survey adapter and events | Dashboard, surveys, wallet | Lifecycle tests |
| 8–12h | Withdrawals, Admin, permissions, audit | Withdrawal and admin shells | RBAC/idempotency tests |
| 12–16h | Email worker, OpenAPI, deployment | Contract integration, errors/empty states | End-to-end smoke |
| 16–20h | Security review and policy guardrails | Accessibility/responsive QA | CI + a11y gate |
| 20–24h | Final audit, deployment rehearsal, handoff | Integration fixes | Release-candidate report |

## Implemented checkpoint

- TypeScript workspace with shared TypeBox contracts
- Fastify API shell and generated OpenAPI document
- PostgreSQL migration covering identity, sessions, RBAC, limit templates, providers,
  surveys, wallet ledger, withdrawals, audit/security events, settings, and outbox
- Opaque revocable sessions, CSRF binding, memory-hard password hashing, email tokens
- Event-driven Pending → Validated rule; no time-only validation path
- Exact integer points and USD-micro accounting
- Encrypted payout destinations and idempotent withdrawal reservation
- Admin dashboard, moderation history, withdrawal decisions, verified reconciliation,
  and audit log access
- SMTP outbox worker with encryption, leasing, retry, and dead-letter state
- Docker, CI/PostgreSQL integration test, production dependency audit, and CodeQL

## Explicitly blocked from activation

- Real provider adapters and credentials
- Any V1 payout method
- Withdrawal thresholds, fees, limits, and settlement operations
- KYC/age/identity policy
- Unnamed launch countries and local-currency exchange-rate display
- Provider-specific maturity/cleared-funds rules
- Production hosting, region, backup retention, RTO, and RPO

These are not implementation omissions to be silently filled. They require owner
decisions and/or external evidence.
