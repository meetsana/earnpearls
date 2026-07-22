# Backup and Recovery Guide

This guide defines the required procedure; it does not claim the current free-tier staging
provider has production-grade backup/PITR. The infrastructure owner must record actual
provider capabilities and prove restores before production.

## Assets

| Asset | System of record | Backup approach |
| --- | --- | --- |
| PostgreSQL | managed PostgreSQL 17 | encrypted automated snapshots + PITR if approved tier supports it |
| Application/config | Git and reviewed deployment manifests | protected repository/tags; secret names only |
| Secrets | selected secret manager | provider recovery/export under dual control; never Git |
| Static assets | reproducible Git SHA build | retain artifact/image digest for active/prior releases |
| Uploaded files | future private object store | versioning/retention/checksum after upload feature approval |
| Audit/incident evidence | database + approved incident store | retention and restricted immutable access |

## Recovery objectives

Owners must approve numeric RPO/RTO from business/provider cost before production. Proposed
starting targets for review—not commitments:

- financial/identity database RPO ≤ 15 minutes with PITR;
- API/member read availability RTO ≤ 4 hours;
- email/analytics worker RTO ≤ 8 hours;
- CMS static rebuild RPO 0 from Git and RTO ≤ 2 hours.

If the selected tier cannot meet approved targets, upgrade it or narrow launch scope. Do not
silently accept weaker recovery.

## Backup policy

- encrypt in transit and at rest with provider-managed or owner-approved keys;
- restrict backup administration separately from routine application access;
- use daily snapshots plus PITR/transaction logs where supported;
- retain according to legal/financial/privacy policy, not indefinitely by default;
- monitor backup success, age, storage, and deletion/retention changes;
- include schema/version, environment, timestamp, region, encryption, and restore metadata;
- never copy production personal data into development; use sanitized or synthetic data.

## Restore drill (isolated target)

1. Open an approved change/incident record; state source, recovery point, target, owner.
2. Create a new isolated PostgreSQL 17 target—never overwrite the source during a drill.
3. Restrict network and credentials; record start time.
4. Restore snapshot/PITR to the chosen timestamp.
5. Run migration status without altering applied checksums.
6. Validate table counts/ranges, foreign keys, append-only triggers, administrator access,
   wallet balance equations, withdrawal reservations, outbox/jobs, and audit chronology.
7. Start the pinned application against the isolated target with SMTP/providers/payouts off.
8. Run health, auth read-only, dashboard/wallet, content, and admin evidence checks.
9. Record achieved RPO/RTO, discrepancies, logs, and approval.
10. Destroy the isolated copy through the provider’s recoverable process after evidence and
    retention requirements are satisfied.

## Disaster recovery

For confirmed primary loss/corruption:

1. Declare incident, freeze deployments and financial/provider ingestion.
2. Preserve logs, provider event references, release SHA, and last known good backup.
3. Choose recovery point with finance/security/privacy owners; state expected data loss.
4. Restore isolated, validate, then promote through provider-approved mechanism.
5. Rotate affected database/application credentials and revoke uncertain sessions.
6. Reconcile provider events, wallet/withdrawal evidence, outbox, and jobs after the point.
7. Reopen features incrementally; global withdrawals last and only after finance sign-off.
8. Communicate member impact without unsupported precision.
9. Complete post-incident review and a new restore drill.

## Application rollback versus database recovery

Prefer restoring the previous frontend artifact/API image for application defects. Migrations
are forward-oriented; use a compatibility fix rather than ad hoc down SQL. Restore a database
only for actual data loss/corruption and with explicit approval because it can discard valid
newer financial/audit events.

## Evidence checklist

- backup job ID/status/age and provider location;
- source/recovery timestamp and achieved RPO;
- release/schema SHA and restored target;
- integrity queries and acceptance results;
- achieved RTO;
- owner/approver and deviations;
- proof the drill target was securely removed.
