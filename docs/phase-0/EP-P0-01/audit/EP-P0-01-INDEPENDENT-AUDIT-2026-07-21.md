# EP-P0-01 Independent Audit

**Audit date:** 2026-07-21
**Auditor role:** Backend and compliance manager
**Candidate audited:** 1,392-row atomic requirements package
**Verdict:** **FAILED INDEPENDENT REVIEW — REVISION REQUIRED**

## Source identity

The canonical Constitution passed byte-level identity verification:

| Control | Actual | Expected | Result |
|---|---:|---:|---|
| Lines | 5,337 | 5,337 | PASS |
| Words | 8,313 | 8,313 | PASS |
| Bytes | 65,976 | 65,976 | PASS |
| SHA-256 | `53ff6b78255a979ed635ed113fb812b8ece5a7ed10933ad84773c9412d0f08f1` | Same | PASS |
| Parts | 1–10 | 1–10 | PASS |

## What passed

- 1,392 requirement IDs are syntactically valid and unique.
- All structural parent references resolve.
- Required columns and values are populated.
- All locators parse, remain in bounds, and remain inside their declared Part.
- Every recorded `source_wording` value exactly reconstructs from its cited
  canonical lines.
- Per-row source-wording hashes match.
- Counts reconcile mechanically by Part, modality, classification, type, target,
  and responsible layer.
- ODR, DDR, EFE, and OCR IDs are separate and structurally valid.
- All DDR entries carry the required derived-proposal label.

These passes prove mechanical consistency only. They do not prove semantic
correctness, atomicity, or approval readiness.

## Blocking failures

### 1. Acceptance criteria are not requirement-specific

All **1,392** records use one of only eight generic sentence templates. Examples
include “An acceptance test confirms this statement” and “The named artifact
exists.” They do not define the actor, precondition, observable result, failure
path, threshold, or binary pass/fail rule needed to test the individual clause.

**Required correction:** Replace every criterion with a requirement-specific,
binary condition and evidence rule. UI clauses need screen/state/accessibility
evidence; APIs need contract and negative-path assertions; data clauses need
schema/constraint assertions; process gates need named approval evidence.

### 2. Constitution section names are not exact

Only **63 of 1,392** rows use a section string that appears exactly in the
canonical file. **1,329** rows use synthesized group names such as “Controlled
Blueprint Workflow” or combined section titles rather than the heading as written.

**Required correction:** Use the exact canonical heading active at each cited line.
Split any record whose sources cross sections.

### 3. Requirement-type taxonomy is unauthorized

The controlling schema permits `Functional`, `Non-functional`, `Quality`,
`Process`, `Deliverable`, and `Identity`. **897** rows instead use unapproved
values:

| Unapproved value | Rows |
|---|---:|
| Documentation | 333 |
| Data | 130 |
| Governance | 99 |
| Business Rule | 88 |
| Operational | 77 |
| Security | 76 |
| API | 75 |
| Compliance | 19 |

**Required correction:** Reclassify every row into the approved taxonomy without
losing its responsible-layer or evidence metadata.

### 4. MAY clauses are counted as formal requirements

The formal REQ total includes **24 MAY rows**. The remediation rule explicitly
prohibits converting MAY options or examples into requirements.

**Required correction:** Move pure MAY clauses to a non-counted source-options
trace or an applicable ODR/DDR. Preserve a formal REQ only when an independent
MUST or SHOULD exists, and cite that clause separately.

### 5. Mixed modalities remain combined or strengthened

Twelve rows cite more than one modality without an accepted split. Verified
examples:

- `REQ-001.05` combines future features that **MAY** exist with architecture that
  **SHOULD** support future expansion.
- `REQ-002.08` and `REQ-002.09` combine a **MUST** page-depth target with a
  **SHOULD** operational-depth objective.
- `REQ-004.11` combines future multilingual capability (**SHOULD**) with the V1
  prohibition on enabling it (**MUST NOT**).
- `REQ-007.05`–`REQ-007.12` strengthen example permissions that **MAY** be
  included into mandatory permissions and combine them with separate SHOULD
  interface/authorization behavior.
- `REQ-081.08` weakens “The AI should analyze options such as …” from SHOULD to
  MAY.

The marketing launch items at lines 3675–3707 are also presented beneath
“Suggested phases” but several were classified as MUST without citing that
qualifier.

### 6. Atomicity remains incomplete

At least **75 high-confidence records** still bundle independently verifiable
items. Examples include:

- audit event categories;
- backend evaluation criteria;
- error-page types;
- button variants and states;
- card properties and contexts;
- dashboard fields and ordering;
- leaderboard columns;
- background-job workload types;
- documentation deliverables;
- marketing channels, content types, and metrics.

The count 1,392 is therefore not accepted as the final formal REQ total.

### 7. Formal source coverage is incomplete

Canonical line 107 — `Version 1.0 must remain intentionally focused.` — is an
uncited formal MUST. Line 569 (`The dashboard should be the heart of the
platform.`) is also uncited and requires disposition. Line 5147 establishes that
the following documents are required but is omitted from their non-contiguous
locators.

Other uncovered MAY/commentary lines must be dispositioned explicitly rather
than silently counted as requirements.

### 8. Phase 0 traceability is unresolved for every REQ

All **1,392** rows still say the related document identifier is pending ODR-001.
The authoritative handoff already defines EP-P0-01 through EP-P0-13, so this is a
stale placeholder, not a valid trace.

**Required correction:** Map every REQ to one or more exact EP-P0 identifiers and
record cross-document dependencies.

### 9. The required predecessor reassessment is not traceable

The rejected predecessor IDs `REQ-006`, `REQ-009`, `REQ-019`, `REQ-027`,
`REQ-031`, `REQ-055`, `REQ-058`, `REQ-076`, `REQ-080`, and `REQ-085` were to be
reassessed explicitly. Reusing those numbers for unrelated new parent groups is
not a reassessment. A predecessor-to-replacement mapping and disposition record is
required.

### 10. Change history is insufficient

The narrative change note does not enumerate predecessor additions, splits,
removals, modality corrections, reclassifications, or supersessions with a stable
audit identifier. The new remediation must create a machine-readable change map.

## Governance registers

The candidate contains 27 ODRs, 14 DDRs, 12 EFEs, and 3 owner clarifications.
Their separation and DDR labels passed. Their content remains subject to the next
semantic pass, but these registers are materially stronger than the rejected
Notion draft and should be retained as remediation inputs.

## Gate consequence

- EP-P0-01 is **not approved**.
- EP-P0-02 through EP-P0-13 remain blocked.
- Phase 1 coding remains blocked.
- The existing UI is an exploratory prototype and may be audited, inventoried,
  and mapped to requirements, but it must not be expanded as approved product
  implementation.

## Required corrective build

The next EP-P0-01 candidate must:

1. rebuild structural parents around exact canonical headings;
2. split mixed-modality and independently testable clauses;
3. exclude pure MAY options from the formal count;
4. use the approved requirement-type taxonomy;
5. supply requirement-specific binary acceptance criteria;
6. map every REQ to exact EP-P0 documents;
7. add the omitted clauses or record a reasoned non-requirement disposition;
8. produce a predecessor-to-replacement change map; and
9. rerun this validator followed by a full semantic review.

Until those conditions pass, no later Phase 0 artifact may be represented as a
valid derivative baseline.
