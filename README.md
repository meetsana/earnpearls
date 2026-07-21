# EarnPearls

> **Your Time. Your Rewards.**

EarnPearls is a global rewards-platform project whose focused Version 1 centers on
surveys, transparent wallet states, configurable withdrawals, trust, and scalable
operations.

## Current status

The production-oriented MVP build is **in progress**. This repository is not yet a
production release and does not activate any real survey provider or payout method.
The governance and requirements remediation is under review in
[draft PR #1](https://github.com/meetsana/earnpearls/pull/1).

Implemented backend surfaces:

- email/password registration, verification, login, reset, and revocable sessions;
- capability-based authorization with reusable Limit Template denials;
- user dashboard and exact integer money/points contracts;
- append-only Pending → Validated → Mature → Withdrawable wallet lifecycle;
- modular survey-provider adapters and signed/idempotent provider events;
- default-off configurable withdrawals with encrypted destinations;
- Super Admin dashboard, moderation history, withdrawal review, reconciliation, and audit logs;
- SMTP outbox worker, PostgreSQL migrations, OpenAPI, Docker, CI, and CodeQL.

Implemented frontend surfaces:

- responsive public, authentication, dashboard, surveys, wallet, withdrawals, and security routes;
- capability-filtered navigation and capability-gated admin routes;
- one typed API boundary with cookie credentials, session-bound CSRF, canonical errors,
  and withdrawal idempotency;
- exact `BigInt` point calculations and server-formatted USD display;
- loading, empty, access-denied, rate-limit, conflict, network, and server-error states;
- unit, contract-boundary, capability, withdrawal-disabled, and accessibility tests.

## Architecture

```text
React/Vite frontend → Fastify API → PostgreSQL
                           ├── provider adapters
                           └── email outbox worker → SMTP
```

The backend is a TypeScript modular monolith. PostgreSQL is the transactional source
of truth. Provider adapters and deployment vendors remain replaceable boundaries.

Key paths:

- `apps/api` — API, migrations, workers, and tests
- `packages/contracts` — shared runtime schemas and frontend types
- `docs/api/openapi.json` — generated API contract
- `docs/implementation` — architecture and 24-hour build controls
- `docs/frontend` — frontend architecture, API matrix, QA evidence, and change log
- `docs/handoffs` — parallel Opus 4.8 frontend prompt
- `infra` — Docker development and deployment baseline

## Local setup

Requirements: Node.js 24+, npm 11+, and PostgreSQL 17+ (or Docker Compose).

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev:api
# In a second terminal:
npm run dev
```

Run the full local quality gate:

```bash
npm run check
```

Or start PostgreSQL and the API with containers:

```bash
docker compose -f infra/docker-compose.yml up --build postgres migrate api
```

Development API documentation is served at `http://localhost:3001/documentation`.

## Policy-safe defaults

- Points use a configurable default conversion of 1,000 points = USD 1.00.
- USD is the accounting source of truth; local currency is not fabricated.
- Pending earnings validate only through provider confirmation or verified reconciliation.
- Real providers, payout methods, KYC triggers, fees, thresholds, and maturity rules remain disabled
  until their owner decisions and external evidence are complete.
- Named initial launch countries are enabled in the database; Pakistan, India, Bangladesh, and
  China are blocked from initial public registration.

See [deployment controls](docs/deployment/README.md) and [security policy](SECURITY.md).
