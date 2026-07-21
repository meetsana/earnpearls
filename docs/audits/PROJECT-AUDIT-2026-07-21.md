# EarnPearls repository audit

Date: 2026-07-21
Scope: repository wiring, build, dependencies, prototype claims, accessibility
risk, and Phase 0 governance alignment

## Verdict

The repository is a buildable exploratory prototype, not an implementation
baseline. It may remain available for inventory and design analysis, but frontend
or backend implementation should not proceed until the controlling Phase 0 gates
are approved.

## Verification results

- `npm run build`: PASS
- Built artifact: standalone `dist/index.html`, 93.64 kB / 14.28 kB gzip
- Production dependency audit (`npm audit --omit=dev`): 0 known vulnerabilities
- Full dependency audit: 3 development-tool findings through Vite 4/esbuild
  (1 low, 1 moderate, 1 high)
- EP-P0-01 validator: 25 passed, 0 failed
- EP-P0-01 v3 artifact manifest: all entries verified

## Critical findings

### 1. The built app and React source are disconnected

Vite builds the monolithic inline HTML/CSS/JavaScript in `index.html`. There is no
`src/main.jsx`, React root, or module entry importing the component/page tree.
Consequently, the files under `src/components` and `src/pages` are reference code
that is not exercised by the build.

Impact: a successful build does not prove that the React components compile,
render, or integrate. ODR-004 must decide the frontend architecture before this
is corrected.

### 2. The prototype presents unresolved business choices as active behavior

The built `index.html` contains:

- named survey providers and apparent live survey availability;
- PayPal, Virtual Visa, and cryptocurrency withdrawal choices;
- hardcoded withdrawal minimums, fees, and completion times;
- a functional-looking withdrawal confirmation flow;
- “Available in 13+ countries” and other launch-style claims;
- production-like user, wallet, survey, and admin statistics; and
- a “Hold period complete” label that suggests a global maturity period.

These conflict with or depend on ODR-003, ODR-005, ODR-006, ODR-014, ODR-016,
ODR-018, ODR-027, EFE-001, EFE-002, EFE-003, and EFE-010. OCR-002 expressly
prohibits inventing one global maturity or hold period.

Impact: the prototype can mislead reviewers if it is viewed without the Phase 0
warning. Treat all displayed values, brands, methods, countries, and activity as
unapproved sample data.

### 3. Accessibility and interaction behavior are not approval-ready

The built entry contains clickable `div` elements for admin actions, lacks dialog
semantics and a focus trap for the modal, has no live-region semantics on the
toast container, and relies on a global `event` object in `showPage`. These are
not sufficient evidence for keyboard access, screen-reader support, focus
management, or robust navigation.

Impact: accessibility conformance cannot be claimed. EFE-008 and the Product
Blueprint/UI review must establish the target and test evidence.

### 4. Development tooling requires a controlled upgrade

The current Vite 4/esbuild dependency line carries development-server audit
findings, and npm reports no non-breaking automatic fix in the installed line.
Production dependencies are unaffected in the current audit.

Impact: select and test a supported frontend toolchain after ODR-004. Do not run
the development server on an untrusted network in the meantime, and do not use
`npm audit fix --force` without an approved major-version migration plan.

## Required disposition

| Finding | Owner/gate | Action |
| --- | --- | --- |
| Static HTML versus React architecture | ODR-004 / EP-P0-06 | Select one approved frontend architecture and remove the unused path |
| Unsupported providers/payment claims | ODR-005, ODR-014 / EP-P0-04/05 | Label or neutralize sample data before external review |
| Global hold wording | OCR-002 / EP-P0-04/05 | Replace with provider-specific, decision-dependent copy |
| Keyboard/dialog/toast gaps | EFE-008 / EP-P0-04/05 | Define and test accessible interaction contracts |
| Vite/esbuild findings | ODR-004 / EP-P0-06/12 | Plan a supported toolchain upgrade and rerun audits |
| No React entry/test coverage | EP-P0-04/05/06/13 | Add only after architecture and implementation roadmap approval |

## Current safe parallel work

The UI may be inventoried and mapped to approved EP-P0-01 v3 IDs. No frontend
building is needed during EP-P0-02. The Notion Opus handoff in
`docs/handoffs/frontend/NOTION-OPUS-PHASE-0-FRONTEND-AUDIT-PROMPT.md` is the
authorized parallel task.
