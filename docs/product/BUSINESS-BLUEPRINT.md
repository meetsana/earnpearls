# EarnPearls Business Blueprint

Version 2.0 · synchronized with the Version 1 implementation · 2026-07-22

## Executive summary

EarnPearls is a trust-led rewards platform. Version 1 helps eligible adults discover
third-party surveys, records provider-confirmed rewards as points and USD micro-units,
and explains every balance state before a withdrawal is permitted. It is not positioned
as employment, guaranteed income, or a provider of surveys in every market.

The business thesis is that rewards users will prefer a smaller, clearer catalog with
honest status information over a confusing interface that overstates availability or
cash value. Operational leverage comes from a modular provider layer, automated ledger
and notification workflows, configurable country/risk controls, and one administrator
system instead of manual spreadsheets.

## Vision, mission, and principles

Vision: become a dependable global rewards account in which members understand the
origin, status, and availability of every reward.

Mission: connect eligible members to approved reward opportunities while operating a
transparent, secure, and evidence-driven ledger.

Decision order:

1. User trust and financial accuracy
2. Security and legal/provider compliance
3. Clear, accessible experience
4. Sustainable unit economics
5. Operational automation
6. Growth and feature breadth

## Customer and problem

Primary member: an English-speaking adult in an enabled launch country who wants to use
spare time for modest rewards and values clear expectations. The initial operator is a
small team that needs precise controls, an audit trail, and low infrastructure cost.

Problems addressed:

- opportunity catalogs often hide eligibility, estimated time, or validation delay;
- a single “balance” obscures pending and actually withdrawable value;
- members cannot easily explain reversals, maturity, or payout status;
- operators rely on manual support and reconciliation without durable evidence;
- premature provider/payout activation creates contractual, fraud, and cash-flow risk.

The product does not solve low provider inventory, guarantee survey qualification, or
replace professional income. Those constraints must be communicated plainly.

## Brand strategy

Name: EarnPearls. Tagline: **Your Time. Your Rewards.**

Brand attributes: calm, clear, capable, respectful, and transparent. Avoid casino-like
urgency, fake countdowns, invented scarcity, exaggerated earnings, or unverified social
proof. The pearl metaphor represents small verified rewards accumulating over time.

Voice:

- say “estimated,” “pending,” and “provider-confirmed” when those are the facts;
- show points and USD together and explain any local-currency estimate;
- use direct action labels and plain error recovery;
- never imply a payout is available while either safety switch is off.

## Market and positioning

EarnPearls competes for member attention with survey routers, offerwall sites, cashback
apps, and direct research panels. The differentiator is not a claim of the largest
inventory. It is a transparent reward ledger, safer operator controls, and a product
architecture that can add vetted reward types without corrupting the accounting model.

Before signing any commercial agreement, the owner must perform a current market review
covering provider geographic coverage, respondent quality requirements, chargeback
windows, payment terms, privacy roles, data-transfer regions, SDK/link restrictions,
and prohibited traffic sources. This document intentionally makes no unsupported claim
about a current competitor or provider contract.

## Business model

Initial revenue is the documented spread between provider compensation and the member
reward, measured in USD micro-units. Revenue is recognized only according to approved
accounting policy and provider evidence; a pending member estimate is not booked as cash.

Potential future models, each requiring a separate decision record:

- survey-provider margin;
- clearly disclosed promotional placement;
- partner offer margin;
- cashback commission;
- gift-card procurement spread;
- premium B2B analytics using aggregated, privacy-preserving data.

Never monetize by selling passwords, payout data, precise behavioral profiles, or data
outside disclosed consent and contractual scope.

## Unit-economics control model

Track by provider, country, and cohort:

- gross provider-confirmed USD;
- member reward liability by wallet bucket;
- reversal and rejection rates;
- payout and transaction fees;
- support minutes per validated completion;
- fraud loss and recovery;
- contribution margin after variable costs;
- working-capital days between validation, provider settlement, and payout.

The global withdrawal switch remains off until finance approves liquidity reserves,
minimums, fees, payout processing ownership, reconciliation, and reversal policy.

## Launch markets

Initial enabled registration markets are US, GB, CA, IE, AU, DE, BE, SA, AE, QA, OM,
and BH. PK, IN, BD, and CN are explicitly blocked. An enabled technical flag is not a
legal conclusion: the launch owner must still approve age/eligibility copy, privacy
requirements, sanctions screening, tax disclosures, provider coverage, and payout
availability per country.

Country changes require an administrator reason and audit record. Provider and payout
country rules remain independent; registration availability never guarantees inventory
or withdrawal access.

## Go-to-market

### Stage 0 — internal alpha

- synthetic data only;
- prove ledger transitions, support operations, monitoring, and restore procedure;
- validate all claims and legal text;
- measure task completion and accessibility with internal testers.

### Stage 1 — closed beta

- one contract-approved provider in a narrow set of countries;
- invite-only cohort and conservative caps;
- manual review of every reconciliation and withdrawal;
- daily cash-liability and complaint review.

### Stage 2 — open beta

- expand only after provider quality, support load, reversal rate, and cash cycle meet
  signed thresholds;
- publish educational content, transparent FAQs, and genuine member feedback;
- run acquisition tests with explicit spend and fraud ceilings.

### Stage 3 — public launch

- activate only approved country/provider/payout combinations;
- use SEO and educational content as the durable channel;
- diversify providers without sacrificing quality controls;
- introduce future reward modules behind independent feature and financial gates.

