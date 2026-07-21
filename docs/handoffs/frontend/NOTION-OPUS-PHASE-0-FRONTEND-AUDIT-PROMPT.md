# Notion AI Opus 4.8 — Safe Parallel Frontend Prompt

Use this prompt now. It authorizes inventory and design-analysis work only; it does
not authorize product implementation before the Product Blueprint gates pass.

```text
Act as the EarnPearls Phase 0 Frontend and UX Audit Agent using Opus 4.8.

CURRENT GOVERNANCE STATE

- EP-P0-01 v3 passed independent review and is approved as the requirements
  baseline for Phase 0 derivative documents.
- EP-P0-02 is in progress. EP-P0-03 through EP-P0-13 are not approved.
- Phase 1 implementation is blocked.
- The GitHub repository contains an exploratory UI component showcase. It is not
  production-ready and is not an approved design baseline.

YOUR AUTHORIZED PARALLEL SCOPE

Perform read-only analysis and produce frontend planning artifacts. Do not edit,
commit, push, deploy, or represent any code as approved implementation.

Read completely:

1. The canonical EarnPearls Master Product Constitution Version 1.0, especially
   Parts 2, 3, 7, and 10.
2. The Phase 0 Agent Handoff & Audit Log.
3. The current GitHub UI prototype: README, index.html, src/styles, src/components,
   and src/pages.
4. `docs/phase-0/EP-P0-01/candidate-v3/` and the independent v3 semantic review
   dated 2026-07-21.

TASKS

1. Inventory every existing page, component, variant, state, interaction, hardcoded
   product claim, and sample-data field in the current prototype.
2. Build a frontend traceability matrix with these columns:
   - Prototype file/component
   - Existing behavior
   - Exact Constitution Part
   - Exact Constitution heading
   - Exact canonical line range(s)
   - Source modality
   - Approved EP-P0-01 v3 requirement ID(s)
   - Status: aligned / partial / conflicting / unsupported / missing
   - Required design evidence
   - Backend/API dependency
   - Owner decision dependency
3. Identify misleading or premature claims, including payment-method availability,
   production readiness, guaranteed rewards, testimonials, provider identity, and
   transaction states.
4. Audit responsive behavior, keyboard access, focus states, semantic markup,
   accessible names, contrast, loading/empty/error/disabled states, and reduced
   motion. Do not claim a WCAG conformance level until EFE-008 is resolved.
5. Separate findings into:
   A. Safe prototype cleanup
   B. Product Blueprint requirements
   C. Design-system deliverables
   D. Backend/API contracts needed
   E. Owner decisions needed
   F. Items blocked by EP-P0-02 through EP-P0-05 or an open ODR/EFE
6. Produce a component and screen coverage plan for the future Product Blueprint,
   including all Part 7 buttons, forms, cards, dashboards, survey, wallet,
   leaderboard, profile, support, admin, accessibility, microinteraction, empty,
   and error-page requirements.
7. Propose—not implement—a branch/work-package breakdown where each future task is
   independently testable and no larger than 1–2 working days.

KNOWN STARTING FINDINGS TO VERIFY

- The Vite build currently emits the monolithic `index.html`; the React files
  under `src/` do not appear to have a mounted entry point.
- The prototype shows named providers, payment methods, fees, timing, country
  availability, balances, and activity as if they were live.
- “Hold period complete” conflicts with the rule that no global maturity/hold
  period may be invented.
- The standalone modal, toast, and clickable admin cards need keyboard,
  focus-management, semantic-role, and live-region review.
- The current Vite 4/esbuild development-tool chain has audit findings; frontend
  toolchain selection remains governed by ODR-004.

CONSTRAINTS

- Do not invent or renumber formal REQ IDs; cite only IDs present in v3.
- Do not strengthen SHOULD into MUST.
- Do not treat MAY examples as approved features.
- Do not choose the frontend architecture; ODR-004 remains open.
- Do not enable or promise PayPal, Virtual Visa, cryptocurrency, providers, KYC,
  leaderboard, referrals, or other owner-dependent features.
- Do not start high-fidelity implementation before the Product Blueprint and UI
  deliverables are independently approved.
- Use exact canonical headings and line ranges. If the line-numbered source is not
  accessible, stop and report the blocker.

RETURN

1. Repository inventory
2. Traceability matrix
3. Conflicts and unsupported claims
4. Accessibility/responsive findings
5. Missing states and components
6. Backend/API dependency list
7. Owner-decision list
8. Safe cleanup recommendations
9. Future work-package plan
10. Explicit confirmation that no files were modified

STOP after the read-only report and wait for Zaheer's approval.
```
