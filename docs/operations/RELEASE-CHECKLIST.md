# Release Checklist

Use one immutable candidate SHA. Checkboxes require linked/sanitized evidence. Software
completion does not authorize providers, payouts, countries, or production infrastructure.

## Scope and ownership

- [ ] Release owner, approver, incident owner, rollback owner named
- [ ] Candidate SHA, target environment, change summary, risk, and rollback recorded
- [ ] No unrelated/unreviewed changes or unresolved conflict markers
- [ ] External gates/deviations explicitly listed; no implied approval
- [ ] User-facing and operator documentation updated

## Code and contract

- [ ] `npm ci --no-audit --no-fund` completed from clean checkout
- [ ] `npm run check` passed
- [ ] frontend, contracts, API, migrations, and worker tests passed
- [ ] recurring operations one-shot passed against PostgreSQL 17
- [ ] `npm run openapi:generate` leaves no diff
- [ ] full-build and staging audits passed
- [ ] `git diff --check` and formatting passed
- [ ] API image builds from `infra/docker/api.Dockerfile`

## Security and privacy

- [ ] CodeQL and production/full dependency audits passed with no unreviewed finding
- [ ] secret scan and log-redaction review passed
- [ ] HTTPS/TLS, exact origins, trusted proxy, cookie, CSRF, rate limits verified
- [ ] unique environment secrets stored in secret manager; seed secrets removed at runtime
- [ ] roles/Limit Templates/administrator access reviewed
- [ ] data collection, retention, legal/consent changes approved
- [ ] high-risk threat scenarios and abuse/error responses tested

## Database and financial integrity

- [ ] migration tested on fresh PostgreSQL 17 and representative prior schema
- [ ] applied migration files/checksums unchanged
- [ ] backup/recovery point recorded before migration
- [ ] append-only triggers and balance equations verified
- [ ] provider confirmation/reconciliation and reversal tests passed
- [ ] withdrawal reservation/rejection/paid/idempotency tests passed
- [ ] global withdrawals, wallet adjustments, and all unapproved methods remain off
- [ ] demo seed remains synthetic, balanced, and payout-reference free

## Product acceptance

- [ ] direct-load public, member, `/admin`, `/index.html`, and 404 routes
- [ ] registration/verification/login/logout/reset and session revocation
- [ ] capability/Limit Template and direct API denial parity
- [ ] maintenance and every enabled/disabled feature state
- [ ] dashboard, surveys, wallet history/explanations, withdrawals disabled/eligible paths
- [ ] notifications/preferences/email template and controlled delivery
- [ ] support member/admin conversation and attachment-unavailable truth
- [ ] CMS schedule/revision/blog search/FAQ/dynamic sitemap and staging noindex
- [ ] leaderboards exact aggregation/reset/history/exclusion
- [ ] admin settings/countries/providers/payouts/jobs/analytics/security/audit
- [ ] mobile/responsive keyboard and automated accessibility scans

## Infrastructure and recovery

- [ ] frontend/API/workers built from same SHA and recorded artifact/image digest
- [ ] production vendor/region/DNS/SMTP/monitoring approved
- [ ] database capacity, connection pool, TLS, backups/PITR, storage alerts approved
- [ ] timed isolated restore meets approved RPO/RTO
- [ ] uptime/error/log/queue/provider/security alerts tested to recipient
- [ ] prior artifact/image and compatibility rollback available
- [ ] status/incident communication path tested

## Provider/payout launch gate (only if in scope)

- [ ] contract, sandbox, countries, privacy roles, signature/replay, and owner approved
- [ ] compiled provider adapter and failure/reversal/amount tests passed
- [ ] payout vendor/method, reserves, fees, threshold, destination, KYC/tax policy approved
- [ ] manual/automated processing, dual control, reconciliation, support, incident flow proved
- [ ] activation evidence recorded in config/audit; enable smallest country cohort first

If not all applicable boxes pass, release may proceed only to an environment whose stated
scope tolerates the gaps. Live money must never be an accepted deviation.

## Deployment

- [ ] re-pin remote target immediately before publication
- [ ] fast-forward-only publication; exact committed tree verified
- [ ] CI and CodeQL green on exact remote SHA
- [ ] migration completed once before API rollout
- [ ] readiness gates API; static asset and API SHA match
- [ ] workers started and queue progress observed
- [ ] post-deploy smoke/acceptance and monitoring stable

## Rollback triggers

Rollback or contain immediately on migration uncertainty, auth/CSRF regression, balance
mismatch, incorrect reward/withdrawal state, secret/PII exposure, provider signature or
amount integrity failure, sustained availability breach, or inability to observe critical
queues. Preserve evidence before rollback.

## Release record

| Evidence | Value |
| --- | --- |
| SHA and target | |
| CI / CodeQL / audit links | |
| Frontend artifact and API image digest | |
| Migration and backup/restore point | |
| Acceptance evidence | |
| Monitoring window | |
| Known external gates | |
| Approver / rollback owner | |
