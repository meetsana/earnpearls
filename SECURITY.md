# Security Policy and Architecture

EarnPearls handles authentication, personal data, and financial-like reward evidence.
Security and financial integrity override convenience and release dates.

## Reporting a vulnerability

Use the repository owner’s private GitHub vulnerability-reporting channel. Do not open a
public issue. Include affected SHA/environment, reproduction, safe request IDs/timestamps,
impact, and suggested mitigation. Do not include real credentials, cookies, reset tokens,
provider secrets, database/SMTP URLs, personal data, or payout destinations.

Allow the owner reasonable time to investigate before disclosure. For active compromise,
contact the designated incident owner through the private operational channel.

## Supported version

Only the newest approved release SHA on the active release branch is supported. Staging is
synthetic and not a production launch. A branch/build is not production-approved until the
release checklist, monitoring, restore, legal, provider, payout, and owner gates pass.

## Threat model

Primary risks: credential stuffing/session theft, CSRF/XSS/injection, privilege escalation,
country/Limit Template bypass, provider webhook spoof/replay/amount mismatch, duplicate or
concurrent ledger/withdrawal mutation, payout destination exposure, malicious admin action,
dependency/secret compromise, sensitive logging, file-upload malware, database loss, and
abuse/fraud/automation.

Trust boundaries are browser/edge, API, PostgreSQL, workers, SMTP, provider adapters, hosting
control plane, and administrator users. External vendors are not trusted merely because a
connection is configured.

## Authentication and sessions

- passwords use memory-hard scrypt and a separate unique production pepper;
- password policy rejects weak/context-derived credentials;
- verification/reset tokens are random, hashed in the auth table, encrypted in outbox data,
  single-use, expiry-bound, and never returned from public APIs;
- sessions use high-entropy opaque tokens stored only as hashes server-side;
- sessions are revocable individually/all-at-once and expire; password change/reset revokes
  other sessions;
- production session cookie is Secure, HttpOnly, SameSite=Lax; session-bound CSRF uses an
  exact cookie/header pair on authenticated mutations;
- login/recovery use non-enumerating messages, rate limits, and security events;
- security notifications cannot be disabled by member preference.

## Authorization

RBAC grants granular permissions. Active Limit Templates subtract capabilities and never
grant. Account state, verified-email policy, feature/maintenance switch, country/provider/
payout rules, and the endpoint capability are enforced server-side. Client navigation is a
convenience mirror only. Admin mutations require CSRF, schema validation, reason/evidence
where material, and immutable audit record.

## Application and data controls

- Fastify schema validation, body limits, CORS allowlist, Helmet headers, and rate limits;
- parameterized PostgreSQL queries; explicit transactions/locks for state changes;
- stable safe error envelope; raw stack/SQL/secrets never returned;
- structured logs redact authorization/cookies/CSRF/password/token/secrets/destination;
- production startup rejects placeholder secrets, non-TLS database, and HTTP origins;
- IP evidence is HMAC-hashed with a separate secret and retained only by policy;
- sensitive payout destinations use AES-256-GCM with a unique 32-byte key and masked display;
- exact integer points/USD micro-units avoid floating-point financial corruption;
- wallet/withdrawal/provider mutations are idempotent and state-machine restricted;
- financial facts, entries/events, audit/security/account/revision/support/settlement evidence
  are protected from destructive mutation by database triggers.

## Provider and payout safety

Provider events require adapter-specific signature/replay/idempotency validation. A provider
cannot enable unless an adapter is registered in server code. Unknown states, amount
mismatch, and invalid/out-of-order events fail closed and produce safe evidence.

Payout methods default disabled and global withdrawals are a separate disabled switch.
Destination, minimum, fee, country, capability, balance, and idempotency are rechecked in a
serializable reservation transaction. Marking paid requires external evidence/reference.
No real provider or payout is authorized by this repository alone.

## Email and content safety

Transactional mail uses a database outbox with leases, retry, and dead-letter visibility.
Templates have allow-listed variables and immutable revisions; recipient data is HTML-
escaped, unsafe active/form HTML patterns are rejected, and verification/reset templates
cannot be disabled. Member action URLs remain within the configured application origin.

CMS Markdown renderer uses a constrained implementation rather than raw HTML execution.
Canonical/metadata and public content remain administrator-controlled; legal publication
requires owner approval.

## Uploads

Support attachment tables exist but upload/download is intentionally unavailable. Enabling
requires private object storage, random keys, strict size/type allowlist, checksum, malware
scan/quarantine, authorized short-lived downloads, filename/content-disposition safety,
retention/deletion, monitoring, and incident playbook. A UI/config-only enable is blocked.

## Secrets and key management

Use an approved secret manager with least privilege, access logs, rotation, and environment
separation. Never commit or expose secrets through `VITE_*`, Docker image layers, GitHub
logs, documentation, screenshots, tickets, or chat. Seed credentials are one-time inputs and
removed from runtime. Rotation procedures must account for password pepper and encryption-key
data migration; do not swap them blindly.

## Secure development lifecycle

Every relevant change includes threat/data/financial analysis, runtime schemas, authorization,
stable errors, audit, unit/integration tests, and docs/rollback. CI runs strict typechecks,
frontend/backend tests, PostgreSQL migrations, recurring worker SQL, builds, full/staging
controls, OpenAPI drift, Docker, dependency audits, and CodeQL. Applied migrations are
immutable. Synthetic test data only.

Before production: independent security review, real provider sandbox verification, secrets
and access review, monitoring alert test, penetration testing proportional to risk, database
restore drill, incident exercise, and release approval.

## Dependency and vulnerability management

Lockfile is committed. CI performs production high-severity and full dependency audits plus
CodeQL. Review direct/transitive change, maintainer/source integrity, license, runtime reach,
and exploitability. Critical active exposure triggers containment/patch release; no finding is
silently accepted. Record any temporary exception with owner, scope, compensating control,
expiry, and removal task.

## Monitoring and incident response

Monitor authentication/security events, provider signature/replay/amount failures, ledger
and withdrawal anomalies, API readiness/errors/latency, database capacity/backups, email/job
backlog/dead letters, support critical cases, and deployed SHA. Follow
`docs/operations/MONITORING-RUNBOOK.md`. Preserve evidence, disable the smallest affected
surface, keep global withdrawals off during uncertainty, rotate compromised secrets, and
reconcile before reopening.

## Backup and recovery

Follow `docs/operations/BACKUP-RECOVERY.md`. Production requires encrypted automated backup,
approved RPO/RTO, monitoring, and a timed isolated restore with ledger/integrity validation.
Application rollback is preferred for code defects; database restore requires explicit
incident/finance approval because it may remove valid financial/audit events.

## Known external security gates

Production secret manager, monitoring/error/log vendors, backup/PITR tier, DNS/region, SMTP
sender, legal/privacy approvals, live providers/payouts, file storage/scanner, and any KYC/
identity vendor are not provided by source code. Their absence must remain visible and blocks
the corresponding activation.
