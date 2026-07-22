# Configuration Guide

Configuration is server-side. Secrets belong in an environment secret manager, never in
Git, frontend variables, build logs, screenshots, tickets, or chat.

## Runtime variables

| Variable | Purpose | Production rule |
| --- | --- | --- |
| `NODE_ENV` | development/test/production behavior | `production` |
| `HOST`, `PORT` | API bind | provider-specific, no public debug bind |
| `LOG_LEVEL` | structured log threshold | `info` initially |
| `DATABASE_URL` | PostgreSQL connection | secret, TLS, least-privilege role |
| `DATABASE_SSL` | TLS enforcement | `true` |
| `DATABASE_POOL_MAX` | per-process connection cap | sized across API/workers |
| `APP_ORIGINS` | exact comma-separated browser origins | HTTPS allowlist only |
| `PUBLIC_APP_URL` | canonical web origin/email links | HTTPS exact origin |
| `TRUST_PROXY` | honor trusted proxy information | true only behind known proxy |
| `SESSION_COOKIE_NAME` | opaque session cookie | stable per environment |
| `SESSION_TTL_HOURS` | session expiry | approved security value |
| `AUTH_TOKEN_TTL_MINUTES` | verify/reset expiry | approved security value |
| `PASSWORD_PEPPER` | password defense secret | unique ≥32 characters |
| `IP_HASH_SECRET` | pseudonymous IP evidence | distinct unique ≥32 characters |
| `DATA_ENCRYPTION_KEY` | AES-256-GCM key | unique 32-byte base64 secret |
| `PROVIDER_WEBHOOK_SECRET` | demo/current provider verification | per environment/provider |
| `ENABLE_SWAGGER` | interactive API docs | false unless restricted |
| `ALLOW_DEMO_DATA` | synthetic demo seed | false in production |
| `SMTP_URL` | mail transport | secret, TLS, approved sender |
| `EMAIL_FROM` | visible sender | verified identity |
| `EMAIL_WORKER_POLL_MS` | delivery polling | 1,000–60,000 ms |
| `OPERATIONS_WORKER_POLL_MS` | recurring job polling | 1,000–300,000 ms |
| `SEED_ADMIN_EMAIL/PASSWORD/COUNTRY` | one-time seed input | remove after seed |

`OPERATIONS_WORKER_RUN_ONCE` is a CI/diagnostic switch, not a normal service setting.

## Database-managed settings

Use Admin → Platform settings. Every change requires a reason and creates a revision.

| Key | Important invariants |
| --- | --- |
| `points_per_usd` | positive exact integer string |
| `registration` | country enforcement cannot be disabled |
| `withdrawals` | default off; enable requires approval evidence |
| `wallet_adjustments` | default off; enable requires approval evidence |
| `maintenance` | safe public message and admin recovery path |
| `features` | future unimplemented modules cannot be enabled |
| `leaderboards` | master board availability/privacy defaults |
| `support` | attachments remain off without storage/scanner |
| `content` | blog visibility and truthful testimonial mode |
| `currency_display` | USD base; dated decimal-string estimates only |
| `security_policy` | bounded password/session/verification controls |
| `data_retention` | bounded cleanup periods |

Provider activation additionally requires a compiled registered adapter. Payout method
activation is independent of the global withdrawal switch and requires evidence. Never
combine feature visibility with financial activation.

## Key rotation

- Pepper rotation requires a staged password migration/reset strategy; do not simply swap it.
- Encryption-key rotation requires versioned ciphertext and transactional re-encryption.
- IP hash rotation changes correlation and must follow retention/privacy policy.
- Provider secrets rotate per adapter with overlap/replay planning.
- SMTP/database secrets can rotate with dual credentials or a controlled restart.

Record owner, date, affected environment, validation, and rollback without recording the
secret value.

## Frontend configuration

The browser uses relative API paths and contains no secret. `vite.config.ts` proxies local
`/v1`, `/health`, and `/sitemap.xml` requests. Environment-specific routing belongs at the
edge/deployment layer, not as embedded provider credentials.
