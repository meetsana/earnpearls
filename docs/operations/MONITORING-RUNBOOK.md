# Monitoring and Incident Runbook

The application emits structured logs and database operational evidence. A production
launch additionally requires owner-selected uptime, error, log, and alert delivery services.
Staging without those integrations is not production-ready.

## Required telemetry

| Signal | Source | Alert intent |
| --- | --- | --- |
| liveness/readiness, HTTP rate/error/latency | edge/API | outage or degradation |
| database connections, CPU/storage, query latency, backup age | PostgreSQL provider | capacity/data risk |
| queued/failed/dead email and oldest age | `email_outbox`/dashboard | missed security/member mail |
| queued/running/failed/dead jobs and oldest age | `background_job_runs` | stale content/rankings/retention |
| provider health, sync failure/duration, signature/replay errors | providers/sync/security events | integration/integrity issue |
| wallet transition/reconciliation/reversal anomalies | ledger/audit/analytics | financial integrity |
| pending/reserved withdrawal age and failures | withdrawals/dashboard | payout/member risk |
| login failures, session events, critical security events | `security_events` | attack/account compromise |
| support backlog/first response/critical tickets | support/analytics | member-impact escalation |
| static deployment SHA/asset and sitemap availability | edge | frontend release drift |

Logs must redact cookies, authorization, CSRF, passwords, tokens, database/SMTP URLs,
provider secrets, encrypted/plain payout destinations, and email template token data.

## Proposed starting alerts

Owners tune after baseline; these are safe initial review values:

- readiness fails twice over 2 minutes: page on-call;
- 5xx > 2% for 5 minutes or p95 > 2 seconds: warn/page by impact;
- database storage > 80%, connections > 80%, backup overdue: page infrastructure;
- any dead security email or oldest security mail > 10 minutes: page operations/security;
- any dead recurring job or oldest due job > 30 minutes: page operations;
- repeated provider signature failure or amount mismatch: disable adapter and page security;
- withdrawal reserved beyond approved method SLA: finance/operations escalation;
- critical security event: immediate security owner notification;
- restore drill overdue: block production promotion.

Alert destination, coverage hours, acknowledgment, and backup contact must be recorded outside
the repository. Do not send sensitive payloads in alert titles.

## Triage

1. Acknowledge and record incident ID, start time, reporter, environment, release SHA.
2. Determine member, security, financial, provider, and data-recovery impact.
3. Preserve request IDs/job IDs/sanitized logs; do not destroy or mutate evidence.
4. Contain with the smallest safe control: provider off, feature off, maintenance, session
   revocation, deployment rollback. Global withdrawals stay off during uncertain integrity.
5. Diagnose against recent deploy/config/vendor changes and database evidence.
6. Recover using documented rollback/restore, then prove health and critical flows.
7. Communicate status and known uncertainty; never claim no loss before reconciliation.
8. Close only after monitoring is stable and an owner accepts remaining risk.

## Severity

| Severity | Examples | Response |
| --- | --- | --- |
| SEV-1 | data/ledger corruption, secret exposure, account takeover campaign, payout integrity, broad outage | immediate incident command; maintenance/financial freeze |
| SEV-2 | material feature outage, worker backlog affecting members, provider integrity failure | on-call response and scoped disable |
| SEV-3 | degraded non-critical function, isolated recoverable errors | business-hours owner and tracked fix |
| SEV-4 | cosmetic/docs issue with workaround | normal backlog |

Security/privacy incidents follow disclosure and evidence requirements of the responsible
jurisdictions and contracts; engage the designated legal/privacy owner immediately.

## Common containment

- API/database uncertain: maintenance mode, keep admin recovery, stop provider ingestion.
- Provider anomaly: disable provider, preserve events, stop reconciliation automation.
- Payout anomaly: global withdrawals off, method off, preserve reservations/references.
- Credential exposure: revoke/rotate, invalidate sessions where relevant, review access logs.
- Bad release: pin prior artifact/image, verify schema compatibility, roll back application.
- Email issue: keep queue, disable optional template if needed; security templates remain on.
- Abuse spike: rate/country/Limit Template controls under approved policy; avoid broad silent bans.

## Recovery verification

Check live/ready, login/session/CSRF, public settings/maintenance, representative survey read,
wallet balance equation, withdrawal safety switches, admin audit, email/job progress, static
asset SHA, and error/latency stability. Financial incidents require provider/ledger/
withdrawal reconciliation before reopening.

## Post-incident review

Within an owner-approved window record timeline, impact, detection gap, root cause,
contributing conditions, containment/recovery, data/financial reconciliation, communication,
what worked, and assigned actions with dates. Add automated detection/regression and update
runbooks. Do not blame individuals or edit historical evidence.

## Routine review

Daily during beta: health, security, providers, failed jobs/mail, withdrawal liability,
support critical/aged. Weekly: SLO trends, capacity, dependency alerts, audit sampling,
provider economics/reversals. Monthly: access review, secrets/keys schedule, restore evidence,
retention, incident actions, and cost. Quarterly: threat model and disaster exercise.
