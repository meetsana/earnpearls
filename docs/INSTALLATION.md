# Installation Guide

## Prerequisites

- Node.js 24.x and npm 11.x
- PostgreSQL 17 with a dedicated local database
- optional Docker/Compose for the container path
- optional SMTP sandbox for email delivery

## Native setup

```bash
cp .env.example .env
npm ci --no-audit --no-fund
npm run db:migrate
npm run db:seed
```

Set a development-only administrator email/password in `.env` before seeding. Do not reuse
production credentials. Keep `ALLOW_DEMO_DATA=false` unless the database is disposable and
synthetic.

Start the API and frontend in separate terminals:

```bash
npm run dev:api
npm run dev
```

Default URLs:

- frontend: `http://localhost:5173`
- API: `http://localhost:3001`
- API docs: `http://localhost:3001/documentation`

To deliver queued mail, configure `SMTP_URL` and run:

```bash
npm run worker:email --workspace @earnpearls/api
```

To run recurring jobs:

```bash
npm run worker:operations --workspace @earnpearls/api
```

## Docker setup

```bash
docker compose -f infra/docker-compose.yml up --build postgres migrate api
```

Run optional seed/email profiles only with the required environment variables. The
container image contains compiled API and both workers; production process topology is
documented in the deployment runbook.

## Verification

```bash
npm run check
npm audit --omit=dev --audit-level=high
curl --fail http://localhost:3001/health/live
curl --fail http://localhost:3001/health/ready
```

The check must leave `docs/api/openapi.json` unchanged. A fresh migration test must pass.

## Resetting a local database

Destroy/recreate only an explicitly named disposable local database. Never use a broad
shell variable, wildcard, shared/staging URL, or production connection. Prefer creating a
new disposable database and running migrations rather than deleting an uncertain target.

## Common constraints

- PostgreSQL major version must be 17 for release parity.
- `DATA_ENCRYPTION_KEY` decodes to exactly 32 bytes.
- production mode requires HTTPS origins, TLS database, and non-placeholder secrets.
- SMTP worker refuses to start without `SMTP_URL`; API remains operational and mail queues.
- real providers/payouts cannot be enabled by seed or local configuration alone.
