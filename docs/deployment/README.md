# EarnPearls MVP Deployment

## Current deployment model

The MVP is a vendor-neutral containerized modular monolith:

- one stateless API process;
- one independent email-outbox worker;
- PostgreSQL as the transactional system of record;
- a separately deployed static frontend;
- migrations run as a release job before new API instances start.

No public cloud vendor or production region is selected by this implementation.
Those choices remain an owner/infrastructure decision. The container boundary keeps
the same build deployable to a managed container service or VM without changing the
domain model.

For the vendor-neutral staging sequence, acceptance tests, rollback procedure, and
owner sign-off gates, see [the staging runbook](STAGING-RUNBOOK.md).

## Local database and API

```bash
docker compose -f infra/docker-compose.yml up --build postgres migrate api
```

Swagger UI is available at `http://localhost:3001/documentation` in development.

To seed a Super Admin, set the three seed variables without committing them and run:

```bash
docker compose -f infra/docker-compose.yml --profile tools run --rm seed
```

The optional email worker requires a real SMTP connection URL:

```bash
docker compose -f infra/docker-compose.yml --profile email up email-worker
```

## Production release gate

Before any production deployment:

1. Set every variable documented in `.env.example` through a secret manager.
2. Use a unique password pepper, IP-hash secret, provider secrets, and 32-byte
   base64 data-encryption key.
3. Use TLS for PostgreSQL and HTTPS for every frontend origin.
4. Configure SMTP and verify registration, verification, password reset, security,
   and withdrawal notifications.
5. Select the production region, backup retention, RTO/RPO, observability platform,
   and incident owners.
6. Approve launch countries, provider adapters, payout methods, thresholds, fees,
   KYC policy, and provider-specific maturity rules.
7. Run migrations, tests, dependency audit, CodeQL, restore test, and a security review.

Withdrawals and provider integrations remain disabled until their policy and adapter
configuration is explicitly approved.
