# EP-P0-01 v3 independent semantic review

Date: 2026-07-21
Reviewer: ChatGPT Work / Codex
Decision: **PASS — approved as the requirements baseline for Phase 0 derivation only**

## Authority and boundary

The owner instructed the reviewer to audit the remediation independently and, if
it passed, continue to the next phases. That instruction is recorded as approval
to derive EP-P0-02 through EP-P0-13 from this baseline.

This decision does not:

- resolve any open ODR;
- approve a DDR or external fact;
- approve the existing UI as production implementation;
- authorize unsupported product or payment claims; or
- authorize Phase 1 implementation before EP-P0-02 through EP-P0-13 pass their
  own review gates.

## Canonical source control

- Lines: 5,337
- Words: 8,313
- Bytes: 65,976
- SHA-256: `53ff6b78255a979ed635ed113fb812b8ece5a7ed10933ad84773c9412d0f08f1`
- Parts reviewed: 1 through 10

## Approved baseline totals

| Register | Count |
| --- | ---: |
| Formal atomic REQ children | 1,666 |
| Structural parents | 204 |
| Non-counted MAY/example/source options | 100 |
| ODR | 28 total: 1 resolved, 27 open |
| DDR | 15 |
| EFE | 12 |
| OCR | 3 |

### Formal REQs by Part

| Constitution Part | Count |
| --- | ---: |
| Part 1 | 187 |
| Part 2 | 200 |
| Part 3 | 205 |
| Part 4 | 85 |
| Part 5 | 144 |
| Part 6 | 159 |
| Part 7 | 179 |
| Part 8 | 162 |
| Part 9 | 168 |
| Part 10 | 177 |
| **Total** | **1,666** |

### Reconciled dimensions

- Modality: MUST 918; SHOULD 748; MAY 0 formal
- Classification: CD 684; CBR 451; REC 510; FRR 21
- Type: Functional 628; Non-functional 147; Quality 145; Process 275;
  Deliverable 449; Identity 22
- Delivery target: V1 950; Future 21; Pre-implementation deliverable 695

## Semantic review performed

1. Reviewed all 210 detected headings. Two hundred four have formal REQ
   children; six are explicitly dispositioned as duplicate declarations,
   narrative transitions, or list labels.
2. Compared every stored source excerpt and digest with the canonical lines.
3. Rechecked explicit MUST/SHOULD tokens and split the mixed-modality clauses at
   lines 397 and 469.
4. Removed pure MAY, possible-feature, named-tool, suggested-status, and
   illustrative-example content from the formal total unless a controlling
   SHOULD/MUST clause independently exists.
5. Split independently testable fields, controls, qualities, deliverables, API
   capabilities, and all eight implementation-phase scope lists.
6. Rechecked the high-risk wallet lifecycle, database deliverables, API
   deliverables, required documentation, controlled workflow, and self-review
   sections directly against the canonical source.
7. Preserved the financial owner clarifications separately: elapsed time never
   validates a provider transaction, maturity is provider-specific, and
   withdrawability requires cleared funds plus configured risk conditions.
8. Completed the explicit reassessment of legacy REQ-006, REQ-009, REQ-019,
   REQ-027, REQ-031, REQ-055, REQ-058, REQ-076, REQ-080, and REQ-085.
9. Added ODR-028 for the unresolved account-state taxonomy and DDR-015 for the
   derived account-state transition-history proposal.
10. Reconciled all governance-register dependency references.

## Mechanical audit

The final validator passed 25 of 25 checks with zero failures, including unique
atomic IDs, parent resolution, section coverage, exact source wording, source
digests, allowed taxonomy, modality, atomicity, binary acceptance criteria,
Phase 0 traceability, normative-line coverage, governance-register integrity,
dependency resolution, and legacy reassessment coverage.

The machine-readable evidence is
`candidate-v3/EP-P0-01-Independent-Audit.json`.

## Open decisions and evidence gaps

The 27 open ODRs and 12 EFEs are intentional outputs of the approved baseline.
Any EP-P0-02 through EP-P0-13 statement that depends on one must remain explicitly
conditional, use an evidence placeholder, or stop at an approval gate. A later
document must not silently decide backend/frontend technology, payment methods,
provider visibility, eligibility, KYC, economics, service levels, retention,
infrastructure, or account-state policy.

## Gate result

EP-P0-01 v3 is approved for Phase 0 derivation. EP-P0-02 may proceed. EP-P0-03
remains blocked until EP-P0-02 is complete and independently reviewed. Phase 1
implementation remains blocked.
