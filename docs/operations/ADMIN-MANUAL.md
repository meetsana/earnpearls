# EarnPearls Administrator Manual

## Safety rules

Use a named personal administrator account and only the role required for the task. Never
share sessions. Every material action needs a truthful reason and, for financial/provider
activation, an evidence reference. Audit logs are permanent evidence, not a notes area.

Do not place passwords, tokens, secret URLs, complete IP addresses, provider credentials,
or payout destinations in reasons, tickets, logs, or screenshots. Do not enable a real
provider, payout method, global withdrawals, wallet adjustments, attachment upload, or
future feature without its documented approval gate.

## Dashboard

Admin dashboard summarizes users, registrations/verification/activity, reward buckets,
withdrawal states, surveys/providers, support, jobs, email queue, content, security, and
system health. A zero may mean no activity; `unknown` is not healthy. Use System health and
the underlying queue/event list before declaring an incident resolved.

## User operations

### Search and export

Filter by text/status and open the exact UUID. CSV export contains sensitive account data;
download only for an approved purpose, store encrypted, restrict access, and delete under
retention policy. Do not email it as an attachment.

### Inspect

User detail combines profile, roles, account status, sessions, wallet, survey count,
withdrawals, support, notifications, recent activity, and security events. Confirm at least
two identifiers before acting on a similarly named account.

### Account states and Limit Templates

- `active`: normal capabilities;
- `limited`: active session with assigned capability denials;
- `suspended`/`disabled`: access restricted according to policy;
- `archived`: soft-deleted account retained for evidence/recovery.

Choose an existing Limit Template or create/clone one under Roles & access. Templates only
deny capabilities. State changes require a reason, optional expiry where supported, and
produce immutable history. Review downstream survey/withdrawal/support impact first.

### Sessions and password reset

Force logout revokes active sessions. Admin password reset queues the same secure one-time
flow used by members; administrators never see or set the password. Use after identity and
request verification under support policy.

### Roles

Assign/revoke the smallest administrative role. Verify permission list and target UUID.
Never use a role to work around a Limit Template or feature gate. Avoid removing the last
usable Super Admin; follow a second-person review for high-privilege changes.

## Survey and wallet operations

Pending reward validation requires provider confirmation or verified reconciliation
evidence. Reconciliation screen may validate/reject an eligible participation with reason
and external evidence. Never validate because time elapsed or a member supplied a screenshot
alone.

Mature/withdrawable settlement actions require the allowed source state and approved
evidence. Wallet adjustments are separately disabled by default. If enabled through an
owner decision, use a unique idempotency key, exact points, supported bucket, evidence, and
reason. Corrections are new transactions—not edits to financial facts.

## Withdrawal operations

Three independent layers matter:

1. feature visibility;
2. global `withdrawals.enabled` financial switch;
3. method enabled/country/minimum/fee/destination rules.

Payout methods are created disabled. Their evidence reference documents approval but does
not activate the global switch. Before any live enablement, verify payout vendor, contract,
credentials, country, KYC/tax policy, fee/threshold, reserve, processor, reconciliation,
support, incident owner, and dry-run record.

Review requests against reserved balance and evidence. Reject returns the reservation.
Mark paid only after external completion and enter a non-secret payout reference. Never
paste a complete destination. A request with no approved processor remains pending/review,
not falsely marked paid.

## Providers

Provider page shows registry, display/visibility, health, config, and last check. A provider
cannot enable unless a compiled adapter exists. For a real adapter, attach the decision
record and prove signature, replay, country, reward precision, status/reversal, outage,
privacy, and sandbox behavior. Disable on repeated integrity failures and follow incident
runbook.

## Platform settings and countries

Edit one setting at a time, preserve required fields, state reason/evidence, and verify the
public/member behavior. Built-in validation blocks unsafe country bypass, non-USD base,
undated rates, unsupported future features, attachments without storage, and financial
switches without evidence.

Country registration status is independent from provider and payout coverage. `enabled`
means registration is permitted by current product policy, not guaranteed opportunity.
Changes require legal/provider/operations review.

Maintenance mode should have a short truthful message and planned window. Admin access stays
available. Confirm readiness and critical flows before disabling maintenance.

## Content, communications, and SEO

Pages/posts/FAQs support draft, scheduled/published/archived state and immutable revisions.
Use canonical paths, accurate metadata, useful internal links, and licensed/approved image
URLs. Scheduled content is published by the operations worker. Legal pages require owner
legal approval; CMS capability is not legal approval.

Announcements target optional countries and time windows. Broadcasts expand asynchronously
and respect preferences; promotional mail requires opt-in. Use member-safe action URLs only.

Email templates expose allow-listed variables. Preserve every required token. HTML rejects
scripts/forms/event handlers and recipient variables are escaped. Verification and reset
templates cannot be disabled. Send a controlled test after editing.

Sitemap updates from published CMS/blog records; disabling blog removes its URLs. Staging
is noindex and must not be submitted to search engines.

## Support queue

Filter by status/priority and inspect the complete conversation. Public replies notify the
member; internal notes stay admin-only. Set priority/status/assignment deliberately and
include reason. Messages and events cannot be edited, so correct mistakes with a new note.

Never ask for password, verification/reset token, full payout credential, or secret. File
upload remains unavailable until secure storage/scanning is configured. Escalate security,
privacy, provider integrity, and financial cases to their owners.

Suggested starting service targets (owner must approve): security/financial critical triage
within 1 hour, high priority within 4 business hours, normal first response within 1 business
day. Analytics measures actual response time.

## Leaderboards

Configure cadence, metric, entry limit, and seasonal dates. Reset finalizes the current
period and starts a clean materialization; do not use reset to manipulate results. Exclusions
require a reason and hide the member from a specific board without changing wallet facts.
Streak/referral metrics remain off until those data domains exist.

## Jobs, health, and audit

Jobs page shows attempts, schedule, completion, and sanitized error. Fix cause before retry;
every retry is audited. Email and operations workers are independent of API health. A green
API does not prove mail or rankings are current.

Security events are operational signals; preserve request ID and timestamp. Audit search
supports action review. Audit records cannot be changed; export/share only under approved
access and retention.

## End-of-shift checklist

- no unexplained provider/job/email failures;
- high-risk queues assigned and aged cases escalated;
- withdrawal liability/reservations reconcile under finance procedure;
- no temporary feature/maintenance/country flag left incorrectly set;
- all changes have usable reasons/evidence;
- incidents and handoff notes reference sanitized IDs, owner, and next action.
