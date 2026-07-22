# EarnPearls Deployment

## Deployable units

The production-shaped topology is vendor-neutral:

- immutable static React frontend;
- stateless Fastify API container;
- one migration release job per release;
- independent operations and email workers from the same API image;
- PostgreSQL 17 as transactional database/queue/evidence store;
- approved SMTP and future provider adapters.

Current free-tier staging temporarily supervises API and workers in one Render Docker web
service because the tier has no free worker/job service. That documented deviation is not a
production recommendation. See [STAGING-FREE-TIER.md](STAGING-FREE-TIER.md) and the full
[STAGING-RUNBOOK.md](STAGING-RUNBOOK.md).

## Local containers

```bash
docker compose -f infra/docker-compose.yml up --build postgres migrate api
```

Optional seed and worker profiles require the relevant environment configuration. Swagger
is available at `http://localhost:3001/documentation` only when enabled.

## Artifact rule

Frontend and API image must be built from one immutable Git SHA. Record frontend artifact,
API image digest, migration result, configuration revision, and previous rollback artifacts.
Never deploy mutable `latest` without resolving it to a recorded digest.

## Production gate

Before production:

1. Select and approve vendor, region, DNS, secret manager, SMTP, logs/errors/uptime, and
   incident ownership.
2. Configure PostgreSQL TLS, capacity, encrypted backup/PITR, approved RPO/RTO, and prove a
   timed isolated restore.
3. Generate unique secrets; enforce HTTPS exact origins and trusted-proxy policy.
4. Run the complete release checklist, PostgreSQL 17 tests, image build, CI, CodeQL,
   dependency/security review, and browser acceptance on the exact SHA.
5. Approve legal copy, eligibility/countries, privacy/retention, provider contracts/adapters,
   payout vendor/rules/reserves/KYC/tax, and support/incident processes.
6. Keep global withdrawals, wallet adjustments, real providers, and methods off until their
   specific evidence is recorded.

Use [the release checklist](../operations/RELEASE-CHECKLIST.md) as the authoritative sign-off.

## Deployment order

1. Confirm backup/recovery point and previous compatible artifacts.
2. Build and scan immutable frontend/API artifacts.
3. Run migrations exactly once; stop on failure/checksum mismatch.
4. Roll API and require `/health/ready` before traffic.
5. Start operations worker; start email worker after SMTP verification.
6. Publish frontend and same-origin `/v1`, `/health`, `/sitemap.xml` routing.
7. Run critical acceptance, verify queues/monitoring, and observe the release window.

Rollback application artifacts for code defects. Do not improvise database down-migrations;
use a reviewed forward fix or approved recovery process.