## Growth strategy

Acquisition priorities: high-intent educational search, approved provider/partner
channels, transparent product content, and consented lifecycle email. Retention should
come from clear inventory, honest status updates, useful notifications, and responsive
support—not manipulative streak loss or undisclosed urgency.

Every campaign requires:

- audience, country, source, landing page, and approved claim;
- cost ceiling and success/stop metrics;
- fraud and duplicate-account monitoring;
- consent and unsubscribe handling;
- post-campaign cohort quality and contribution-margin review.

## Operating model

Core responsibilities:

| Function | Accountable outcomes |
| --- | --- |
| Product owner | scope, claims, country decisions, roadmap, member outcomes |
| Operations | provider health, jobs, catalog, incident triage, reconciliations |
| Finance | liability, settlements, payout approvals, liquidity, accounting policy |
| Support | ticket SLAs, safe identity handling, escalation, knowledge gaps |
| Content/marketing | versioned content, SEO, announcements, consented campaigns |
| Security/engineering | releases, access, monitoring, vulnerabilities, recovery |
| Legal/privacy owner | terms, privacy, cookies, eligibility, vendor agreements |

High-risk actions use least privilege, written reasons, audit logs, and evidence
references. No person should both create and approve a live payout integration without
an owner-approved exception.

## Customer lifecycle

1. Visitor reads truthful value, process, security, FAQ, and country information.
2. Eligible member registers, verifies email, and reviews active sessions.
3. Member sees only eligible active surveys from enabled providers.
4. Start creates an idempotent participation before provider launch.
5. Provider evidence moves reward from Pending to Validated; policy/evidence moves it
   to Mature and then Withdrawable.
6. A withdrawal can be requested only when the global and method switches, country,
   capability, balance, minimum, destination, and idempotency checks all pass.
7. Member receives preference-aware notifications and can open a tracked support ticket.
8. Account data can be moderated, archived, restored, and retained under documented policy.

## Fraud and abuse strategy

Preventive controls include verified email, rate limits, opaque sessions, country rules,
provider signatures, idempotency, capability denials, encrypted payout destinations,
independent payout switches, and immutable evidence. Detection uses authentication
events, provider anomalies, duplicate identifiers available under contract, reward and
withdrawal velocity, repeated reversals, and support patterns. Response uses Limit
Templates, session revocation, account states, leaderboard exclusions, reconciliation,
and documented escalation.

Do not silently invent device fingerprinting, KYC, or identity-vendor checks. Each
requires a privacy/security review, explicit data mapping, retention limit, contract,
false-positive process, and member-facing explanation.

## Risk register

| Risk | Control | Activation/owner gate |
| --- | --- | --- |
| Provider non-payment or reversal | separate wallet buckets and settlement evidence | Finance + provider contract |
| Payout fraud or liquidity gap | dual switches, encrypted destination, reservation ledger | Finance approval |
| Fake/duplicate accounts | verification, rate limits, events, Limit Templates | Fraud policy |
| Misleading earnings claims | approved copy, exact states, placeholder labels | Product/legal review |
| Country/privacy breach | country registry, data map, legal review | Legal/privacy owner |
| Credential compromise | least privilege, secret manager, rotation, CodeQL | Security owner |
| Database loss | managed backups and restore drills | Infrastructure owner |
| Worker backlog | queue metrics, retries, dead-letter visibility | Operations on-call |
| Vendor lock-in | adapters, PostgreSQL, container/static boundaries | Architecture review |
| Support overload | FAQs, transparent status, queue priorities, SLA metrics | Support owner |

## Metrics and decision thresholds

North-star candidate: provider-confirmed reward value delivered per eligible active
member, paired with trust guardrails. A single growth number must never override:

- reward reversal rate;
- unresolved support age and first-response time;
- provider confirmation latency;
- withdrawal processing time and failure rate;
- security incidents and account takeovers;
- verified-registration and survey-completion rates;
- contribution margin and outstanding member liability;
- accessibility and task-completion failures.

Thresholds are not invented in code. Owners approve values after baseline observation.

## SWOT

Strengths: exact and explainable ledger, safe default-off integrations, comprehensive
admin operations, modular architecture, low-cost staging, and durable audit evidence.

Weaknesses: no live inventory or payout until external agreements exist, an English-only
Version 1, dependency on third-party validation, and an initially manual payout process.

Opportunities: trust-focused SEO, underserved transparent status experience, provider
diversification, loyalty layers, and mobile clients over the same API.

Threats: provider policy changes, acquisition fraud, payment restrictions, privacy-law
change, working-capital pressure, low survey qualification, and larger competitors.

## Long-term expansion rules

Offerwalls, referrals, daily rewards, games, cashback, gift cards, campaigns, loyalty,
mobile apps, and automation use new domain modules and ledger reference types. They must
not reuse “survey” semantics or bypass evidence, exact accounting, country controls,
notifications, support, analytics, and audit requirements. Future flags default off.

## Blueprint self-review (Version 2 changes)

The initial concept overemphasized feature breadth and a generic “global” launch. This
revision narrows Version 1 to survey-led rewards, separates registration from provider
and payout availability, treats working capital as a launch gate, prohibits fabricated
social proof, and makes provider contracts/legal/backup evidence explicit external
dependencies. It also rejects numeric business targets without baseline data. The next
review should use closed-beta evidence, support themes, provider economics, and a proved
restore rather than assumptions.
