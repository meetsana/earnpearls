# EarnPearls Free-Tier Staging Decision Record

## Decision

The temporary staging environment uses the `staging` Git branch and the following
reversible services. These choices are for demonstration and acceptance testing only;
they do not select the production vendors.

| Component | Temporary choice | Configuration |
|---|---|---|
| Frontend | Render Static Site | Frankfurt edge, `staging` branch, immutable `dist/` artifact |
| API | Render Free Web Service | Frankfurt, Docker, one instance, readiness check |
| Database | Neon Free | PostgreSQL 17, AWS Frankfurt (`aws-eu-central-1`), direct TLS URL |
| Queue | PostgreSQL outbox | `email_outbox` with `FOR UPDATE SKIP LOCKED`; no unused Redis |
| Email | Resend Free | SMTP over implicit TLS on port `2465` |
| Survey data | Built-in demo adapter | Synthetic records only; no vendor contract or credential |
| Payout data | Disabled demo methods | Display-only PayPal/Virtual Visa labels; no destination entry or request |

Base release: PR #3 merge commit
`81a09c2136e7605332d0f979e549d81387fdad7d`.

## Why Redis is not provisioned

The MVP has no cache contract and its durable email queue is already implemented as a
PostgreSQL transactional outbox. Adding Redis would not be used by the application and
would introduce an extra credential, network dependency, and failure mode. Add Redis
only when a reviewed queue/cache consumer exists.

## One-time account preparation

### 1. Neon PostgreSQL 17

1. Create a free Neon project named `earnpearls-staging`.
2. Select PostgreSQL `17` and AWS Frankfurt (`aws-eu-central-1`).
3. Use the direct, unpooled connection string. It must include TLS requirements such as
   `sslmode=require`; never commit or paste it into logs.
4. Keep the default Free-plan restore window and create one manual snapshot after the
   migration and seed complete.

### 2. Resend SMTP

1. Create a free Resend API key and verify the staging sender/domain.
2. Build the secret URL with the API key URL-encoded:

   ```text
   smtps://resend:URL_ENCODED_API_KEY@smtp.resend.com:2465
   ```

3. Port `2465` is deliberate: Render Free blocks outbound SMTP on ports `25`, `465`,
   and `587`.

### 3. Render Blueprint

Open the Blueprint from the published staging branch:

```text
https://render.com/deploy?repo=https://github.com/meetsana/earnpearls/tree/staging
```

Connect the `meetsana/earnpearls` GitHub repository and enter only these prompted
values:

| Variable | Value source |
|---|---|
| `DATABASE_URL` | Neon direct PostgreSQL 17 TLS connection string |
| `SMTP_URL` | Resend port-2465 URL above |
| `EMAIL_FROM` | Verified staging sender, for example `EarnPearls <staging@earnpearls.com>` |
| `SEED_ADMIN_EMAIL` | Synthetic staging administrator email |
| `SEED_ADMIN_PASSWORD` | Unique password of at least 16 characters |

Render generates the password pepper, IP hash secret, data-encryption key, and demo
webhook secret. It must not reuse production values.

## Automated startup sequence

The free web tier does not provide a free background-worker instance, pre-deploy job,
one-off job, or shell. The staging supervisor therefore performs this documented
temporary sequence inside the single Docker service:

1. Run checksum-verified, advisory-locked migrations.
2. Seed the synthetic administrator and demo records when both seed credentials exist.
3. Remove seed credentials from the API and worker child-process environments.
4. Start the API and email worker together.
5. Terminate the service if either runtime process exits unexpectedly.

After the first successful administrator login, delete `SEED_ADMIN_EMAIL`,
`SEED_ADMIN_PASSWORD`, and `SEED_ADMIN_COUNTRY` from the Render service and redeploy.
Subsequent starts will skip seeding.

Production must return to the independently deployable release job, API, and worker
topology in `STAGING-RUNBOOK.md`.

## Required verification

1. Confirm GitHub CI and CodeQL pass on the exact `staging` head.
2. Confirm Render reports the API readiness check healthy.
3. Open the static-site URL and directly load `/login`, `/dashboard`, and `/admin` to
   verify history fallback.
4. Call `/health/live` and `/health/ready` through the static-site origin.
5. Register a synthetic user, receive the Resend verification email, verify it, sign
   in, sign out, and complete a password reset.
6. Confirm three demo surveys appear only for eligible synthetic accounts.
7. Confirm payout cards are labeled demo/disabled, no destination field is shown, and
   withdrawal creation remains unavailable.
8. Confirm no real provider, payout, or production secret appears in configuration or
   logs.
9. Record the staging Git SHA, Render deploy IDs, frontend artifact, Docker image
   digest, migration timestamp, Neon snapshot, and sanitized acceptance evidence.

## Known free-tier limitations

- Render Free web services spin down after 15 minutes without inbound traffic and can
  take about one minute to wake.
- Render grants 750 free web-service instance hours per workspace per month.
- The free web service cannot run a separate free background worker or one-off job.
- Neon Free is for prototyping, has limited storage/compute, and a six-hour restore
  history window.
- Resend Free is limited to 100 transactional emails per day and 3,000 per month.
- This environment has no production SLA and must contain synthetic data only.

These limitations block production promotion but do not block the staging demo.
