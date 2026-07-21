# EP-P0-01 — Backend & Compliance Atomic Requirements Register

**Status:** REVISION COMPLETED — PENDING INDEPENDENT REVIEW  
**Extraction date:** 2026-07-21  
**Scope:** Fresh extraction from all ten Parts of the canonical Constitution. Frontend-owned clauses remain traceable but are marked `Frontend handoff`; no frontend architecture is selected here.

## Source control

| Control | Verified value |
|---|---|
| Canonical file | EARNPEARLS MASTER PRODUCT CONSTITUTION — VERSION 1.0.md |
| Lines | 5337 |
| Words | 8313 |
| Bytes | 65976 |
| SHA-256 | `53ff6b78255a979ed635ed113fb812b8ece5a7ed10933ad84773c9412d0f08f1` |
| Parts present | 1–10 |

Line citations refer only to this byte-verified canonical file. A semicolon separates non-contiguous source ranges. Structural parent IDs are navigation containers and are not counted as formal requirements; only child IDs such as `REQ-001.01` are formal atomic REQs.

Each atomic row also contains a `source_digest_sha256` calculated from that row’s canonical source excerpt. It is an integrity control for the excerpt, not a replacement for the canonical file SHA-256.

## Register rules

- **REQ:** A formal Constitution requirement. Only atomic REQ children count toward totals.
- **ODR:** An unresolved owner decision. It never counts as a Constitution requirement.
- **DDR:** A derived design or architecture proposal. Every DDR is non-authoritative until approved.
- **EFE:** An external fact that requires current authoritative evidence before reliance.
- **OCR:** A binding owner clarification recorded outside the Constitution. It is not falsely assigned a Constitution citation.
- **Classification:** `CD` = constitutional directive; `CBR` = constitutional business rule; `FRR` = future-ready requirement; `REC` = recommendation/optional clause.
- **ID stability:** After independent approval, existing IDs are never renumbered or reused. New atomic children take the next unused suffix under the applicable parent; superseded rows retain their ID and change status through a controlled change record.

## Reconciled counts

### By Constitution Part

| Value | Count |
|---|---:|
| Part 1 | 143 |
| Part 2 | 188 |
| Part 3 | 202 |
| Part 4 | 87 |
| Part 5 | 147 |
| Part 6 | 168 |
| Part 7 | 106 |
| Part 8 | 107 |
| Part 9 | 112 |
| Part 10 | 132 |

### By source modality

| Value | Count |
|---|---:|
| MUST | 756 |
| MAY | 24 |
| SHOULD | 612 |

### By classification

| Value | Count |
|---|---:|
| CD | 533 |
| FRR | 26 |
| CBR | 450 |
| REC | 383 |

### By requirement type

| Value | Count |
|---|---:|
| Governance | 99 |
| Non-functional | 115 |
| Documentation | 333 |
| Functional | 380 |
| Business Rule | 88 |
| Security | 76 |
| Data | 130 |
| Compliance | 19 |
| API | 75 |
| Operational | 77 |

### By delivery target

| Value | Count |
|---|---:|
| Pre-implementation deliverable | 506 |
| V1 | 860 |
| Future | 26 |

### By responsible layer

| Value | Count |
|---|---:|
| Shared governance | 184 |
| Shared | 159 |
| Architecture | 33 |
| Backend | 73 |
| Frontend handoff | 175 |
| Backend/Admin ERP | 182 |
| Security/Backend | 18 |
| Database | 88 |
| Backend/Analytics | 35 |
| DevOps/Operations | 38 |
| Database/Backend | 57 |
| Database/Operations | 14 |
| Backend/API | 154 |
| Backend/Integration | 13 |
| Marketing/Shared | 40 |
| Marketing | 13 |
| Backend/Marketing | 15 |
| DevOps/Architecture | 21 |
| DevOps/Database | 9 |
| Backend/Infrastructure | 14 |
| Backend/DevOps | 9 |
| DevOps | 11 |
| DevOps/Security | 21 |
| Shared engineering | 16 |

## Atomic requirements

The complete 19-field authoritative row set is in the companion CSV and JSON. This review view preserves every ID, modality, owner, source locator, summary, target, and atomic acceptance criterion.

### REQ-001 — Part 1 / AI Master Instruction and Primary Objective

**Structural source span:** L3–L123  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-001.01 | MUST | Pre-implementation deliverable | Governance | Shared governance | L9–L63 | The delivery agent operates as a multidisciplinary product, engineering, security, operations, design, marketing, QA, and documentation organization rather than immediately acting as a coding assistant. | Workflow and audit evidence confirm this statement: “The delivery agent operates as a multidisciplinary product, engineering, security, operations, design, marketing, QA, and documentation organization rather than immediately acting as a coding assistant.” |
| REQ-001.02 | MUST | Pre-implementation deliverable | Governance | Shared governance | L63–L65 | The work produces a complete business and software ecosystem before implementation begins. | Workflow and audit evidence confirm this statement: “The work produces a complete business and software ecosystem before implementation begins.” |
| REQ-001.03 | MUST | V1 | Non-functional | Shared | L69–L75 | EarnPearls is designed as a modern, scalable, secure, trustworthy, and highly optimized rewards platform. | A defined measurement or design review confirms this statement: “EarnPearls is designed as a modern, scalable, secure, trustworthy, and highly optimized rewards platform.” |
| REQ-001.04 | MUST | V1 | Non-functional | Architecture | L73–L75 | The architecture supports future product expansion without requiring major rewrites. | A defined measurement or design review confirms this statement: “The architecture supports future product expansion without requiring major rewrites.” |
| REQ-001.05 | MAY | Future | Documentation | Architecture | L77–L103; L123 | The architecture records the listed future capability families as potential expansion domains without treating them as activated V1 features. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The architecture records the listed future capability families as potential expansion domains without treating them as activated V1 features.” |
| REQ-001.06 | SHOULD | V1 | Functional | Backend | L109; L111 | Version 1 prioritizes surveys. | An acceptance test confirms this statement: “Version 1 prioritizes surveys.” |
| REQ-001.07 | SHOULD | V1 | Functional | Backend | L109; L113 | Version 1 prioritizes the wallet. | An acceptance test confirms this statement: “Version 1 prioritizes the wallet.” |
| REQ-001.08 | SHOULD | V1 | Functional | Backend | L109; L115 | Version 1 prioritizes rewards. | An acceptance test confirms this statement: “Version 1 prioritizes rewards.” |
| REQ-001.09 | SHOULD | V1 | Functional | Shared | L109; L117 | Version 1 prioritizes user experience. | An acceptance test confirms this statement: “Version 1 prioritizes user experience.” |
| REQ-001.10 | SHOULD | V1 | Non-functional | Shared | L109; L119 | Version 1 prioritizes user trust. | A defined measurement or design review confirms this statement: “Version 1 prioritizes user trust.” |
| REQ-001.11 | SHOULD | V1 | Non-functional | Architecture | L109; L121 | Version 1 prioritizes scalability. | A defined measurement or design review confirms this statement: “Version 1 prioritizes scalability.” |

### REQ-002 — Part 1 / Controlled Blueprint Workflow

**Structural source span:** L127–L301  
**Atomic child count:** 67

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-002.01 | MUST | Pre-implementation deliverable | Governance | Shared governance | L127–L131; L301 | Development does not begin until the prescribed analysis and blueprint sequence is completed. | Workflow and audit evidence confirm this statement: “Development does not begin until the prescribed analysis and blueprint sequence is completed.” |
| REQ-002.02 | MUST | Pre-implementation deliverable | Governance | Shared governance | L131; L135 | Phase 1 documents a complete understanding of the business. | Workflow and audit evidence confirm this statement: “Phase 1 documents a complete understanding of the business.” |
| REQ-002.03 | MUST | Pre-implementation deliverable | Governance | Shared governance | L131; L137 | Phase 1 studies every requirement. | Workflow and audit evidence confirm this statement: “Phase 1 studies every requirement.” |
| REQ-002.04 | MUST | Pre-implementation deliverable | Governance | Shared governance | L131; L139 | Phase 1 identifies weaknesses. | Workflow and audit evidence confirm this statement: “Phase 1 identifies weaknesses.” |
| REQ-002.05 | MUST | Pre-implementation deliverable | Governance | Shared governance | L131; L141 | Phase 1 proposes improvements. | Workflow and audit evidence confirm this statement: “Phase 1 proposes improvements.” |
| REQ-002.06 | MUST | Pre-implementation deliverable | Governance | Shared governance | L131; L143 | Phase 1 challenges assumptions. | Workflow and audit evidence confirm this statement: “Phase 1 challenges assumptions.” |
| REQ-002.07 | MUST | Pre-implementation deliverable | Governance | Shared governance | L131; L145 | Phase 1 recommends better alternatives when appropriate. | Workflow and audit evidence confirm this statement: “Phase 1 recommends better alternatives when appropriate.” |
| REQ-002.08 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L149–L155 | Phase 2 produces a complete Business Blueprint. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Phase 2 produces a complete Business Blueprint.” |
| REQ-002.09 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L151–L155 | The Business Blueprint targets approximately 100 pages and sufficient operational depth for a new company to operate from it. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint targets approximately 100 pages and sufficient operational depth for a new company to operate from it.” |
| REQ-002.10 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L159 | The Business Blueprint includes an Executive Summary. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes an Executive Summary.” |
| REQ-002.11 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L161 | The Business Blueprint includes the Vision. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes the Vision.” |
| REQ-002.12 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L163 | The Business Blueprint includes the Mission. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes the Mission.” |
| REQ-002.13 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L165 | The Business Blueprint includes Brand Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Brand Strategy.” |
| REQ-002.14 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L167 | The Business Blueprint includes Market Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Market Analysis.” |
| REQ-002.15 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L169 | The Business Blueprint includes Competitor Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Competitor Analysis.” |
| REQ-002.16 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L171 | The Business Blueprint includes SWOT Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes SWOT Analysis.” |
| REQ-002.17 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L173 | The Business Blueprint includes the Revenue Model. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes the Revenue Model.” |
| REQ-002.18 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L175 | The Business Blueprint includes Growth Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Growth Strategy.” |
| REQ-002.19 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L177 | The Business Blueprint includes the User Journey. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes the User Journey.” |
| REQ-002.20 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L179 | The Business Blueprint includes Customer Psychology. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Customer Psychology.” |
| REQ-002.21 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L181 | The Business Blueprint includes Risk Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Risk Analysis.” |
| REQ-002.22 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L183 | The Business Blueprint includes Fraud Prevention Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Fraud Prevention Strategy.” |
| REQ-002.23 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L185 | The Business Blueprint includes the Product Roadmap. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes the Product Roadmap.” |
| REQ-002.24 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L187 | The Business Blueprint includes Expansion Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes Expansion Strategy.” |
| REQ-002.25 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L157; L189 | The Business Blueprint includes the Long-Term Vision. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint includes the Long-Term Vision.” |
| REQ-002.26 | MUST | Pre-implementation deliverable | Governance | Shared governance | L193; L195 | Phase 3 reviews the Business Blueprint. | Workflow and audit evidence confirm this statement: “Phase 3 reviews the Business Blueprint.” |
| REQ-002.27 | MUST | Pre-implementation deliverable | Governance | Shared governance | L193; L197 | Phase 3 criticizes the Business Blueprint. | Workflow and audit evidence confirm this statement: “Phase 3 criticizes the Business Blueprint.” |
| REQ-002.28 | MUST | Pre-implementation deliverable | Governance | Shared governance | L193; L199 | Phase 3 identifies weaknesses in the Business Blueprint. | Workflow and audit evidence confirm this statement: “Phase 3 identifies weaknesses in the Business Blueprint.” |
| REQ-002.29 | MUST | Pre-implementation deliverable | Governance | Shared governance | L193; L201 | Phase 3 improves the Business Blueprint. | Workflow and audit evidence confirm this statement: “Phase 3 improves the Business Blueprint.” |
| REQ-002.30 | MUST | Pre-implementation deliverable | Governance | Shared governance | L193; L203 | Phase 3 produces Business Blueprint Version 2. | Workflow and audit evidence confirm this statement: “Phase 3 produces Business Blueprint Version 2.” |
| REQ-002.31 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L207–L209 | Phase 4 produces a Product Blueprint. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Phase 4 produces a Product Blueprint.” |
| REQ-002.32 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L213 | The Product Blueprint documents every page. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every page.” |
| REQ-002.33 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L215 | The Product Blueprint documents every screen. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every screen.” |
| REQ-002.34 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L217 | The Product Blueprint documents every workflow. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every workflow.” |
| REQ-002.35 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L219 | The Product Blueprint documents every button. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every button.” |
| REQ-002.36 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L221 | The Product Blueprint documents every user action. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every user action.” |
| REQ-002.37 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L223 | The Product Blueprint documents every notification. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every notification.” |
| REQ-002.38 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L225 | The Product Blueprint documents every permission. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every permission.” |
| REQ-002.39 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L227 | The Product Blueprint documents every dashboard. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every dashboard.” |
| REQ-002.40 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L211; L229 | The Product Blueprint documents every process. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint documents every process.” |
| REQ-002.41 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L231–L233 | The Product Blueprint makes no unstated assumptions and documents everything in scope. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Product Blueprint makes no unstated assumptions and documents everything in scope.” |
| REQ-002.42 | MUST | Pre-implementation deliverable | Governance | Shared governance | L237; L239 | Phase 5 reviews the Product Blueprint. | Workflow and audit evidence confirm this statement: “Phase 5 reviews the Product Blueprint.” |
| REQ-002.43 | MUST | Pre-implementation deliverable | Governance | Shared governance | L237; L241 | Phase 5 improves the Product Blueprint. | Workflow and audit evidence confirm this statement: “Phase 5 improves the Product Blueprint.” |
| REQ-002.44 | MUST | Pre-implementation deliverable | Governance | Shared governance | L237; L243 | Phase 5 challenges every design decision. | Workflow and audit evidence confirm this statement: “Phase 5 challenges every design decision.” |
| REQ-002.45 | MUST | Pre-implementation deliverable | Governance | Shared governance | L237; L245 | Phase 5 produces Product Blueprint Version 2. | Workflow and audit evidence confirm this statement: “Phase 5 produces Product Blueprint Version 2.” |
| REQ-002.46 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L249–L251 | Phase 6 produces a Technical Blueprint. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Phase 6 produces a Technical Blueprint.” |
| REQ-002.47 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L255 | The Technical Blueprint includes System Architecture. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes System Architecture.” |
| REQ-002.48 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L257 | The Technical Blueprint includes Database Design. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes Database Design.” |
| REQ-002.49 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L259 | The Technical Blueprint includes API Design. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes API Design.” |
| REQ-002.50 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L261 | The Technical Blueprint includes Authentication. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes Authentication.” |
| REQ-002.51 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L263 | The Technical Blueprint includes Authorization. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes Authorization.” |
| REQ-002.52 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L265 | The Technical Blueprint includes the Wallet Engine. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes the Wallet Engine.” |
| REQ-002.53 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L267 | The Technical Blueprint includes the Rewards Engine. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes the Rewards Engine.” |
| REQ-002.54 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L269 | The Technical Blueprint includes the Survey Engine. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes the Survey Engine.” |
| REQ-002.55 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L271 | The Technical Blueprint includes the Notification Engine. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes the Notification Engine.” |
| REQ-002.56 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L273 | The Technical Blueprint includes the Payment Engine. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes the Payment Engine.” |
| REQ-002.57 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L275 | The Technical Blueprint includes the CMS. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes the CMS.” |
| REQ-002.58 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L277 | The Technical Blueprint includes the Admin ERP. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes the Admin ERP.” |
| REQ-002.59 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L279 | The Technical Blueprint includes Analytics. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes Analytics.” |
| REQ-002.60 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L281 | The Technical Blueprint includes Logging. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes Logging.” |
| REQ-002.61 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L283 | The Technical Blueprint includes Security. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes Security.” |
| REQ-002.62 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L253; L285 | The Technical Blueprint includes Deployment. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Technical Blueprint includes Deployment.” |
| REQ-002.63 | MUST | Pre-implementation deliverable | Governance | Shared governance | L289; L291 | Phase 7 reviews the Technical Blueprint. | Workflow and audit evidence confirm this statement: “Phase 7 reviews the Technical Blueprint.” |
| REQ-002.64 | MUST | Pre-implementation deliverable | Governance | Shared governance | L289; L293 | Phase 7 identifies technical bottlenecks. | Workflow and audit evidence confirm this statement: “Phase 7 identifies technical bottlenecks.” |
| REQ-002.65 | MUST | Pre-implementation deliverable | Governance | Shared governance | L289; L295 | Phase 7 improves scalability. | Workflow and audit evidence confirm this statement: “Phase 7 improves scalability.” |
| REQ-002.66 | MUST | Pre-implementation deliverable | Governance | Shared governance | L289; L297 | Phase 7 improves maintainability. | Workflow and audit evidence confirm this statement: “Phase 7 improves maintainability.” |
| REQ-002.67 | MUST | Pre-implementation deliverable | Governance | Shared governance | L289; L299 | Phase 7 improves security. | Workflow and audit evidence confirm this statement: “Phase 7 improves security.” |

### REQ-003 — Part 1 / Brand and Launch Markets

**Structural source span:** L305–L369  
**Atomic child count:** 21

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-003.01 | MUST | V1 | Business Rule | Shared | L305–L313 | The public brand name is EarnPearls. | An acceptance test confirms this statement: “The public brand name is EarnPearls.” |
| REQ-003.02 | MUST | V1 | Business Rule | Shared | L311–L313 | The public tagline is “Your Time. Your Rewards.” | An acceptance test confirms this statement: “The public tagline is “Your Time. Your Rewards.”.” |
| REQ-003.03 | SHOULD | V1 | Non-functional | Shared | L315–L333 | Brand execution preserves the listed modern, clean, premium, friendly, professional, transparent, trustworthy, simple, and fast personality. | A defined measurement or design review confirms this statement: “Brand execution preserves the listed modern, clean, premium, friendly, professional, transparent, trustworthy, simple, and fast personality.” |
| REQ-003.04 | MUST | V1 | Business Rule | Shared | L339; L341 | The United States is a primary launch market. | An acceptance test confirms this statement: “The United States is a primary launch market.” |
| REQ-003.05 | MUST | V1 | Business Rule | Shared | L339; L343 | The United Kingdom is a primary launch market. | An acceptance test confirms this statement: “The United Kingdom is a primary launch market.” |
| REQ-003.06 | MUST | V1 | Business Rule | Shared | L339; L345 | Canada is a primary launch market. | An acceptance test confirms this statement: “Canada is a primary launch market.” |
| REQ-003.07 | MUST | V1 | Business Rule | Shared | L339; L347 | Ireland is a primary launch market. | An acceptance test confirms this statement: “Ireland is a primary launch market.” |
| REQ-003.08 | MUST | V1 | Business Rule | Shared | L339; L349 | Australia is a primary launch market. | An acceptance test confirms this statement: “Australia is a primary launch market.” |
| REQ-003.09 | MUST | V1 | Business Rule | Shared | L339; L351 | Germany is a primary launch market. | An acceptance test confirms this statement: “Germany is a primary launch market.” |
| REQ-003.10 | MUST | V1 | Business Rule | Shared | L339; L353 | Belgium is a primary launch market. | An acceptance test confirms this statement: “Belgium is a primary launch market.” |
| REQ-003.11 | MUST | V1 | Business Rule | Shared | L339; L355 | Selected European countries are eligible as primary launch markets, subject to an owner-approved country list. | An acceptance test confirms this statement: “Selected European countries are eligible as primary launch markets, subject to an owner-approved country list.” |
| REQ-003.12 | MUST | V1 | Business Rule | Shared | L339; L357 | Saudi Arabia is a primary launch market. | An acceptance test confirms this statement: “Saudi Arabia is a primary launch market.” |
| REQ-003.13 | MUST | V1 | Business Rule | Shared | L339; L359 | The United Arab Emirates is a primary launch market. | An acceptance test confirms this statement: “The United Arab Emirates is a primary launch market.” |
| REQ-003.14 | MUST | V1 | Business Rule | Shared | L339; L361 | Qatar is a primary launch market. | An acceptance test confirms this statement: “Qatar is a primary launch market.” |
| REQ-003.15 | MUST | V1 | Business Rule | Shared | L339; L363 | Oman is a primary launch market. | An acceptance test confirms this statement: “Oman is a primary launch market.” |
| REQ-003.16 | MUST | V1 | Business Rule | Shared | L339; L365 | Bahrain is a primary launch market. | An acceptance test confirms this statement: “Bahrain is a primary launch market.” |
| REQ-003.17 | SHOULD | V1 | Business Rule | Shared | L367 | The initial public launch does not target Pakistan. | An acceptance test confirms this statement: “The initial public launch does not target Pakistan.” |
| REQ-003.18 | SHOULD | V1 | Business Rule | Shared | L367 | The initial public launch does not target India. | An acceptance test confirms this statement: “The initial public launch does not target India.” |
| REQ-003.19 | SHOULD | V1 | Business Rule | Shared | L367 | The initial public launch does not target Bangladesh. | An acceptance test confirms this statement: “The initial public launch does not target Bangladesh.” |
| REQ-003.20 | SHOULD | V1 | Business Rule | Shared | L367 | The initial public launch does not target China. | An acceptance test confirms this statement: “The initial public launch does not target China.” |
| REQ-003.21 | SHOULD | Future | Non-functional | Architecture | L369 | The platform architecture can support additional countries in future expansions. | A defined measurement or design review confirms this statement: “The platform architecture can support additional countries in future expansions.” |

### REQ-004 — Part 1 / Platform Language

**Structural source span:** L373–L397  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-004.01 | MUST | V1 | Business Rule | Shared | L373–L377 | Version 1 website language is English only. | An acceptance test confirms this statement: “Version 1 website language is English only.” |
| REQ-004.02 | MUST | V1 | Business Rule | Frontend handoff | L379 | Every user-interface element is English. | An acceptance test confirms this statement: “Every user-interface element is English.” |
| REQ-004.03 | MUST | V1 | Business Rule | Backend | L379; L381 | Every email is English. | An acceptance test confirms this statement: “Every email is English.” |
| REQ-004.04 | MUST | V1 | Business Rule | Backend | L379; L383 | Every notification is English. | An acceptance test confirms this statement: “Every notification is English.” |
| REQ-004.05 | MUST | V1 | Business Rule | Shared | L379; L385 | Every legal page is English. | An acceptance test confirms this statement: “Every legal page is English.” |
| REQ-004.06 | MUST | V1 | Business Rule | Frontend handoff | L379; L387 | Every menu is English. | An acceptance test confirms this statement: “Every menu is English.” |
| REQ-004.07 | MUST | V1 | Business Rule | Shared | L379; L389 | Every help article is English. | An acceptance test confirms this statement: “Every help article is English.” |
| REQ-004.08 | MUST | V1 | Business Rule | Frontend handoff | L379; L391 | Every dashboard is English. | An acceptance test confirms this statement: “Every dashboard is English.” |
| REQ-004.09 | MUST | V1 | Business Rule | Frontend handoff | L379; L393 | Every button is English. | An acceptance test confirms this statement: “Every button is English.” |
| REQ-004.10 | MUST | V1 | Business Rule | Shared | L379; L395 | Every error message is English. | An acceptance test confirms this statement: “Every error message is English.” |
| REQ-004.11 | SHOULD | Future | Non-functional | Architecture | L397 | The architecture permits future multilingual support but does not enable it in Version 1. | A defined measurement or design review confirms this statement: “The architecture permits future multilingual support but does not enable it in Version 1.” |

### REQ-005 — Part 1 / Currency System

**Structural source span:** L401–L427  
**Atomic child count:** 10

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-005.01 | MUST | V1 | Business Rule | Backend | L401–L405 | USD is the platform base currency. | An acceptance test confirms this statement: “USD is the platform base currency.” |
| REQ-005.02 | MUST | V1 | Business Rule | Backend | L407 | The internal reward system uses points. | An acceptance test confirms this statement: “The internal reward system uses points.” |
| REQ-005.03 | MUST | V1 | Business Rule | Backend | L409–L411 | The default conversion is 1,000 points to 1 USD. | An acceptance test confirms this statement: “The default conversion is 1,000 points to 1 USD.” |
| REQ-005.04 | MUST | V1 | Business Rule | Backend | L413 | The points-to-USD conversion value is configurable through the Super Admin Panel. | An acceptance test confirms this statement: “The points-to-USD conversion value is configurable through the Super Admin Panel.” |
| REQ-005.05 | MUST | V1 | Business Rule | Backend | L415 | The points-to-USD conversion is not hardcoded. | An acceptance test confirms this statement: “The points-to-USD conversion is not hardcoded.” |
| REQ-005.06 | SHOULD | V1 | Business Rule | Shared | L417; L419 | Users can see their points. | An acceptance test confirms this statement: “Users can see their points.” |
| REQ-005.07 | SHOULD | V1 | Business Rule | Shared | L417; L421 | Users can see the USD equivalent. | An acceptance test confirms this statement: “Users can see the USD equivalent.” |
| REQ-005.08 | SHOULD | V1 | Business Rule | Shared | L417; L423 | Users can see an estimated local-currency equivalent. | An acceptance test confirms this statement: “Users can see an estimated local-currency equivalent.” |
| REQ-005.09 | MUST | V1 | Business Rule | Backend | L425 | Local currency is display-only. | An acceptance test confirms this statement: “Local currency is display-only.” |
| REQ-005.10 | MUST | V1 | Business Rule | Backend | L427 | USD is the source of truth for calculations, accounting, wallet balances, provider earnings, and business reporting. | An acceptance test confirms this statement: “USD is the source of truth for calculations, accounting, wallet balances, provider earnings, and business reporting.” |

### REQ-006 — Part 1 / User Registration

**Structural source span:** L431–L453  
**Atomic child count:** 8

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-006.01 | MUST | V1 | Non-functional | Shared | L431–L433 | Registration is intentionally simple. | A defined measurement or design review confirms this statement: “Registration is intentionally simple.” |
| REQ-006.02 | MUST | V1 | Functional | Backend | L435; L437 | Registration requires an email address. | An acceptance test confirms this statement: “Registration requires an email address.” |
| REQ-006.03 | MUST | V1 | Functional | Backend | L435; L439 | Registration requires a password. | An acceptance test confirms this statement: “Registration requires a password.” |
| REQ-006.04 | MUST | V1 | Functional | Backend | L441–L443 | Registration sends an email-verification link. | An acceptance test confirms this statement: “Registration sends an email-verification link.” |
| REQ-006.05 | MUST | V1 | Functional | Backend | L445–L447 | Successful email verification automatically approves the account. | An acceptance test confirms this statement: “Successful email verification automatically approves the account.” |
| REQ-006.06 | MUST | V1 | Functional | Backend | L449 | Registration has no manual approval process. | An acceptance test confirms this statement: “Registration has no manual approval process.” |
| REQ-006.07 | MUST | V1 | Functional | Backend | L451 | Phone verification is not required during registration. | An acceptance test confirms this statement: “Phone verification is not required during registration.” |
| REQ-006.08 | SHOULD | V1 | Functional | Backend | L453 | Phone OTP may be enabled only for sensitive actions such as a first withdrawal when the business chooses to use it. | An acceptance test confirms this statement: “Phone OTP may be enabled only for sensitive actions such as a first withdrawal when the business chooses to use it.” |

### REQ-007 — Part 1 / User Account Status and Limit Templates

**Structural source span:** L457–L471  
**Atomic child count:** 15

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-007.01 | MUST | V1 | Functional | Backend/Admin ERP | L457–L459 | The platform supports administrative account states. | An acceptance test confirms this statement: “The platform supports administrative account states.” |
| REQ-007.02 | MUST | V1 | Functional | Backend/Admin ERP | L459–L465 | The account-state model supports a normal verified state. | An acceptance test confirms this statement: “The account-state model supports a normal verified state.” |
| REQ-007.03 | MUST | V1 | Functional | Backend/Admin ERP | L459–L465 | The account-state model supports a limited state. | An acceptance test confirms this statement: “The account-state model supports a limited state.” |
| REQ-007.04 | MUST | V1 | Functional | Backend/Admin ERP | L467 | A limited account can have selected capabilities enabled or disabled without account deletion. | An acceptance test confirms this statement: “A limited account can have selected capabilities enabled or disabled without account deletion.” |
| REQ-007.05 | MUST | V1 | Functional | Backend/Admin ERP | L469 | The Super Admin can create multiple reusable Limit Templates. | An acceptance test confirms this statement: “The Super Admin can create multiple reusable Limit Templates.” |
| REQ-007.06 | MUST | V1 | Functional | Backend/Admin ERP | L469 | Each Limit Template has configurable permissions. | An acceptance test confirms this statement: “Each Limit Template has configurable permissions.” |
| REQ-007.07 | MUST | V1 | Functional | Backend/Admin ERP | L469 | Limit Templates can control wallet visibility. | An acceptance test confirms this statement: “Limit Templates can control wallet visibility.” |
| REQ-007.08 | MUST | V1 | Functional | Backend/Admin ERP | L469 | Limit Templates can control referrals. | An acceptance test confirms this statement: “Limit Templates can control referrals.” |
| REQ-007.09 | MUST | V1 | Functional | Backend/Admin ERP | L469 | Limit Templates can control support features. | An acceptance test confirms this statement: “Limit Templates can control support features.” |
| REQ-007.10 | MUST | V1 | Non-functional | Backend/Admin ERP | L469 | Limit Templates can control other modules through an extensible permission model. | A defined measurement or design review confirms this statement: “Limit Templates can control other modules through an extensible permission model.” |
| REQ-007.11 | MUST | V1 | Functional | Frontend handoff | L469 | Modules disabled by a Limit Template do not appear in the interface. | An acceptance test confirms this statement: “Modules disabled by a Limit Template do not appear in the interface.” |
| REQ-007.12 | MUST | V1 | Security | Backend/Admin ERP | L469 | Direct URL access to a disabled module is denied with an appropriate authorization response. | Security review and negative-path tests confirm this statement: “Direct URL access to a disabled module is denied with an appropriate authorization response.” |
| REQ-007.13 | MUST | V1 | Data | Backend/Admin ERP | L471 | Every administrative action records a timestamp. | Schema, constraint, and data-level tests confirm this statement: “Every administrative action records a timestamp.” |
| REQ-007.14 | MUST | V1 | Data | Backend/Admin ERP | L471 | Every administrative action records the administrator identity. | Schema, constraint, and data-level tests confirm this statement: “Every administrative action records the administrator identity.” |
| REQ-007.15 | MUST | V1 | Data | Backend/Admin ERP | L471 | Every administrative action records a reason. | Schema, constraint, and data-level tests confirm this statement: “Every administrative action records a reason.” |

### REQ-008 — Part 2 / Product Philosophy and Design Principles

**Structural source span:** L481–L527  
**Atomic child count:** 18

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-008.01 | MUST | V1 | Non-functional | Shared | L481–L483 | The platform prioritizes trust, simplicity, transparency, performance, and scalability. | A defined measurement or design review confirms this statement: “The platform prioritizes trust, simplicity, transparency, performance, and scalability.” |
| REQ-008.02 | SHOULD | V1 | Non-functional | Shared | L485 | The product feels modern, fast, intuitive, and highly polished. | A defined measurement or design review confirms this statement: “The product feels modern, fast, intuitive, and highly polished.” |
| REQ-008.03 | SHOULD | V1 | Non-functional | Shared | L487–L491 | Design decisions are reconsidered when they do not improve user trust, usability, or long-term scalability. | A defined measurement or design review confirms this statement: “Design decisions are reconsidered when they do not improve user trust, usability, or long-term scalability.” |
| REQ-008.04 | SHOULD | V1 | Non-functional | Frontend handoff | L493 | Screens avoid clutter and have a clear purpose. | A defined measurement or design review confirms this statement: “Screens avoid clutter and have a clear purpose.” |
| REQ-008.05 | MUST | V1 | Non-functional | Frontend handoff | L499; L501 | The user interface is minimalistic. | A defined measurement or design review confirms this statement: “The user interface is minimalistic.” |
| REQ-008.06 | MUST | V1 | Non-functional | Shared | L499; L503 | Pages load quickly. | A defined measurement or design review confirms this statement: “Pages load quickly.” |
| REQ-008.07 | MUST | V1 | Non-functional | Frontend handoff | L499; L505 | The design is mobile-first and responsive. | A defined measurement or design review confirms this statement: “The design is mobile-first and responsive.” |
| REQ-008.08 | MUST | V1 | Non-functional | Frontend handoff | L499; L507 | The design is optimized for desktop. | A defined measurement or design review confirms this statement: “The design is optimized for desktop.” |
| REQ-008.09 | MUST | V1 | Non-functional | Frontend handoff | L499; L509 | The design is accessibility-friendly. | A defined measurement or design review confirms this statement: “The design is accessibility-friendly.” |
| REQ-008.10 | MUST | V1 | Non-functional | Frontend handoff | L499; L511 | The design uses clean typography. | A defined measurement or design review confirms this statement: “The design uses clean typography.” |
| REQ-008.11 | MUST | V1 | Non-functional | Frontend handoff | L499; L513 | The design uses modern spacing. | A defined measurement or design review confirms this statement: “The design uses modern spacing.” |
| REQ-008.12 | MUST | V1 | Non-functional | Frontend handoff | L499; L515 | The design uses a consistent color palette. | A defined measurement or design review confirms this statement: “The design uses a consistent color palette.” |
| REQ-008.13 | MUST | V1 | Non-functional | Frontend handoff | L499; L517 | The design uses smooth animations. | A defined measurement or design review confirms this statement: “The design uses smooth animations.” |
| REQ-008.14 | MUST | V1 | Non-functional | Frontend handoff | L499; L519 | The design provides high readability. | A defined measurement or design review confirms this statement: “The design provides high readability.” |
| REQ-008.15 | MUST | V1 | Non-functional | Frontend handoff | L499; L521 | Navigation is simple. | A defined measurement or design review confirms this statement: “Navigation is simple.” |
| REQ-008.16 | MUST | V1 | Non-functional | Frontend handoff | L499; L523 | The platform has a professional appearance. | A defined measurement or design review confirms this statement: “The platform has a professional appearance.” |
| REQ-008.17 | MUST | V1 | Non-functional | Architecture | L499; L525 | The platform provides enterprise-grade stability. | A defined measurement or design review confirms this statement: “The platform provides enterprise-grade stability.” |
| REQ-008.18 | SHOULD | V1 | Non-functional | Frontend handoff | L527 | The user experience avoids overwhelming users. | A defined measurement or design review confirms this statement: “The user experience avoids overwhelming users.” |

### REQ-009 — Part 2 / Homepage

**Structural source span:** L531–L563  
**Atomic child count:** 15

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-009.01 | MUST | V1 | Non-functional | Frontend handoff | L531–L533 | The homepage is designed to a world-class standard. | A defined measurement or design review confirms this statement: “The homepage is designed to a world-class standard.” |
| REQ-009.02 | SHOULD | V1 | Functional | Frontend handoff | L535; L537 | The homepage includes a hero section. | An acceptance test confirms this statement: “The homepage includes a hero section.” |
| REQ-009.03 | SHOULD | V1 | Functional | Frontend handoff | L535; L539 | The homepage includes a clear value proposition. | An acceptance test confirms this statement: “The homepage includes a clear value proposition.” |
| REQ-009.04 | SHOULD | V1 | Functional | Frontend handoff | L535; L541 | The homepage includes a primary call to action. | An acceptance test confirms this statement: “The homepage includes a primary call to action.” |
| REQ-009.05 | SHOULD | V1 | Functional | Frontend handoff | L535; L543 | The homepage includes a secondary call to action. | An acceptance test confirms this statement: “The homepage includes a secondary call to action.” |
| REQ-009.06 | SHOULD | V1 | Functional | Frontend handoff | L535; L545 | The homepage explains how EarnPearls works. | An acceptance test confirms this statement: “The homepage explains how EarnPearls works.” |
| REQ-009.07 | SHOULD | V1 | Functional | Frontend handoff | L535; L547 | The homepage explains why users should choose EarnPearls. | An acceptance test confirms this statement: “The homepage explains why users should choose EarnPearls.” |
| REQ-009.08 | SHOULD | V1 | Compliance | Shared | L535; L549 | The homepage can present survey providers without misleading claims. | An acceptance test confirms this statement: “The homepage can present survey providers without misleading claims.” |
| REQ-009.09 | SHOULD | V1 | Functional | Frontend handoff | L535; L551 | The homepage explains rewards. | An acceptance test confirms this statement: “The homepage explains rewards.” |
| REQ-009.10 | SHOULD | V1 | Functional | Frontend handoff | L535; L553 | The homepage includes a security and trust section. | An acceptance test confirms this statement: “The homepage includes a security and trust section.” |
| REQ-009.11 | SHOULD | V1 | Compliance | Shared | L535; L555 | The homepage uses testimonial placeholders until genuine testimonials are available. | An acceptance test confirms this statement: “The homepage uses testimonial placeholders until genuine testimonials are available.” |
| REQ-009.12 | SHOULD | V1 | Functional | Frontend handoff | L535; L557 | The homepage includes frequently asked questions. | An acceptance test confirms this statement: “The homepage includes frequently asked questions.” |
| REQ-009.13 | SHOULD | V1 | Functional | Frontend handoff | L535; L559 | The homepage includes latest blog posts. | An acceptance test confirms this statement: “The homepage includes latest blog posts.” |
| REQ-009.14 | SHOULD | V1 | Functional | Frontend handoff | L535; L561 | The homepage includes a footer. | An acceptance test confirms this statement: “The homepage includes a footer.” |
| REQ-009.15 | SHOULD | V1 | Non-functional | Frontend handoff | L563 | The homepage is optimized to maximize user trust. | A defined measurement or design review confirms this statement: “The homepage is optimized to maximize user trust.” |

### REQ-010 — Part 2 / User Dashboard

**Structural source span:** L567–L607  
**Atomic child count:** 18

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-010.01 | MUST | V1 | Functional | Shared | L571; L573 | The dashboard displays a welcome message. | An acceptance test confirms this statement: “The dashboard displays a welcome message.” |
| REQ-010.02 | MUST | V1 | Functional | Shared | L571; L575 | The dashboard displays current points. | An acceptance test confirms this statement: “The dashboard displays current points.” |
| REQ-010.03 | MUST | V1 | Functional | Shared | L571; L577 | The dashboard displays the USD balance. | An acceptance test confirms this statement: “The dashboard displays the USD balance.” |
| REQ-010.04 | MUST | V1 | Functional | Shared | L571; L579 | The dashboard displays an estimated local-currency balance. | An acceptance test confirms this statement: “The dashboard displays an estimated local-currency balance.” |
| REQ-010.05 | MUST | V1 | Functional | Shared | L571; L581 | The dashboard displays the pending balance. | An acceptance test confirms this statement: “The dashboard displays the pending balance.” |
| REQ-010.06 | MUST | V1 | Functional | Shared | L571; L583 | The dashboard displays the mature balance. | An acceptance test confirms this statement: “The dashboard displays the mature balance.” |
| REQ-010.07 | MUST | V1 | Functional | Shared | L571; L585 | The dashboard displays the available balance. | An acceptance test confirms this statement: “The dashboard displays the available balance.” |
| REQ-010.08 | MUST | V1 | Functional | Shared | L571; L587 | The dashboard displays total lifetime earnings. | An acceptance test confirms this statement: “The dashboard displays total lifetime earnings.” |
| REQ-010.09 | MUST | V1 | Functional | Shared | L571; L589 | The dashboard displays weekly earnings. | An acceptance test confirms this statement: “The dashboard displays weekly earnings.” |
| REQ-010.10 | MUST | V1 | Functional | Shared | L571; L591 | The dashboard displays monthly earnings. | An acceptance test confirms this statement: “The dashboard displays monthly earnings.” |
| REQ-010.11 | MUST | V1 | Functional | Shared | L571; L593 | The dashboard displays leaderboard rank. | An acceptance test confirms this statement: “The dashboard displays leaderboard rank.” |
| REQ-010.12 | MUST | V1 | Functional | Shared | L571; L595 | The dashboard displays available surveys. | An acceptance test confirms this statement: “The dashboard displays available surveys.” |
| REQ-010.13 | MUST | V1 | Functional | Shared | L571; L597 | The dashboard displays recent activity. | An acceptance test confirms this statement: “The dashboard displays recent activity.” |
| REQ-010.14 | MUST | V1 | Functional | Shared | L571; L599 | The dashboard displays notifications. | An acceptance test confirms this statement: “The dashboard displays notifications.” |
| REQ-010.15 | MUST | V1 | Functional | Shared | L571; L601 | The dashboard displays support messages. | An acceptance test confirms this statement: “The dashboard displays support messages.” |
| REQ-010.16 | MUST | V1 | Functional | Shared | L571; L603 | The dashboard displays profile completion. | An acceptance test confirms this statement: “The dashboard displays profile completion.” |
| REQ-010.17 | MUST | V1 | Functional | Shared | L571; L605 | The dashboard displays latest platform announcements. | An acceptance test confirms this statement: “The dashboard displays latest platform announcements.” |
| REQ-010.18 | SHOULD | V1 | Non-functional | Frontend handoff | L607 | The dashboard provides important information without feeling crowded. | A defined measurement or design review confirms this statement: “The dashboard provides important information without feeling crowded.” |

### REQ-011 — Part 2 / Wallet System

**Structural source span:** L611–L661  
**Atomic child count:** 23

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-011.01 | SHOULD | V1 | Non-functional | Frontend handoff | L611–L613 | The wallet has a professional fintech-style experience. | A defined measurement or design review confirms this statement: “The wallet has a professional fintech-style experience.” |
| REQ-011.02 | MUST | V1 | Functional | Shared | L615; L617 | The wallet includes current balance. | An acceptance test confirms this statement: “The wallet includes current balance.” |
| REQ-011.03 | MUST | V1 | Functional | Shared | L615; L619 | The wallet includes pending balance. | An acceptance test confirms this statement: “The wallet includes pending balance.” |
| REQ-011.04 | MUST | V1 | Functional | Shared | L615; L621 | The wallet includes validated balance. | An acceptance test confirms this statement: “The wallet includes validated balance.” |
| REQ-011.05 | MUST | V1 | Functional | Shared | L615; L623 | The wallet includes mature balance. | An acceptance test confirms this statement: “The wallet includes mature balance.” |
| REQ-011.06 | MUST | V1 | Functional | Shared | L615; L625 | The wallet includes withdrawable balance. | An acceptance test confirms this statement: “The wallet includes withdrawable balance.” |
| REQ-011.07 | MUST | V1 | Functional | Shared | L615; L627 | The wallet includes total earnings. | An acceptance test confirms this statement: “The wallet includes total earnings.” |
| REQ-011.08 | MUST | V1 | Functional | Shared | L615; L629 | The wallet includes total withdrawals. | An acceptance test confirms this statement: “The wallet includes total withdrawals.” |
| REQ-011.09 | MUST | V1 | Functional | Shared | L615; L631 | The wallet includes processing withdrawals. | An acceptance test confirms this statement: “The wallet includes processing withdrawals.” |
| REQ-011.10 | MUST | V1 | Functional | Shared | L615; L633 | The wallet includes rejected withdrawals. | An acceptance test confirms this statement: “The wallet includes rejected withdrawals.” |
| REQ-011.11 | MUST | V1 | Functional | Shared | L615; L635 | The wallet includes reward points. | An acceptance test confirms this statement: “The wallet includes reward points.” |
| REQ-011.12 | MUST | V1 | Functional | Shared | L615; L637 | The wallet includes USD value. | An acceptance test confirms this statement: “The wallet includes USD value.” |
| REQ-011.13 | MUST | V1 | Functional | Shared | L615; L639 | The wallet includes estimated local currency. | An acceptance test confirms this statement: “The wallet includes estimated local currency.” |
| REQ-011.14 | MUST | V1 | Functional | Shared | L615; L641 | The wallet includes wallet history. | An acceptance test confirms this statement: “The wallet includes wallet history.” |
| REQ-011.15 | MUST | V1 | Functional | Shared | L615; L643 | The wallet includes transaction history. | An acceptance test confirms this statement: “The wallet includes transaction history.” |
| REQ-011.16 | MUST | V1 | Functional | Shared | L615; L645 | The wallet includes provider history. | An acceptance test confirms this statement: “The wallet includes provider history.” |
| REQ-011.17 | MUST | V1 | Functional | Shared | L615; L647 | The wallet includes withdrawal history. | An acceptance test confirms this statement: “The wallet includes withdrawal history.” |
| REQ-011.18 | MUST | V1 | Functional | Shared | L615; L649 | The wallet includes reward history. | An acceptance test confirms this statement: “The wallet includes reward history.” |
| REQ-011.19 | SHOULD | V1 | Non-functional | Shared | L651 | The wallet is transparent about financial states and history. | A defined measurement or design review confirms this statement: “The wallet is transparent about financial states and history.” |
| REQ-011.20 | SHOULD | V1 | Functional | Shared | L653; L655 | A user can determine where wallet money came from. | An acceptance test confirms this statement: “A user can determine where wallet money came from.” |
| REQ-011.21 | SHOULD | V1 | Functional | Shared | L653; L657 | A user can determine why an amount is pending. | An acceptance test confirms this statement: “A user can determine why an amount is pending.” |
| REQ-011.22 | SHOULD | V1 | Functional | Shared | L653; L659 | A user can determine why an amount is unavailable. | An acceptance test confirms this statement: “A user can determine why an amount is unavailable.” |
| REQ-011.23 | SHOULD | V1 | Functional | Shared | L653; L661 | A user can determine when an amount is expected to become available. | An acceptance test confirms this statement: “A user can determine when an amount is expected to become available.” |

### REQ-012 — Part 2 / Balance Maturity System

**Structural source span:** L665–L713  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-012.01 | SHOULD | V1 | Business Rule | Backend | L665–L669 | Every earning has a recorded lifecycle. | An acceptance test confirms this statement: “Every earning has a recorded lifecycle.” |
| REQ-012.02 | MUST | V1 | Business Rule | Backend | L671–L693 | The earning lifecycle can represent Survey Completed, Pending, Validated, Mature, Withdrawable, and Paid in the stated order. | An acceptance test confirms this statement: “The earning lifecycle can represent Survey Completed, Pending, Validated, Mature, Withdrawable, and Paid in the stated order.” |
| REQ-012.03 | MUST | V1 | Business Rule | Backend | L695; L697 | Every earning transaction shows its status. | An acceptance test confirms this statement: “Every earning transaction shows its status.” |
| REQ-012.04 | MUST | V1 | Business Rule | Backend | L695; L699 | Every earning transaction shows its provider. | An acceptance test confirms this statement: “Every earning transaction shows its provider.” |
| REQ-012.05 | MUST | V1 | Business Rule | Backend | L695; L701 | Every earning transaction shows its earned date. | An acceptance test confirms this statement: “Every earning transaction shows its earned date.” |
| REQ-012.06 | MUST | V1 | Business Rule | Backend | L695; L703 | Every earning transaction shows its estimated maturity date. | An acceptance test confirms this statement: “Every earning transaction shows its estimated maturity date.” |
| REQ-012.07 | MUST | V1 | Business Rule | Backend | L695; L705 | Every earning transaction shows its amount. | An acceptance test confirms this statement: “Every earning transaction shows its amount.” |
| REQ-012.08 | MUST | V1 | Business Rule | Backend | L695; L707 | Every earning transaction shows its points. | An acceptance test confirms this statement: “Every earning transaction shows its points.” |
| REQ-012.09 | MUST | V1 | Business Rule | Backend | L695; L709 | Every earning transaction shows its USD value. | An acceptance test confirms this statement: “Every earning transaction shows its USD value.” |
| REQ-012.10 | MUST | V1 | Business Rule | Backend | L695; L711 | Every earning transaction shows notes. | An acceptance test confirms this statement: “Every earning transaction shows notes.” |
| REQ-012.11 | SHOULD | V1 | Non-functional | Shared | L713 | Balance explanations are sufficient for users to understand their balance without contacting support. | A defined measurement or design review confirms this statement: “Balance explanations are sufficient for users to understand their balance without contacting support.” |

### REQ-013 — Part 2 / Leaderboard System

**Structural source span:** L717–L747  
**Atomic child count:** 13

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-013.01 | MUST | V1 | Functional | Shared | L717–L719 | The platform implements a weekly leaderboard. | An acceptance test confirms this statement: “The platform implements a weekly leaderboard.” |
| REQ-013.02 | SHOULD | V1 | Non-functional | Frontend handoff | L721 | Leaderboard behavior encourages healthy competition. | A defined measurement or design review confirms this statement: “Leaderboard behavior encourages healthy competition.” |
| REQ-013.03 | MAY | V1 | Functional | Shared | L723; L725 | The leaderboard may rank top weekly earners. | An acceptance test confirms this statement: “The leaderboard may rank top weekly earners.” |
| REQ-013.04 | MAY | V1 | Functional | Shared | L723; L727 | The leaderboard may rank top monthly earners. | An acceptance test confirms this statement: “The leaderboard may rank top monthly earners.” |
| REQ-013.05 | MAY | V1 | Functional | Shared | L723; L729 | The leaderboard may rank users by surveys completed. | An acceptance test confirms this statement: “The leaderboard may rank users by surveys completed.” |
| REQ-013.06 | MAY | V1 | Functional | Shared | L723; L731 | The leaderboard may rank users by highest streak. | An acceptance test confirms this statement: “The leaderboard may rank users by highest streak.” |
| REQ-013.07 | MAY | Future | Functional | Shared | L723; L733 | A future leaderboard may rank referral counts. | An acceptance test confirms this statement: “A future leaderboard may rank referral counts.” |
| REQ-013.08 | MUST | V1 | Functional | Backend/Admin ERP | L735; L737 | The Super Admin can enable or disable leaderboards. | An acceptance test confirms this statement: “The Super Admin can enable or disable leaderboards.” |
| REQ-013.09 | MUST | V1 | Functional | Backend/Admin ERP | L735; L739 | The Super Admin can reset leaderboard periods. | An acceptance test confirms this statement: “The Super Admin can reset leaderboard periods.” |
| REQ-013.10 | MUST | V1 | Functional | Backend/Admin ERP | L735; L741 | The Super Admin can choose leaderboard ranking methods. | An acceptance test confirms this statement: “The Super Admin can choose leaderboard ranking methods.” |
| REQ-013.11 | MUST | V1 | Functional | Backend/Admin ERP | L735; L743 | The Super Admin can hide specific users from leaderboards when required. | An acceptance test confirms this statement: “The Super Admin can hide specific users from leaderboards when required.” |
| REQ-013.12 | MUST | V1 | Functional | Backend/Admin ERP | L735; L745 | The Super Admin can create seasonal competitions. | An acceptance test confirms this statement: “The Super Admin can create seasonal competitions.” |
| REQ-013.13 | SHOULD | Future | Non-functional | Architecture | L747 | The architecture supports future gamification. | A defined measurement or design review confirms this statement: “The architecture supports future gamification.” |

### REQ-014 — Part 2 / Survey Experience

**Structural source span:** L751–L781  
**Atomic child count:** 12

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-014.01 | MUST | V1 | Non-functional | Frontend handoff | L751–L753 | Survey discovery is extremely simple. | A defined measurement or design review confirms this statement: “Survey discovery is extremely simple.” |
| REQ-014.02 | SHOULD | V1 | Functional | Shared | L755; L757 | Survey discovery makes the reward immediately understandable. | An acceptance test confirms this statement: “Survey discovery makes the reward immediately understandable.” |
| REQ-014.03 | SHOULD | V1 | Functional | Shared | L755; L759 | Survey discovery makes estimated time immediately understandable. | An acceptance test confirms this statement: “Survey discovery makes estimated time immediately understandable.” |
| REQ-014.04 | SHOULD | V1 | Functional | Shared | L755; L761 | Survey discovery shows difficulty when available. | An acceptance test confirms this statement: “Survey discovery shows difficulty when available.” |
| REQ-014.05 | SHOULD | V1 | Functional | Shared | L755; L763 | Survey discovery makes availability immediately understandable. | An acceptance test confirms this statement: “Survey discovery makes availability immediately understandable.” |
| REQ-014.06 | SHOULD | V1 | Functional | Shared | L755; L765 | Survey discovery makes category immediately understandable. | An acceptance test confirms this statement: “Survey discovery makes category immediately understandable.” |
| REQ-014.07 | SHOULD | V1 | Functional | Shared | L755; L767 | Survey discovery makes country eligibility immediately understandable. | An acceptance test confirms this statement: “Survey discovery makes country eligibility immediately understandable.” |
| REQ-014.08 | SHOULD | V1 | Functional | Shared | L755; L769 | Survey discovery makes device compatibility immediately understandable. | An acceptance test confirms this statement: “Survey discovery makes device compatibility immediately understandable.” |
| REQ-014.09 | MUST | V1 | Compliance | Backend | L771–L773 | Survey launch follows the applicable provider integration requirements. | An acceptance test confirms this statement: “Survey launch follows the applicable provider integration requirements.” |
| REQ-014.10 | MUST | V1 | Compliance | Backend | L775 | The platform does not modify provider workflows in ways that violate provider agreements. | An acceptance test confirms this statement: “The platform does not modify provider workflows in ways that violate provider agreements.” |
| REQ-014.11 | MUST | V1 | Functional | Backend | L777–L779 | The platform automatically synchronizes survey status after completion when supported. | An acceptance test confirms this statement: “The platform automatically synchronizes survey status after completion when supported.” |
| REQ-014.12 | MUST | V1 | Functional | Shared | L781 | When immediate confirmation is unavailable, users are clearly informed that provider-dependent validation may take time. | An acceptance test confirms this statement: “When immediate confirmation is unavailable, users are clearly informed that provider-dependent validation may take time.” |

### REQ-015 — Part 2 / Reward Point System

**Structural source span:** L785–L807  
**Atomic child count:** 7

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-015.01 | SHOULD | V1 | Business Rule | Backend | L785–L789 | Every reward is stored internally as points. | An acceptance test confirms this statement: “Every reward is stored internally as points.” |
| REQ-015.02 | MUST | V1 | Business Rule | Backend | L791–L795 | The points conversion value is not hardcoded. | An acceptance test confirms this statement: “The points conversion value is not hardcoded.” |
| REQ-015.03 | MUST | V1 | Business Rule | Backend | L797 | The points conversion value is configurable. | An acceptance test confirms this statement: “The points conversion value is configurable.” |
| REQ-015.04 | SHOULD | V1 | Business Rule | Frontend handoff | L799; L801 | Reward-related pages display points. | An acceptance test confirms this statement: “Reward-related pages display points.” |
| REQ-015.05 | SHOULD | V1 | Business Rule | Frontend handoff | L799; L803 | Reward-related pages display USD. | An acceptance test confirms this statement: “Reward-related pages display USD.” |
| REQ-015.06 | SHOULD | V1 | Business Rule | Frontend handoff | L799; L805 | Reward-related pages display estimated local currency. | An acceptance test confirms this statement: “Reward-related pages display estimated local currency.” |
| REQ-015.07 | SHOULD | V1 | Non-functional | Frontend handoff | L807 | The points experience is designed to promote emotional engagement with earning. | A defined measurement or design review confirms this statement: “The points experience is designed to promote emotional engagement with earning.” |

### REQ-016 — Part 2 / Withdrawal System

**Structural source span:** L811–L839  
**Atomic child count:** 12

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-016.01 | SHOULD | V1 | Non-functional | Frontend handoff | L811–L813 | The withdrawal experience is professional and transparent. | A defined measurement or design review confirms this statement: “The withdrawal experience is professional and transparent.” |
| REQ-016.02 | SHOULD | V1 | Functional | Shared | L815; L817 | The withdrawal architecture is designed to support PayPal. | An acceptance test confirms this statement: “The withdrawal architecture is designed to support PayPal.” |
| REQ-016.03 | SHOULD | V1 | Functional | Shared | L815; L819 | The withdrawal architecture is designed to support Virtual Visa. | An acceptance test confirms this statement: “The withdrawal architecture is designed to support Virtual Visa.” |
| REQ-016.04 | SHOULD | V1 | Functional | Shared | L815; L821 | The withdrawal architecture is designed to support cryptocurrency. | An acceptance test confirms this statement: “The withdrawal architecture is designed to support cryptocurrency.” |
| REQ-016.05 | SHOULD | Future | Non-functional | Architecture | L823 | The withdrawal architecture permits additional payment methods to be added later with minimal redesign. | A defined measurement or design review confirms this statement: “The withdrawal architecture permits additional payment methods to be added later with minimal redesign.” |
| REQ-016.06 | SHOULD | V1 | Functional | Shared | L825; L827 | Each withdrawal shows its request date. | An acceptance test confirms this statement: “Each withdrawal shows its request date.” |
| REQ-016.07 | SHOULD | V1 | Functional | Shared | L825; L829 | Each withdrawal shows its processing status. | An acceptance test confirms this statement: “Each withdrawal shows its processing status.” |
| REQ-016.08 | SHOULD | V1 | Functional | Shared | L825; L831 | Each withdrawal shows estimated completion. | An acceptance test confirms this statement: “Each withdrawal shows estimated completion.” |
| REQ-016.09 | SHOULD | V1 | Functional | Shared | L825; L833 | Each withdrawal shows completed date. | An acceptance test confirms this statement: “Each withdrawal shows completed date.” |
| REQ-016.10 | SHOULD | V1 | Functional | Shared | L825; L835 | Each withdrawal shows transaction reference. | An acceptance test confirms this statement: “Each withdrawal shows transaction reference.” |
| REQ-016.11 | SHOULD | V1 | Functional | Shared | L825; L837 | Each withdrawal shows a support link. | An acceptance test confirms this statement: “Each withdrawal shows a support link.” |
| REQ-016.12 | SHOULD | V1 | Data | Backend | L839 | Every withdrawal receives a unique transaction ID. | Schema, constraint, and data-level tests confirm this statement: “Every withdrawal receives a unique transaction ID.” |

### REQ-017 — Part 2 / Notification Center

**Structural source span:** L843–L875  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-017.01 | MUST | V1 | Functional | Backend | L843–L845 | The platform provides a centralized notification system. | An acceptance test confirms this statement: “The platform provides a centralized notification system.” |
| REQ-017.02 | MUST | V1 | Functional | Backend | L847; L849 | The notification system supports survey updates. | An acceptance test confirms this statement: “The notification system supports survey updates.” |
| REQ-017.03 | MUST | V1 | Functional | Backend | L847; L851 | The notification system supports reward updates. | An acceptance test confirms this statement: “The notification system supports reward updates.” |
| REQ-017.04 | MUST | V1 | Functional | Backend | L847; L853 | The notification system supports withdrawal updates. | An acceptance test confirms this statement: “The notification system supports withdrawal updates.” |
| REQ-017.05 | MUST | V1 | Functional | Backend | L847; L855 | The notification system supports security alerts. | An acceptance test confirms this statement: “The notification system supports security alerts.” |
| REQ-017.06 | MUST | V1 | Functional | Backend | L847; L857 | The notification system supports announcements. | An acceptance test confirms this statement: “The notification system supports announcements.” |
| REQ-017.07 | MUST | V1 | Functional | Backend | L847; L859 | The notification system supports support replies. | An acceptance test confirms this statement: “The notification system supports support replies.” |
| REQ-017.08 | MUST | V1 | Functional | Backend | L847; L861 | The notification system supports promotions. | An acceptance test confirms this statement: “The notification system supports promotions.” |
| REQ-017.09 | MUST | V1 | Functional | Backend | L847; L863 | The notification system supports system messages. | An acceptance test confirms this statement: “The notification system supports system messages.” |
| REQ-017.10 | SHOULD | V1 | Data | Backend | L865; L867 | A notification can be unread. | Schema, constraint, and data-level tests confirm this statement: “A notification can be unread.” |
| REQ-017.11 | SHOULD | V1 | Data | Backend | L865; L869 | A notification can be read. | Schema, constraint, and data-level tests confirm this statement: “A notification can be read.” |
| REQ-017.12 | SHOULD | V1 | Data | Backend | L865; L871 | A notification can be archived. | Schema, constraint, and data-level tests confirm this statement: “A notification can be archived.” |
| REQ-017.13 | SHOULD | V1 | Data | Backend | L865; L873 | A notification can be deleted. | Schema, constraint, and data-level tests confirm this statement: “A notification can be deleted.” |
| REQ-017.14 | SHOULD | Future | Non-functional | Architecture | L875 | The notification architecture plans for future push notifications. | A defined measurement or design review confirms this statement: “The notification architecture plans for future push notifications.” |

### REQ-018 — Part 2 / Support Center

**Structural source span:** L879–L903  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-018.01 | MUST | V1 | Functional | Shared | L879–L881 | The platform provides a complete support system. | An acceptance test confirms this statement: “The platform provides a complete support system.” |
| REQ-018.02 | MUST | V1 | Functional | Shared | L883; L885 | The support system includes a knowledge base. | An acceptance test confirms this statement: “The support system includes a knowledge base.” |
| REQ-018.03 | MUST | V1 | Functional | Shared | L883; L887 | The support system includes frequently asked questions. | An acceptance test confirms this statement: “The support system includes frequently asked questions.” |
| REQ-018.04 | MUST | V1 | Functional | Shared | L883; L889 | The support system includes support tickets. | An acceptance test confirms this statement: “The support system includes support tickets.” |
| REQ-018.05 | MUST | V1 | Functional | Shared | L883; L891 | Support tickets have categories. | An acceptance test confirms this statement: “Support tickets have categories.” |
| REQ-018.06 | MUST | V1 | Functional | Shared | L883; L893 | Support tickets have priority. | An acceptance test confirms this statement: “Support tickets have priority.” |
| REQ-018.07 | MUST | V1 | Functional | Shared | L883; L895 | Support tickets have status. | An acceptance test confirms this statement: “Support tickets have status.” |
| REQ-018.08 | MUST | V1 | Functional | Shared | L883; L897 | Support tickets retain conversation history. | An acceptance test confirms this statement: “Support tickets retain conversation history.” |
| REQ-018.09 | MUST | V1 | Functional | Shared | L883; L899 | Support tickets support file attachments. | An acceptance test confirms this statement: “Support tickets support file attachments.” |
| REQ-018.10 | MUST | V1 | Functional | Backend/Admin ERP | L883; L901 | Support tickets support internal admin notes. | An acceptance test confirms this statement: “Support tickets support internal admin notes.” |
| REQ-018.11 | SHOULD | V1 | Functional | Shared | L903 | Users can track support-ticket progress. | An acceptance test confirms this statement: “Users can track support-ticket progress.” |

### REQ-019 — Part 2 / Blog and CMS

**Structural source span:** L907–L957  
**Atomic child count:** 12

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-019.01 | MUST | V1 | Functional | Shared | L907–L909 | A professional blog is included from Day One. | An acceptance test confirms this statement: “A professional blog is included from Day One.” |
| REQ-019.02 | MUST | V1 | Non-functional | Shared | L911–L921 | The blog supports SEO, organic traffic, trust building, education, and content marketing purposes. | A defined measurement or design review confirms this statement: “The blog supports SEO, organic traffic, trust building, education, and content marketing purposes.” |
| REQ-019.03 | MAY | V1 | Functional | Backend/Admin ERP | L923–L937 | The CMS can organize the example blog category families without treating the examples as a closed list. | An acceptance test confirms this statement: “The CMS can organize the example blog category families without treating the examples as a closed list.” |
| REQ-019.04 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L941 | The CMS supports draft content. | An acceptance test confirms this statement: “The CMS supports draft content.” |
| REQ-019.05 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L943 | The CMS supports scheduled publishing. | An acceptance test confirms this statement: “The CMS supports scheduled publishing.” |
| REQ-019.06 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L945 | The CMS supports SEO metadata. | An acceptance test confirms this statement: “The CMS supports SEO metadata.” |
| REQ-019.07 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L947 | The CMS supports featured images. | An acceptance test confirms this statement: “The CMS supports featured images.” |
| REQ-019.08 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L949 | The CMS supports categories. | An acceptance test confirms this statement: “The CMS supports categories.” |
| REQ-019.09 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L951 | The CMS supports tags. | An acceptance test confirms this statement: “The CMS supports tags.” |
| REQ-019.10 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L953 | The CMS supports authors. | An acceptance test confirms this statement: “The CMS supports authors.” |
| REQ-019.11 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L955 | The CMS supports search. | An acceptance test confirms this statement: “The CMS supports search.” |
| REQ-019.12 | SHOULD | V1 | Functional | Backend/Admin ERP | L939; L957 | The CMS supports related posts. | An acceptance test confirms this statement: “The CMS supports related posts.” |

### REQ-020 — Part 2 / SEO Requirements

**Structural source span:** L961–L991  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-020.01 | SHOULD | V1 | Functional | Shared | L961–L963 | Every public page is SEO optimized. | An acceptance test confirms this statement: “Every public page is SEO optimized.” |
| REQ-020.02 | SHOULD | V1 | Functional | Shared | L965; L967 | The platform supports meta titles. | An acceptance test confirms this statement: “The platform supports meta titles.” |
| REQ-020.03 | SHOULD | V1 | Functional | Shared | L965; L969 | The platform supports meta descriptions. | An acceptance test confirms this statement: “The platform supports meta descriptions.” |
| REQ-020.04 | SHOULD | V1 | Functional | Shared | L965; L971 | The platform supports canonical URLs. | An acceptance test confirms this statement: “The platform supports canonical URLs.” |
| REQ-020.05 | SHOULD | V1 | Functional | Shared | L965; L973 | The platform supports Open Graph metadata. | An acceptance test confirms this statement: “The platform supports Open Graph metadata.” |
| REQ-020.06 | SHOULD | V1 | Functional | Shared | L965; L975 | The platform supports Twitter Card metadata. | An acceptance test confirms this statement: “The platform supports Twitter Card metadata.” |
| REQ-020.07 | SHOULD | V1 | Functional | Shared | L965; L977 | The platform supports structured data. | An acceptance test confirms this statement: “The platform supports structured data.” |
| REQ-020.08 | SHOULD | V1 | Functional | Shared | L965; L979 | The platform supports an XML sitemap. | An acceptance test confirms this statement: “The platform supports an XML sitemap.” |
| REQ-020.09 | SHOULD | V1 | Functional | Shared | L965; L981 | The platform supports robots.txt. | An acceptance test confirms this statement: “The platform supports robots.txt.” |
| REQ-020.10 | SHOULD | V1 | Functional | Frontend handoff | L965; L983 | The platform supports breadcrumbs. | An acceptance test confirms this statement: “The platform supports breadcrumbs.” |
| REQ-020.11 | SHOULD | V1 | Functional | Shared | L965; L985 | The platform supports internal linking. | An acceptance test confirms this statement: “The platform supports internal linking.” |
| REQ-020.12 | SHOULD | V1 | Functional | Shared | L965; L987 | The platform supports Schema.org markup. | An acceptance test confirms this statement: “The platform supports Schema.org markup.” |
| REQ-020.13 | SHOULD | V1 | Non-functional | Shared | L965; L989 | The platform supports SEO performance optimization. | A defined measurement or design review confirms this statement: “The platform supports SEO performance optimization.” |
| REQ-020.14 | SHOULD | V1 | Non-functional | Shared | L991 | The platform is designed to maximize long-term organic traffic. | A defined measurement or design review confirms this statement: “The platform is designed to maximize long-term organic traffic.” |

### REQ-021 — Part 2 / Performance Targets

**Structural source span:** L995–L1013  
**Atomic child count:** 8

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-021.01 | SHOULD | V1 | Non-functional | Shared | L997; L999 | The platform targets a fast initial page load. | A defined measurement or design review confirms this statement: “The platform targets a fast initial page load.” |
| REQ-021.02 | SHOULD | V1 | Non-functional | Frontend handoff | L997; L1001 | The platform uses optimized images. | A defined measurement or design review confirms this statement: “The platform uses optimized images.” |
| REQ-021.03 | SHOULD | V1 | Non-functional | Frontend handoff | L997; L1003 | The platform uses lazy loading where relevant. | A defined measurement or design review confirms this statement: “The platform uses lazy loading where relevant.” |
| REQ-021.04 | SHOULD | V1 | Non-functional | Architecture | L997; L1005 | The platform uses efficient caching. | A defined measurement or design review confirms this statement: “The platform uses efficient caching.” |
| REQ-021.05 | SHOULD | V1 | Non-functional | Frontend handoff | L997; L1007 | The platform minimizes JavaScript. | A defined measurement or design review confirms this statement: “The platform minimizes JavaScript.” |
| REQ-021.06 | SHOULD | V1 | Non-functional | Shared | L997; L1009 | The platform targets excellent Core Web Vitals. | A defined measurement or design review confirms this statement: “The platform targets excellent Core Web Vitals.” |
| REQ-021.07 | SHOULD | V1 | Non-functional | Frontend handoff | L997; L1011 | The platform provides a responsive mobile experience. | A defined measurement or design review confirms this statement: “The platform provides a responsive mobile experience.” |
| REQ-021.08 | SHOULD | Pre-implementation deliverable | Documentation | Architecture | L1013 | The architecture documentation recommends measurable performance targets and supporting architecture choices. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The architecture documentation recommends measurable performance targets and supporting architecture choices.” |

### REQ-022 — Part 3 / Super Admin ERP and Admin Dashboard

**Structural source span:** L1059–L1129  
**Atomic child count:** 31

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-022.01 | MUST | V1 | Non-functional | Backend/Admin ERP | L1059–L1063 | The Super Admin Panel is a complete ERP control system rather than a simple admin panel. | A defined measurement or design review confirms this statement: “The Super Admin Panel is a complete ERP control system rather than a simple admin panel.” |
| REQ-022.02 | SHOULD | V1 | Functional | Backend/Admin ERP | L1065 | The Super Admin can manage almost every platform aspect without changing source code. | An acceptance test confirms this statement: “The Super Admin can manage almost every platform aspect without changing source code.” |
| REQ-022.03 | SHOULD | V1 | Functional | Backend/Admin ERP | L1067 | Business rules are configurable through the admin interface wherever practical. | An acceptance test confirms this statement: “Business rules are configurable through the admin interface wherever practical.” |
| REQ-022.04 | SHOULD | V1 | Functional | Backend/Admin ERP | L1071–L1073 | The admin dashboard provides a real-time overview of platform health. | An acceptance test confirms this statement: “The admin dashboard provides a real-time overview of platform health.” |
| REQ-022.05 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1077 | The admin dashboard includes total users. | An acceptance test confirms this statement: “The admin dashboard includes total users.” |
| REQ-022.06 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1079 | The admin dashboard includes active users. | An acceptance test confirms this statement: “The admin dashboard includes active users.” |
| REQ-022.07 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1081 | The admin dashboard includes new registrations. | An acceptance test confirms this statement: “The admin dashboard includes new registrations.” |
| REQ-022.08 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1083 | The admin dashboard includes verified users. | An acceptance test confirms this statement: “The admin dashboard includes verified users.” |
| REQ-022.09 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1085 | The admin dashboard includes limited users. | An acceptance test confirms this statement: “The admin dashboard includes limited users.” |
| REQ-022.10 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1087 | The admin dashboard includes online users. | An acceptance test confirms this statement: “The admin dashboard includes online users.” |
| REQ-022.11 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1089 | The admin dashboard includes daily revenue. | An acceptance test confirms this statement: “The admin dashboard includes daily revenue.” |
| REQ-022.12 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1091 | The admin dashboard includes monthly revenue. | An acceptance test confirms this statement: “The admin dashboard includes monthly revenue.” |
| REQ-022.13 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1093 | The admin dashboard includes total withdrawals. | An acceptance test confirms this statement: “The admin dashboard includes total withdrawals.” |
| REQ-022.14 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1095 | The admin dashboard includes pending withdrawals. | An acceptance test confirms this statement: “The admin dashboard includes pending withdrawals.” |
| REQ-022.15 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1097 | The admin dashboard includes completed withdrawals. | An acceptance test confirms this statement: “The admin dashboard includes completed withdrawals.” |
| REQ-022.16 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1099 | The admin dashboard includes failed withdrawals. | An acceptance test confirms this statement: “The admin dashboard includes failed withdrawals.” |
| REQ-022.17 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1101 | The admin dashboard includes survey statistics. | An acceptance test confirms this statement: “The admin dashboard includes survey statistics.” |
| REQ-022.18 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1103 | The admin dashboard includes provider performance. | An acceptance test confirms this statement: “The admin dashboard includes provider performance.” |
| REQ-022.19 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1105 | The admin dashboard includes conversion rates. | An acceptance test confirms this statement: “The admin dashboard includes conversion rates.” |
| REQ-022.20 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1107 | The admin dashboard includes weekly growth. | An acceptance test confirms this statement: “The admin dashboard includes weekly growth.” |
| REQ-022.21 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1109 | The admin dashboard includes monthly growth. | An acceptance test confirms this statement: “The admin dashboard includes monthly growth.” |
| REQ-022.22 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1111 | The admin dashboard includes support-ticket metrics. | An acceptance test confirms this statement: “The admin dashboard includes support-ticket metrics.” |
| REQ-022.23 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1113 | The admin dashboard includes fraud alerts. | An acceptance test confirms this statement: “The admin dashboard includes fraud alerts.” |
| REQ-022.24 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1115 | The admin dashboard includes system health. | An acceptance test confirms this statement: “The admin dashboard includes system health.” |
| REQ-022.25 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1117 | The admin dashboard includes background-job status. | An acceptance test confirms this statement: “The admin dashboard includes background-job status.” |
| REQ-022.26 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1119 | The admin dashboard includes recent activities. | An acceptance test confirms this statement: “The admin dashboard includes recent activities.” |
| REQ-022.27 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1121 | The admin dashboard includes error monitoring. | An acceptance test confirms this statement: “The admin dashboard includes error monitoring.” |
| REQ-022.28 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1123 | The admin dashboard includes storage usage. | An acceptance test confirms this statement: “The admin dashboard includes storage usage.” |
| REQ-022.29 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1125 | The admin dashboard includes API status. | An acceptance test confirms this statement: “The admin dashboard includes API status.” |
| REQ-022.30 | SHOULD | V1 | Functional | Backend/Admin ERP | L1075; L1127 | The admin dashboard includes email-queue status. | An acceptance test confirms this statement: “The admin dashboard includes email-queue status.” |
| REQ-022.31 | SHOULD | V1 | Functional | Backend/Admin ERP | L1129 | Admin dashboard widgets are customizable. | An acceptance test confirms this statement: “Admin dashboard widgets are customizable.” |

### REQ-023 — Part 3 / User Management

**Structural source span:** L1133–L1177  
**Atomic child count:** 21

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-023.01 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1137 | Administrators can search users. | An acceptance test confirms this statement: “Administrators can search users.” |
| REQ-023.02 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1139 | Administrators can filter users. | An acceptance test confirms this statement: “Administrators can filter users.” |
| REQ-023.03 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1141 | Administrators can sort users. | An acceptance test confirms this statement: “Administrators can sort users.” |
| REQ-023.04 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1143 | Administrators can export users. | An acceptance test confirms this statement: “Administrators can export users.” |
| REQ-023.05 | MUST | Future | Functional | Backend/Admin ERP | L1135; L1145 | Administrators can import users in a future release. | An acceptance test confirms this statement: “Administrators can import users in a future release.” |
| REQ-023.06 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1147 | Administrators can view a complete user profile. | An acceptance test confirms this statement: “Administrators can view a complete user profile.” |
| REQ-023.07 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1149 | Administrators can view user login history. | An acceptance test confirms this statement: “Administrators can view user login history.” |
| REQ-023.08 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1151 | Administrators can view user activity history. | An acceptance test confirms this statement: “Administrators can view user activity history.” |
| REQ-023.09 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1153 | Administrators can view user earnings. | An acceptance test confirms this statement: “Administrators can view user earnings.” |
| REQ-023.10 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1155 | Administrators can view user withdrawals. | An acceptance test confirms this statement: “Administrators can view user withdrawals.” |
| REQ-023.11 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1157 | Administrators can view survey history when available. | An acceptance test confirms this statement: “Administrators can view survey history when available.” |
| REQ-023.12 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1159 | Administrators can view support history. | An acceptance test confirms this statement: “Administrators can view support history.” |
| REQ-023.13 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1161 | Administrators can view notification history. | An acceptance test confirms this statement: “Administrators can view notification history.” |
| REQ-023.14 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1163 | Administrators can initiate a password reset. | An acceptance test confirms this statement: “Administrators can initiate a password reset.” |
| REQ-023.15 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1165 | Administrators can force logout. | An acceptance test confirms this statement: “Administrators can force logout.” |
| REQ-023.16 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1167 | Administrators can suspend sessions. | An acceptance test confirms this statement: “Administrators can suspend sessions.” |
| REQ-023.17 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1169 | Administrators can lock an account. | An acceptance test confirms this statement: “Administrators can lock an account.” |
| REQ-023.18 | MUST | V1 | Functional | Backend/Admin ERP | L1135; L1171 | Administrators can unlock an account. | An acceptance test confirms this statement: “Administrators can unlock an account.” |
| REQ-023.19 | MUST | V1 | Data | Backend/Admin ERP | L1135; L1173 | Administrators can soft-delete an account. | Schema, constraint, and data-level tests confirm this statement: “Administrators can soft-delete an account.” |
| REQ-023.20 | MUST | V1 | Data | Backend/Admin ERP | L1135; L1175 | Administrators can restore a soft-deleted account. | Schema, constraint, and data-level tests confirm this statement: “Administrators can restore a soft-deleted account.” |
| REQ-023.21 | MUST | Future | Functional | Backend/Admin ERP | L1135; L1177 | Administrators can merge duplicate accounts in a future release. | An acceptance test confirms this statement: “Administrators can merge duplicate accounts in a future release.” |

### REQ-024 — Part 3 / Account Moderation and State Extensibility

**Structural source span:** L1181–L1197  
**Atomic child count:** 3

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-024.01 | SHOULD | V1 | Functional | Backend/Admin ERP | L1181–L1183 | Every account supports administrative states. | An acceptance test confirms this statement: “Every account supports administrative states.” |
| REQ-024.02 | MAY | V1 | Data | Backend/Admin ERP | L1185–L1195 | The state model can represent active, limited, suspended, disabled, and archived states as candidate states without treating the example list as closed. | Schema, constraint, and data-level tests confirm this statement: “The state model can represent active, limited, suspended, disabled, and archived states as candidate states without treating the example list as closed.” |
| REQ-024.03 | SHOULD | Future | Non-functional | Architecture | L1197 | Additional account states can be added later without database redesign. | A defined measurement or design review confirms this statement: “Additional account states can be added later without database redesign.” |

### REQ-025 — Part 3 / Limit Template System

**Structural source span:** L1201–L1255  
**Atomic child count:** 17

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-025.01 | SHOULD | V1 | Functional | Backend/Admin ERP | L1201–L1203 | Administrators can reuse Limit Templates instead of reconfiguring restrictions for each account. | An acceptance test confirms this statement: “Administrators can reuse Limit Templates instead of reconfiguring restrictions for each account.” |
| REQ-025.02 | SHOULD | V1 | Functional | Backend/Admin ERP | L1227 | Limit Templates provide granular control over platform capabilities. | An acceptance test confirms this statement: “Limit Templates provide granular control over platform capabilities.” |
| REQ-025.03 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1231 | Limit Templates can control login. | An acceptance test confirms this statement: “Limit Templates can control login.” |
| REQ-025.04 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1233 | Limit Templates can control profile editing. | An acceptance test confirms this statement: “Limit Templates can control profile editing.” |
| REQ-025.05 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1235 | Limit Templates can control email changes. | An acceptance test confirms this statement: “Limit Templates can control email changes.” |
| REQ-025.06 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1237 | Limit Templates can control password changes. | An acceptance test confirms this statement: “Limit Templates can control password changes.” |
| REQ-025.07 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1239 | Limit Templates can control survey access. | An acceptance test confirms this statement: “Limit Templates can control survey access.” |
| REQ-025.08 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1241 | Limit Templates can control wallet access. | An acceptance test confirms this statement: “Limit Templates can control wallet access.” |
| REQ-025.09 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1243 | Limit Templates can control withdrawal access. | An acceptance test confirms this statement: “Limit Templates can control withdrawal access.” |
| REQ-025.10 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1245 | Limit Templates can control notifications. | An acceptance test confirms this statement: “Limit Templates can control notifications.” |
| REQ-025.11 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1247 | Limit Templates can control blog access. | An acceptance test confirms this statement: “Limit Templates can control blog access.” |
| REQ-025.12 | SHOULD | Future | Functional | Backend/Admin ERP | L1229; L1249 | Limit Templates can control the future referral module. | An acceptance test confirms this statement: “Limit Templates can control the future referral module.” |
| REQ-025.13 | SHOULD | Future | Functional | Backend/Admin ERP | L1229; L1251 | Limit Templates can control future promotional features. | An acceptance test confirms this statement: “Limit Templates can control future promotional features.” |
| REQ-025.14 | SHOULD | V1 | Functional | Backend/Admin ERP | L1229; L1253 | Limit Templates can control support-ticket creation. | An acceptance test confirms this statement: “Limit Templates can control support-ticket creation.” |
| REQ-025.15 | SHOULD | V1 | Functional | Backend/Admin ERP | L1255 | Limit Templates are editable. | An acceptance test confirms this statement: “Limit Templates are editable.” |
| REQ-025.16 | SHOULD | V1 | Functional | Backend/Admin ERP | L1255 | Limit Templates are cloneable. | An acceptance test confirms this statement: “Limit Templates are cloneable.” |
| REQ-025.17 | SHOULD | V1 | Functional | Backend/Admin ERP | L1255 | Limit Templates are assignable to users. | An acceptance test confirms this statement: “Limit Templates are assignable to users.” |

### REQ-026 — Part 3 / Administrator Role Management

**Structural source span:** L1259–L1281  
**Atomic child count:** 4

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-026.01 | SHOULD | V1 | Security | Backend/Admin ERP | L1259–L1261 | The system supports multiple administrator roles. | Security review and negative-path tests confirm this statement: “The system supports multiple administrator roles.” |
| REQ-026.02 | MAY | V1 | Functional | Backend/Admin ERP | L1263–L1279 | The administrator-role model can represent the example operational, finance, support, content, marketing, developer, and auditor role families without treating that list as closed. | An acceptance test confirms this statement: “The administrator-role model can represent the example operational, finance, support, content, marketing, developer, and auditor role families without treating that list as closed.” |
| REQ-026.03 | SHOULD | V1 | Security | Backend/Admin ERP | L1281 | Every administrator role uses role-based access control. | Security review and negative-path tests confirm this statement: “Every administrator role uses role-based access control.” |
| REQ-026.04 | SHOULD | V1 | Security | Backend/Admin ERP | L1281 | Administrator RBAC supports granular permissions. | Security review and negative-path tests confirm this statement: “Administrator RBAC supports granular permissions.” |

### REQ-027 — Part 3 / System Settings

**Structural source span:** L1285–L1315  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-027.01 | MUST | V1 | Business Rule | Backend/Admin ERP | L1285–L1287 | Business values are not hardcoded. | An acceptance test confirms this statement: “Business values are not hardcoded.” |
| REQ-027.02 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1291 | Points-to-USD conversion is configurable from the admin panel. | An acceptance test confirms this statement: “Points-to-USD conversion is configurable from the admin panel.” |
| REQ-027.03 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1293 | Minimum withdrawal amount is configurable from the admin panel. | An acceptance test confirms this statement: “Minimum withdrawal amount is configurable from the admin panel.” |
| REQ-027.04 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1295 | Available withdrawal methods are configurable from the admin panel. | An acceptance test confirms this statement: “Available withdrawal methods are configurable from the admin panel.” |
| REQ-027.05 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1297 | Leaderboard settings are configurable from the admin panel. | An acceptance test confirms this statement: “Leaderboard settings are configurable from the admin panel.” |
| REQ-027.06 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1299 | Registration controls are configurable from the admin panel. | An acceptance test confirms this statement: “Registration controls are configurable from the admin panel.” |
| REQ-027.07 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1301 | Email templates are configurable from the admin panel. | An acceptance test confirms this statement: “Email templates are configurable from the admin panel.” |
| REQ-027.08 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1303 | Platform announcements are configurable from the admin panel. | An acceptance test confirms this statement: “Platform announcements are configurable from the admin panel.” |
| REQ-027.09 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1305 | Maintenance mode is configurable from the admin panel. | An acceptance test confirms this statement: “Maintenance mode is configurable from the admin panel.” |
| REQ-027.10 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1307 | Feature flags are configurable from the admin panel. | An acceptance test confirms this statement: “Feature flags are configurable from the admin panel.” |
| REQ-027.11 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1309 | Currency-display preferences are configurable from the admin panel. | An acceptance test confirms this statement: “Currency-display preferences are configurable from the admin panel.” |
| REQ-027.12 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1289; L1311 | Country availability is configurable from the admin panel. | An acceptance test confirms this statement: “Country availability is configurable from the admin panel.” |
| REQ-027.13 | SHOULD | Future | Business Rule | Backend/Admin ERP | L1289; L1313 | Future referral settings are configurable from the admin panel. | An acceptance test confirms this statement: “Future referral settings are configurable from the admin panel.” |
| REQ-027.14 | SHOULD | Future | Business Rule | Backend/Admin ERP | L1289; L1315 | Future reward campaigns are configurable from the admin panel. | An acceptance test confirms this statement: “Future reward campaigns are configurable from the admin panel.” |

### REQ-028 — Part 3 / Content Management System

**Structural source span:** L1319–L1347  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-028.01 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1323 | The CMS manages homepage content. | An acceptance test confirms this statement: “The CMS manages homepage content.” |
| REQ-028.02 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1325 | The CMS manages the About page. | An acceptance test confirms this statement: “The CMS manages the About page.” |
| REQ-028.03 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1327 | The CMS manages the Contact page. | An acceptance test confirms this statement: “The CMS manages the Contact page.” |
| REQ-028.04 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1329 | The CMS manages FAQs. | An acceptance test confirms this statement: “The CMS manages FAQs.” |
| REQ-028.05 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1331 | The CMS manages the Privacy Policy. | An acceptance test confirms this statement: “The CMS manages the Privacy Policy.” |
| REQ-028.06 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1333 | The CMS manages the Terms of Service. | An acceptance test confirms this statement: “The CMS manages the Terms of Service.” |
| REQ-028.07 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1335 | The CMS manages the Cookie Policy. | An acceptance test confirms this statement: “The CMS manages the Cookie Policy.” |
| REQ-028.08 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1337 | The CMS manages the blog. | An acceptance test confirms this statement: “The CMS manages the blog.” |
| REQ-028.09 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1339 | The CMS manages guides. | An acceptance test confirms this statement: “The CMS manages guides.” |
| REQ-028.10 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1341 | The CMS manages announcements. | An acceptance test confirms this statement: “The CMS manages announcements.” |
| REQ-028.11 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1343 | The CMS manages banner messages. | An acceptance test confirms this statement: “The CMS manages banner messages.” |
| REQ-028.12 | SHOULD | V1 | Functional | Backend/Admin ERP | L1321; L1345 | The CMS manages footer links. | An acceptance test confirms this statement: “The CMS manages footer links.” |
| REQ-028.13 | SHOULD | V1 | Functional | Backend/Admin ERP | L1347 | The CMS supports content versioning where practical. | An acceptance test confirms this statement: “The CMS supports content versioning where practical.” |
| REQ-028.14 | SHOULD | V1 | Functional | Backend/Admin ERP | L1347 | The CMS supports draft publishing where practical. | An acceptance test confirms this statement: “The CMS supports draft publishing where practical.” |

### REQ-029 — Part 3 / Provider Integration Framework

**Structural source span:** L1351–L1363  
**Atomic child count:** 9

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-029.01 | MUST | V1 | API | Backend | L1351–L1353 | The platform uses a modular provider architecture. | Contract and integration tests confirm this statement: “The platform uses a modular provider architecture.” |
| REQ-029.02 | SHOULD | V1 | API | Backend | L1355 | Each provider behaves like a plugin. | Contract and integration tests confirm this statement: “Each provider behaves like a plugin.” |
| REQ-029.03 | SHOULD | V1 | Non-functional | Backend | L1357 | Adding or removing a provider requires minimal changes. | A defined measurement or design review confirms this statement: “Adding or removing a provider requires minimal changes.” |
| REQ-029.04 | SHOULD | V1 | API | Backend | L1359 | Provider-specific logic is abstracted behind a common interface where feasible. | Contract and integration tests confirm this statement: “Provider-specific logic is abstracted behind a common interface where feasible.” |
| REQ-029.05 | SHOULD | V1 | API | Backend | L1361 | Each provider can be configured independently. | Contract and integration tests confirm this statement: “Each provider can be configured independently.” |
| REQ-029.06 | SHOULD | V1 | Operational | Backend | L1361 | Each provider can be health-monitored independently. | Operational execution or recovery evidence confirms this statement: “Each provider can be health-monitored independently.” |
| REQ-029.07 | SHOULD | V1 | Operational | Backend | L1361 | Each provider has independent logging. | Operational execution or recovery evidence confirms this statement: “Each provider has independent logging.” |
| REQ-029.08 | SHOULD | V1 | Operational | Backend | L1361 | Each provider has independent error reporting. | Operational execution or recovery evidence confirms this statement: “Each provider has independent error reporting.” |
| REQ-029.09 | MUST | V1 | Compliance | Backend | L1363 | Provider integrations comply with each provider’s published requirements and agreements. | An acceptance test confirms this statement: “Provider integrations comply with each provider’s published requirements and agreements.” |

### REQ-030 — Part 3 / API Management

**Structural source span:** L1367–L1383  
**Atomic child count:** 7

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-030.01 | SHOULD | V1 | Operational | Backend/Admin ERP | L1369; L1371 | Administrators can view API status. | Operational execution or recovery evidence confirms this statement: “Administrators can view API status.” |
| REQ-030.02 | SHOULD | V1 | Operational | Backend/Admin ERP | L1369; L1373 | Administrators can enable or disable integrations. | Operational execution or recovery evidence confirms this statement: “Administrators can enable or disable integrations.” |
| REQ-030.03 | SHOULD | V1 | Operational | Backend/Admin ERP | L1369; L1375 | Administrators can view synchronization logs. | Operational execution or recovery evidence confirms this statement: “Administrators can view synchronization logs.” |
| REQ-030.04 | SHOULD | V1 | Operational | Backend/Admin ERP | L1369; L1377 | Administrators can monitor integration failures. | Operational execution or recovery evidence confirms this statement: “Administrators can monitor integration failures.” |
| REQ-030.05 | SHOULD | V1 | Operational | Backend/Admin ERP | L1369; L1379 | Administrators can retry synchronization jobs. | Operational execution or recovery evidence confirms this statement: “Administrators can retry synchronization jobs.” |
| REQ-030.06 | SHOULD | V1 | Operational | Backend/Admin ERP | L1369; L1381 | Administrators can view API response times. | Operational execution or recovery evidence confirms this statement: “Administrators can view API response times.” |
| REQ-030.07 | SHOULD | V1 | Operational | Backend/Admin ERP | L1369; L1383 | Administrators receive alerts for repeated integration failures. | Operational execution or recovery evidence confirms this statement: “Administrators receive alerts for repeated integration failures.” |

### REQ-031 — Part 3 / Transactional Email System

**Structural source span:** L1387–L1403  
**Atomic child count:** 7

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-031.01 | MUST | V1 | Functional | Backend | L1389; L1391 | Transactional email supports email verification. | An acceptance test confirms this statement: “Transactional email supports email verification.” |
| REQ-031.02 | MUST | V1 | Functional | Backend | L1389; L1393 | Transactional email supports password reset. | An acceptance test confirms this statement: “Transactional email supports password reset.” |
| REQ-031.03 | MUST | V1 | Functional | Backend | L1389; L1395 | Transactional email supports security notifications. | An acceptance test confirms this statement: “Transactional email supports security notifications.” |
| REQ-031.04 | MUST | V1 | Functional | Backend | L1389; L1397 | Transactional email supports withdrawal updates. | An acceptance test confirms this statement: “Transactional email supports withdrawal updates.” |
| REQ-031.05 | MUST | V1 | Functional | Backend | L1389; L1399 | Transactional email supports platform announcements. | An acceptance test confirms this statement: “Transactional email supports platform announcements.” |
| REQ-031.06 | MUST | V1 | Functional | Backend | L1389; L1401 | Transactional email supports support-ticket updates. | An acceptance test confirms this statement: “Transactional email supports support-ticket updates.” |
| REQ-031.07 | SHOULD | Pre-implementation deliverable | Documentation | Backend | L1403 | A pre-implementation evaluation recommends an email-delivery solution based on reliability, scalability, cost, and free-tier availability. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A pre-implementation evaluation recommends an email-delivery solution based on reliability, scalability, cost, and free-tier availability.” |

### REQ-032 — Part 3 / Audit Logging

**Structural source span:** L1407–L1443  
**Atomic child count:** 10

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-032.01 | SHOULD | V1 | Governance | Backend/Admin ERP | L1407–L1409 | Important administrative actions are logged. | Workflow and audit evidence confirm this statement: “Important administrative actions are logged.” |
| REQ-032.02 | SHOULD | V1 | Governance | Backend/Admin ERP | L1411–L1425 | The audit scope covers user modifications, permission changes, withdrawal approvals, settings changes, content updates, login attempts, and failed authentication events. | Workflow and audit evidence confirm this statement: “The audit scope covers user modifications, permission changes, withdrawal approvals, settings changes, content updates, login attempts, and failed authentication events.” |
| REQ-032.03 | SHOULD | V1 | Data | Backend/Admin ERP | L1427; L1429 | Audit logs record a timestamp. | Schema, constraint, and data-level tests confirm this statement: “Audit logs record a timestamp.” |
| REQ-032.04 | SHOULD | V1 | Data | Backend/Admin ERP | L1427; L1431 | Audit logs record the responsible administrator. | Schema, constraint, and data-level tests confirm this statement: “Audit logs record the responsible administrator.” |
| REQ-032.05 | SHOULD | V1 | Data | Backend/Admin ERP | L1427; L1433 | Audit logs record the action. | Schema, constraint, and data-level tests confirm this statement: “Audit logs record the action.” |
| REQ-032.06 | SHOULD | V1 | Data | Backend/Admin ERP | L1427; L1435 | Audit logs record the target. | Schema, constraint, and data-level tests confirm this statement: “Audit logs record the target.” |
| REQ-032.07 | SHOULD | V1 | Data | Backend/Admin ERP | L1427; L1437 | Audit logs record the reason where applicable. | Schema, constraint, and data-level tests confirm this statement: “Audit logs record the reason where applicable.” |
| REQ-032.08 | SHOULD | V1 | Data | Backend/Admin ERP | L1427; L1439 | Audit logs record IP information when appropriate. | Schema, constraint, and data-level tests confirm this statement: “Audit logs record IP information when appropriate.” |
| REQ-032.09 | SHOULD | V1 | Data | Backend/Admin ERP | L1427; L1441 | Audit logs record the outcome. | Schema, constraint, and data-level tests confirm this statement: “Audit logs record the outcome.” |
| REQ-032.10 | SHOULD | V1 | Functional | Backend/Admin ERP | L1443 | Audit records are searchable. | An acceptance test confirms this statement: “Audit records are searchable.” |

### REQ-033 — Part 3 / Security Architecture

**Structural source span:** L1447–L1485  
**Atomic child count:** 18

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-033.01 | MUST | Pre-implementation deliverable | Documentation | Security/Backend | L1447–L1451 | A comprehensive security architecture is proposed before implementation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A comprehensive security architecture is proposed before implementation.” |
| REQ-033.02 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1453 | The security architecture covers secure authentication. | Security review and negative-path tests confirm this statement: “The security architecture covers secure authentication.” |
| REQ-033.03 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1455 | The security architecture covers session management. | Security review and negative-path tests confirm this statement: “The security architecture covers session management.” |
| REQ-033.04 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1457 | The security architecture covers CSRF protection. | Security review and negative-path tests confirm this statement: “The security architecture covers CSRF protection.” |
| REQ-033.05 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1459 | The security architecture covers XSS protection. | Security review and negative-path tests confirm this statement: “The security architecture covers XSS protection.” |
| REQ-033.06 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1461 | The security architecture covers SQL-injection prevention. | Security review and negative-path tests confirm this statement: “The security architecture covers SQL-injection prevention.” |
| REQ-033.07 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1463 | The security architecture covers secure password hashing. | Security review and negative-path tests confirm this statement: “The security architecture covers secure password hashing.” |
| REQ-033.08 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1465 | The security architecture covers rate limiting. | Security review and negative-path tests confirm this statement: “The security architecture covers rate limiting.” |
| REQ-033.09 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1467 | The security architecture covers brute-force protection. | Security review and negative-path tests confirm this statement: “The security architecture covers brute-force protection.” |
| REQ-033.10 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1469 | The security architecture covers input validation. | Security review and negative-path tests confirm this statement: “The security architecture covers input validation.” |
| REQ-033.11 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1471 | The security architecture covers output encoding. | Security review and negative-path tests confirm this statement: “The security architecture covers output encoding.” |
| REQ-033.12 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1473 | The security architecture covers secure file handling. | Security review and negative-path tests confirm this statement: “The security architecture covers secure file handling.” |
| REQ-033.13 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1475 | The security architecture covers secure API design. | Security review and negative-path tests confirm this statement: “The security architecture covers secure API design.” |
| REQ-033.14 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1477 | The security architecture covers security headers. | Security review and negative-path tests confirm this statement: “The security architecture covers security headers.” |
| REQ-033.15 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1479 | The security architecture covers logging and monitoring. | Security review and negative-path tests confirm this statement: “The security architecture covers logging and monitoring.” |
| REQ-033.16 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1481 | The security architecture covers backup strategy. | Security review and negative-path tests confirm this statement: “The security architecture covers backup strategy.” |
| REQ-033.17 | MUST | Pre-implementation deliverable | Security | Security/Backend | L1451; L1483 | The security architecture covers disaster-recovery planning. | Security review and negative-path tests confirm this statement: “The security architecture covers disaster-recovery planning.” |
| REQ-033.18 | SHOULD | Pre-implementation deliverable | Documentation | Security/Backend | L1485 | Major security decisions are justified. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Major security decisions are justified.” |

### REQ-034 — Part 3 / Database Architecture Direction

**Structural source span:** L1489–L1511  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-034.01 | SHOULD | Pre-implementation deliverable | Data | Database | L1489–L1491 | The database design is normalized, scalable, and relational. | Schema, constraint, and data-level tests confirm this statement: “The database design is normalized, scalable, and relational.” |
| REQ-034.02 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1495 | The database specification defines clear naming conventions. | Schema, constraint, and data-level tests confirm this statement: “The database specification defines clear naming conventions.” |
| REQ-034.03 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1497 | The database design enforces referential integrity. | Schema, constraint, and data-level tests confirm this statement: “The database design enforces referential integrity.” |
| REQ-034.04 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1499 | The database design defines proper indexing. | Schema, constraint, and data-level tests confirm this statement: “The database design defines proper indexing.” |
| REQ-034.05 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1501 | The database design defines a migration strategy. | Schema, constraint, and data-level tests confirm this statement: “The database design defines a migration strategy.” |
| REQ-034.06 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1503 | The database design defines seed data. | Schema, constraint, and data-level tests confirm this statement: “The database design defines seed data.” |
| REQ-034.07 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1505 | Schema changes are version controlled. | Schema, constraint, and data-level tests confirm this statement: “Schema changes are version controlled.” |
| REQ-034.08 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1507 | The database design addresses performance optimization. | Schema, constraint, and data-level tests confirm this statement: “The database design addresses performance optimization.” |
| REQ-034.09 | SHOULD | Pre-implementation deliverable | Data | Database | L1493; L1509 | The database design addresses future scalability. | Schema, constraint, and data-level tests confirm this statement: “The database design addresses future scalability.” |
| REQ-034.10 | SHOULD | Pre-implementation deliverable | Documentation | Database | L1511 | Database documentation explains why each table exists. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Database documentation explains why each table exists.” |
| REQ-034.11 | SHOULD | Pre-implementation deliverable | Documentation | Database | L1511 | Database documentation explains how each table relates to the business. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Database documentation explains how each table relates to the business.” |

### REQ-035 — Part 3 / Backend and Frontend Architecture Evaluation

**Structural source span:** L1515–L1557  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-035.01 | MUST | Pre-implementation deliverable | Documentation | Architecture | L1515–L1517 | The backend technology is not assumed before evaluation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backend technology is not assumed before evaluation.” |
| REQ-035.02 | SHOULD | Pre-implementation deliverable | Documentation | Architecture | L1519–L1533 | Backend options are evaluated for free-tier friendliness, scalability, security, maintainability, performance, developer productivity, and long-term sustainability. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Backend options are evaluated for free-tier friendliness, scalability, security, maintainability, performance, developer productivity, and long-term sustainability.” |
| REQ-035.03 | SHOULD | Pre-implementation deliverable | Documentation | Architecture | L1535 | The backend recommendation compares appropriate framework, serverless, managed-database, and supporting-service options with clear reasoning. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backend recommendation compares appropriate framework, serverless, managed-database, and supporting-service options with clear reasoning.” |
| REQ-035.04 | SHOULD | Pre-implementation deliverable | Documentation | Architecture | L1537 | The backend recommendation prioritizes a smooth path from free to paid infrastructure. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backend recommendation prioritizes a smooth path from free to paid infrastructure.” |
| REQ-035.05 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L1543; L1545 | The frontend architecture is responsive. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The frontend architecture is responsive.” |
| REQ-035.06 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L1543; L1547 | The frontend architecture is modular. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The frontend architecture is modular.” |
| REQ-035.07 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L1543; L1549 | The frontend architecture is accessible. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The frontend architecture is accessible.” |
| REQ-035.08 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L1543; L1551 | The frontend architecture is component-based where appropriate. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The frontend architecture is component-based where appropriate.” |
| REQ-035.09 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L1543; L1553 | The frontend architecture is optimized for performance. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The frontend architecture is optimized for performance.” |
| REQ-035.10 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L1543; L1555 | The frontend architecture is easy to maintain. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The frontend architecture is easy to maintain.” |
| REQ-035.11 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L1557 | The frontend architecture recommendation balances simplicity with long-term maintainability. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The frontend architecture recommendation balances simplicity with long-term maintainability.” |

### REQ-036 — Part 3 / Project Documentation and Interactive Roadmap

**Structural source span:** L1561–L1613  
**Atomic child count:** 22

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-036.01 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1565 | Generate a Master README. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Master README.” |
| REQ-036.02 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1567 | Generate an Installation Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an Installation Guide.” |
| REQ-036.03 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1569 | Generate a Configuration Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Configuration Guide.” |
| REQ-036.04 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1571 | The project documentation set includes a Deployment Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The project documentation set includes a Deployment Guide.” |
| REQ-036.05 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1573 | The project documentation set includes API Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The project documentation set includes API Documentation.” |
| REQ-036.06 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1575 | Generate Database Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Database Documentation.” |
| REQ-036.07 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1577 | Generate an Admin Manual. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an Admin Manual.” |
| REQ-036.08 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1579 | Generate a User Manual. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a User Manual.” |
| REQ-036.09 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1581 | Generate a Troubleshooting Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Troubleshooting Guide.” |
| REQ-036.10 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1583 | Generate a Security Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Security Guide.” |
| REQ-036.11 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1585 | Generate a Backup and Recovery Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Backup and Recovery Guide.” |
| REQ-036.12 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1587 | Generate a Contribution Guide when applicable. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Contribution Guide when applicable.” |
| REQ-036.13 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1563; L1589 | Generate a Change Log. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Change Log.” |
| REQ-036.14 | SHOULD | V1 | Governance | Shared governance | L1591 | Project documentation remains synchronized with implementation. | Workflow and audit evidence confirm this statement: “Project documentation remains synchronized with implementation.” |
| REQ-036.15 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1595–L1597 | Create a structured milestone-based project roadmap. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Create a structured milestone-based project roadmap.” |
| REQ-036.16 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1599; L1601 | Every milestone defines objectives. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every milestone defines objectives.” |
| REQ-036.17 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1599; L1603 | Every milestone breaks work into tasks. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every milestone breaks work into tasks.” |
| REQ-036.18 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1599; L1605 | Every milestone identifies dependencies. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every milestone identifies dependencies.” |
| REQ-036.19 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1599; L1607 | Every milestone estimates complexity. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every milestone estimates complexity.” |
| REQ-036.20 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1599; L1609 | Every milestone defines acceptance criteria. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every milestone defines acceptance criteria.” |
| REQ-036.21 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L1599; L1611 | Every milestone tracks status using the stated lifecycle. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every milestone tracks status using the stated lifecycle.” |
| REQ-036.22 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L1613 | The roadmap is suitable for interactive use in project-management tools such as Notion. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The roadmap is suitable for interactive use in project-management tools such as Notion.” |

### REQ-037 — Part 3 / Quality Standard

**Structural source span:** L1617–L1623  
**Atomic child count:** 3

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-037.01 | SHOULD | Pre-implementation deliverable | Governance | Shared governance | L1617–L1619 | Every recommendation includes clear reasoning. | Workflow and audit evidence confirm this statement: “Every recommendation includes clear reasoning.” |
| REQ-037.02 | SHOULD | Pre-implementation deliverable | Governance | Shared governance | L1621 | When a safer, more scalable, more maintainable, or more cost-effective approach exists, the trade-offs and improved recommendation are documented. | Workflow and audit evidence confirm this statement: “When a safer, more scalable, more maintainable, or more cost-effective approach exists, the trade-offs and improved recommendation are documented.” |
| REQ-037.03 | SHOULD | Pre-implementation deliverable | Non-functional | Shared governance | L1623 | The final deliverable meets the standard of a production-ready SaaS preparation by experienced product, engineering, and operations teams. | A defined measurement or design review confirms this statement: “The final deliverable meets the standard of a production-ready SaaS preparation by experienced product, engineering, and operations teams.” |

### REQ-038 — Part 4 / Core Engineering Philosophy

**Structural source span:** L1645–L1697  
**Atomic child count:** 13

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-038.01 | MUST | V1 | Non-functional | Architecture | L1645–L1667 | Project decisions prioritize user trust, simplicity, transparency, security, performance, scalability, maintainability, accessibility, automation, and long-term sustainability. | A defined measurement or design review confirms this statement: “Project decisions prioritize user trust, simplicity, transparency, security, performance, scalability, maintainability, accessibility, automation, and long-term sustainability.” |
| REQ-038.02 | SHOULD | V1 | Governance | Architecture | L1669 | A feature that compromises the core principles without compelling justification is redesigned. | Workflow and audit evidence confirm this statement: “A feature that compromises the core principles without compelling justification is redesigned.” |
| REQ-038.03 | MUST | V1 | Non-functional | Architecture | L1675; L1677 | The platform is modular. | A defined measurement or design review confirms this statement: “The platform is modular.” |
| REQ-038.04 | MUST | V1 | Non-functional | Architecture | L1675; L1679 | The platform is loosely coupled. | A defined measurement or design review confirms this statement: “The platform is loosely coupled.” |
| REQ-038.05 | MUST | V1 | Non-functional | Architecture | L1675; L1681 | The platform is highly cohesive. | A defined measurement or design review confirms this statement: “The platform is highly cohesive.” |
| REQ-038.06 | MUST | V1 | Non-functional | Architecture | L1675; L1683 | The platform is API-friendly. | A defined measurement or design review confirms this statement: “The platform is API-friendly.” |
| REQ-038.07 | MUST | V1 | Non-functional | Architecture | L1675; L1685 | The platform is cloud-ready. | A defined measurement or design review confirms this statement: “The platform is cloud-ready.” |
| REQ-038.08 | MUST | V1 | Non-functional | Architecture | L1675; L1687 | The platform is mobile-ready. | A defined measurement or design review confirms this statement: “The platform is mobile-ready.” |
| REQ-038.09 | MUST | V1 | Non-functional | Architecture | L1675; L1689 | The platform is future-proof. | A defined measurement or design review confirms this statement: “The platform is future-proof.” |
| REQ-038.10 | MUST | V1 | Non-functional | Architecture | L1675; L1691 | The platform is easily testable. | A defined measurement or design review confirms this statement: “The platform is easily testable.” |
| REQ-038.11 | MUST | V1 | Non-functional | Architecture | L1675; L1693 | The platform is well documented. | A defined measurement or design review confirms this statement: “The platform is well documented.” |
| REQ-038.12 | MUST | V1 | Non-functional | Architecture | L1675; L1695 | The platform is version controlled. | A defined measurement or design review confirms this statement: “The platform is version controlled.” |
| REQ-038.13 | MUST | V1 | Non-functional | Architecture | L1697 | The architecture avoids unnecessary complexity. | A defined measurement or design review confirms this statement: “The architecture avoids unnecessary complexity.” |

### REQ-039 — Part 4 / Project Structure and Module Boundaries

**Structural source span:** L1701–L1741  
**Atomic child count:** 4

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-039.01 | SHOULD | Pre-implementation deliverable | Non-functional | Architecture | L1701–L1703 | The project is organized using clean architecture. | A defined measurement or design review confirms this statement: “The project is organized using clean architecture.” |
| REQ-039.02 | MAY | Pre-implementation deliverable | Documentation | Architecture | L1705–L1739 | The architecture evaluates the suggested authentication, user, wallet, rewards, surveys, withdrawals, notifications, CMS, blog, support, leaderboards, admin, analytics, settings, audit, jobs, and integration module boundaries. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The architecture evaluates the suggested authentication, user, wallet, rewards, surveys, withdrawals, notifications, CMS, blog, support, leaderboards, admin, analytics, settings, audit, jobs, and integration module boundaries.” |
| REQ-039.03 | SHOULD | Pre-implementation deliverable | Non-functional | Architecture | L1741 | Every selected module has clear boundaries. | A defined measurement or design review confirms this statement: “Every selected module has clear boundaries.” |
| REQ-039.04 | SHOULD | Pre-implementation deliverable | Non-functional | Architecture | L1741 | Coupling between modules is minimized. | A defined measurement or design review confirms this statement: “Coupling between modules is minimized.” |

### REQ-040 — Part 4 / Definition of Done and User Feedback

**Structural source span:** L1745–L1783  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-040.01 | SHOULD | V1 | Governance | Shared | L1747; L1749 | Every feature includes functional implementation. | Workflow and audit evidence confirm this statement: “Every feature includes functional implementation.” |
| REQ-040.02 | SHOULD | V1 | Governance | Shared | L1747; L1751 | Every feature includes validation. | Workflow and audit evidence confirm this statement: “Every feature includes validation.” |
| REQ-040.03 | SHOULD | V1 | Governance | Shared | L1747; L1753 | Every feature includes error handling. | Workflow and audit evidence confirm this statement: “Every feature includes error handling.” |
| REQ-040.04 | SHOULD | V1 | Governance | Shared | L1747; L1755 | Every feature includes logging. | Workflow and audit evidence confirm this statement: “Every feature includes logging.” |
| REQ-040.05 | SHOULD | V1 | Governance | Shared | L1747; L1757 | Every feature includes documentation. | Workflow and audit evidence confirm this statement: “Every feature includes documentation.” |
| REQ-040.06 | SHOULD | V1 | Governance | Shared | L1747; L1759 | Every feature includes unit tests where appropriate. | Workflow and audit evidence confirm this statement: “Every feature includes unit tests where appropriate.” |
| REQ-040.07 | SHOULD | V1 | Governance | Shared | L1747; L1761 | Every feature includes integration tests where appropriate. | Workflow and audit evidence confirm this statement: “Every feature includes integration tests where appropriate.” |
| REQ-040.08 | MUST | V1 | Governance | Shared | L1763 | A feature is not complete until its definition-of-done requirements are met. | Workflow and audit evidence confirm this statement: “A feature is not complete until its definition-of-done requirements are met.” |
| REQ-040.09 | SHOULD | V1 | Governance | Frontend handoff | L1767–L1769 | Every user action provides clear feedback. | Workflow and audit evidence confirm this statement: “Every user action provides clear feedback.” |
| REQ-040.10 | SHOULD | V1 | Governance | Frontend handoff | L1771–L1781 | Destructive user actions use confirmation dialogs. | Workflow and audit evidence confirm this statement: “Destructive user actions use confirmation dialogs.” |
| REQ-040.11 | SHOULD | V1 | Governance | Shared | L1783 | The product avoids ambiguous or silent failures. | Workflow and audit evidence confirm this statement: “The product avoids ambiguous or silent failures.” |

### REQ-041 — Part 4 / Performance and Accessibility

**Structural source span:** L1787–L1823  
**Atomic child count:** 13

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-041.01 | SHOULD | V1 | Non-functional | Shared | L1789; L1791 | The platform is optimized for fast initial load. | A defined measurement or design review confirms this statement: “The platform is optimized for fast initial load.” |
| REQ-041.02 | SHOULD | V1 | Non-functional | Shared | L1789; L1793 | The platform is optimized for responsive interactions. | A defined measurement or design review confirms this statement: “The platform is optimized for responsive interactions.” |
| REQ-041.03 | SHOULD | V1 | Non-functional | Frontend handoff | L1789; L1795 | The platform is optimized for efficient asset loading. | A defined measurement or design review confirms this statement: “The platform is optimized for efficient asset loading.” |
| REQ-041.04 | SHOULD | V1 | Non-functional | Database | L1789; L1797 | The platform is optimized for database-query efficiency. | A defined measurement or design review confirms this statement: “The platform is optimized for database-query efficiency.” |
| REQ-041.05 | SHOULD | V1 | Non-functional | Shared | L1789; L1799 | The platform minimizes unnecessary network requests. | A defined measurement or design review confirms this statement: “The platform minimizes unnecessary network requests.” |
| REQ-041.06 | SHOULD | V1 | Non-functional | Backend | L1789; L1801 | Long-running tasks use background processing where appropriate. | A defined measurement or design review confirms this statement: “Long-running tasks use background processing where appropriate.” |
| REQ-041.07 | SHOULD | V1 | Governance | Shared | L1803 | Performance is addressed from initial design rather than deferred. | Workflow and audit evidence confirm this statement: “Performance is addressed from initial design rather than deferred.” |
| REQ-041.08 | SHOULD | V1 | Non-functional | Frontend handoff | L1811; L1813 | The user interface supports keyboard navigation. | A defined measurement or design review confirms this statement: “The user interface supports keyboard navigation.” |
| REQ-041.09 | SHOULD | V1 | Non-functional | Frontend handoff | L1811; L1815 | User-interface controls have proper labels. | A defined measurement or design review confirms this statement: “User-interface controls have proper labels.” |
| REQ-041.10 | SHOULD | V1 | Non-functional | Frontend handoff | L1811; L1817 | The user interface has a logical focus order. | A defined measurement or design review confirms this statement: “The user interface has a logical focus order.” |
| REQ-041.11 | SHOULD | V1 | Non-functional | Frontend handoff | L1811; L1819 | The user interface has adequate color contrast. | A defined measurement or design review confirms this statement: “The user interface has adequate color contrast.” |
| REQ-041.12 | SHOULD | V1 | Non-functional | Frontend handoff | L1811; L1821 | The user interface supports screen readers where practical. | A defined measurement or design review confirms this statement: “The user interface supports screen readers where practical.” |
| REQ-041.13 | SHOULD | V1 | Non-functional | Frontend handoff | L1823 | Accessibility is part of the initial design. | A defined measurement or design review confirms this statement: “Accessibility is part of the initial design.” |

### REQ-042 — Part 4 / Configuration Philosophy

**Structural source span:** L1827–L1851  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-042.01 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1827–L1829 | Values are not hardcoded whenever practical. | An acceptance test confirms this statement: “Values are not hardcoded whenever practical.” |
| REQ-042.02 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1831 | Business rules likely to change are configurable through the Super Admin Panel. | An acceptance test confirms this statement: “Business rules likely to change are configurable through the Super Admin Panel.” |
| REQ-042.03 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1835 | Points conversion is configurable. | An acceptance test confirms this statement: “Points conversion is configurable.” |
| REQ-042.04 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1837 | Withdrawal thresholds are configurable. | An acceptance test confirms this statement: “Withdrawal thresholds are configurable.” |
| REQ-042.05 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1839 | Feature availability is configurable. | An acceptance test confirms this statement: “Feature availability is configurable.” |
| REQ-042.06 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1841 | Country availability is configurable. | An acceptance test confirms this statement: “Country availability is configurable.” |
| REQ-042.07 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1843 | Notification templates are configurable. | An acceptance test confirms this statement: “Notification templates are configurable.” |
| REQ-042.08 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1845 | Announcement banners are configurable. | An acceptance test confirms this statement: “Announcement banners are configurable.” |
| REQ-042.09 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1847 | Maintenance mode is configurable. | An acceptance test confirms this statement: “Maintenance mode is configurable.” |
| REQ-042.10 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1849 | Reward campaigns are configurable. | An acceptance test confirms this statement: “Reward campaigns are configurable.” |
| REQ-042.11 | SHOULD | V1 | Business Rule | Backend/Admin ERP | L1833; L1851 | Leaderboard settings are configurable. | An acceptance test confirms this statement: “Leaderboard settings are configurable.” |

### REQ-043 — Part 4 / Operational Analytics

**Structural source span:** L1855–L1883  
**Atomic child count:** 13

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-043.01 | SHOULD | V1 | Functional | Backend/Analytics | L1855–L1857 | The platform measures meaningful operational metrics. | An acceptance test confirms this statement: “The platform measures meaningful operational metrics.” |
| REQ-043.02 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1861 | Analytics measures daily active users. | An acceptance test confirms this statement: “Analytics measures daily active users.” |
| REQ-043.03 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1863 | Analytics measures weekly active users. | An acceptance test confirms this statement: “Analytics measures weekly active users.” |
| REQ-043.04 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1865 | Analytics measures monthly active users. | An acceptance test confirms this statement: “Analytics measures monthly active users.” |
| REQ-043.05 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1867 | Analytics measures registration conversion. | An acceptance test confirms this statement: “Analytics measures registration conversion.” |
| REQ-043.06 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1869 | Analytics measures email-verification rate. | An acceptance test confirms this statement: “Analytics measures email-verification rate.” |
| REQ-043.07 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1871 | Analytics measures survey-completion rate. | An acceptance test confirms this statement: “Analytics measures survey-completion rate.” |
| REQ-043.08 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1873 | Analytics measures withdrawal-request rate. | An acceptance test confirms this statement: “Analytics measures withdrawal-request rate.” |
| REQ-043.09 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1875 | Analytics measures support-response time. | An acceptance test confirms this statement: “Analytics measures support-response time.” |
| REQ-043.10 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1877 | Analytics measures user retention. | An acceptance test confirms this statement: “Analytics measures user retention.” |
| REQ-043.11 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1879 | Analytics measures blog traffic. | An acceptance test confirms this statement: “Analytics measures blog traffic.” |
| REQ-043.12 | SHOULD | V1 | Functional | Backend/Analytics | L1859; L1881 | Analytics measures feature usage. | An acceptance test confirms this statement: “Analytics measures feature usage.” |
| REQ-043.13 | SHOULD | V1 | Compliance | Backend/Analytics | L1883 | Analytics collection is tied to product-improvement purposes. | An acceptance test confirms this statement: “Analytics collection is tied to product-improvement purposes.” |

### REQ-044 — Part 4 / Error Handling and Background Processing

**Structural source span:** L1887–L1923  
**Atomic child count:** 9

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-044.01 | SHOULD | V1 | Operational | Backend | L1889; L1891 | Unexpected errors are logged. | Operational execution or recovery evidence confirms this statement: “Unexpected errors are logged.” |
| REQ-044.02 | SHOULD | V1 | Operational | Backend | L1889; L1893 | Unexpected errors are traceable. | Operational execution or recovery evidence confirms this statement: “Unexpected errors are traceable.” |
| REQ-044.03 | SHOULD | V1 | Operational | Backend | L1889; L1895 | Unexpected errors are actionable. | Operational execution or recovery evidence confirms this statement: “Unexpected errors are actionable.” |
| REQ-044.04 | SHOULD | V1 | Operational | Shared | L1889; L1897 | Unexpected errors are user-friendly. | Operational execution or recovery evidence confirms this statement: “Unexpected errors are user-friendly.” |
| REQ-044.05 | SHOULD | V1 | Security | Shared | L1899 | Users never see raw system errors. | Security review and negative-path tests confirm this statement: “Users never see raw system errors.” |
| REQ-044.06 | SHOULD | V1 | Operational | Backend | L1901 | Administrators receive sufficient diagnostic information to investigate issues. | Operational execution or recovery evidence confirms this statement: “Administrators receive sufficient diagnostic information to investigate issues.” |
| REQ-044.07 | SHOULD | V1 | Operational | Backend | L1905–L1907 | Long-running or scheduled tasks are separated from the main request flow where appropriate. | Operational execution or recovery evidence confirms this statement: “Long-running or scheduled tasks are separated from the main request flow where appropriate.” |
| REQ-044.08 | SHOULD | V1 | Operational | Backend | L1909–L1921 | The background-processing design covers email, notifications, scheduled synchronization, cleanup, reporting, and maintenance workloads. | Operational execution or recovery evidence confirms this statement: “The background-processing design covers email, notifications, scheduled synchronization, cleanup, reporting, and maintenance workloads.” |
| REQ-044.09 | SHOULD | Pre-implementation deliverable | Documentation | Backend | L1923 | The selected background-processing architecture is justified against the selected infrastructure. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The selected background-processing architecture is justified against the selected infrastructure.” |

### REQ-045 — Part 4 / Release, Backup, and Continuous Improvement

**Structural source span:** L1927–L1991  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-045.01 | SHOULD | V1 | Operational | DevOps/Operations | L1927–L1929 | The platform uses a phased release strategy. | Operational execution or recovery evidence confirms this statement: “The platform uses a phased release strategy.” |
| REQ-045.02 | MAY | Pre-implementation deliverable | Documentation | DevOps/Operations | L1931–L1941 | Release planning evaluates internal alpha, closed beta, open beta, public launch, and incremental releases. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Release planning evaluates internal alpha, closed beta, open beta, public launch, and incremental releases.” |
| REQ-045.03 | SHOULD | V1 | Operational | DevOps/Operations | L1943; L1945 | Every release includes release notes. | Operational execution or recovery evidence confirms this statement: “Every release includes release notes.” |
| REQ-045.04 | SHOULD | V1 | Operational | DevOps/Operations | L1943; L1947 | Every release includes a testing checklist. | Operational execution or recovery evidence confirms this statement: “Every release includes a testing checklist.” |
| REQ-045.05 | SHOULD | V1 | Operational | DevOps/Operations | L1943; L1949 | Every release includes a rollback plan. | Operational execution or recovery evidence confirms this statement: “Every release includes a rollback plan.” |
| REQ-045.06 | SHOULD | V1 | Operational | DevOps/Operations | L1943; L1951 | Every release includes a monitoring plan. | Operational execution or recovery evidence confirms this statement: “Every release includes a monitoring plan.” |
| REQ-045.07 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Operations | L1955–L1957 | The system has a documented backup and recovery strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The system has a documented backup and recovery strategy.” |
| REQ-045.08 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Operations | L1959–L1969 | The backup and recovery strategy evaluates database, configuration, and file-storage backups, recovery testing, and recovery objectives. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup and recovery strategy evaluates database, configuration, and file-storage backups, recovery testing, and recovery objectives.” |
| REQ-045.09 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Operations | L1971 | The backup and recovery approach is suitable for the selected infrastructure. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup and recovery approach is suitable for the selected infrastructure.” |
| REQ-045.10 | SHOULD | V1 | Governance | DevOps/Operations | L1975–L1989 | The product regularly reviews user feedback, support requests, analytics, performance metrics, and security findings. | Workflow and audit evidence confirm this statement: “The product regularly reviews user feedback, support requests, analytics, performance metrics, and security findings.” |
| REQ-045.11 | SHOULD | V1 | Governance | DevOps/Operations | L1991 | Review insights are used to prioritize future improvements. | Workflow and audit evidence confirm this statement: “Review insights are used to prioritize future improvements.” |

### REQ-046 — Part 4 / Final Engineering Directive

**Structural source span:** L1995–L2001  
**Atomic child count:** 2

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-046.01 | MUST | Pre-implementation deliverable | Governance | Shared governance | L1995–L1999 | Delivery is optimized for long-term quality, maintainability, and trust rather than coding speed. | Workflow and audit evidence confirm this statement: “Delivery is optimized for long-term quality, maintainability, and trust rather than coding speed.” |
| REQ-046.02 | MUST | Pre-implementation deliverable | Governance | Shared governance | L2001 | When a substantially better solution exists, reasoning and trade-offs are documented and the improvement is recommended before implementation. | Workflow and audit evidence confirm this statement: “When a substantially better solution exists, reasoning and trade-offs are documented and the improvement is recommended before implementation.” |

### REQ-047 — Part 5 / Database Philosophy and Objectives

**Structural source span:** L2037–L2075  
**Atomic child count:** 19

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-047.01 | MUST | Pre-implementation deliverable | Data | Database | L2037–L2042 | Every table has a clear business purpose. | Schema, constraint, and data-level tests confirm this statement: “Every table has a clear business purpose.” |
| REQ-047.02 | MUST | Pre-implementation deliverable | Data | Database | L2041 | Every relationship has a clear business purpose. | Schema, constraint, and data-level tests confirm this statement: “Every relationship has a clear business purpose.” |
| REQ-047.03 | MUST | Pre-implementation deliverable | Data | Database | L2041 | Every column has a clear business purpose. | Schema, constraint, and data-level tests confirm this statement: “Every column has a clear business purpose.” |
| REQ-047.04 | MUST | Pre-implementation deliverable | Data | Database | L2041 | Every index has a clear business purpose. | Schema, constraint, and data-level tests confirm this statement: “Every index has a clear business purpose.” |
| REQ-047.05 | MUST | Pre-implementation deliverable | Data | Database | L2041 | Every constraint has a clear business purpose. | Schema, constraint, and data-level tests confirm this statement: “Every constraint has a clear business purpose.” |
| REQ-047.06 | MUST | Pre-implementation deliverable | Data | Database | L2043 | The design avoids unnecessary tables. | Schema, constraint, and data-level tests confirm this statement: “The design avoids unnecessary tables.” |
| REQ-047.07 | MUST | Pre-implementation deliverable | Data | Database | L2045 | The design avoids duplicated data unless justified. | Schema, constraint, and data-level tests confirm this statement: “The design avoids duplicated data unless justified.” |
| REQ-047.08 | MUST | Pre-implementation deliverable | Data | Database | L2047 | The database is designed for long-term scalability, maintainability, integrity, and performance. | Schema, constraint, and data-level tests confirm this statement: “The database is designed for long-term scalability, maintainability, integrity, and performance.” |
| REQ-047.09 | SHOULD | Future | Data | Database | L2049 | The schema supports future product growth without major redesign. | Schema, constraint, and data-level tests confirm this statement: “The schema supports future product growth without major redesign.” |
| REQ-047.10 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2057 | The database provides high performance. | Schema, constraint, and data-level tests confirm this statement: “The database provides high performance.” |
| REQ-047.11 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2059 | The database provides strong consistency. | Schema, constraint, and data-level tests confirm this statement: “The database provides strong consistency.” |
| REQ-047.12 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2061 | The database provides excellent maintainability. | Schema, constraint, and data-level tests confirm this statement: “The database provides excellent maintainability.” |
| REQ-047.13 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2063 | The database provides data integrity. | Schema, constraint, and data-level tests confirm this statement: “The database provides data integrity.” |
| REQ-047.14 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2065 | The database supports easy migrations. | Schema, constraint, and data-level tests confirm this statement: “The database supports easy migrations.” |
| REQ-047.15 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2067 | The database supports easy backups. | Schema, constraint, and data-level tests confirm this statement: “The database supports easy backups.” |
| REQ-047.16 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2069 | The database provides clear relationships. | Schema, constraint, and data-level tests confirm this statement: “The database provides clear relationships.” |
| REQ-047.17 | MUST | Future | Data | Database | L2055; L2071 | The database provides future extensibility. | Schema, constraint, and data-level tests confirm this statement: “The database provides future extensibility.” |
| REQ-047.18 | MUST | Pre-implementation deliverable | Data | Database | L2055; L2073 | The database provides auditability. | Schema, constraint, and data-level tests confirm this statement: “The database provides auditability.” |
| REQ-047.19 | MUST | Pre-implementation deliverable | Security | Database | L2055; L2075 | The database provides security. | Security review and negative-path tests confirm this statement: “The database provides security.” |

### REQ-048 — Part 5 / Database Design Principles and Specification

**Structural source span:** L2079–L2119  
**Atomic child count:** 17

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-048.01 | MUST | Pre-implementation deliverable | Data | Database | L2079–L2083 | The schema is normalized appropriately, typically through Third Normal Form unless deviation is justified. | Schema, constraint, and data-level tests confirm this statement: “The schema is normalized appropriately, typically through Third Normal Form unless deviation is justified.” |
| REQ-048.02 | MUST | Pre-implementation deliverable | Data | Database | L2085 | Primary and foreign keys are used consistently. | Schema, constraint, and data-level tests confirm this statement: “Primary and foreign keys are used consistently.” |
| REQ-048.03 | MUST | Pre-implementation deliverable | Data | Database | L2087 | Referential integrity is enforced where appropriate. | Schema, constraint, and data-level tests confirm this statement: “Referential integrity is enforced where appropriate.” |
| REQ-048.04 | MUST | Pre-implementation deliverable | Data | Database | L2089 | Indexes are selected from expected query patterns. | Schema, constraint, and data-level tests confirm this statement: “Indexes are selected from expected query patterns.” |
| REQ-048.05 | MUST | Pre-implementation deliverable | Data | Database | L2091 | The database design avoids premature optimization. | Schema, constraint, and data-level tests confirm this statement: “The database design avoids premature optimization.” |
| REQ-048.06 | MUST | Pre-implementation deliverable | Data | Database | L2093 | Derived values are not stored unless measurable performance benefit and synchronization strategy are documented. | Schema, constraint, and data-level tests confirm this statement: “Derived values are not stored unless measurable performance benefit and synchronization strategy are documented.” |
| REQ-048.07 | MUST | Pre-implementation deliverable | Documentation | Database | L2097–L2099 | A complete database specification is generated before implementation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A complete database specification is generated before implementation.” |
| REQ-048.08 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2101 | The database specification includes entity descriptions. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes entity descriptions.” |
| REQ-048.09 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2103 | The database specification includes each entity’s business purpose. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes each entity’s business purpose.” |
| REQ-048.10 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2105 | The database specification includes relationships. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes relationships.” |
| REQ-048.11 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2107 | The database specification includes cardinality. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes cardinality.” |
| REQ-048.12 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2109 | The database specification includes data ownership. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes data ownership.” |
| REQ-048.13 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2111 | The database specification includes constraints. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes constraints.” |
| REQ-048.14 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2113 | The database specification includes index strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes index strategy.” |
| REQ-048.15 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2115 | The database specification includes retention considerations. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes retention considerations.” |
| REQ-048.16 | MUST | Pre-implementation deliverable | Documentation | Database | L2099; L2117 | The database specification includes migration considerations. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The database specification includes migration considerations.” |
| REQ-048.17 | MUST | Pre-implementation deliverable | Documentation | Database | L2119 | An Entity Relationship Diagram is generated before implementation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “An Entity Relationship Diagram is generated before implementation.” |

### REQ-049 — Part 5 / Identity, Authentication, and Profile Data Domains

**Structural source span:** L2123–L2163  
**Atomic child count:** 9

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-049.01 | SHOULD | Pre-implementation deliverable | Data | Database | L2123–L2125 | The data model is organized into logical business domains. | Schema, constraint, and data-level tests confirm this statement: “The data model is organized into logical business domains.” |
| REQ-049.02 | MAY | Pre-implementation deliverable | Data | Database | L2127–L2143 | The identity and authentication domain evaluates users, credentials, sessions, email verification, password reset, login history, and devices as distinct concerns. | Schema, constraint, and data-level tests confirm this statement: “The identity and authentication domain evaluates users, credentials, sessions, email verification, password reset, login history, and devices as distinct concerns.” |
| REQ-049.03 | SHOULD | Pre-implementation deliverable | Data | Database | L2149; L2151 | The user-profile model can store a public profile. | Schema, constraint, and data-level tests confirm this statement: “The user-profile model can store a public profile.” |
| REQ-049.04 | SHOULD | Pre-implementation deliverable | Data | Database | L2149; L2153 | The user-profile model can store country. | Schema, constraint, and data-level tests confirm this statement: “The user-profile model can store country.” |
| REQ-049.05 | SHOULD | Pre-implementation deliverable | Data | Database | L2149; L2155 | The user-profile model can store time zone. | Schema, constraint, and data-level tests confirm this statement: “The user-profile model can store time zone.” |
| REQ-049.06 | SHOULD | Pre-implementation deliverable | Data | Database | L2149; L2157 | The user-profile model can store currency-display preference. | Schema, constraint, and data-level tests confirm this statement: “The user-profile model can store currency-display preference.” |
| REQ-049.07 | SHOULD | Pre-implementation deliverable | Data | Database | L2149; L2159 | The user-profile model can store notification preferences. | Schema, constraint, and data-level tests confirm this statement: “The user-profile model can store notification preferences.” |
| REQ-049.08 | SHOULD | Pre-implementation deliverable | Data | Database | L2149; L2161 | The user-profile model can store account status. | Schema, constraint, and data-level tests confirm this statement: “The user-profile model can store account status.” |
| REQ-049.09 | MUST | Pre-implementation deliverable | Compliance | Database | L2163 | The platform collects only profile data necessary for platform operation. | An acceptance test confirms this statement: “The platform collects only profile data necessary for platform operation.” |

### REQ-050 — Part 5 / Wallet Data Domain

**Structural source span:** L2167–L2187  
**Atomic child count:** 9

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-050.01 | MUST | V1 | Data | Database/Backend | L2169; L2171 | The wallet data model supports reward points. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports reward points.” |
| REQ-050.02 | MUST | V1 | Data | Database/Backend | L2169; L2173 | The wallet data model supports USD balances. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports USD balances.” |
| REQ-050.03 | MUST | V1 | Data | Database/Backend | L2169; L2175 | The wallet data model supports pending balances. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports pending balances.” |
| REQ-050.04 | MUST | V1 | Data | Database/Backend | L2169; L2177 | The wallet data model supports validated balances. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports validated balances.” |
| REQ-050.05 | MUST | V1 | Data | Database/Backend | L2169; L2179 | The wallet data model supports mature balances. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports mature balances.” |
| REQ-050.06 | MUST | V1 | Data | Database/Backend | L2169; L2181 | The wallet data model supports withdrawable balances. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports withdrawable balances.” |
| REQ-050.07 | MUST | V1 | Data | Database/Backend | L2169; L2183 | The wallet data model supports transaction history. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports transaction history.” |
| REQ-050.08 | MUST | V1 | Data | Database/Backend | L2169; L2185 | The wallet data model supports adjustment history. | Schema, constraint, and data-level tests confirm this statement: “The wallet data model supports adjustment history.” |
| REQ-050.09 | SHOULD | V1 | Business Rule | Database/Backend | L2187 | Financial changes are traceable through transactions instead of direct balance edits. | An acceptance test confirms this statement: “Financial changes are traceable through transactions instead of direct balance edits.” |

### REQ-051 — Part 5 / Survey Data Domain

**Structural source span:** L2191–L2209  
**Atomic child count:** 8

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-051.01 | MUST | V1 | Data | Database/Backend | L2191–L2193 | The survey schema supports multiple providers through a common abstraction. | Schema, constraint, and data-level tests confirm this statement: “The survey schema supports multiple providers through a common abstraction.” |
| REQ-051.02 | MUST | V1 | Data | Database/Backend | L2195; L2197 | The survey data model tracks survey availability. | Schema, constraint, and data-level tests confirm this statement: “The survey data model tracks survey availability.” |
| REQ-051.03 | MUST | V1 | Data | Database/Backend | L2195; L2199 | The survey data model tracks user participation. | Schema, constraint, and data-level tests confirm this statement: “The survey data model tracks user participation.” |
| REQ-051.04 | MUST | V1 | Data | Database/Backend | L2195; L2201 | The survey data model tracks status. | Schema, constraint, and data-level tests confirm this statement: “The survey data model tracks status.” |
| REQ-051.05 | MUST | V1 | Data | Database/Backend | L2195; L2203 | The survey data model tracks reward. | Schema, constraint, and data-level tests confirm this statement: “The survey data model tracks reward.” |
| REQ-051.06 | MUST | V1 | Data | Database/Backend | L2195; L2205 | The survey data model tracks completion timestamps. | Schema, constraint, and data-level tests confirm this statement: “The survey data model tracks completion timestamps.” |
| REQ-051.07 | MUST | V1 | Data | Database/Backend | L2195; L2207 | The survey data model tracks validation status. | Schema, constraint, and data-level tests confirm this statement: “The survey data model tracks validation status.” |
| REQ-051.08 | SHOULD | V1 | Compliance | Database/Backend | L2209 | The survey-schema implementation respects provider requirements. | An acceptance test confirms this statement: “The survey-schema implementation respects provider requirements.” |

### REQ-052 — Part 5 / Withdrawal Data Domain

**Structural source span:** L2213–L2235  
**Atomic child count:** 10

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-052.01 | MUST | V1 | Data | Database/Backend | L2215; L2217 | The withdrawal data model tracks requests. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks requests.” |
| REQ-052.02 | MUST | V1 | Data | Database/Backend | L2215; L2219 | The withdrawal data model tracks status. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks status.” |
| REQ-052.03 | MUST | V1 | Data | Database/Backend | L2215; L2221 | The withdrawal data model tracks amount. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks amount.” |
| REQ-052.04 | MUST | V1 | Data | Database/Backend | L2215; L2223 | The withdrawal data model tracks points. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks points.” |
| REQ-052.05 | MUST | V1 | Data | Database/Backend | L2215; L2225 | The withdrawal data model tracks currency. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks currency.” |
| REQ-052.06 | MUST | V1 | Data | Database/Backend | L2215; L2227 | The withdrawal data model tracks payment method. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks payment method.” |
| REQ-052.07 | MUST | V1 | Data | Database/Backend | L2215; L2229 | The withdrawal data model tracks processing timestamps. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks processing timestamps.” |
| REQ-052.08 | MUST | V1 | Data | Database/Backend | L2215; L2231 | The withdrawal data model tracks references. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks references.” |
| REQ-052.09 | MUST | V1 | Data | Database/Backend | L2215; L2233 | The withdrawal data model tracks administrative actions. | Schema, constraint, and data-level tests confirm this statement: “The withdrawal data model tracks administrative actions.” |
| REQ-052.10 | SHOULD | V1 | Data | Database/Backend | L2235 | Withdrawal history is immutable wherever practical. | Schema, constraint, and data-level tests confirm this statement: “Withdrawal history is immutable wherever practical.” |

### REQ-053 — Part 5 / Notification and Support Data Domains

**Structural source span:** L2239–L2275  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-053.01 | MUST | V1 | Data | Database/Backend | L2241; L2243 | The notification model supports in-app notifications. | Schema, constraint, and data-level tests confirm this statement: “The notification model supports in-app notifications.” |
| REQ-053.02 | MUST | V1 | Data | Database/Backend | L2241; L2245 | The notification model supports email notifications. | Schema, constraint, and data-level tests confirm this statement: “The notification model supports email notifications.” |
| REQ-053.03 | MUST | V1 | Data | Database/Backend | L2241; L2247 | The notification model records delivery status. | Schema, constraint, and data-level tests confirm this statement: “The notification model records delivery status.” |
| REQ-053.04 | MUST | V1 | Data | Database/Backend | L2241; L2249 | The notification model records read status. | Schema, constraint, and data-level tests confirm this statement: “The notification model records read status.” |
| REQ-053.05 | MUST | V1 | Data | Database/Backend | L2241; L2251 | The notification model records categories. | Schema, constraint, and data-level tests confirm this statement: “The notification model records categories.” |
| REQ-053.06 | SHOULD | Future | Data | Database/Backend | L2253 | The notification data architecture permits future push notifications. | Schema, constraint, and data-level tests confirm this statement: “The notification data architecture permits future push notifications.” |
| REQ-053.07 | MUST | V1 | Data | Database/Backend | L2259; L2261 | The support model supports tickets. | Schema, constraint, and data-level tests confirm this statement: “The support model supports tickets.” |
| REQ-053.08 | MUST | V1 | Data | Database/Backend | L2259; L2263 | The support model supports conversations. | Schema, constraint, and data-level tests confirm this statement: “The support model supports conversations.” |
| REQ-053.09 | MUST | V1 | Data | Database/Backend | L2259; L2265 | The support model supports attachments. | Schema, constraint, and data-level tests confirm this statement: “The support model supports attachments.” |
| REQ-053.10 | MUST | V1 | Data | Database/Backend | L2259; L2267 | The support model supports categories. | Schema, constraint, and data-level tests confirm this statement: “The support model supports categories.” |
| REQ-053.11 | MUST | V1 | Data | Database/Backend | L2259; L2269 | The support model supports priorities. | Schema, constraint, and data-level tests confirm this statement: “The support model supports priorities.” |
| REQ-053.12 | MUST | V1 | Data | Database/Backend | L2259; L2271 | The support model supports status history. | Schema, constraint, and data-level tests confirm this statement: “The support model supports status history.” |
| REQ-053.13 | MUST | V1 | Data | Database/Backend | L2259; L2273 | The support model supports internal notes. | Schema, constraint, and data-level tests confirm this statement: “The support model supports internal notes.” |
| REQ-053.14 | MUST | V1 | Data | Database/Backend | L2275 | The support domain maintains a complete audit trail. | Schema, constraint, and data-level tests confirm this statement: “The support domain maintains a complete audit trail.” |

### REQ-054 — Part 5 / CMS, Leaderboard, Audit, and Analytics Data Domains

**Structural source span:** L2279–L2333  
**Atomic child count:** 16

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-054.01 | MUST | V1 | Data | Database/Backend | L2281; L2283 | The CMS data model supports static pages. | Schema, constraint, and data-level tests confirm this statement: “The CMS data model supports static pages.” |
| REQ-054.02 | MUST | V1 | Data | Database/Backend | L2281; L2285 | The CMS data model supports blog posts. | Schema, constraint, and data-level tests confirm this statement: “The CMS data model supports blog posts.” |
| REQ-054.03 | MUST | V1 | Data | Database/Backend | L2281; L2287 | The CMS data model supports categories. | Schema, constraint, and data-level tests confirm this statement: “The CMS data model supports categories.” |
| REQ-054.04 | MUST | V1 | Data | Database/Backend | L2281; L2289 | The CMS data model supports tags. | Schema, constraint, and data-level tests confirm this statement: “The CMS data model supports tags.” |
| REQ-054.05 | MUST | V1 | Data | Database/Backend | L2281; L2291 | The CMS data model supports authors. | Schema, constraint, and data-level tests confirm this statement: “The CMS data model supports authors.” |
| REQ-054.06 | MUST | V1 | Data | Database/Backend | L2281; L2293 | The CMS data model supports SEO metadata. | Schema, constraint, and data-level tests confirm this statement: “The CMS data model supports SEO metadata.” |
| REQ-054.07 | MUST | V1 | Data | Database/Backend | L2281; L2295 | The CMS data model supports publishing workflow. | Schema, constraint, and data-level tests confirm this statement: “The CMS data model supports publishing workflow.” |
| REQ-054.08 | MUST | V1 | Data | Database/Backend | L2301; L2303 | The leaderboard data model supports weekly rankings. | Schema, constraint, and data-level tests confirm this statement: “The leaderboard data model supports weekly rankings.” |
| REQ-054.09 | MUST | V1 | Data | Database/Backend | L2301; L2305 | The leaderboard data model supports monthly rankings. | Schema, constraint, and data-level tests confirm this statement: “The leaderboard data model supports monthly rankings.” |
| REQ-054.10 | MUST | V1 | Data | Database/Backend | L2301; L2307 | The leaderboard data model supports historical rankings. | Schema, constraint, and data-level tests confirm this statement: “The leaderboard data model supports historical rankings.” |
| REQ-054.11 | SHOULD | V1 | Business Rule | Database/Backend | L2309 | Leaderboard calculations are reproducible. | An acceptance test confirms this statement: “Leaderboard calculations are reproducible.” |
| REQ-054.12 | SHOULD | V1 | Business Rule | Database/Backend | L2309 | Leaderboard calculations are configurable. | An acceptance test confirms this statement: “Leaderboard calculations are configurable.” |
| REQ-054.13 | MUST | V1 | Data | Database/Backend | L2313–L2315 | The audit domain maintains immutable records of significant administrative and system actions. | Schema, constraint, and data-level tests confirm this statement: “The audit domain maintains immutable records of significant administrative and system actions.” |
| REQ-054.14 | MUST | V1 | Data | Database/Backend | L2317–L2325 | The audit domain covers settings changes, user moderation, permission changes, and administrative actions. | Schema, constraint, and data-level tests confirm this statement: “The audit domain covers settings changes, user moderation, permission changes, and administrative actions.” |
| REQ-054.15 | SHOULD | V1 | Data | Database/Backend | L2329–L2331 | The analytics domain stores aggregated metrics where appropriate. | Schema, constraint, and data-level tests confirm this statement: “The analytics domain stores aggregated metrics where appropriate.” |
| REQ-054.16 | MUST | V1 | Compliance | Database/Backend | L2333 | The analytics domain avoids excessive personally identifiable information. | An acceptance test confirms this statement: “The analytics domain avoids excessive personally identifiable information.” |

### REQ-055 — Part 5 / Retention, Migrations, and Seed Data

**Structural source span:** L2337–L2387  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-055.01 | SHOULD | Pre-implementation deliverable | Documentation | Database/Operations | L2337–L2339 | Data-retention policies are recommended by data category. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Data-retention policies are recommended by data category.” |
| REQ-055.02 | SHOULD | Pre-implementation deliverable | Documentation | Database/Operations | L2341–L2351 | Retention recommendations cover logs, audit records, notifications, sessions, and support tickets. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Retention recommendations cover logs, audit records, notifications, sessions, and support tickets.” |
| REQ-055.03 | SHOULD | Pre-implementation deliverable | Documentation | Database/Operations | L2353 | Retention recommendations balance operational needs, storage cost, and applicable legal obligations. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Retention recommendations balance operational needs, storage cost, and applicable legal obligations.” |
| REQ-055.04 | MUST | V1 | Data | Database/Operations | L2357–L2359 | Every schema change uses a version-controlled migration. | Schema, constraint, and data-level tests confirm this statement: “Every schema change uses a version-controlled migration.” |
| REQ-055.05 | SHOULD | Pre-implementation deliverable | Documentation | Database/Operations | L2361–L2363 | The migration strategy supports safe upgrades. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The migration strategy supports safe upgrades.” |
| REQ-055.06 | SHOULD | Pre-implementation deliverable | Documentation | Database/Operations | L2361; L2365 | The migration strategy supports rollback where practical. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The migration strategy supports rollback where practical.” |
| REQ-055.07 | SHOULD | Pre-implementation deliverable | Documentation | Database/Operations | L2361; L2367 | The migration strategy supports repeatable deployments. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The migration strategy supports repeatable deployments.” |
| REQ-055.08 | MUST | Pre-implementation deliverable | Data | Database/Operations | L2373; L2375 | Seed data includes administrator roles. | Schema, constraint, and data-level tests confirm this statement: “Seed data includes administrator roles.” |
| REQ-055.09 | MUST | Pre-implementation deliverable | Data | Database/Operations | L2373; L2377 | Seed data includes permissions. | Schema, constraint, and data-level tests confirm this statement: “Seed data includes permissions.” |
| REQ-055.10 | MUST | Pre-implementation deliverable | Data | Database/Operations | L2373; L2379 | Seed data includes default settings. | Schema, constraint, and data-level tests confirm this statement: “Seed data includes default settings.” |
| REQ-055.11 | MUST | Pre-implementation deliverable | Data | Database/Operations | L2373; L2381 | Seed data includes CMS placeholders. | Schema, constraint, and data-level tests confirm this statement: “Seed data includes CMS placeholders.” |
| REQ-055.12 | MUST | Pre-implementation deliverable | Data | Database/Operations | L2373; L2383 | Seed data includes leaderboard defaults. | Schema, constraint, and data-level tests confirm this statement: “Seed data includes leaderboard defaults.” |
| REQ-055.13 | MUST | Pre-implementation deliverable | Data | Database/Operations | L2373; L2385 | Seed data includes notification templates. | Schema, constraint, and data-level tests confirm this statement: “Seed data includes notification templates.” |
| REQ-055.14 | SHOULD | Pre-implementation deliverable | Non-functional | Database/Operations | L2387 | Seed data makes a fresh installation usable. | A defined measurement or design review confirms this statement: “Seed data makes a fresh installation usable.” |

### REQ-056 — Part 5 / Indexing, Scalability, and Data Security

**Structural source span:** L2391–L2447  
**Atomic child count:** 13

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-056.01 | SHOULD | Pre-implementation deliverable | Data | Database | L2391–L2393 | Index recommendations are based on expected access patterns. | Schema, constraint, and data-level tests confirm this statement: “Index recommendations are based on expected access patterns.” |
| REQ-056.02 | SHOULD | Pre-implementation deliverable | Data | Database | L2395–L2407 | The index review covers user lookups, wallet history, withdrawals, surveys, notifications, and audit logs. | Schema, constraint, and data-level tests confirm this statement: “The index review covers user lookups, wallet history, withdrawals, surveys, notifications, and audit logs.” |
| REQ-056.03 | SHOULD | Pre-implementation deliverable | Data | Database | L2409 | The design avoids unnecessary indexes that increase write overhead. | Schema, constraint, and data-level tests confirm this statement: “The design avoids unnecessary indexes that increase write overhead.” |
| REQ-056.04 | SHOULD | Pre-implementation deliverable | Data | Database | L2413–L2415 | The schema supports significant growth without major redesign. | Schema, constraint, and data-level tests confirm this statement: “The schema supports significant growth without major redesign.” |
| REQ-056.05 | SHOULD | Pre-implementation deliverable | Data | Database | L2417–L2425 | The scalability review considers future partitioning, historical archiving, read-heavy workloads, and reporting requirements. | Schema, constraint, and data-level tests confirm this statement: “The scalability review considers future partitioning, historical archiving, read-heavy workloads, and reporting requirements.” |
| REQ-056.06 | SHOULD | Pre-implementation deliverable | Data | Database | L2427 | Advanced database techniques are recommended only when justified. | Schema, constraint, and data-level tests confirm this statement: “Advanced database techniques are recommended only when justified.” |
| REQ-056.07 | SHOULD | V1 | Security | Database | L2431–L2433 | Sensitive information is protected appropriately. | Security review and negative-path tests confirm this statement: “Sensitive information is protected appropriately.” |
| REQ-056.08 | SHOULD | Pre-implementation deliverable | Security | Database | L2435; L2437 | The data-security recommendation covers encryption where appropriate. | Security review and negative-path tests confirm this statement: “The data-security recommendation covers encryption where appropriate.” |
| REQ-056.09 | SHOULD | Pre-implementation deliverable | Security | Database | L2435; L2439 | The data-security recommendation covers secure credential storage. | Security review and negative-path tests confirm this statement: “The data-security recommendation covers secure credential storage.” |
| REQ-056.10 | SHOULD | Pre-implementation deliverable | Compliance | Database | L2435; L2441 | The data-security recommendation covers minimal data collection. | An acceptance test confirms this statement: “The data-security recommendation covers minimal data collection.” |
| REQ-056.11 | SHOULD | Pre-implementation deliverable | Security | Database | L2435; L2443 | The data-security recommendation covers access controls. | Security review and negative-path tests confirm this statement: “The data-security recommendation covers access controls.” |
| REQ-056.12 | SHOULD | Pre-implementation deliverable | Security | Database | L2435; L2445 | The data-security recommendation covers secret management. | Security review and negative-path tests confirm this statement: “The data-security recommendation covers secret management.” |
| REQ-056.13 | SHOULD | Pre-implementation deliverable | Security | Database | L2435; L2447 | The data-security recommendation covers backup protection. | Security review and negative-path tests confirm this statement: “The data-security recommendation covers backup protection.” |

### REQ-057 — Part 5 / Reporting and Final Database Deliverables

**Structural source span:** L2451–L2495  
**Atomic child count:** 18

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-057.01 | SHOULD | Pre-implementation deliverable | Data | Database | L2453; L2455 | The schema supports user-growth reporting. | Schema, constraint, and data-level tests confirm this statement: “The schema supports user-growth reporting.” |
| REQ-057.02 | SHOULD | Pre-implementation deliverable | Data | Database | L2453; L2457 | The schema supports revenue reporting. | Schema, constraint, and data-level tests confirm this statement: “The schema supports revenue reporting.” |
| REQ-057.03 | SHOULD | Pre-implementation deliverable | Data | Database | L2453; L2459 | The schema supports withdrawal reporting. | Schema, constraint, and data-level tests confirm this statement: “The schema supports withdrawal reporting.” |
| REQ-057.04 | SHOULD | Pre-implementation deliverable | Data | Database | L2453; L2461 | The schema supports survey-activity reporting. | Schema, constraint, and data-level tests confirm this statement: “The schema supports survey-activity reporting.” |
| REQ-057.05 | SHOULD | Pre-implementation deliverable | Data | Database | L2453; L2463 | The schema supports support-performance reporting. | Schema, constraint, and data-level tests confirm this statement: “The schema supports support-performance reporting.” |
| REQ-057.06 | SHOULD | Pre-implementation deliverable | Data | Database | L2453; L2465 | The schema supports platform-health reporting. | Schema, constraint, and data-level tests confirm this statement: “The schema supports platform-health reporting.” |
| REQ-057.07 | SHOULD | V1 | Non-functional | Database | L2467 | Reporting does not negatively impact operational performance. | A defined measurement or design review confirms this statement: “Reporting does not negatively impact operational performance.” |
| REQ-057.08 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2475 | Generate a Database Design Document. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Database Design Document.” |
| REQ-057.09 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2477 | Generate an ER Diagram. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an ER Diagram.” |
| REQ-057.10 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2479 | Generate a Data Dictionary. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Data Dictionary.” |
| REQ-057.11 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2481 | Generate a Migration Plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Migration Plan.” |
| REQ-057.12 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2483 | Generate an Index Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an Index Strategy.” |
| REQ-057.13 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2485 | Generate Backup and Recovery Considerations. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Backup and Recovery Considerations.” |
| REQ-057.14 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2487 | Generate Retention Recommendations. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Retention Recommendations.” |
| REQ-057.15 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2489 | Generate a Database Performance Review. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Database Performance Review.” |
| REQ-057.16 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2491 | Generate a Database Scalability Review. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Database Scalability Review.” |
| REQ-057.17 | SHOULD | Pre-implementation deliverable | Documentation | Database | L2473; L2493 | Generate a Database Security Review. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Database Security Review.” |
| REQ-057.18 | SHOULD | Pre-implementation deliverable | Governance | Database | L2495 | Database implementation does not begin until all final database deliverables are complete. | Workflow and audit evidence confirm this statement: “Database implementation does not begin until all final database deliverables are complete.” |

### REQ-058 — Part 6 / API Philosophy, Objectives, and Standards

**Structural source span:** L2511–L2593  
**Atomic child count:** 30

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-058.01 | MUST | V1 | Security | Backend/API | L2515; L2517 | Every API is secure. | Security review and negative-path tests confirm this statement: “Every API is secure.” |
| REQ-058.02 | MUST | V1 | API | Backend/API | L2515; L2519 | Every API is consistent. | Contract and integration tests confirm this statement: “Every API is consistent.” |
| REQ-058.03 | MUST | V1 | API | Backend/API | L2515; L2521 | Every API is predictable. | Contract and integration tests confirm this statement: “Every API is predictable.” |
| REQ-058.04 | MUST | V1 | API | Backend/API | L2515; L2523 | Every API is versioned. | Contract and integration tests confirm this statement: “Every API is versioned.” |
| REQ-058.05 | MUST | Pre-implementation deliverable | API | Backend/API | L2515; L2525 | Every API is well documented. | Contract and integration tests confirm this statement: “Every API is well documented.” |
| REQ-058.06 | MUST | V1 | Non-functional | Backend/API | L2515; L2527 | Every API is easy to maintain. | A defined measurement or design review confirms this statement: “Every API is easy to maintain.” |
| REQ-058.07 | MUST | V1 | Non-functional | Backend/API | L2515; L2529 | Every API is easy to extend. | A defined measurement or design review confirms this statement: “Every API is easy to extend.” |
| REQ-058.08 | SHOULD | V1 | API | Backend/API | L2531 | Every endpoint solves a clear business problem. | Contract and integration tests confirm this statement: “Every endpoint solves a clear business problem.” |
| REQ-058.09 | SHOULD | V1 | API | Backend/API | L2533 | Unnecessary endpoints are avoided. | Contract and integration tests confirm this statement: “Unnecessary endpoints are avoided.” |
| REQ-058.10 | MUST | V1 | API | Backend/API | L2539; L2541 | The API architecture supports the web frontend. | Contract and integration tests confirm this statement: “The API architecture supports the web frontend.” |
| REQ-058.11 | MUST | Future | API | Backend/API | L2539; L2543 | The API architecture supports future mobile applications. | Contract and integration tests confirm this statement: “The API architecture supports future mobile applications.” |
| REQ-058.12 | MUST | V1 | API | Backend/API | L2539; L2545 | The API architecture supports the admin panel. | Contract and integration tests confirm this statement: “The API architecture supports the admin panel.” |
| REQ-058.13 | MUST | V1 | API | Backend/API | L2539; L2547 | The API architecture supports internal services. | Contract and integration tests confirm this statement: “The API architecture supports internal services.” |
| REQ-058.14 | MUST | V1 | API | Backend/API | L2539; L2549 | The API architecture supports third-party integrations. | Contract and integration tests confirm this statement: “The API architecture supports third-party integrations.” |
| REQ-058.15 | MUST | V1 | API | Backend/API | L2539; L2551 | The API architecture supports automation. | Contract and integration tests confirm this statement: “The API architecture supports automation.” |
| REQ-058.16 | MUST | V1 | API | Backend/API | L2539; L2553 | The API architecture supports analytics. | Contract and integration tests confirm this statement: “The API architecture supports analytics.” |
| REQ-058.17 | SHOULD | Future | Non-functional | Backend/API | L2555 | Future expansion does not break existing API clients where practical. | A defined measurement or design review confirms this statement: “Future expansion does not break existing API clients where practical.” |
| REQ-058.18 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2565 | API standards define consistent naming conventions. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define consistent naming conventions.” |
| REQ-058.19 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2567 | API standards define standard request validation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define standard request validation.” |
| REQ-058.20 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2569 | API standards define a standard response structure. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define a standard response structure.” |
| REQ-058.21 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2571 | API standards define meaningful error messages. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define meaningful error messages.” |
| REQ-058.22 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2573 | API standards define pagination for large datasets. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define pagination for large datasets.” |
| REQ-058.23 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2575 | API standards define filtering. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define filtering.” |
| REQ-058.24 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2577 | API standards define sorting. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define sorting.” |
| REQ-058.25 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2579 | API standards define search. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define search.” |
| REQ-058.26 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2581 | API standards define versioning. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define versioning.” |
| REQ-058.27 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2561; L2583 | API standards define rate limiting where appropriate. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API standards define rate limiting where appropriate.” |
| REQ-058.28 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2585 | The API standards are recommended and documented before implementation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The API standards are recommended and documented before implementation.” |
| REQ-058.29 | SHOULD | Pre-implementation deliverable | API | Backend/API | L2589–L2591 | An API versioning strategy is designed from the beginning. | Contract and integration tests confirm this statement: “An API versioning strategy is designed from the beginning.” |
| REQ-058.30 | SHOULD | Future | Non-functional | Backend/API | L2593 | Future API versions preserve backward compatibility whenever practical. | A defined measurement or design review confirms this statement: “Future API versions preserve backward compatibility whenever practical.” |

### REQ-059 — Part 6 / Authentication and User APIs

**Structural source span:** L2597–L2635  
**Atomic child count:** 16

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-059.01 | MUST | V1 | API | Backend/API | L2599; L2601 | Authentication APIs support registration. | Contract and integration tests confirm this statement: “Authentication APIs support registration.” |
| REQ-059.02 | MUST | V1 | API | Backend/API | L2599; L2603 | Authentication APIs support email verification. | Contract and integration tests confirm this statement: “Authentication APIs support email verification.” |
| REQ-059.03 | MUST | V1 | API | Backend/API | L2599; L2605 | Authentication APIs support login. | Contract and integration tests confirm this statement: “Authentication APIs support login.” |
| REQ-059.04 | MUST | V1 | API | Backend/API | L2599; L2607 | Authentication APIs support logout. | Contract and integration tests confirm this statement: “Authentication APIs support logout.” |
| REQ-059.05 | MUST | V1 | API | Backend/API | L2599; L2609 | Authentication APIs support password reset. | Contract and integration tests confirm this statement: “Authentication APIs support password reset.” |
| REQ-059.06 | MUST | V1 | API | Backend/API | L2599; L2611 | Authentication APIs support session refresh. | Contract and integration tests confirm this statement: “Authentication APIs support session refresh.” |
| REQ-059.07 | MUST | V1 | API | Backend/API | L2599; L2613 | Authentication APIs support account-status retrieval. | Contract and integration tests confirm this statement: “Authentication APIs support account-status retrieval.” |
| REQ-059.08 | MUST | V1 | API | Backend/API | L2599; L2615 | Authentication APIs support security checks. | Contract and integration tests confirm this statement: “Authentication APIs support security checks.” |
| REQ-059.09 | SHOULD | V1 | Security | Backend/API | L2617 | Authentication APIs are secure. | Security review and negative-path tests confirm this statement: “Authentication APIs are secure.” |
| REQ-059.10 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2617 | Authentication APIs are documented. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Authentication APIs are documented.” |
| REQ-059.11 | MUST | V1 | API | Backend/API | L2623; L2625 | User APIs support profile retrieval. | Contract and integration tests confirm this statement: “User APIs support profile retrieval.” |
| REQ-059.12 | MUST | V1 | API | Backend/API | L2623; L2627 | User APIs support profile updates. | Contract and integration tests confirm this statement: “User APIs support profile updates.” |
| REQ-059.13 | MUST | V1 | API | Backend/API | L2623; L2629 | User APIs support notification preferences. | Contract and integration tests confirm this statement: “User APIs support notification preferences.” |
| REQ-059.14 | MUST | V1 | API | Backend/API | L2623; L2631 | User APIs support security settings. | Contract and integration tests confirm this statement: “User APIs support security settings.” |
| REQ-059.15 | MUST | V1 | API | Backend/API | L2623; L2633 | User APIs support activity history. | Contract and integration tests confirm this statement: “User APIs support activity history.” |
| REQ-059.16 | SHOULD | V1 | Security | Backend/API | L2635 | A user can access only their own data unless explicitly authorized. | Security review and negative-path tests confirm this statement: “A user can access only their own data unless explicitly authorized.” |

### REQ-060 — Part 6 / Wallet and Survey APIs

**Structural source span:** L2639–L2677  
**Atomic child count:** 15

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-060.01 | MUST | V1 | API | Backend/API | L2641; L2643 | Wallet APIs support wallet summary. | Contract and integration tests confirm this statement: “Wallet APIs support wallet summary.” |
| REQ-060.02 | MUST | V1 | API | Backend/API | L2641; L2645 | Wallet APIs support transaction history. | Contract and integration tests confirm this statement: “Wallet APIs support transaction history.” |
| REQ-060.03 | MUST | V1 | API | Backend/API | L2641; L2647 | Wallet APIs support pending rewards. | Contract and integration tests confirm this statement: “Wallet APIs support pending rewards.” |
| REQ-060.04 | MUST | V1 | API | Backend/API | L2641; L2649 | Wallet APIs support mature rewards. | Contract and integration tests confirm this statement: “Wallet APIs support mature rewards.” |
| REQ-060.05 | MUST | V1 | API | Backend/API | L2641; L2651 | Wallet APIs support withdrawable balance. | Contract and integration tests confirm this statement: “Wallet APIs support withdrawable balance.” |
| REQ-060.06 | MUST | V1 | API | Backend/API | L2641; L2653 | Wallet APIs support reward history. | Contract and integration tests confirm this statement: “Wallet APIs support reward history.” |
| REQ-060.07 | SHOULD | V1 | API | Backend/API | L2655 | Wallet API responses clearly distinguish balance states. | Contract and integration tests confirm this statement: “Wallet API responses clearly distinguish balance states.” |
| REQ-060.08 | MUST | V1 | API | Backend/API | L2659–L2661 | Survey APIs provide a consistent interface for survey interactions. | Contract and integration tests confirm this statement: “Survey APIs provide a consistent interface for survey interactions.” |
| REQ-060.09 | MAY | V1 | API | Backend/API | L2663; L2665 | Survey APIs may support available-survey listing. | Contract and integration tests confirm this statement: “Survey APIs may support available-survey listing.” |
| REQ-060.10 | MAY | V1 | API | Backend/API | L2663; L2667 | Survey APIs may support survey details. | Contract and integration tests confirm this statement: “Survey APIs may support survey details.” |
| REQ-060.11 | MAY | V1 | API | Backend/API | L2663; L2669 | Survey APIs may support survey launch. | Contract and integration tests confirm this statement: “Survey APIs may support survey launch.” |
| REQ-060.12 | MAY | V1 | API | Backend/API | L2663; L2671 | Survey APIs may support completion status. | Contract and integration tests confirm this statement: “Survey APIs may support completion status.” |
| REQ-060.13 | MAY | V1 | API | Backend/API | L2663; L2673 | Survey APIs may support reward updates. | Contract and integration tests confirm this statement: “Survey APIs may support reward updates.” |
| REQ-060.14 | MAY | V1 | API | Backend/API | L2663; L2675 | Survey APIs may support survey history. | Contract and integration tests confirm this statement: “Survey APIs may support survey history.” |
| REQ-060.15 | SHOULD | V1 | API | Backend/API | L2677 | Provider-specific survey logic remains isolated behind integration layers where possible. | Contract and integration tests confirm this statement: “Provider-specific survey logic remains isolated behind integration layers where possible.” |

### REQ-061 — Part 6 / Withdrawal, Leaderboard, and Notification APIs

**Structural source span:** L2681–L2729  
**Atomic child count:** 18

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-061.01 | MUST | V1 | API | Backend/API | L2683; L2685 | Withdrawal APIs support available-method retrieval. | Contract and integration tests confirm this statement: “Withdrawal APIs support available-method retrieval.” |
| REQ-061.02 | MUST | V1 | API | Backend/API | L2683; L2687 | Withdrawal APIs support withdrawal requests. | Contract and integration tests confirm this statement: “Withdrawal APIs support withdrawal requests.” |
| REQ-061.03 | MUST | V1 | API | Backend/API | L2683; L2689 | Withdrawal APIs support withdrawal-status retrieval. | Contract and integration tests confirm this statement: “Withdrawal APIs support withdrawal-status retrieval.” |
| REQ-061.04 | MUST | V1 | API | Backend/API | L2683; L2691 | Withdrawal APIs support withdrawal history. | Contract and integration tests confirm this statement: “Withdrawal APIs support withdrawal history.” |
| REQ-061.05 | MUST | V1 | API | Backend/API | L2683; L2693 | Withdrawal APIs support validation. | Contract and integration tests confirm this statement: “Withdrawal APIs support validation.” |
| REQ-061.06 | SHOULD | V1 | Business Rule | Backend/API | L2695 | Withdrawal requests are validated before processing. | An acceptance test confirms this statement: “Withdrawal requests are validated before processing.” |
| REQ-061.07 | MUST | V1 | API | Backend/API | L2701; L2703 | Leaderboard APIs support weekly rankings. | Contract and integration tests confirm this statement: “Leaderboard APIs support weekly rankings.” |
| REQ-061.08 | MUST | V1 | API | Backend/API | L2701; L2705 | Leaderboard APIs support monthly rankings. | Contract and integration tests confirm this statement: “Leaderboard APIs support monthly rankings.” |
| REQ-061.09 | MUST | V1 | API | Backend/API | L2701; L2707 | Leaderboard APIs support user position. | Contract and integration tests confirm this statement: “Leaderboard APIs support user position.” |
| REQ-061.10 | MUST | V1 | API | Backend/API | L2701; L2709 | Leaderboard APIs support historical rankings. | Contract and integration tests confirm this statement: “Leaderboard APIs support historical rankings.” |
| REQ-061.11 | SHOULD | V1 | Business Rule | Backend/API | L2711 | Leaderboard calculations are transparent. | An acceptance test confirms this statement: “Leaderboard calculations are transparent.” |
| REQ-061.12 | SHOULD | V1 | Business Rule | Backend/API | L2711 | Leaderboard API behavior uses configurable calculation rules. | An acceptance test confirms this statement: “Leaderboard API behavior uses configurable calculation rules.” |
| REQ-061.13 | MUST | V1 | API | Backend/API | L2717; L2719 | Notification APIs support notification listing. | Contract and integration tests confirm this statement: “Notification APIs support notification listing.” |
| REQ-061.14 | MUST | V1 | API | Backend/API | L2717; L2721 | Notification APIs support read-status updates. | Contract and integration tests confirm this statement: “Notification APIs support read-status updates.” |
| REQ-061.15 | MUST | V1 | API | Backend/API | L2717; L2723 | Notification APIs support archiving. | Contract and integration tests confirm this statement: “Notification APIs support archiving.” |
| REQ-061.16 | MUST | V1 | API | Backend/API | L2717; L2725 | Notification APIs support deletion. | Contract and integration tests confirm this statement: “Notification APIs support deletion.” |
| REQ-061.17 | MUST | V1 | API | Backend/API | L2717; L2727 | Notification APIs support preferences. | Contract and integration tests confirm this statement: “Notification APIs support preferences.” |
| REQ-061.18 | SHOULD | Future | Non-functional | Backend/API | L2729 | Future push notifications fit naturally into the notification API architecture. | A defined measurement or design review confirms this statement: “Future push notifications fit naturally into the notification API architecture.” |

### REQ-062 — Part 6 / Support, CMS, and Admin APIs

**Structural source span:** L2733–L2791  
**Atomic child count:** 22

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-062.01 | MUST | V1 | API | Backend/API | L2735; L2737 | Support APIs support ticket creation. | Contract and integration tests confirm this statement: “Support APIs support ticket creation.” |
| REQ-062.02 | MUST | V1 | API | Backend/API | L2735; L2739 | Support APIs support ticket updates. | Contract and integration tests confirm this statement: “Support APIs support ticket updates.” |
| REQ-062.03 | MUST | V1 | API | Backend/API | L2735; L2741 | Support APIs support conversation history. | Contract and integration tests confirm this statement: “Support APIs support conversation history.” |
| REQ-062.04 | MUST | V1 | API | Backend/API | L2735; L2743 | Support APIs support attachments. | Contract and integration tests confirm this statement: “Support APIs support attachments.” |
| REQ-062.05 | MUST | V1 | API | Backend/API | L2735; L2745 | Support APIs support status tracking. | Contract and integration tests confirm this statement: “Support APIs support status tracking.” |
| REQ-062.06 | SHOULD | V1 | Non-functional | Backend/API | L2747 | Support APIs provide a complete support experience. | A defined measurement or design review confirms this statement: “Support APIs provide a complete support experience.” |
| REQ-062.07 | MUST | V1 | API | Backend/API | L2753; L2755 | CMS APIs support homepage-content retrieval. | Contract and integration tests confirm this statement: “CMS APIs support homepage-content retrieval.” |
| REQ-062.08 | MUST | V1 | API | Backend/API | L2753; L2757 | CMS APIs support blog-content retrieval. | Contract and integration tests confirm this statement: “CMS APIs support blog-content retrieval.” |
| REQ-062.09 | MUST | V1 | API | Backend/API | L2753; L2759 | CMS APIs support static-page retrieval. | Contract and integration tests confirm this statement: “CMS APIs support static-page retrieval.” |
| REQ-062.10 | MUST | V1 | API | Backend/API | L2753; L2761 | CMS APIs support FAQ retrieval. | Contract and integration tests confirm this statement: “CMS APIs support FAQ retrieval.” |
| REQ-062.11 | MUST | V1 | API | Backend/API | L2753; L2763 | CMS APIs support announcement retrieval. | Contract and integration tests confirm this statement: “CMS APIs support announcement retrieval.” |
| REQ-062.12 | SHOULD | V1 | Security | Backend/API | L2765 | Administrative content-management APIs use appropriate authorization controls. | Security review and negative-path tests confirm this statement: “Administrative content-management APIs use appropriate authorization controls.” |
| REQ-062.13 | MUST | V1 | Security | Backend/API | L2771; L2773 | Secure admin APIs support user management. | Security review and negative-path tests confirm this statement: “Secure admin APIs support user management.” |
| REQ-062.14 | MUST | V1 | Security | Backend/API | L2771; L2775 | Secure admin APIs support platform settings. | Security review and negative-path tests confirm this statement: “Secure admin APIs support platform settings.” |
| REQ-062.15 | MUST | V1 | Security | Backend/API | L2771; L2777 | Secure admin APIs support wallet adjustments. | Security review and negative-path tests confirm this statement: “Secure admin APIs support wallet adjustments.” |
| REQ-062.16 | MUST | V1 | Security | Backend/API | L2771; L2779 | Secure admin APIs support withdrawal management. | Security review and negative-path tests confirm this statement: “Secure admin APIs support withdrawal management.” |
| REQ-062.17 | MUST | V1 | Security | Backend/API | L2771; L2781 | Secure admin APIs support CMS management. | Security review and negative-path tests confirm this statement: “Secure admin APIs support CMS management.” |
| REQ-062.18 | MUST | V1 | Security | Backend/API | L2771; L2783 | Secure admin APIs support analytics. | Security review and negative-path tests confirm this statement: “Secure admin APIs support analytics.” |
| REQ-062.19 | MUST | V1 | Security | Backend/API | L2771; L2785 | Secure admin APIs support audit-log access. | Security review and negative-path tests confirm this statement: “Secure admin APIs support audit-log access.” |
| REQ-062.20 | MUST | V1 | Security | Backend/API | L2771; L2787 | Secure admin APIs support notifications. | Security review and negative-path tests confirm this statement: “Secure admin APIs support notifications.” |
| REQ-062.21 | MUST | V1 | Security | Backend/API | L2771; L2789 | Secure admin APIs support moderation. | Security review and negative-path tests confirm this statement: “Secure admin APIs support moderation.” |
| REQ-062.22 | SHOULD | V1 | Security | Backend/API | L2791 | Administrative API operations require appropriate permissions. | Security review and negative-path tests confirm this statement: “Administrative API operations require appropriate permissions.” |

### REQ-063 — Part 6 / Provider Integration and Webhooks

**Structural source span:** L2795–L2825  
**Atomic child count:** 13

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-063.01 | MUST | V1 | API | Backend/Integration | L2795–L2797 | The platform has an abstraction layer for external providers. | Contract and integration tests confirm this statement: “The platform has an abstraction layer for external providers.” |
| REQ-063.02 | SHOULD | V1 | API | Backend/Integration | L2799 | The provider interface minimizes provider-specific code outside integration modules. | Contract and integration tests confirm this statement: “The provider interface minimizes provider-specific code outside integration modules.” |
| REQ-063.03 | SHOULD | V1 | API | Backend/Integration | L2801 | Adding a provider primarily creates a new integration module rather than modifying core business logic. | Contract and integration tests confirm this statement: “Adding a provider primarily creates a new integration module rather than modifying core business logic.” |
| REQ-063.04 | SHOULD | V1 | Compliance | Backend/Integration | L2803 | Integrations comply with each provider’s published requirements and agreements. | An acceptance test confirms this statement: “Integrations comply with each provider’s published requirements and agreements.” |
| REQ-063.05 | SHOULD | V1 | API | Backend/Integration | L2807–L2809 | A secure webhook handling system is designed where providers support webhooks. | Contract and integration tests confirm this statement: “A secure webhook handling system is designed where providers support webhooks.” |
| REQ-063.06 | SHOULD | V1 | Security | Backend/Integration | L2811; L2813 | Webhook handling verifies incoming requests. | Security review and negative-path tests confirm this statement: “Webhook handling verifies incoming requests.” |
| REQ-063.07 | SHOULD | V1 | Operational | Backend/Integration | L2811; L2815 | Webhook handling records logs. | Operational execution or recovery evidence confirms this statement: “Webhook handling records logs.” |
| REQ-063.08 | SHOULD | V1 | Operational | Backend/Integration | L2811; L2817 | Webhook handling supports retry processing. | Operational execution or recovery evidence confirms this statement: “Webhook handling supports retry processing.” |
| REQ-063.09 | SHOULD | V1 | API | Backend/Integration | L2811; L2819 | Webhook handling is idempotent. | Contract and integration tests confirm this statement: “Webhook handling is idempotent.” |
| REQ-063.10 | SHOULD | V1 | Operational | Backend/Integration | L2811; L2821 | Webhook handling reports errors. | Operational execution or recovery evidence confirms this statement: “Webhook handling reports errors.” |
| REQ-063.11 | SHOULD | V1 | Operational | Backend/Integration | L2811; L2823 | Webhook handling is monitored. | Operational execution or recovery evidence confirms this statement: “Webhook handling is monitored.” |
| REQ-063.12 | SHOULD | V1 | Non-functional | Backend/Integration | L2825 | Webhook processing is resilient. | A defined measurement or design review confirms this statement: “Webhook processing is resilient.” |
| REQ-063.13 | SHOULD | V1 | Governance | Backend/Integration | L2825 | Webhook processing is auditable. | Workflow and audit evidence confirm this statement: “Webhook processing is auditable.” |

### REQ-064 — Part 6 / API Background Processing and Error Handling

**Structural source span:** L2829–L2863  
**Atomic child count:** 10

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-064.01 | SHOULD | V1 | Operational | Backend/API | L2829–L2831 | Long-running API operations are processed asynchronously where appropriate. | Operational execution or recovery evidence confirms this statement: “Long-running API operations are processed asynchronously where appropriate.” |
| REQ-064.02 | SHOULD | V1 | Operational | Backend/API | L2833–L2843 | The asynchronous-processing design covers email, notifications, synchronization, maintenance, and reporting workloads. | Operational execution or recovery evidence confirms this statement: “The asynchronous-processing design covers email, notifications, synchronization, maintenance, and reporting workloads.” |
| REQ-064.03 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2845 | The job-processing approach is justified against the selected infrastructure. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The job-processing approach is justified against the selected infrastructure.” |
| REQ-064.04 | SHOULD | V1 | Operational | Backend/API | L2849–L2851 | Every API returns structured responses. | Operational execution or recovery evidence confirms this statement: “Every API returns structured responses.” |
| REQ-064.05 | SHOULD | V1 | Operational | Shared | L2853; L2855 | API errors are understandable. | Operational execution or recovery evidence confirms this statement: “API errors are understandable.” |
| REQ-064.06 | SHOULD | V1 | Security | Backend/API | L2853; L2857 | API errors do not expose sensitive implementation details. | Security review and negative-path tests confirm this statement: “API errors do not expose sensitive implementation details.” |
| REQ-064.07 | SHOULD | V1 | Operational | Backend/API | L2853; L2859 | API errors include appropriate status information. | Operational execution or recovery evidence confirms this statement: “API errors include appropriate status information.” |
| REQ-064.08 | SHOULD | V1 | Operational | Backend/API | L2853; L2861 | API errors are logged for diagnostics. | Operational execution or recovery evidence confirms this statement: “API errors are logged for diagnostics.” |
| REQ-064.09 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2863 | A consistent API error format is documented. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A consistent API error format is documented.” |
| REQ-064.10 | SHOULD | V1 | Operational | Backend/API | L2863 | The documented API error format is used across the platform. | Operational execution or recovery evidence confirms this statement: “The documented API error format is used across the platform.” |

### REQ-065 — Part 6 / API Security, Documentation, Testing, and Observability

**Structural source span:** L2867–L2953  
**Atomic child count:** 33

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-065.01 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2871 | The API security design covers authentication. | Security review and negative-path tests confirm this statement: “The API security design covers authentication.” |
| REQ-065.02 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2873 | The API security design covers authorization. | Security review and negative-path tests confirm this statement: “The API security design covers authorization.” |
| REQ-065.03 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2875 | The API security design covers rate limiting. | Security review and negative-path tests confirm this statement: “The API security design covers rate limiting.” |
| REQ-065.04 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2877 | The API security design covers input validation. | Security review and negative-path tests confirm this statement: “The API security design covers input validation.” |
| REQ-065.05 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2879 | The API security design covers output encoding. | Security review and negative-path tests confirm this statement: “The API security design covers output encoding.” |
| REQ-065.06 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2881 | The API security design covers request logging. | Security review and negative-path tests confirm this statement: “The API security design covers request logging.” |
| REQ-065.07 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2883 | The API security design covers abuse detection. | Security review and negative-path tests confirm this statement: “The API security design covers abuse detection.” |
| REQ-065.08 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2885 | The API security design covers session security. | Security review and negative-path tests confirm this statement: “The API security design covers session security.” |
| REQ-065.09 | SHOULD | Pre-implementation deliverable | Security | Backend/API | L2869; L2887 | The API security design covers secret management. | Security review and negative-path tests confirm this statement: “The API security design covers secret management.” |
| REQ-065.10 | SHOULD | Pre-implementation deliverable | Governance | Backend/API | L2889 | API security is addressed throughout design rather than added afterward. | Workflow and audit evidence confirm this statement: “API security is addressed throughout design rather than added afterward.” |
| REQ-065.11 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2893–L2895 | Generate comprehensive API documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate comprehensive API documentation.” |
| REQ-065.12 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2897; L2899 | API documentation includes the authentication flow. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API documentation includes the authentication flow.” |
| REQ-065.13 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2897; L2901 | API documentation includes endpoint descriptions. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API documentation includes endpoint descriptions.” |
| REQ-065.14 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2897; L2903 | API documentation includes request examples. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API documentation includes request examples.” |
| REQ-065.15 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2897; L2905 | API documentation includes response examples. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API documentation includes response examples.” |
| REQ-065.16 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2897; L2907 | API documentation includes error documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API documentation includes error documentation.” |
| REQ-065.17 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2897; L2909 | API documentation includes version history. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API documentation includes version history.” |
| REQ-065.18 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2897; L2911 | API documentation includes integration guidance. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API documentation includes integration guidance.” |
| REQ-065.19 | SHOULD | V1 | Governance | Backend/API | L2913 | API documentation remains synchronized with implementation. | Workflow and audit evidence confirm this statement: “API documentation remains synchronized with implementation.” |
| REQ-065.20 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2919; L2921 | The API test strategy includes functional testing. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The API test strategy includes functional testing.” |
| REQ-065.21 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2919; L2923 | The API test strategy includes integration testing. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The API test strategy includes integration testing.” |
| REQ-065.22 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2919; L2925 | The API test strategy includes security testing. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The API test strategy includes security testing.” |
| REQ-065.23 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2919; L2927 | The API test strategy includes performance testing. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The API test strategy includes performance testing.” |
| REQ-065.24 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2919; L2929 | The API test strategy includes regression testing. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The API test strategy includes regression testing.” |
| REQ-065.25 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2931 | API testing is automated wherever practical. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API testing is automated wherever practical.” |
| REQ-065.26 | SHOULD | V1 | Operational | Backend/API | L2935–L2937 | The API layer supports operational visibility. | Operational execution or recovery evidence confirms this statement: “The API layer supports operational visibility.” |
| REQ-065.27 | SHOULD | Pre-implementation deliverable | Operational | Backend/API | L2939; L2941 | The API observability design considers structured logging. | Operational execution or recovery evidence confirms this statement: “The API observability design considers structured logging.” |
| REQ-065.28 | SHOULD | Pre-implementation deliverable | Operational | Backend/API | L2939; L2943 | The API observability design considers metrics. | Operational execution or recovery evidence confirms this statement: “The API observability design considers metrics.” |
| REQ-065.29 | SHOULD | Pre-implementation deliverable | Operational | Backend/API | L2939; L2945 | The API observability design considers request tracing. | Operational execution or recovery evidence confirms this statement: “The API observability design considers request tracing.” |
| REQ-065.30 | SHOULD | Pre-implementation deliverable | Operational | Backend/API | L2939; L2947 | The API observability design considers health checks. | Operational execution or recovery evidence confirms this statement: “The API observability design considers health checks.” |
| REQ-065.31 | SHOULD | Pre-implementation deliverable | Operational | Backend/API | L2939; L2949 | The API observability design considers error monitoring. | Operational execution or recovery evidence confirms this statement: “The API observability design considers error monitoring.” |
| REQ-065.32 | SHOULD | Pre-implementation deliverable | Operational | Backend/API | L2939; L2951 | The API observability design considers performance monitoring. | Operational execution or recovery evidence confirms this statement: “The API observability design considers performance monitoring.” |
| REQ-065.33 | SHOULD | Pre-implementation deliverable | Documentation | Backend/API | L2953 | API observability tools and architecture are appropriate to the selected stack. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “API observability tools and architecture are appropriate to the selected stack.” |

### REQ-066 — Part 6 / Final API Deliverables

**Structural source span:** L2957–L2981  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-066.01 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2961 | Generate an API Architecture Document. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an API Architecture Document.” |
| REQ-066.02 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2963 | Generate Authentication Flow Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Authentication Flow Documentation.” |
| REQ-066.03 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2965 | Generate an API Standards Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an API Standards Guide.” |
| REQ-066.04 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2967 | Generate a Provider Integration Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Provider Integration Guide.” |
| REQ-066.05 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2969 | Generate a Webhook Design Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Webhook Design Guide.” |
| REQ-066.06 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2971 | Generate Error Handling Standards. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Error Handling Standards.” |
| REQ-066.07 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2973 | Generate an API Security Review. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an API Security Review.” |
| REQ-066.08 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2975 | Generate an API Testing Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an API Testing Strategy.” |
| REQ-066.09 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2977 | The final API deliverables include API Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The final API deliverables include API Documentation.” |
| REQ-066.10 | MUST | Pre-implementation deliverable | Documentation | Backend/API | L2959; L2979 | Generate an API Implementation Roadmap. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an API Implementation Roadmap.” |
| REQ-066.11 | SHOULD | Pre-implementation deliverable | Governance | Backend/API | L2981 | API implementation does not begin until all final API deliverables are complete. | Workflow and audit evidence confirm this statement: “API implementation does not begin until all final API deliverables are complete.” |

### REQ-067 — Part 7 / Design Philosophy and Language

**Structural source span:** L2997–L3081  
**Atomic child count:** 7

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-067.01 | SHOULD | V1 | Non-functional | Frontend handoff | L2997–L3013 | The interface communicates professionalism, trust, simplicity, transparency, speed, security, and modernity. | A defined measurement or design review confirms this statement: “The interface communicates professionalism, trust, simplicity, transparency, speed, security, and modernity.” |
| REQ-067.02 | SHOULD | V1 | Non-functional | Frontend handoff | L3015–L3019 | A first-time user can understand each screen within approximately five seconds; otherwise it is redesigned. | A defined measurement or design review confirms this statement: “A first-time user can understand each screen within approximately five seconds; otherwise it is redesigned.” |
| REQ-067.03 | SHOULD | V1 | Non-functional | Frontend handoff | L3023–L3025 | The platform uses a modern SaaS design language. | A defined measurement or design review confirms this statement: “The platform uses a modern SaaS design language.” |
| REQ-067.04 | SHOULD | V1 | Non-functional | Frontend handoff | L3027–L3043 | The design language is clean, spacious, elegant, minimal, premium, responsive, fast, and mobile-first. | A defined measurement or design review confirms this statement: “The design language is clean, spacious, elegant, minimal, premium, responsive, fast, and mobile-first.” |
| REQ-067.05 | SHOULD | V1 | Non-functional | Frontend handoff | L3045–L3057 | The interface avoids clutter, excessive popups, distracting animations, heavy gradients, flashy colors, and confusing layouts. | A defined measurement or design review confirms this statement: “The interface avoids clutter, excessive popups, distracting animations, heavy gradients, flashy colors, and confusing layouts.” |
| REQ-067.06 | SHOULD | V1 | Non-functional | Frontend handoff | L3061–L3079 | Pages use consistent spacing, typography, buttons, icons, forms, colors, cards, and navigation. | A defined measurement or design review confirms this statement: “Pages use consistent spacing, typography, buttons, icons, forms, colors, cards, and navigation.” |
| REQ-067.07 | SHOULD | V1 | Non-functional | Frontend handoff | L3081 | The interface feels like one coherent product. | A defined measurement or design review confirms this statement: “The interface feels like one coherent product.” |

### REQ-068 — Part 7 / Brand, Color, Typography, Grid, and Icons

**Structural source span:** L3085–L3199  
**Atomic child count:** 12

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-068.01 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3085–L3093 | The product uses the EarnPearls name and “Your Time. Your Rewards.” tagline. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The product uses the EarnPearls name and “Your Time. Your Rewards.” tagline.” |
| REQ-068.02 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3095–L3105 | The logo communicates reward, value, growth, premium quality, and trust. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The logo communicates reward, value, growth, premium quality, and trust.” |
| REQ-068.03 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3107 | The pearl represents earned value rather than luxury alone. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The pearl represents earned value rather than luxury alone.” |
| REQ-068.04 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3111–L3113 | A professional color palette is recommended. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A professional color palette is recommended.” |
| REQ-068.05 | MAY | Pre-implementation deliverable | Documentation | Frontend handoff | L3115–L3143 | The palette evaluates the suggested deep-blue, emerald-green, success, warning, danger, and neutral directions without treating them as pre-approved selections. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The palette evaluates the suggested deep-blue, emerald-green, success, warning, danger, and neutral directions without treating them as pre-approved selections.” |
| REQ-068.06 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3145 | The palette avoids excessive color variety. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The palette avoids excessive color variety.” |
| REQ-068.07 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3149–L3161 | Typography uses modern readable fonts and prioritizes readability, accessibility, professionalism, and mobile readability. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Typography uses modern readable fonts and prioritizes readability, accessibility, professionalism, and mobile readability.” |
| REQ-068.08 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3163 | Typography defines a hierarchy for headings, body text, labels, and helper text. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Typography defines a hierarchy for headings, body text, labels, and helper text.” |
| REQ-068.09 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3167–L3171 | The interface uses a consistent spacing grid and aligned components. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The interface uses a consistent spacing grid and aligned components.” |
| REQ-068.10 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3173–L3183 | Responsive breakpoints are planned for mobile, tablet, laptop, desktop, and large desktop. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Responsive breakpoints are planned for mobile, tablet, laptop, desktop, and large desktop.” |
| REQ-068.11 | SHOULD | Pre-implementation deliverable | Documentation | Frontend handoff | L3187–L3197 | Icons are simple, modern, consistent, and recognizable. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Icons are simple, modern, consistent, and recognizable.” |
| REQ-068.12 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3199 | The product does not mix multiple icon styles. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The product does not mix multiple icon styles.” |

### REQ-069 — Part 7 / Buttons, Forms, and Cards

**Structural source span:** L3203–L3285  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-069.01 | SHOULD | V1 | Functional | Frontend handoff | L3203–L3219 | The design system standardizes primary, secondary, outline, danger, text, disabled, and loading button variants. | An acceptance test confirms this statement: “The design system standardizes primary, secondary, outline, danger, text, disabled, and loading button variants.” |
| REQ-069.02 | SHOULD | V1 | Functional | Frontend handoff | L3221–L3233 | Every button defines hover, focus, active, disabled, and loading states. | An acceptance test confirms this statement: “Every button defines hover, focus, active, disabled, and loading states.” |
| REQ-069.03 | SHOULD | V1 | Functional | Frontend handoff | L3239; L3241 | Every form provides real-time validation. | An acceptance test confirms this statement: “Every form provides real-time validation.” |
| REQ-069.04 | SHOULD | V1 | Functional | Frontend handoff | L3239; L3243 | Every form provides helpful error messages. | An acceptance test confirms this statement: “Every form provides helpful error messages.” |
| REQ-069.05 | SHOULD | V1 | Functional | Frontend handoff | L3239; L3245 | Every form provides clear placeholders. | An acceptance test confirms this statement: “Every form provides clear placeholders.” |
| REQ-069.06 | SHOULD | V1 | Functional | Frontend handoff | L3239; L3247 | Every form uses consistent spacing. | An acceptance test confirms this statement: “Every form uses consistent spacing.” |
| REQ-069.07 | SHOULD | V1 | Functional | Frontend handoff | L3239; L3249 | Every form provides accessible labels. | An acceptance test confirms this statement: “Every form provides accessible labels.” |
| REQ-069.08 | SHOULD | V1 | Functional | Frontend handoff | L3239; L3251 | Every form supports keyboard navigation. | An acceptance test confirms this statement: “Every form supports keyboard navigation.” |
| REQ-069.09 | SHOULD | V1 | Functional | Frontend handoff | L3239; L3253 | Every multi-step form provides progress indicators. | An acceptance test confirms this statement: “Every multi-step form provides progress indicators.” |
| REQ-069.10 | SHOULD | V1 | Functional | Frontend handoff | L3257–L3269 | Cards use consistent padding, borders, corner radius, shadow, and hover behavior. | An acceptance test confirms this statement: “Cards use consistent padding, borders, corner radius, shadow, and hover behavior.” |
| REQ-069.11 | SHOULD | V1 | Functional | Frontend handoff | L3271–L3285 | The shared card system supports survey, wallet, transaction, blog, statistic, leaderboard, and admin-widget contexts. | An acceptance test confirms this statement: “The shared card system supports survey, wallet, transaction, blog, statistic, leaderboard, and admin-widget contexts.” |

### REQ-070 — Part 7 / Dashboard, Survey, Wallet, Leaderboard, and Profile UX

**Structural source span:** L3289–L3403  
**Atomic child count:** 33

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-070.01 | SHOULD | V1 | Functional | Frontend handoff | L3289–L3309 | The dashboard prioritizes wallet summary, available surveys, pending rewards, mature rewards, weekly leaderboard, recent activity, notifications, and announcements in the suggested order unless an approved design justifies a change. | An acceptance test confirms this statement: “The dashboard prioritizes wallet summary, available surveys, pending rewards, mature rewards, weekly leaderboard, recent activity, notifications, and announcements in the suggested order unless an approved design justifies a change.” |
| REQ-070.02 | SHOULD | V1 | Functional | Frontend handoff | L3311 | A user immediately understands their current dashboard status. | An acceptance test confirms this statement: “A user immediately understands their current dashboard status.” |
| REQ-070.03 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3319 | Survey cards clearly display reward. | An acceptance test confirms this statement: “Survey cards clearly display reward.” |
| REQ-070.04 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3321 | Survey cards clearly display estimated time. | An acceptance test confirms this statement: “Survey cards clearly display estimated time.” |
| REQ-070.05 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3323 | Survey cards clearly display points. | An acceptance test confirms this statement: “Survey cards clearly display points.” |
| REQ-070.06 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3325 | Survey cards clearly display the USD equivalent. | An acceptance test confirms this statement: “Survey cards clearly display the USD equivalent.” |
| REQ-070.07 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3327 | Survey cards clearly display the local-currency estimate. | An acceptance test confirms this statement: “Survey cards clearly display the local-currency estimate.” |
| REQ-070.08 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3329 | Survey cards clearly display status. | An acceptance test confirms this statement: “Survey cards clearly display status.” |
| REQ-070.09 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3331 | Survey cards clearly display availability. | An acceptance test confirms this statement: “Survey cards clearly display availability.” |
| REQ-070.10 | SHOULD | V1 | Functional | Frontend handoff | L3317; L3333 | Survey cards clearly display provider requirements where appropriate. | An acceptance test confirms this statement: “Survey cards clearly display provider requirements where appropriate.” |
| REQ-070.11 | SHOULD | V1 | Functional | Frontend handoff | L3335 | Survey-card calls to action are obvious. | An acceptance test confirms this statement: “Survey-card calls to action are obvious.” |
| REQ-070.12 | SHOULD | V1 | Functional | Frontend handoff | L3339–L3341 | The wallet resembles a fintech application. | An acceptance test confirms this statement: “The wallet resembles a fintech application.” |
| REQ-070.13 | MUST | V1 | Functional | Frontend handoff | L3343; L3345 | The wallet experience displays points. | An acceptance test confirms this statement: “The wallet experience displays points.” |
| REQ-070.14 | MUST | V1 | Functional | Frontend handoff | L3343; L3347 | The wallet experience displays USD. | An acceptance test confirms this statement: “The wallet experience displays USD.” |
| REQ-070.15 | MUST | V1 | Functional | Frontend handoff | L3343; L3349 | The wallet experience displays local currency. | An acceptance test confirms this statement: “The wallet experience displays local currency.” |
| REQ-070.16 | MUST | V1 | Functional | Frontend handoff | L3343; L3351 | The wallet experience displays pending balance. | An acceptance test confirms this statement: “The wallet experience displays pending balance.” |
| REQ-070.17 | MUST | V1 | Functional | Frontend handoff | L3343; L3353 | The wallet experience displays validated balance. | An acceptance test confirms this statement: “The wallet experience displays validated balance.” |
| REQ-070.18 | MUST | V1 | Functional | Frontend handoff | L3343; L3355 | The wallet experience displays mature balance. | An acceptance test confirms this statement: “The wallet experience displays mature balance.” |
| REQ-070.19 | MUST | V1 | Functional | Frontend handoff | L3343; L3357 | The wallet experience displays withdrawable balance. | An acceptance test confirms this statement: “The wallet experience displays withdrawable balance.” |
| REQ-070.20 | MUST | V1 | Functional | Frontend handoff | L3343; L3359 | The wallet experience displays transaction history. | An acceptance test confirms this statement: “The wallet experience displays transaction history.” |
| REQ-070.21 | MUST | V1 | Functional | Frontend handoff | L3343; L3361 | The wallet experience displays estimated processing times. | An acceptance test confirms this statement: “The wallet experience displays estimated processing times.” |
| REQ-070.22 | SHOULD | V1 | Functional | Frontend handoff | L3363 | Wallet presentation prioritizes transparency. | An acceptance test confirms this statement: “Wallet presentation prioritizes transparency.” |
| REQ-070.23 | SHOULD | V1 | Functional | Frontend handoff | L3367–L3377 | The weekly leaderboard displays rank, display name, points earned, and surveys completed. | An acceptance test confirms this statement: “The weekly leaderboard displays rank, display name, points earned, and surveys completed.” |
| REQ-070.24 | MAY | Future | Functional | Frontend handoff | L3379 | Achievement badges are a future leaderboard option. | An acceptance test confirms this statement: “Achievement badges are a future leaderboard option.” |
| REQ-070.25 | SHOULD | V1 | Non-functional | Frontend handoff | L3381 | Leaderboard design encourages participation without unhealthy competition. | A defined measurement or design review confirms this statement: “Leaderboard design encourages participation without unhealthy competition.” |
| REQ-070.26 | SHOULD | V1 | Functional | Frontend handoff | L3387; L3389 | The profile page lets users manage profile information. | An acceptance test confirms this statement: “The profile page lets users manage profile information.” |
| REQ-070.27 | SHOULD | V1 | Functional | Frontend handoff | L3387; L3391 | The profile page lets users manage password. | An acceptance test confirms this statement: “The profile page lets users manage password.” |
| REQ-070.28 | SHOULD | V1 | Functional | Frontend handoff | L3387; L3393 | The profile page shows email-verification status. | An acceptance test confirms this statement: “The profile page shows email-verification status.” |
| REQ-070.29 | SHOULD | V1 | Functional | Frontend handoff | L3387; L3395 | The profile page lets users manage notification preferences. | An acceptance test confirms this statement: “The profile page lets users manage notification preferences.” |
| REQ-070.30 | SHOULD | V1 | Functional | Frontend handoff | L3387; L3397 | The profile page lets users manage withdrawal methods. | An acceptance test confirms this statement: “The profile page lets users manage withdrawal methods.” |
| REQ-070.31 | SHOULD | V1 | Functional | Frontend handoff | L3387; L3399 | The profile page lets users manage security settings. | An acceptance test confirms this statement: “The profile page lets users manage security settings.” |
| REQ-070.32 | SHOULD | V1 | Functional | Frontend handoff | L3387; L3401 | The profile page lets users access activity history. | An acceptance test confirms this statement: “The profile page lets users access activity history.” |
| REQ-070.33 | SHOULD | V1 | Non-functional | Frontend handoff | L3403 | The profile interface remains simple. | A defined measurement or design review confirms this statement: “The profile interface remains simple.” |

### REQ-071 — Part 7 / Support and Admin UX

**Structural source span:** L3407–L3449  
**Atomic child count:** 17

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-071.01 | SHOULD | V1 | Non-functional | Frontend handoff | L3407–L3409 | The support experience feels conversational. | A defined measurement or design review confirms this statement: “The support experience feels conversational.” |
| REQ-071.02 | MUST | V1 | Functional | Frontend handoff | L3411; L3413 | Support UX includes a knowledge base. | An acceptance test confirms this statement: “Support UX includes a knowledge base.” |
| REQ-071.03 | MUST | V1 | Functional | Frontend handoff | L3411; L3415 | Support UX includes search. | An acceptance test confirms this statement: “Support UX includes search.” |
| REQ-071.04 | MUST | V1 | Functional | Frontend handoff | L3411; L3417 | Support UX includes support tickets. | An acceptance test confirms this statement: “Support UX includes support tickets.” |
| REQ-071.05 | MUST | V1 | Functional | Frontend handoff | L3411; L3419 | Support UX includes a ticket timeline. | An acceptance test confirms this statement: “Support UX includes a ticket timeline.” |
| REQ-071.06 | MUST | V1 | Functional | Frontend handoff | L3411; L3421 | Support UX includes attachments. | An acceptance test confirms this statement: “Support UX includes attachments.” |
| REQ-071.07 | MUST | V1 | Functional | Frontend handoff | L3411; L3423 | Support UX includes status updates. | An acceptance test confirms this statement: “Support UX includes status updates.” |
| REQ-071.08 | MUST | V1 | Functional | Frontend handoff | L3411; L3425 | Support UX includes estimated response time. | An acceptance test confirms this statement: “Support UX includes estimated response time.” |
| REQ-071.09 | SHOULD | V1 | Non-functional | Frontend handoff | L3429–L3431 | The Super Admin interface prioritizes efficiency. | A defined measurement or design review confirms this statement: “The Super Admin interface prioritizes efficiency.” |
| REQ-071.10 | SHOULD | V1 | Functional | Frontend handoff | L3433; L3435 | Admin UX provides fast navigation. | An acceptance test confirms this statement: “Admin UX provides fast navigation.” |
| REQ-071.11 | SHOULD | V1 | Functional | Frontend handoff | L3433; L3437 | Admin UX provides powerful filtering. | An acceptance test confirms this statement: “Admin UX provides powerful filtering.” |
| REQ-071.12 | SHOULD | V1 | Functional | Frontend handoff | L3433; L3439 | Admin UX provides bulk actions. | An acceptance test confirms this statement: “Admin UX provides bulk actions.” |
| REQ-071.13 | SHOULD | V1 | Functional | Frontend handoff | L3433; L3441 | Admin UX provides quick search. | An acceptance test confirms this statement: “Admin UX provides quick search.” |
| REQ-071.14 | SHOULD | V1 | Functional | Frontend handoff | L3433; L3443 | Admin UX provides keyboard shortcuts where practical. | An acceptance test confirms this statement: “Admin UX provides keyboard shortcuts where practical.” |
| REQ-071.15 | SHOULD | V1 | Functional | Frontend handoff | L3433; L3445 | Admin UX provides dashboard customization. | An acceptance test confirms this statement: “Admin UX provides dashboard customization.” |
| REQ-071.16 | MAY | V1 | Functional | Frontend handoff | L3433; L3447 | Admin UX may provide dark mode. | An acceptance test confirms this statement: “Admin UX may provide dark mode.” |
| REQ-071.17 | SHOULD | V1 | Functional | Frontend handoff | L3433; L3449 | Admin UX provides a responsive layout. | An acceptance test confirms this statement: “Admin UX provides a responsive layout.” |

### REQ-072 — Part 7 / Accessibility, Microinteractions, Empty States, and Error Pages

**Structural source span:** L3453–L3527  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-072.01 | SHOULD | V1 | Functional | Frontend handoff | L3453–L3455 | The design follows accessibility best practices. | An acceptance test confirms this statement: “The design follows accessibility best practices.” |
| REQ-072.02 | MUST | V1 | Functional | Frontend handoff | L3457; L3459 | The design supports keyboard navigation. | An acceptance test confirms this statement: “The design supports keyboard navigation.” |
| REQ-072.03 | MUST | V1 | Functional | Frontend handoff | L3457; L3461 | The design supports visible focus states. | An acceptance test confirms this statement: “The design supports visible focus states.” |
| REQ-072.04 | MUST | V1 | Functional | Frontend handoff | L3457; L3463 | The design supports readable contrast. | An acceptance test confirms this statement: “The design supports readable contrast.” |
| REQ-072.05 | MUST | V1 | Functional | Frontend handoff | L3457; L3465 | The design supports scalable text. | An acceptance test confirms this statement: “The design supports scalable text.” |
| REQ-072.06 | MUST | V1 | Functional | Frontend handoff | L3457; L3467 | The design supports screen-reader compatibility where practical. | An acceptance test confirms this statement: “The design supports screen-reader compatibility where practical.” |
| REQ-072.07 | MUST | V1 | Functional | Frontend handoff | L3469 | The interface does not rely solely on color to communicate meaning. | An acceptance test confirms this statement: “The interface does not rely solely on color to communicate meaning.” |
| REQ-072.08 | SHOULD | V1 | Functional | Frontend handoff | L3473–L3489 | Animations are subtle and not excessive. | An acceptance test confirms this statement: “Animations are subtle and not excessive.” |
| REQ-072.09 | SHOULD | V1 | Functional | Frontend handoff | L3493–L3497 | Every empty screen provides a helpful explanation. | An acceptance test confirms this statement: “Every empty screen provides a helpful explanation.” |
| REQ-072.10 | SHOULD | V1 | Functional | Frontend handoff | L3493; L3499 | Every empty screen provides a suggested action. | An acceptance test confirms this statement: “Every empty screen provides a suggested action.” |
| REQ-072.11 | SHOULD | V1 | Functional | Frontend handoff | L3493; L3501 | Every empty screen provides a clear call to action. | An acceptance test confirms this statement: “Every empty screen provides a clear call to action.” |
| REQ-072.12 | MUST | V1 | Functional | Frontend handoff | L3503 | The product does not leave blank pages. | An acceptance test confirms this statement: “The product does not leave blank pages.” |
| REQ-072.13 | MUST | V1 | Functional | Frontend handoff | L3507–L3525 | Professional 401, 403, 404, 429, 500, maintenance, and offline pages are created. | An acceptance test confirms this statement: “Professional 401, 403, 404, 429, 500, maintenance, and offline pages are created.” |
| REQ-072.14 | SHOULD | V1 | Functional | Frontend handoff | L3527 | Every error page guides the user to a useful action. | An acceptance test confirms this statement: “Every error page guides the user to a useful action.” |

### REQ-073 — Part 7 / Final UI Deliverables and Approval Gate

**Structural source span:** L3531–L3557  
**Atomic child count:** 12

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-073.01 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3535 | Generate a Complete Design System. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Complete Design System.” |
| REQ-073.02 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3537 | Generate a Component Library. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Component Library.” |
| REQ-073.03 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3539 | Generate Design Tokens. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Design Tokens.” |
| REQ-073.04 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3541 | Generate a Typography Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Typography Guide.” |
| REQ-073.05 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3543 | Generate a Color Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Color Guide.” |
| REQ-073.06 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3545 | Generate Responsive Guidelines. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Responsive Guidelines.” |
| REQ-073.07 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3547 | Generate an Accessibility Review. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an Accessibility Review.” |
| REQ-073.08 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3549 | Generate UX Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate UX Documentation.” |
| REQ-073.09 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3551 | Generate Wireframes. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Wireframes.” |
| REQ-073.10 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3553 | Generate High-Fidelity Mockups. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate High-Fidelity Mockups.” |
| REQ-073.11 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L3533; L3555 | Generate a Design QA Checklist. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Design QA Checklist.” |
| REQ-073.12 | SHOULD | Pre-implementation deliverable | Governance | Frontend handoff | L3557 | UI implementation begins only after the UI deliverables are approved. | Workflow and audit evidence confirm this statement: “UI implementation begins only after the UI deliverables are approved.” |

### REQ-074 — Part 8 / Growth and Brand Positioning

**Structural source span:** L3569–L3667  
**Atomic child count:** 8

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-074.01 | MUST | Pre-implementation deliverable | Compliance | Marketing/Shared | L3569–L3571 | EarnPearls does not depend solely on paid advertising. | An acceptance test confirms this statement: “EarnPearls does not depend solely on paid advertising.” |
| REQ-074.02 | SHOULD | Pre-implementation deliverable | Documentation | Marketing/Shared | L3573–L3589 | Long-term growth planning centers on trust, content, community, organic search, social presence, retention, referrals, and brand authority. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Long-term growth planning centers on trust, content, community, organic search, social presence, retention, referrals, and brand authority.” |
| REQ-074.03 | SHOULD | Pre-implementation deliverable | Compliance | Marketing/Shared | L3595–L3599 | Brand positioning describes EarnPearls as a trusted global rewards platform for surveys and approved reward opportunities. | An acceptance test confirms this statement: “Brand positioning describes EarnPearls as a trusted global rewards platform for surveys and approved reward opportunities.” |
| REQ-074.04 | SHOULD | Pre-implementation deliverable | Compliance | Marketing/Shared | L3601–L3613 | Brand messaging emphasizes respect for user time, transparency, fair rewards, simplicity, reliable withdrawals, and user empowerment. | An acceptance test confirms this statement: “Brand messaging emphasizes respect for user time, transparency, fair rewards, simplicity, reliable withdrawals, and user empowerment.” |
| REQ-074.05 | MUST | Pre-implementation deliverable | Compliance | Marketing/Shared | L3615–L3621 | Marketing avoids get-rich-quick, guaranteed-income, and effortless-money claims. | An acceptance test confirms this statement: “Marketing avoids get-rich-quick, guaranteed-income, and effortless-money claims.” |
| REQ-074.06 | MUST | Pre-implementation deliverable | Compliance | Marketing/Shared | L3623 | Brand communications remain trustworthy. | An acceptance test confirms this statement: “Brand communications remain trustworthy.” |
| REQ-074.07 | SHOULD | Pre-implementation deliverable | Documentation | Marketing/Shared | L3627–L3655 | The target-audience plan covers the stated US, UK, Canadian, Australian, Irish, German, selected-European, and GCC markets. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The target-audience plan covers the stated US, UK, Canadian, Australian, Irish, German, selected-European, and GCC markets.” |
| REQ-074.08 | SHOULD | Pre-implementation deliverable | Compliance | Marketing/Shared | L3657–L3667 | Campaign planning adapts to country, culture, language behavior, internet habits, and reward preferences. | An acceptance test confirms this statement: “Campaign planning adapts to country, culture, language behavior, internet habits, and reward preferences.” |

### REQ-075 — Part 8 / Launch and Content Engine

**Structural source span:** L3671–L3787  
**Atomic child count:** 20

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-075.01 | SHOULD | Pre-implementation deliverable | Documentation | Marketing/Shared | L3671–L3673 | A complete launch roadmap is created. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A complete launch roadmap is created.” |
| REQ-075.02 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3685 | The website exists before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The website exists before public launch.” |
| REQ-075.03 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3687 | Social media accounts exist before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Social media accounts exist before public launch.” |
| REQ-075.04 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3689 | The blog exists before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The blog exists before public launch.” |
| REQ-075.05 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3691 | The YouTube channel exists before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The YouTube channel exists before public launch.” |
| REQ-075.06 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3693 | The email system exists before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The email system exists before public launch.” |
| REQ-075.07 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3695 | Analytics is set up before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Analytics is set up before public launch.” |
| REQ-075.08 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3697 | The SEO foundation exists before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The SEO foundation exists before public launch.” |
| REQ-075.09 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L3683; L3699 | Brand assets exist before public launch. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Brand assets exist before public launch.” |
| REQ-075.10 | MUST | Pre-implementation deliverable | Governance | Marketing/Shared | L3701 | Credibility is built before user acquisition. | Workflow and audit evidence confirm this statement: “Credibility is built before user acquisition.” |
| REQ-075.11 | MUST | Pre-implementation deliverable | Governance | Marketing/Shared | L3705–L3707 | Content creation starts on Day One. | Workflow and audit evidence confirm this statement: “Content creation starts on Day One.” |
| REQ-075.12 | SHOULD | V1 | Operational | Marketing/Shared | L3709; L3711 | The content engine continuously publishes blog articles. | Operational execution or recovery evidence confirms this statement: “The content engine continuously publishes blog articles.” |
| REQ-075.13 | SHOULD | V1 | Operational | Marketing/Shared | L3709; L3713 | The content engine continuously publishes YouTube videos. | Operational execution or recovery evidence confirms this statement: “The content engine continuously publishes YouTube videos.” |
| REQ-075.14 | SHOULD | V1 | Operational | Marketing/Shared | L3709; L3715 | The content engine continuously publishes short videos. | Operational execution or recovery evidence confirms this statement: “The content engine continuously publishes short videos.” |
| REQ-075.15 | SHOULD | V1 | Operational | Marketing/Shared | L3709; L3717 | The content engine continuously publishes social posts. | Operational execution or recovery evidence confirms this statement: “The content engine continuously publishes social posts.” |
| REQ-075.16 | SHOULD | V1 | Operational | Marketing/Shared | L3709; L3719 | The content engine continuously publishes guides. | Operational execution or recovery evidence confirms this statement: “The content engine continuously publishes guides.” |
| REQ-075.17 | SHOULD | V1 | Operational | Marketing/Shared | L3709; L3721 | The content engine continuously publishes educational content. | Operational execution or recovery evidence confirms this statement: “The content engine continuously publishes educational content.” |
| REQ-075.18 | SHOULD | Pre-implementation deliverable | Documentation | Marketing/Shared | L3725–L3727 | A complete content calendar is created. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A complete content calendar is created.” |
| REQ-075.19 | SHOULD | Pre-implementation deliverable | Documentation | Marketing/Shared | L3729–L3785 | The content calendar covers survey education, rewards education, trust content, and search-based content. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The content calendar covers survey education, rewards education, trust content, and search-based content.” |
| REQ-075.20 | SHOULD | Pre-implementation deliverable | Compliance | Marketing/Shared | L3787 | SEO-friendly articles avoid misleading comparisons. | An acceptance test confirms this statement: “SEO-friendly articles avoid misleading comparisons.” |

### REQ-076 — Part 8 / Video and Social Media Strategy

**Structural source span:** L3791–L3917  
**Atomic child count:** 13

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-076.01 | SHOULD | Pre-implementation deliverable | Documentation | Marketing | L3791–L3793 | YouTube is treated as a major growth channel. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “YouTube is treated as a major growth channel.” |
| REQ-076.02 | SHOULD | Pre-implementation deliverable | Documentation | Marketing | L3795–L3811 | The YouTube strategy covers branding, video categories, upload schedule, SEO, thumbnails, and retention. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The YouTube strategy covers branding, video categories, upload schedule, SEO, thumbnails, and retention.” |
| REQ-076.03 | SHOULD | Pre-implementation deliverable | Documentation | Marketing | L3815–L3845 | YouTube content planning covers educational videos, platform updates, and trust-building content. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “YouTube content planning covers educational videos, platform updates, and trust-building content.” |
| REQ-076.04 | SHOULD | Pre-implementation deliverable | Documentation | Marketing | L3849–L3859 | Short-form strategy covers TikTok, Instagram Reels, YouTube Shorts, and Facebook Reels. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Short-form strategy covers TikTok, Instagram Reels, YouTube Shorts, and Facebook Reels.” |
| REQ-076.05 | SHOULD | Pre-implementation deliverable | Documentation | Marketing | L3861–L3869 | Short-form content focuses on quick tips, reward education, platform features, and user guidance. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Short-form content focuses on quick tips, reward education, platform features, and user guidance.” |
| REQ-076.06 | SHOULD | Pre-implementation deliverable | Documentation | Marketing | L3871 | Short-form video optimizes for awareness and trust. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Short-form video optimizes for awareness and trust.” |
| REQ-076.07 | SHOULD | Pre-implementation deliverable | Documentation | Marketing | L3875–L3899 | Initial social priorities are YouTube, Instagram, TikTok, and Facebook; LinkedIn remains a future consideration and is not a launch priority. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Initial social priorities are YouTube, Instagram, TikTok, and Facebook; LinkedIn remains a future consideration and is not a launch priority.” |
| REQ-076.08 | MUST | Pre-implementation deliverable | Documentation | Marketing | L3903–L3907 | The social operating system includes a posting calendar. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The social operating system includes a posting calendar.” |
| REQ-076.09 | MUST | Pre-implementation deliverable | Documentation | Marketing | L3903; L3909 | The social operating system includes content templates. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The social operating system includes content templates.” |
| REQ-076.10 | MUST | Pre-implementation deliverable | Documentation | Marketing | L3903; L3911 | The social operating system includes brand guidelines. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The social operating system includes brand guidelines.” |
| REQ-076.11 | MUST | Pre-implementation deliverable | Documentation | Marketing | L3903; L3913 | The social operating system includes a hashtag strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The social operating system includes a hashtag strategy.” |
| REQ-076.12 | MUST | Pre-implementation deliverable | Documentation | Marketing | L3903; L3915 | The social operating system includes community-response guidelines. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The social operating system includes community-response guidelines.” |
| REQ-076.13 | MUST | Pre-implementation deliverable | Documentation | Marketing | L3903; L3917 | The social operating system includes a crisis-communication plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The social operating system includes a crisis-communication plan.” |

### REQ-077 — Part 8 / SEO and Blog Growth Engine

**Structural source span:** L3921–L3995  
**Atomic child count:** 17

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-077.01 | MUST | V1 | Functional | Shared | L3921–L3923 | SEO is built into the platform from the beginning. | An acceptance test confirms this statement: “SEO is built into the platform from the beginning.” |
| REQ-077.02 | MUST | V1 | Functional | Shared | L3925–L3931 | Technical SEO includes clean URLs. | An acceptance test confirms this statement: “Technical SEO includes clean URLs.” |
| REQ-077.03 | MUST | V1 | Non-functional | Shared | L3925; L3933 | Technical SEO includes fast-loading pages. | A defined measurement or design review confirms this statement: “Technical SEO includes fast-loading pages.” |
| REQ-077.04 | MUST | V1 | Functional | Shared | L3925; L3935 | Technical SEO includes a sitemap. | An acceptance test confirms this statement: “Technical SEO includes a sitemap.” |
| REQ-077.05 | MUST | V1 | Functional | Shared | L3925; L3937 | Technical SEO includes robots.txt. | An acceptance test confirms this statement: “Technical SEO includes robots.txt.” |
| REQ-077.06 | MUST | V1 | Functional | Shared | L3925; L3939 | Technical SEO includes schema markup. | An acceptance test confirms this statement: “Technical SEO includes schema markup.” |
| REQ-077.07 | MUST | V1 | Functional | Frontend handoff | L3925; L3941 | Technical SEO includes mobile optimization. | An acceptance test confirms this statement: “Technical SEO includes mobile optimization.” |
| REQ-077.08 | MUST | V1 | Functional | Shared | L3925; L3943 | Technical SEO includes canonical URLs. | An acceptance test confirms this statement: “Technical SEO includes canonical URLs.” |
| REQ-077.09 | MUST | V1 | Functional | Shared | L3925; L3945 | Technical SEO includes proper indexing. | An acceptance test confirms this statement: “Technical SEO includes proper indexing.” |
| REQ-077.10 | SHOULD | V1 | Functional | Shared | L3951; L3953 | Every content page supports an SEO title. | An acceptance test confirms this statement: “Every content page supports an SEO title.” |
| REQ-077.11 | SHOULD | V1 | Functional | Shared | L3951; L3955 | Every content page supports a meta description. | An acceptance test confirms this statement: “Every content page supports a meta description.” |
| REQ-077.12 | SHOULD | V1 | Functional | Shared | L3951; L3957 | Every content page supports keywords. | An acceptance test confirms this statement: “Every content page supports keywords.” |
| REQ-077.13 | SHOULD | V1 | Functional | Shared | L3951; L3959 | Every content page supports internal links. | An acceptance test confirms this statement: “Every content page supports internal links.” |
| REQ-077.14 | SHOULD | V1 | Functional | Shared | L3951; L3961 | Every content page supports structured headings. | An acceptance test confirms this statement: “Every content page supports structured headings.” |
| REQ-077.15 | SHOULD | V1 | Functional | Shared | L3951; L3963 | Every content page supports image optimization. | An acceptance test confirms this statement: “Every content page supports image optimization.” |
| REQ-077.16 | SHOULD | V1 | Functional | Shared | L3967–L3969 | The blog is developed as a long-term traffic asset. | An acceptance test confirms this statement: “The blog is developed as a long-term traffic asset.” |
| REQ-077.17 | SHOULD | Pre-implementation deliverable | Documentation | Shared | L3971–L3995 | The blog SEO plan defines content clusters, pillar pages, supporting articles, and internal linking. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The blog SEO plan defines content clusters, pillar pages, supporting articles, and internal linking.” |

### REQ-078 — Part 8 / Email Marketing, Referrals, and Retention

**Structural source span:** L3999–L4071  
**Atomic child count:** 15

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-078.01 | MUST | Pre-implementation deliverable | Documentation | Backend/Marketing | L3999–L4001 | Create an email-marketing framework. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Create an email-marketing framework.” |
| REQ-078.02 | MUST | V1 | Functional | Backend/Marketing | L4003–L4007 | The email framework supports welcome email. | An acceptance test confirms this statement: “The email framework supports welcome email.” |
| REQ-078.03 | MUST | V1 | Functional | Backend/Marketing | L4003; L4009 | The email framework supports verification email. | An acceptance test confirms this statement: “The email framework supports verification email.” |
| REQ-078.04 | MUST | V1 | Functional | Backend/Marketing | L4011–L4013 | The email framework supports new-survey-available email. | An acceptance test confirms this statement: “The email framework supports new-survey-available email.” |
| REQ-078.05 | MUST | V1 | Functional | Backend/Marketing | L4011; L4015 | The email framework supports platform-update email. | An acceptance test confirms this statement: “The email framework supports platform-update email.” |
| REQ-078.06 | MUST | V1 | Functional | Backend/Marketing | L4011; L4017 | The email framework supports reward-reminder email. | An acceptance test confirms this statement: “The email framework supports reward-reminder email.” |
| REQ-078.07 | MUST | V1 | Functional | Backend/Marketing | L4019–L4021 | The email framework supports security-notification email. | An acceptance test confirms this statement: “The email framework supports security-notification email.” |
| REQ-078.08 | MUST | V1 | Functional | Backend/Marketing | L4019; L4023 | The email framework supports account-activity email. | An acceptance test confirms this statement: “The email framework supports account-activity email.” |
| REQ-078.09 | MUST | V1 | Functional | Backend/Marketing | L4025–L4027 | The email framework supports inactive-user campaigns. | An acceptance test confirms this statement: “The email framework supports inactive-user campaigns.” |
| REQ-078.10 | MUST | V1 | Functional | Backend/Marketing | L4025; L4029 | The email framework supports personalized-recommendation email. | An acceptance test confirms this statement: “The email framework supports personalized-recommendation email.” |
| REQ-078.11 | SHOULD | Future | Functional | Backend/Marketing | L4033–L4035 | The architecture supports future referral campaigns. | An acceptance test confirms this statement: “The architecture supports future referral campaigns.” |
| REQ-078.12 | MAY | Future | Functional | Backend/Marketing | L4037–L4047 | Future referral architecture considers links, tracking, reward rules, campaign management, and fraud prevention. | An acceptance test confirms this statement: “Future referral architecture considers links, tracking, reward rules, campaign management, and fraud prevention.” |
| REQ-078.13 | MUST | Future | Governance | Backend/Marketing | L4049 | The referral system is not activated until properly designed. | Workflow and audit evidence confirm this statement: “The referral system is not activated until properly designed.” |
| REQ-078.14 | SHOULD | Pre-implementation deliverable | Documentation | Backend/Marketing | L4053–L4069 | A retention design considers leaderboards, future achievements, reward milestones, recommendations, notifications, and education. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A retention design considers leaderboards, future achievements, reward milestones, recommendations, notifications, and education.” |
| REQ-078.15 | SHOULD | V1 | Non-functional | Backend/Marketing | L4071 | Retention mechanisms focus on sustainable engagement. | A defined measurement or design review confirms this statement: “Retention mechanisms focus on sustainable engagement.” |

### REQ-079 — Part 8 / Growth Analytics and Paid Advertising Gate

**Structural source span:** L4075–L4143  
**Atomic child count:** 22

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-079.01 | MUST | V1 | Functional | Backend/Analytics | L4077; L4079 | Growth analytics tracks acquisition. | An acceptance test confirms this statement: “Growth analytics tracks acquisition.” |
| REQ-079.02 | MUST | V1 | Functional | Backend/Analytics | L4077; L4081 | Growth analytics tracks traffic sources. | An acceptance test confirms this statement: “Growth analytics tracks traffic sources.” |
| REQ-079.03 | MUST | V1 | Functional | Backend/Analytics | L4077; L4083 | Growth analytics tracks signups. | An acceptance test confirms this statement: “Growth analytics tracks signups.” |
| REQ-079.04 | MUST | V1 | Functional | Backend/Analytics | L4077; L4085 | Growth analytics tracks conversion rate. | An acceptance test confirms this statement: “Growth analytics tracks conversion rate.” |
| REQ-079.05 | MUST | V1 | Functional | Backend/Analytics | L4077; L4087 | Growth analytics tracks activation. | An acceptance test confirms this statement: “Growth analytics tracks activation.” |
| REQ-079.06 | MUST | V1 | Functional | Backend/Analytics | L4077; L4089 | Growth analytics tracks email verification. | An acceptance test confirms this statement: “Growth analytics tracks email verification.” |
| REQ-079.07 | MUST | V1 | Functional | Backend/Analytics | L4077; L4091 | Growth analytics tracks first survey completion. | An acceptance test confirms this statement: “Growth analytics tracks first survey completion.” |
| REQ-079.08 | MUST | V1 | Functional | Backend/Analytics | L4077; L4093 | Growth analytics tracks engagement. | An acceptance test confirms this statement: “Growth analytics tracks engagement.” |
| REQ-079.09 | MUST | V1 | Functional | Backend/Analytics | L4077; L4095 | Growth analytics tracks daily active users. | An acceptance test confirms this statement: “Growth analytics tracks daily active users.” |
| REQ-079.10 | MUST | V1 | Functional | Backend/Analytics | L4077; L4097 | Growth analytics tracks survey participation. | An acceptance test confirms this statement: “Growth analytics tracks survey participation.” |
| REQ-079.11 | MUST | V1 | Functional | Backend/Analytics | L4077; L4099 | Growth analytics tracks return frequency. | An acceptance test confirms this statement: “Growth analytics tracks return frequency.” |
| REQ-079.12 | MUST | V1 | Functional | Backend/Analytics | L4077; L4101 | Growth analytics tracks revenue. | An acceptance test confirms this statement: “Growth analytics tracks revenue.” |
| REQ-079.13 | MUST | V1 | Functional | Backend/Analytics | L4077; L4103 | Growth analytics tracks provider revenue. | An acceptance test confirms this statement: “Growth analytics tracks provider revenue.” |
| REQ-079.14 | MUST | V1 | Functional | Backend/Analytics | L4077; L4105 | Growth analytics tracks user rewards. | An acceptance test confirms this statement: “Growth analytics tracks user rewards.” |
| REQ-079.15 | MUST | V1 | Functional | Backend/Analytics | L4077; L4107 | Growth analytics tracks platform margin. | An acceptance test confirms this statement: “Growth analytics tracks platform margin.” |
| REQ-079.16 | MUST | V1 | Functional | Backend/Analytics | L4077; L4109 | Growth analytics tracks retention. | An acceptance test confirms this statement: “Growth analytics tracks retention.” |
| REQ-079.17 | MUST | V1 | Functional | Backend/Analytics | L4077; L4111 | Growth analytics tracks returning users. | An acceptance test confirms this statement: “Growth analytics tracks returning users.” |
| REQ-079.18 | MUST | V1 | Functional | Backend/Analytics | L4077; L4113 | Growth analytics tracks churn rate. | An acceptance test confirms this statement: “Growth analytics tracks churn rate.” |
| REQ-079.19 | SHOULD | V1 | Governance | Backend/Analytics | L4117–L4121 | Paid advertising begins only after tracking is ready. | Workflow and audit evidence confirm this statement: “Paid advertising begins only after tracking is ready.” |
| REQ-079.20 | SHOULD | V1 | Governance | Backend/Analytics | L4119–L4123 | Paid advertising begins only after the conversion funnel is tested. | Workflow and audit evidence confirm this statement: “Paid advertising begins only after the conversion funnel is tested.” |
| REQ-079.21 | SHOULD | V1 | Governance | Backend/Analytics | L4119–L4125 | Paid advertising begins only after unit economics are understood. | Workflow and audit evidence confirm this statement: “Paid advertising begins only after unit economics are understood.” |
| REQ-079.22 | SHOULD | Pre-implementation deliverable | Documentation | Backend/Analytics | L4135–L4143 | Customer-acquisition cost, lifetime value, and payback period are calculated before paid scaling is recommended. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Customer-acquisition cost, lifetime value, and payback period are calculated before paid scaling is recommended.” |

### REQ-080 — Part 8 / Community and Marketing Deliverables

**Structural source span:** L4147–L4187  
**Atomic child count:** 12

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-080.01 | SHOULD | Pre-implementation deliverable | Documentation | Marketing/Shared | L4147–L4159 | Community trust is built through social presence, feedback, transparency, updates, and educational resources. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Community trust is built through social presence, feedback, transparency, updates, and educational resources.” |
| REQ-080.02 | SHOULD | Pre-implementation deliverable | Non-functional | Marketing/Shared | L4161 | Community experience makes users feel part of the platform journey. | A defined measurement or design review confirms this statement: “Community experience makes users feel part of the platform journey.” |
| REQ-080.03 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4169 | Generate a Complete Marketing Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Complete Marketing Strategy.” |
| REQ-080.04 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4171 | Generate Brand Guidelines. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Brand Guidelines.” |
| REQ-080.05 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4173 | Generate an SEO Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an SEO Strategy.” |
| REQ-080.06 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4175 | Generate a Content Calendar. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Content Calendar.” |
| REQ-080.07 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4177 | Generate a YouTube Growth Plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a YouTube Growth Plan.” |
| REQ-080.08 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4179 | Generate a Social Media Operating Plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Social Media Operating Plan.” |
| REQ-080.09 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4181 | Generate an Email Marketing Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an Email Marketing Strategy.” |
| REQ-080.10 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4183 | Generate Analytics Dashboard Requirements. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate Analytics Dashboard Requirements.” |
| REQ-080.11 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4185 | Generate a Launch Campaign Plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Launch Campaign Plan.” |
| REQ-080.12 | MUST | Pre-implementation deliverable | Documentation | Marketing/Shared | L4167; L4187 | Generate a User Acquisition Roadmap. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a User Acquisition Roadmap.” |

### REQ-081 — Part 9 / Infrastructure Philosophy and Selection

**Structural source span:** L4199–L4281  
**Atomic child count:** 10

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-081.01 | MUST | V1 | Non-functional | DevOps/Architecture | L4199–L4201 | Infrastructure is startup-friendly and enterprise-ready. | A defined measurement or design review confirms this statement: “Infrastructure is startup-friendly and enterprise-ready.” |
| REQ-081.02 | SHOULD | V1 | Non-functional | DevOps/Architecture | L4203 | Initial infrastructure is cost-efficient and has a clear migration path as usage grows. | A defined measurement or design review confirms this statement: “Initial infrastructure is cost-efficient and has a clear migration path as usage grows.” |
| REQ-081.03 | MUST | V1 | Non-functional | DevOps/Architecture | L4205 | Vendor lock-in is avoided wherever practical. | A defined measurement or design review confirms this statement: “Vendor lock-in is avoided wherever practical.” |
| REQ-081.04 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4207–L4221 | Infrastructure decisions prioritize reliability, security, performance, low cost, scalability, maintenance, and migration capability. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Infrastructure decisions prioritize reliability, security, performance, low cost, scalability, maintenance, and migration capability.” |
| REQ-081.05 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4225–L4229 | Infrastructure options are evaluated objectively rather than selected by popularity. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Infrastructure options are evaluated objectively rather than selected by popularity.” |
| REQ-081.06 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4231–L4249 | Infrastructure evaluation covers free tiers, resource limits, scalability, reliability, security, developer experience, documentation, long-term cost, and migration difficulty. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Infrastructure evaluation covers free tiers, resource limits, scalability, reliability, security, developer experience, documentation, long-term cost, and migration difficulty.” |
| REQ-081.07 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4253–L4255 | Free or extremely low-cost solutions are prioritized during the startup phase where practical. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Free or extremely low-cost solutions are prioritized during the startup phase where practical.” |
| REQ-081.08 | MAY | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4257–L4277 | The infrastructure evaluation considers the named cloud, serverless, database, Apps Script, and other suitable startup options without preselecting them. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The infrastructure evaluation considers the named cloud, serverless, database, Apps Script, and other suitable startup options without preselecting them.” |
| REQ-081.09 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4279 | The recommended infrastructure combination includes reasoning. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The recommended infrastructure combination includes reasoning.” |
| REQ-081.10 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4281 | A free service is not selected when it creates future technical debt. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “A free service is not selected when it creates future technical debt.” |

### REQ-082 — Part 9 / Cloud and Backend Infrastructure

**Structural source span:** L4285–L4340  
**Atomic child count:** 7

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-082.01 | SHOULD | Pre-implementation deliverable | Non-functional | DevOps/Architecture | L4285–L4303 | Cloud architecture separates frontend, backend services, database, storage, email, background jobs, monitoring, and third-party integrations. | A defined measurement or design review confirms this statement: “Cloud architecture separates frontend, backend services, database, storage, email, background jobs, monitoring, and third-party integrations.” |
| REQ-082.02 | SHOULD | Pre-implementation deliverable | Non-functional | DevOps/Architecture | L4305 | Separated cloud components can scale independently. | A defined measurement or design review confirms this statement: “Separated cloud components can scale independently.” |
| REQ-082.03 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4309–L4321 | Backend options are evaluated for performance, security, cost, developer availability, and maintenance. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Backend options are evaluated for performance, security, cost, developer availability, and maintenance.” |
| REQ-082.04 | MAY | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4323–L4331 | The backend evaluation considers Laravel, Node.js, serverless functions, and other modern approaches without preselecting one. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backend evaluation considers Laravel, Node.js, serverless functions, and other modern approaches without preselecting one.” |
| REQ-082.05 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4333–L4335 | The final backend recommendation explains why the selected option was chosen. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The final backend recommendation explains why the selected option was chosen.” |
| REQ-082.06 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4333; L4337 | The final backend recommendation explains why alternatives were rejected. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The final backend recommendation explains why alternatives were rejected.” |
| REQ-082.07 | MUST | Pre-implementation deliverable | Documentation | DevOps/Architecture | L4333; L4339 | The final backend recommendation defines a scaling path. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The final backend recommendation defines a scaling path.” |

### REQ-083 — Part 9 / Database and Storage Infrastructure

**Structural source span:** L4343–L4395  
**Atomic child count:** 9

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-083.01 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Database | L4343–L4355 | Database infrastructure evaluates PostgreSQL, MySQL, MariaDB, serverless databases, and managed database services. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Database infrastructure evaluates PostgreSQL, MySQL, MariaDB, serverless databases, and managed database services.” |
| REQ-083.02 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Database | L4357–L4369 | Database infrastructure evaluation covers free-tier limits, backups, performance, scaling, security, and migration possibilities. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Database infrastructure evaluation covers free-tier limits, backups, performance, scaling, security, and migration possibilities.” |
| REQ-083.03 | MUST | V1 | Non-functional | DevOps/Database | L4371 | The selected database does not become the first platform bottleneck. | A defined measurement or design review confirms this statement: “The selected database does not become the first platform bottleneck.” |
| REQ-083.04 | MUST | Pre-implementation deliverable | Documentation | DevOps/Database | L4375–L4379 | The storage strategy covers user uploads. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The storage strategy covers user uploads.” |
| REQ-083.05 | MUST | Pre-implementation deliverable | Documentation | DevOps/Database | L4377; L4381 | The storage strategy covers blog images. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The storage strategy covers blog images.” |
| REQ-083.06 | MUST | Pre-implementation deliverable | Documentation | DevOps/Database | L4377; L4383 | The storage strategy covers documents. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The storage strategy covers documents.” |
| REQ-083.07 | MUST | Pre-implementation deliverable | Documentation | DevOps/Database | L4377; L4385 | The storage strategy covers system files. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The storage strategy covers system files.” |
| REQ-083.08 | MUST | Pre-implementation deliverable | Documentation | DevOps/Database | L4377; L4387 | The storage strategy covers backups. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The storage strategy covers backups.” |
| REQ-083.09 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Database | L4389–L4395 | The storage strategy evaluates object storage, CDN integration, and cost optimization. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The storage strategy evaluates object storage, CDN integration, and cost optimization.” |

### REQ-084 — Part 9 / Email and OTP Infrastructure

**Structural source span:** L4399–L4459  
**Atomic child count:** 14

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-084.01 | MUST | V1 | Non-functional | Backend/Infrastructure | L4399–L4401 | The system uses reliable email delivery. | A defined measurement or design review confirms this statement: “The system uses reliable email delivery.” |
| REQ-084.02 | MUST | Pre-implementation deliverable | Documentation | Backend/Infrastructure | L4403–L4413 | Email providers are evaluated for free limits, deliverability, API quality, reliability, and scalability. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Email providers are evaluated for free limits, deliverability, API quality, reliability, and scalability.” |
| REQ-084.03 | MUST | V1 | Functional | Backend/Infrastructure | L4415–L4417 | Email infrastructure supports account verification. | An acceptance test confirms this statement: “Email infrastructure supports account verification.” |
| REQ-084.04 | MUST | V1 | Functional | Backend/Infrastructure | L4415; L4419 | Email infrastructure supports password reset. | An acceptance test confirms this statement: “Email infrastructure supports password reset.” |
| REQ-084.05 | MUST | V1 | Functional | Backend/Infrastructure | L4415; L4421 | Email infrastructure supports security notifications. | An acceptance test confirms this statement: “Email infrastructure supports security notifications.” |
| REQ-084.06 | MUST | V1 | Functional | Backend/Infrastructure | L4415; L4423 | Email infrastructure supports withdrawal notifications. | An acceptance test confirms this statement: “Email infrastructure supports withdrawal notifications.” |
| REQ-084.07 | MUST | V1 | Functional | Backend/Infrastructure | L4415; L4425 | Email infrastructure supports support updates. | An acceptance test confirms this statement: “Email infrastructure supports support updates.” |
| REQ-084.08 | MUST | Future | Functional | Backend/Infrastructure | L4415; L4427 | Email infrastructure can support future marketing communications. | An acceptance test confirms this statement: “Email infrastructure can support future marketing communications.” |
| REQ-084.09 | MUST | V1 | Security | Backend/Infrastructure | L4431–L4435 | OTP generation is secure. | Security review and negative-path tests confirm this statement: “OTP generation is secure.” |
| REQ-084.10 | MUST | V1 | Security | Backend/Infrastructure | L4433; L4437 | OTP codes expire. | Security review and negative-path tests confirm this statement: “OTP codes expire.” |
| REQ-084.11 | MUST | V1 | Security | Backend/Infrastructure | L4433; L4439 | OTP use is rate limited. | Security review and negative-path tests confirm this statement: “OTP use is rate limited.” |
| REQ-084.12 | MUST | V1 | Security | Backend/Infrastructure | L4433; L4441 | OTP use has abuse prevention. | Security review and negative-path tests confirm this statement: “OTP use has abuse prevention.” |
| REQ-084.13 | MUST | V1 | Governance | Backend/Infrastructure | L4433; L4443 | OTP activity is logged. | Workflow and audit evidence confirm this statement: “OTP activity is logged.” |
| REQ-084.14 | SHOULD | Pre-implementation deliverable | Documentation | Backend/Infrastructure | L4445–L4459 | The OTP recommendation evaluates email OTP, SMS OTP, and third-party verification against cost, reliability, and target countries. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The OTP recommendation evaluates email OTP, SMS OTP, and third-party verification against cost, reliability, and target countries.” |

### REQ-085 — Part 9 / Background Jobs and Environment Management

**Structural source span:** L4463–L4517  
**Atomic child count:** 9

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-085.01 | SHOULD | V1 | Operational | Backend/DevOps | L4463–L4481 | A reliable background-job system handles email, survey synchronization, reward updates, notifications, analytics, and scheduled tasks. | Operational execution or recovery evidence confirms this statement: “A reliable background-job system handles email, survey synchronization, reward updates, notifications, analytics, and scheduled tasks.” |
| REQ-085.02 | MUST | V1 | Operational | Backend/DevOps | L4483–L4485 | The job system supports retry handling. | Operational execution or recovery evidence confirms this statement: “The job system supports retry handling.” |
| REQ-085.03 | MUST | V1 | Operational | Backend/DevOps | L4483; L4487 | The job system supports failure tracking. | Operational execution or recovery evidence confirms this statement: “The job system supports failure tracking.” |
| REQ-085.04 | MUST | V1 | Operational | Backend/DevOps | L4483; L4489 | The job system supports monitoring. | Operational execution or recovery evidence confirms this statement: “The job system supports monitoring.” |
| REQ-085.05 | MUST | V1 | Operational | Backend/DevOps | L4483; L4491 | The job system supports queue management. | Operational execution or recovery evidence confirms this statement: “The job system supports queue management.” |
| REQ-085.06 | MUST | V1 | Operational | Backend/DevOps | L4495–L4509 | The project has separate development, testing/staging, and production environments. | Operational execution or recovery evidence confirms this statement: “The project has separate development, testing/staging, and production environments.” |
| REQ-085.07 | MUST | V1 | Operational | Backend/DevOps | L4511–L4513 | Each environment has separate configuration. | Operational execution or recovery evidence confirms this statement: “Each environment has separate configuration.” |
| REQ-085.08 | MUST | V1 | Security | Backend/DevOps | L4511; L4515 | Each environment has separate credentials. | Security review and negative-path tests confirm this statement: “Each environment has separate credentials.” |
| REQ-085.09 | MUST | V1 | Security | Backend/DevOps | L4511; L4517 | Each environment has appropriate security controls. | Security review and negative-path tests confirm this statement: “Each environment has appropriate security controls.” |

### REQ-086 — Part 9 / Version Control and CI/CD

**Structural source span:** L4521–L4553  
**Atomic child count:** 11

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-086.01 | MUST | V1 | Operational | DevOps | L4521–L4527 | The project uses a Git-based workflow. | Operational execution or recovery evidence confirms this statement: “The project uses a Git-based workflow.” |
| REQ-086.02 | MUST | V1 | Operational | DevOps | L4525; L4529 | Commits are meaningful. | Operational execution or recovery evidence confirms this statement: “Commits are meaningful.” |
| REQ-086.03 | MUST | V1 | Operational | DevOps | L4525; L4531 | The project defines a branch strategy. | Operational execution or recovery evidence confirms this statement: “The project defines a branch strategy.” |
| REQ-086.04 | MUST | V1 | Operational | DevOps | L4525; L4533 | Code reviews are used where applicable. | Operational execution or recovery evidence confirms this statement: “Code reviews are used where applicable.” |
| REQ-086.05 | MUST | V1 | Operational | DevOps | L4525; L4535 | Releases are tagged. | Operational execution or recovery evidence confirms this statement: “Releases are tagged.” |
| REQ-086.06 | SHOULD | Pre-implementation deliverable | Documentation | DevOps | L4539–L4541 | An automated deployment pipeline is designed. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “An automated deployment pipeline is designed.” |
| REQ-086.07 | SHOULD | V1 | Operational | DevOps | L4543–L4545 | The CI/CD pipeline validates code. | Operational execution or recovery evidence confirms this statement: “The CI/CD pipeline validates code.” |
| REQ-086.08 | SHOULD | V1 | Operational | DevOps | L4543; L4547 | The CI/CD pipeline runs tests. | Operational execution or recovery evidence confirms this statement: “The CI/CD pipeline runs tests.” |
| REQ-086.09 | SHOULD | V1 | Operational | DevOps | L4543; L4549 | The CI/CD pipeline runs the build process. | Operational execution or recovery evidence confirms this statement: “The CI/CD pipeline runs the build process.” |
| REQ-086.10 | SHOULD | V1 | Operational | DevOps | L4543; L4551 | The CI/CD pipeline deploys releases. | Operational execution or recovery evidence confirms this statement: “The CI/CD pipeline deploys releases.” |
| REQ-086.11 | SHOULD | V1 | Operational | DevOps | L4543; L4553 | The CI/CD pipeline supports rollback. | Operational execution or recovery evidence confirms this statement: “The CI/CD pipeline supports rollback.” |

### REQ-087 — Part 9 / Security Operations, Monitoring, and Logging

**Structural source span:** L4557–L4623  
**Atomic child count:** 21

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-087.01 | MUST | V1 | Security | DevOps/Security | L4559; L4561 | Infrastructure security includes secret management. | Security review and negative-path tests confirm this statement: “Infrastructure security includes secret management.” |
| REQ-087.02 | MUST | V1 | Security | DevOps/Security | L4559; L4563 | Infrastructure security includes access control. | Security review and negative-path tests confirm this statement: “Infrastructure security includes access control.” |
| REQ-087.03 | MUST | V1 | Security | DevOps/Security | L4559; L4565 | Infrastructure security includes firewall rules where applicable. | Security review and negative-path tests confirm this statement: “Infrastructure security includes firewall rules where applicable.” |
| REQ-087.04 | MUST | V1 | Security | DevOps/Security | L4559; L4567 | Infrastructure security includes secure environment variables. | Security review and negative-path tests confirm this statement: “Infrastructure security includes secure environment variables.” |
| REQ-087.05 | MUST | V1 | Security | DevOps/Security | L4559; L4569 | Infrastructure security includes dependency monitoring. | Security review and negative-path tests confirm this statement: “Infrastructure security includes dependency monitoring.” |
| REQ-087.06 | MUST | V1 | Security | DevOps/Security | L4559; L4571 | Infrastructure security includes regular updates. | Security review and negative-path tests confirm this statement: “Infrastructure security includes regular updates.” |
| REQ-087.07 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4579 | Monitoring covers application health. | Operational execution or recovery evidence confirms this statement: “Monitoring covers application health.” |
| REQ-087.08 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4581 | Monitoring covers application errors. | Operational execution or recovery evidence confirms this statement: “Monitoring covers application errors.” |
| REQ-087.09 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4583 | Monitoring covers response times. | Operational execution or recovery evidence confirms this statement: “Monitoring covers response times.” |
| REQ-087.10 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4585 | Monitoring covers failed requests. | Operational execution or recovery evidence confirms this statement: “Monitoring covers failed requests.” |
| REQ-087.11 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4589 | Monitoring covers CPU utilization. | Operational execution or recovery evidence confirms this statement: “Monitoring covers CPU utilization.” |
| REQ-087.12 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4591 | Monitoring covers memory utilization. | Operational execution or recovery evidence confirms this statement: “Monitoring covers memory utilization.” |
| REQ-087.13 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4593 | Monitoring covers storage utilization. | Operational execution or recovery evidence confirms this statement: “Monitoring covers storage utilization.” |
| REQ-087.14 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4595 | Monitoring covers database performance. | Operational execution or recovery evidence confirms this statement: “Monitoring covers database performance.” |
| REQ-087.15 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4599 | Monitoring covers signups. | Operational execution or recovery evidence confirms this statement: “Monitoring covers signups.” |
| REQ-087.16 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4601 | Monitoring covers survey activity. | Operational execution or recovery evidence confirms this statement: “Monitoring covers survey activity.” |
| REQ-087.17 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4603 | Monitoring covers withdrawals. | Operational execution or recovery evidence confirms this statement: “Monitoring covers withdrawals.” |
| REQ-087.18 | SHOULD | V1 | Operational | DevOps/Security | L4577; L4605 | Monitoring covers revenue. | Operational execution or recovery evidence confirms this statement: “Monitoring covers revenue.” |
| REQ-087.19 | MUST | V1 | Operational | DevOps/Security | L4609–L4611 | The platform implements structured logging. | Operational execution or recovery evidence confirms this statement: “The platform implements structured logging.” |
| REQ-087.20 | SHOULD | V1 | Operational | DevOps/Security | L4613–L4621 | Logs support investigation of errors, security events, user actions, and integration failures. | Operational execution or recovery evidence confirms this statement: “Logs support investigation of errors, security events, user actions, and integration failures.” |
| REQ-087.21 | MUST | V1 | Compliance | DevOps/Security | L4623 | Logs avoid unnecessary sensitive information. | An acceptance test confirms this statement: “Logs avoid unnecessary sensitive information.” |

### REQ-088 — Part 9 / Backup, Disaster Recovery, and Scaling

**Structural source span:** L4627–L4689  
**Atomic child count:** 15

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-088.01 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4627–L4629 | Create a complete backup plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Create a complete backup plan.” |
| REQ-088.02 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4631–L4633 | The backup plan covers database backups. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup plan covers database backups.” |
| REQ-088.03 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4631; L4635 | The backup plan covers file backups. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup plan covers file backups.” |
| REQ-088.04 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4631; L4637 | The backup plan covers configuration backups. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup plan covers configuration backups.” |
| REQ-088.05 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4639–L4641 | The backup plan defines backup frequency. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup plan defines backup frequency.” |
| REQ-088.06 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4639; L4643 | The backup plan defines storage location. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup plan defines storage location.” |
| REQ-088.07 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4639; L4645 | The backup plan defines recovery process. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup plan defines recovery process.” |
| REQ-088.08 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4639; L4647 | The backup plan defines testing procedure. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The backup plan defines testing procedure.” |
| REQ-088.09 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4651–L4653 | Create a disaster-recovery strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Create a disaster-recovery strategy.” |
| REQ-088.10 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4655–L4657 | The disaster-recovery strategy defines RTO. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The disaster-recovery strategy defines RTO.” |
| REQ-088.11 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4655; L4659 | The disaster-recovery strategy defines RPO. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The disaster-recovery strategy defines RPO.” |
| REQ-088.12 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4655; L4661 | The disaster-recovery strategy defines emergency procedures. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The disaster-recovery strategy defines emergency procedures.” |
| REQ-088.13 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4655; L4663 | The disaster-recovery strategy defines responsible roles. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The disaster-recovery strategy defines responsible roles.” |
| REQ-088.14 | SHOULD | V1 | Non-functional | DevOps/Operations | L4667–L4687 | The architecture supports growth from thousands to hundreds of thousands to millions of users. | A defined measurement or design review confirms this statement: “The architecture supports growth from thousands to hundreds of thousands to millions of users.” |
| REQ-088.15 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Operations | L4689 | The scaling plan explains when infrastructure changes become necessary. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The scaling plan explains when infrastructure changes become necessary.” |

### REQ-089 — Part 9 / Cost Optimization and Deployment Documentation

**Structural source span:** L4693–L4731  
**Atomic child count:** 12

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-089.01 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Operations | L4693–L4703 | Infrastructure planning considers free-tier use, avoidance of unnecessary services, efficient resources, and expense monitoring. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Infrastructure planning considers free-tier use, avoidance of unnecessary services, efficient resources, and expense monitoring.” |
| REQ-089.02 | SHOULD | Pre-implementation deliverable | Documentation | DevOps/Operations | L4705 | Every infrastructure recommendation states estimated operational impact. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every infrastructure recommendation states estimated operational impact.” |
| REQ-089.03 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4713 | Generate an Infrastructure Architecture Diagram. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an Infrastructure Architecture Diagram.” |
| REQ-089.04 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4715 | Generate a Hosting Setup Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Hosting Setup Guide.” |
| REQ-089.05 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4717 | Generate an Environment Setup Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate an Environment Setup Guide.” |
| REQ-089.06 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4719 | Generate a Deployment Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Deployment Guide.” |
| REQ-089.07 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4721 | Generate a Database Setup Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Database Setup Guide.” |
| REQ-089.08 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4723 | Generate a Backup Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Backup Guide.” |
| REQ-089.09 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4725 | Generate a Monitoring Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Monitoring Guide.” |
| REQ-089.10 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4727 | Generate a Security Checklist. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Security Checklist.” |
| REQ-089.11 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4729 | Generate a Scaling Plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Scaling Plan.” |
| REQ-089.12 | MUST | Pre-implementation deliverable | Documentation | DevOps/Operations | L4711; L4731 | Generate a Cost Optimization Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Generate a Cost Optimization Guide.” |

### REQ-090 — Part 9 / Final Infrastructure Directive

**Structural source span:** L4735–L4743  
**Atomic child count:** 4

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-090.01 | MUST | Pre-implementation deliverable | Governance | DevOps/Architecture | L4735–L4737 | Infrastructure design respects both global-platform quality and startup realities. | Workflow and audit evidence confirm this statement: “Infrastructure design respects both global-platform quality and startup realities.” |
| REQ-090.02 | MUST | Pre-implementation deliverable | Governance | DevOps/Architecture | L4739 | Infrastructure is not over-engineered too early. | Workflow and audit evidence confirm this statement: “Infrastructure is not over-engineered too early.” |
| REQ-090.03 | MUST | Pre-implementation deliverable | Governance | DevOps/Architecture | L4741 | Infrastructure is not a fragile prototype. | Workflow and audit evidence confirm this statement: “Infrastructure is not a fragile prototype.” |
| REQ-090.04 | MUST | Pre-implementation deliverable | Governance | DevOps/Architecture | L4743 | Infrastructure starts cheaply and has a professional growth path. | Workflow and audit evidence confirm this statement: “Infrastructure starts cheaply and has a professional growth path.” |

### REQ-091 — Part 10 / AI Role and Master Execution Rule

**Structural source span:** L4757–L4795  
**Atomic child count:** 4

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-091.01 | MUST | Pre-implementation deliverable | Governance | Shared governance | L4757–L4779 | The delivery agent acts as the combined product, development, architecture, QA, security, operations, marketing, and documentation organization. | Workflow and audit evidence confirm this statement: “The delivery agent acts as the combined product, development, architecture, QA, security, operations, marketing, and documentation organization.” |
| REQ-091.02 | MUST | Pre-implementation deliverable | Governance | Shared governance | L4781–L4783 | The objective is a production-ready global rewards platform rather than code generation alone. | Workflow and audit evidence confirm this statement: “The objective is a production-ready global rewards platform rather than code generation alone.” |
| REQ-091.03 | MUST | Pre-implementation deliverable | Governance | Shared governance | L4787–L4793 | Before implementation, the agent understands, analyzes, challenges, improves, and documents the project. | Workflow and audit evidence confirm this statement: “Before implementation, the agent understands, analyzes, challenges, improves, and documents the project.” |
| REQ-091.04 | MUST | Pre-implementation deliverable | Governance | Shared governance | L4793–L4795 | Coding does not start immediately and follows the prescribed execution order. | Workflow and audit evidence confirm this statement: “Coding does not start immediately and follows the prescribed execution order.” |

### REQ-092 — Part 10 / Business, Product, System, and UI Design Steps

**Structural source span:** L4799–L4891  
**Atomic child count:** 31

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-092.01 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4803 | Business analysis produces a Complete Business Blueprint. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces a Complete Business Blueprint.” |
| REQ-092.02 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4805 | Business analysis produces Market Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces Market Analysis.” |
| REQ-092.03 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4807 | Business analysis produces Competitive Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces Competitive Analysis.” |
| REQ-092.04 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4809 | Business analysis produces a Revenue Model. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces a Revenue Model.” |
| REQ-092.05 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4811 | Business analysis produces User Psychology Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces User Psychology Analysis.” |
| REQ-092.06 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4813 | Business analysis produces Risk Analysis. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces Risk Analysis.” |
| REQ-092.07 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4815 | Business analysis produces a Growth Strategy. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces a Growth Strategy.” |
| REQ-092.08 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4801; L4817 | Business analysis produces an Operational Model. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Business analysis produces an Operational Model.” |
| REQ-092.09 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4819–L4821 | The Business Blueprint targets at least 100 pages. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The Business Blueprint targets at least 100 pages.” |
| REQ-092.10 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4827; L4829 | Product definition produces a Product Requirements Document. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Product definition produces a Product Requirements Document.” |
| REQ-092.11 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4827; L4831 | Product definition produces User Stories. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Product definition produces User Stories.” |
| REQ-092.12 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4827; L4833 | Product definition produces User Journeys. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Product definition produces User Journeys.” |
| REQ-092.13 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4827; L4835 | Product definition produces Feature Specifications. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Product definition produces Feature Specifications.” |
| REQ-092.14 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4827; L4837 | Product definition produces page-by-page Product Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Product definition produces page-by-page Product Documentation.” |
| REQ-092.15 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4827; L4839 | Product definition produces User Flow Diagrams. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Product definition produces User Flow Diagrams.” |
| REQ-092.16 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4841–L4843 | Every feature specification states purpose. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every feature specification states purpose.” |
| REQ-092.17 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4841; L4845 | Every feature specification states user benefit. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every feature specification states user benefit.” |
| REQ-092.18 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4841; L4847 | Every feature specification states business reason. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every feature specification states business reason.” |
| REQ-092.19 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4841; L4849 | Every feature specification states technical requirement. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every feature specification states technical requirement.” |
| REQ-092.20 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4855; L4857 | System design produces System Architecture. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “System design produces System Architecture.” |
| REQ-092.21 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4855; L4859 | System design produces Database Architecture. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “System design produces Database Architecture.” |
| REQ-092.22 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4855; L4861 | System design produces API Architecture. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “System design produces API Architecture.” |
| REQ-092.23 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4855; L4863 | System design produces Security Architecture. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “System design produces Security Architecture.” |
| REQ-092.24 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4855; L4865 | System design produces Infrastructure Architecture. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “System design produces Infrastructure Architecture.” |
| REQ-092.25 | MUST | Pre-implementation deliverable | Governance | Shared governance | L4867–L4873 | Architecture is self-reviewed, weaknesses are found, and improvements are made before implementation. | Workflow and audit evidence confirm this statement: “Architecture is self-reviewed, weaknesses are found, and improvements are made before implementation.” |
| REQ-092.26 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L4879; L4881 | UI/UX design produces a Design System. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “UI/UX design produces a Design System.” |
| REQ-092.27 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L4879; L4883 | UI/UX design produces Wireframes. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “UI/UX design produces Wireframes.” |
| REQ-092.28 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L4879; L4885 | UI/UX design produces Screen Specifications. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “UI/UX design produces Screen Specifications.” |
| REQ-092.29 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L4879; L4887 | UI/UX design produces a Component Library. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “UI/UX design produces a Component Library.” |
| REQ-092.30 | MUST | Pre-implementation deliverable | Documentation | Frontend handoff | L4879; L4889 | UI/UX design produces Responsive Guidelines. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “UI/UX design produces Responsive Guidelines.” |
| REQ-092.31 | MUST | Pre-implementation deliverable | Non-functional | Frontend handoff | L4891 | UI/UX design makes the product feel premium and trustworthy. | A defined measurement or design review confirms this statement: “UI/UX design makes the product feel premium and trustworthy.” |

### REQ-093 — Part 10 / Development Roadmap and Controlled Phases

**Structural source span:** L4895–L5063  
**Atomic child count:** 19

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-093.01 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4895–L4897 | Create an interactive development roadmap. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Create an interactive development roadmap.” |
| REQ-093.02 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4899; L4901 | Every roadmap task includes a name. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every roadmap task includes a name.” |
| REQ-093.03 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4899; L4903 | Every roadmap task includes a description. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every roadmap task includes a description.” |
| REQ-093.04 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4899; L4905 | Every roadmap task includes priority. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every roadmap task includes priority.” |
| REQ-093.05 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4899; L4907 | Every roadmap task includes dependencies. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every roadmap task includes dependencies.” |
| REQ-093.06 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4899; L4909 | Every roadmap task includes estimated complexity. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every roadmap task includes estimated complexity.” |
| REQ-093.07 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4899; L4911 | Every roadmap task includes status. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every roadmap task includes status.” |
| REQ-093.08 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4899; L4913 | Every roadmap task includes acceptance criteria. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Every roadmap task includes acceptance criteria.” |
| REQ-093.09 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L4915–L4927 | The roadmap supports the suggested Not Started, Planning, Development, Testing, Review, and Completed statuses. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The roadmap supports the suggested Not Started, Planning, Development, Testing, Review, and Completed statuses.” |
| REQ-093.10 | SHOULD | Pre-implementation deliverable | Documentation | Shared governance | L4929 | The roadmap is compatible with project-management tools such as Notion. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “The roadmap is compatible with project-management tools such as Notion.” |
| REQ-093.11 | SHOULD | Pre-implementation deliverable | Governance | Shared governance | L4933–L4935 | Development occurs in controlled phases. | Workflow and audit evidence confirm this statement: “Development occurs in controlled phases.” |
| REQ-093.12 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4939–L4951 | Foundation phase covers project structure, authentication, database, core configuration, and security foundations. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Foundation phase covers project structure, authentication, database, core configuration, and security foundations.” |
| REQ-093.13 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4955–L4969 | User-platform phase covers registration, email verification, login, dashboard, profile, and wallet foundation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “User-platform phase covers registration, email verification, login, dashboard, profile, and wallet foundation.” |
| REQ-093.14 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4973–L4985 | Rewards-engine phase covers points, USD conversion, wallet transactions, balance maturity, and reward history. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Rewards-engine phase covers points, USD conversion, wallet transactions, balance maturity, and reward history.” |
| REQ-093.15 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L4989–L4999 | Survey-system phase covers survey marketplace, provider integration, survey tracking, and reward synchronization. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Survey-system phase covers survey marketplace, provider integration, survey tracking, and reward synchronization.” |
| REQ-093.16 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5003–L5013 | Withdrawal phase covers requests, payment methods, processing workflow, and history tracking. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Withdrawal phase covers requests, payment methods, processing workflow, and history tracking.” |
| REQ-093.17 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5017–L5033 | Admin ERP phase covers Super Admin, user management, limit templates, permissions, settings, analytics, and audit logs. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Admin ERP phase covers Super Admin, user management, limit templates, permissions, settings, analytics, and audit logs.” |
| REQ-093.18 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5037–L5049 | Growth phase covers blog, SEO, content management, marketing integrations, and analytics. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Growth phase covers blog, SEO, content management, marketing integrations, and analytics.” |
| REQ-093.19 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5053–L5063 | Optimization phase improves performance, security, user experience, and scalability. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Optimization phase improves performance, security, user experience, and scalability.” |

### REQ-094 — Part 10 / Code Quality, Configuration, and Testing

**Structural source span:** L5067–L5139  
**Atomic child count:** 17

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-094.01 | MUST | V1 | Governance | Shared engineering | L5067–L5071 | Every implementation follows clean-code principles. | Workflow and audit evidence confirm this statement: “Every implementation follows clean-code principles.” |
| REQ-094.02 | MUST | V1 | Governance | Shared engineering | L5069; L5073 | Every implementation uses clear naming conventions. | Workflow and audit evidence confirm this statement: “Every implementation uses clear naming conventions.” |
| REQ-094.03 | MUST | V1 | Governance | Shared engineering | L5069; L5075 | Every implementation uses modular architecture. | Workflow and audit evidence confirm this statement: “Every implementation uses modular architecture.” |
| REQ-094.04 | MUST | V1 | Governance | Shared engineering | L5069; L5077 | Every implementation provides proper error handling. | Workflow and audit evidence confirm this statement: “Every implementation provides proper error handling.” |
| REQ-094.05 | MUST | V1 | Security | Shared engineering | L5069; L5079 | Every implementation follows security best practices. | Security review and negative-path tests confirm this statement: “Every implementation follows security best practices.” |
| REQ-094.06 | MUST | V1 | Governance | Shared engineering | L5069; L5081 | Every implementation follows documentation standards. | Workflow and audit evidence confirm this statement: “Every implementation follows documentation standards.” |
| REQ-094.07 | MUST | V1 | Governance | Shared engineering | L5083–L5085 | Implementations avoid quick hacks. | Workflow and audit evidence confirm this statement: “Implementations avoid quick hacks.” |
| REQ-094.08 | MUST | V1 | Governance | Shared engineering | L5083; L5087 | Implementations avoid hardcoded business rules. | Workflow and audit evidence confirm this statement: “Implementations avoid hardcoded business rules.” |
| REQ-094.09 | MUST | V1 | Governance | Shared engineering | L5083; L5089 | Implementations avoid duplicate logic. | Workflow and audit evidence confirm this statement: “Implementations avoid duplicate logic.” |
| REQ-094.10 | MUST | V1 | Governance | Shared engineering | L5083; L5091 | Implementations avoid unnecessary complexity. | Workflow and audit evidence confirm this statement: “Implementations avoid unnecessary complexity.” |
| REQ-094.11 | MUST | V1 | Business Rule | Shared engineering | L5095–L5097 | Important business values are configurable. | An acceptance test confirms this statement: “Important business values are configurable.” |
| REQ-094.12 | MUST | V1 | Business Rule | Shared engineering | L5113 | Values likely to change are not hardcoded. | An acceptance test confirms this statement: “Values likely to change are not hardcoded.” |
| REQ-094.13 | MUST | V1 | Governance | Shared engineering | L5117–L5123 | Every major feature has functional testing. | Workflow and audit evidence confirm this statement: “Every major feature has functional testing.” |
| REQ-094.14 | MUST | V1 | Security | Shared engineering | L5119; L5125–L5127 | Every major feature has security testing. | Security review and negative-path tests confirm this statement: “Every major feature has security testing.” |
| REQ-094.15 | MUST | V1 | Governance | Shared engineering | L5119; L5129–L5131 | Every major feature has performance testing. | Workflow and audit evidence confirm this statement: “Every major feature has performance testing.” |
| REQ-094.16 | MUST | V1 | Governance | Frontend handoff | L5119; L5133–L5135 | Every major feature has user-experience testing. | Workflow and audit evidence confirm this statement: “Every major feature has user-experience testing.” |
| REQ-094.17 | MUST | V1 | Governance | Shared engineering | L5119; L5137–L5139 | Every major feature has regression testing. | Workflow and audit evidence confirm this statement: “Every major feature has regression testing.” |

### REQ-095 — Part 10 / Documentation Requirements

**Structural source span:** L5143–L5185  
**Atomic child count:** 16

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-095.01 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5143–L5145 | Project documentation is complete and maintained. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Project documentation is complete and maintained.” |
| REQ-095.02 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5149; L5151 | Required business documentation includes the Business Blueprint. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required business documentation includes the Business Blueprint.” |
| REQ-095.03 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5149; L5153 | Required business documentation includes Strategy Documents. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required business documentation includes Strategy Documents.” |
| REQ-095.04 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5149; L5155 | Required business documentation includes the Growth Plan. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required business documentation includes the Growth Plan.” |
| REQ-095.05 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5157; L5159 | Required technical documentation includes Architecture Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required technical documentation includes Architecture Documentation.” |
| REQ-095.06 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5157; L5161 | Required technical documentation includes Database Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required technical documentation includes Database Documentation.” |
| REQ-095.07 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5157; L5163 | Required technical documentation includes API Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required technical documentation includes API Documentation.” |
| REQ-095.08 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5157; L5165 | Required technical documentation includes Security Documentation. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required technical documentation includes Security Documentation.” |
| REQ-095.09 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5167; L5169 | Required operational documentation includes the Admin Manual. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required operational documentation includes the Admin Manual.” |
| REQ-095.10 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5167; L5171 | Required operational documentation includes the User Manual. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required operational documentation includes the User Manual.” |
| REQ-095.11 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5167; L5173 | Required operational documentation includes the Support Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required operational documentation includes the Support Guide.” |
| REQ-095.12 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5167; L5175 | Required operational documentation includes the Deployment Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required operational documentation includes the Deployment Guide.” |
| REQ-095.13 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5177; L5179 | Required developer documentation includes the README. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required developer documentation includes the README.” |
| REQ-095.14 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5177; L5181 | Required developer documentation includes the Installation Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required developer documentation includes the Installation Guide.” |
| REQ-095.15 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5177; L5183 | Required developer documentation includes the Contribution Guide. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required developer documentation includes the Contribution Guide.” |
| REQ-095.16 | MUST | Pre-implementation deliverable | Documentation | Shared governance | L5177; L5185 | Required developer documentation includes Code Standards. | The named artifact exists, addresses this statement, and is traceable to the cited lines: “Required developer documentation includes Code Standards.” |

### REQ-096 — Part 10 / Super Admin and Security Principles

**Structural source span:** L5189–L5243  
**Atomic child count:** 21

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-096.01 | MUST | V1 | Functional | Backend/Admin ERP | L5189–L5191 | The Super Admin Panel is the control center of EarnPearls. | An acceptance test confirms this statement: “The Super Admin Panel is the control center of EarnPearls.” |
| REQ-096.02 | SHOULD | V1 | Functional | Backend/Admin ERP | L5193 | Business operations are manageable without code changes whenever possible. | An acceptance test confirms this statement: “Business operations are manageable without code changes whenever possible.” |
| REQ-096.03 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5197 | Super Admin controls users. | An acceptance test confirms this statement: “Super Admin controls users.” |
| REQ-096.04 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5199 | Super Admin controls permissions. | An acceptance test confirms this statement: “Super Admin controls permissions.” |
| REQ-096.05 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5201 | Super Admin controls restrictions. | An acceptance test confirms this statement: “Super Admin controls restrictions.” |
| REQ-096.06 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5203 | Super Admin controls settings. | An acceptance test confirms this statement: “Super Admin controls settings.” |
| REQ-096.07 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5205 | Super Admin controls content. | An acceptance test confirms this statement: “Super Admin controls content.” |
| REQ-096.08 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5207 | Super Admin controls rewards. | An acceptance test confirms this statement: “Super Admin controls rewards.” |
| REQ-096.09 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5209 | Super Admin controls withdrawals. | An acceptance test confirms this statement: “Super Admin controls withdrawals.” |
| REQ-096.10 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5211 | Super Admin controls reports. | An acceptance test confirms this statement: “Super Admin controls reports.” |
| REQ-096.11 | SHOULD | V1 | Functional | Backend/Admin ERP | L5195; L5213 | Super Admin controls analytics. | An acceptance test confirms this statement: “Super Admin controls analytics.” |
| REQ-096.12 | MUST | V1 | Security | Backend/Admin ERP | L5215–L5217 | Every sensitive action has authorization checks. | Security review and negative-path tests confirm this statement: “Every sensitive action has authorization checks.” |
| REQ-096.13 | MUST | V1 | Governance | Backend/Admin ERP | L5215; L5219 | Every sensitive action has audit logging. | Workflow and audit evidence confirm this statement: “Every sensitive action has audit logging.” |
| REQ-096.14 | MUST | V1 | Security | Backend/Admin ERP | L5215; L5221 | Every sensitive action has security protection. | Security review and negative-path tests confirm this statement: “Every sensitive action has security protection.” |
| REQ-096.15 | MUST | V1 | Security | Backend/Admin ERP | L5225–L5229 | Security exists from the beginning rather than being optional. | Security review and negative-path tests confirm this statement: “Security exists from the beginning rather than being optional.” |
| REQ-096.16 | MUST | V1 | Security | Backend/Admin ERP | L5231; L5233 | Security design addresses user privacy. | Security review and negative-path tests confirm this statement: “Security design addresses user privacy.” |
| REQ-096.17 | MUST | V1 | Security | Backend/Admin ERP | L5231; L5235 | Security design addresses financial-data protection. | Security review and negative-path tests confirm this statement: “Security design addresses financial-data protection.” |
| REQ-096.18 | MUST | V1 | Security | Backend/Admin ERP | L5231; L5237 | Security design addresses account security. | Security review and negative-path tests confirm this statement: “Security design addresses account security.” |
| REQ-096.19 | MUST | V1 | Security | Backend/Admin ERP | L5231; L5239 | Security design addresses fraud prevention. | Security review and negative-path tests confirm this statement: “Security design addresses fraud prevention.” |
| REQ-096.20 | MUST | V1 | Security | Backend/Admin ERP | L5231; L5241 | Security design addresses abuse prevention. | Security review and negative-path tests confirm this statement: “Security design addresses abuse prevention.” |
| REQ-096.21 | MUST | V1 | Security | Backend/Admin ERP | L5231; L5243 | Security design addresses secure integrations. | Security review and negative-path tests confirm this statement: “Security design addresses secure integrations.” |

### REQ-097 — Part 10 / Self-Review, Communication, and Final Command

**Structural source span:** L5247–L5329  
**Atomic child count:** 24

| ID | Modality | Target | Type | Layer | Exact source | Atomic requirement | Acceptance criterion |
|---|---|---|---|---|---|---|---|
| REQ-097.01 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5247–L5249 | Every major output is self-reviewed before finalization. | Workflow and audit evidence confirm this statement: “Every major output is self-reviewed before finalization.” |
| REQ-097.02 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5251; L5253 | Self-review checks scalability. | Workflow and audit evidence confirm this statement: “Self-review checks scalability.” |
| REQ-097.03 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5251; L5255 | Self-review checks security. | Workflow and audit evidence confirm this statement: “Self-review checks security.” |
| REQ-097.04 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5251; L5257 | Self-review checks maintainability. | Workflow and audit evidence confirm this statement: “Self-review checks maintainability.” |
| REQ-097.05 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5251; L5259 | Self-review checks user-friendliness. | Workflow and audit evidence confirm this statement: “Self-review checks user-friendliness.” |
| REQ-097.06 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5251; L5261 | Self-review checks cost-effectiveness. | Workflow and audit evidence confirm this statement: “Self-review checks cost-effectiveness.” |
| REQ-097.07 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5251; L5263 | Self-review checks future-readiness. | Workflow and audit evidence confirm this statement: “Self-review checks future-readiness.” |
| REQ-097.08 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5251; L5265 | Self-review asks whether a better alternative exists. | Workflow and audit evidence confirm this statement: “Self-review asks whether a better alternative exists.” |
| REQ-097.09 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5267 | A better alternative identified by self-review is incorporated. | Workflow and audit evidence confirm this statement: “A better alternative identified by self-review is incorporated.” |
| REQ-097.10 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5273; L5275 | EarnPearls work is structured. | Workflow and audit evidence confirm this statement: “EarnPearls work is structured.” |
| REQ-097.11 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5273; L5277 | EarnPearls work is professional. | Workflow and audit evidence confirm this statement: “EarnPearls work is professional.” |
| REQ-097.12 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5273; L5279 | EarnPearls work explains decisions. | Workflow and audit evidence confirm this statement: “EarnPearls work explains decisions.” |
| REQ-097.13 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5273; L5281 | EarnPearls work identifies risks. | Workflow and audit evidence confirm this statement: “EarnPearls work identifies risks.” |
| REQ-097.14 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5273; L5283 | EarnPearls work suggests improvements. | Workflow and audit evidence confirm this statement: “EarnPearls work suggests improvements.” |
| REQ-097.15 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5273; L5285 | EarnPearls work does not blindly follow assumptions. | Workflow and audit evidence confirm this statement: “EarnPearls work does not blindly follow assumptions.” |
| REQ-097.16 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5287–L5289 | Focused questions are asked before major decisions when uncertainty exists. | Workflow and audit evidence confirm this statement: “Focused questions are asked before major decisions when uncertainty exists.” |
| REQ-097.17 | MUST | V1 | Functional | Shared governance | L5295; L5297 | The platform supports survey participation. | An acceptance test confirms this statement: “The platform supports survey participation.” |
| REQ-097.18 | MUST | V1 | Functional | Shared governance | L5295; L5299 | The platform supports reward earning. | An acceptance test confirms this statement: “The platform supports reward earning.” |
| REQ-097.19 | MUST | V1 | Functional | Shared governance | L5295; L5301 | The platform supports progress tracking. | An acceptance test confirms this statement: “The platform supports progress tracking.” |
| REQ-097.20 | MUST | V1 | Functional | Shared governance | L5295; L5303 | The platform supports earnings redemption. | An acceptance test confirms this statement: “The platform supports earnings redemption.” |
| REQ-097.21 | MUST | V1 | Functional | Shared governance | L5295; L5305 | The platform supports transparent engagement. | An acceptance test confirms this statement: “The platform supports transparent engagement.” |
| REQ-097.22 | MUST | V1 | Non-functional | Shared governance | L5307 | The platform meets the quality standards of a serious international technology company. | A defined measurement or design review confirms this statement: “The platform meets the quality standards of a serious international technology company.” |
| REQ-097.23 | MUST | Pre-implementation deliverable | Governance | Shared governance | L5311–L5325 | Work proceeds from business foundation to product foundation to technical foundation to implementation roadmap before stepwise development. | Workflow and audit evidence confirm this statement: “Work proceeds from business foundation to product foundation to technical foundation to implementation roadmap before stepwise development.” |
| REQ-097.24 | MUST | V1 | Non-functional | Shared governance | L5327–L5329 | The long-term objective is a scalable, trustworthy global rewards platform rather than only a website launch. | A defined measurement or design review confirms this statement: “The long-term objective is a scalable, trustworthy global rewards platform rather than only a website launch.” |

## ODR — Owner Decision Register

### ODR-001 — Authoritative Phase 0 document map

- **Status:** Open
- **Constitution source:** GAP — no controlling Constitution clause
- **Decision needed:** Approve the definitive Phase 0 document list, IDs, titles, owners, and requirement-to-document mapping.
- **Description:** The Constitution names many required deliverables but does not assign the EP-P0-02 through EP-P0-13 identifiers or ownership map.

### ODR-002 — Backend technology and runtime architecture

- **Status:** Open
- **Constitution source:** L1515–L1537; L4309–L4340
- **Decision needed:** Approve the backend stack, deployment model, scaling path, and rejected alternatives.
- **Description:** Select the backend framework/runtime and migration path after the mandated comparison.

### ODR-003 — Launch-country and eligibility matrix

- **Status:** Open
- **Constitution source:** L337–L369; L1289–L1312
- **Decision needed:** Approve exact countries, excluded regions, eligibility rules, geolocation policy, and future activation process.
- **Description:** “Other selected European countries” is undefined and country eligibility controls require an authoritative launch matrix.

### ODR-004 — Frontend architecture and design approvals

- **Status:** Open
- **Constitution source:** L1541–L1557; L3111–L3145; L3531–L3557
- **Decision needed:** Approve frontend stack, design tokens, accessibility target, responsive baseline, and UI gate.
- **Description:** Frontend architecture, palette, design system, and implementation approval remain frontend-owner decisions.

### ODR-005 — V1 withdrawal methods

- **Status:** Open
- **Constitution source:** L811–L823; L1289–L1295
- **Decision needed:** Approve V1 payment methods, country coverage, fees, reserves, settlement flow, and fallback behavior.
- **Description:** The architecture should support PayPal, Virtual Visa, and cryptocurrency, but the Constitution does not approve which methods launch in V1.

### ODR-006 — Withdrawal thresholds, fees, and limits

- **Status:** Open
- **Constitution source:** L1285–L1295; L5095–L5113
- **Decision needed:** Approve threshold, fees, daily/monthly limits, cooldowns, and change-governance policy.
- **Description:** Minimum withdrawal is configurable, but no default threshold, fee, frequency, or account limit is specified.

### ODR-007 — Sensitive-action verification and KYC trigger policy

- **Status:** Open
- **Constitution source:** L451–L453; L4431–L4459
- **Decision needed:** Approve sensitive actions, first-withdrawal controls, OTP channel hierarchy, recovery flow, and any KYC triggers.
- **Description:** Phone OTP is optional for sensitive actions and the OTP channel must be recommended, but the triggering actions and KYC relationship are not decided.

### ODR-008 — Infrastructure platform selection

- **Status:** Open
- **Constitution source:** L4225–L4281
- **Decision needed:** Approve hosting providers, regions, service boundaries, migration triggers, and operational ownership.
- **Description:** The Constitution mandates evaluation but does not select the cloud, serverless, managed-service, or hybrid combination.

### ODR-009 — Database engine and service

- **Status:** Open
- **Constitution source:** L4343–L4371
- **Decision needed:** Approve engine, provider, region, availability model, connection strategy, and scaling triggers.
- **Description:** PostgreSQL, MySQL, MariaDB, serverless, and managed options must be evaluated before a final engine/service is selected.

### ODR-010 — Object storage and CDN design

- **Status:** Open
- **Constitution source:** L4375–L4395
- **Decision needed:** Approve storage provider, buckets/classes, CDN, upload limits, malware scanning, encryption, and lifecycle rules.
- **Description:** The storage strategy must be defined, but provider, region, retention classes, malware handling, and CDN policy are open.

### ODR-011 — Backup schedule and storage policy

- **Status:** Open
- **Constitution source:** L4627–L4647
- **Decision needed:** Approve backup frequency, retention, immutability, encryption, geographic placement, and restore-test cadence.
- **Description:** The backup plan must define frequency and location, but the values are not supplied.

### ODR-012 — Recovery objectives

- **Status:** Open
- **Constitution source:** L4651–L4663
- **Decision needed:** Approve RTO/RPO by service tier, incident authority, communications, and exercise cadence.
- **Description:** The disaster-recovery strategy must define RTO and RPO, but the targets are not supplied.

### ODR-013 — Admin roles, permissions, and Limit Template catalog

- **Status:** Open
- **Constitution source:** L1201–L1281
- **Decision needed:** Approve V1 admin roles, least-privilege matrix, segregation of duties, templates, override rules, expiry, and emergency access.
- **Description:** Role and restriction examples are not a final permission matrix or V1 template catalog.

### ODR-014 — Provider launch and visibility policy

- **Status:** Open
- **Constitution source:** L751–L781; L1351–L1383; L2795–L2803
- **Decision needed:** Approve launch providers, user-facing visibility, routing/caps, credentials ownership, sandbox certification, and disablement criteria.
- **Description:** The modular framework is required, but provider selection, naming/visibility, per-provider caps, routing, and failure policy are not specified.

### ODR-015 — Data-retention schedule

- **Status:** Open
- **Constitution source:** L2337–L2353
- **Decision needed:** Approve category-by-category retention, legal hold, deletion/anonymization, backup expiry, and exception workflow.
- **Description:** Retention policies are required but no durations, legal holds, deletion windows, or anonymization rules are specified.

### ODR-016 — Provider-specific maturity and cleared-funds rules

- **Status:** Open
- **Constitution source:** L665–L713; L2191–L2209
- **Decision needed:** Approve each provider’s validation evidence, maturity conditions, reversal rules, cleared-funds gate, risk holds, and user messaging. Do not adopt a global time-only validation rule.
- **Description:** The Constitution defines lifecycle stages and estimated maturity display but not the provider-specific settlement, risk, or cleared-funds policy.

### ODR-017 — Local-currency conversion display

- **Status:** Open
- **Constitution source:** L417–L427; L799–L805
- **Decision needed:** Approve authoritative rate source, cadence, snapshot/rounding rules, supported currencies, and disclaimer.
- **Description:** Local currency is display-only, but the exchange-rate source, refresh cadence, rounding, stale-rate policy, and disclaimer are undefined.

### ODR-018 — Reward economics and platform-margin policy

- **Status:** Open
- **Constitution source:** L4101–L4107; L5095–L5109
- **Decision needed:** Approve provider-to-user reward calculation, margin, rounding, promotional funding, negative adjustments, and disclosure policy.
- **Description:** The platform must track provider revenue, user rewards, and margin, while reward rules are configurable; the split and accounting policy are not stated.

### ODR-019 — Age, residency, KYC, and eligibility policy

- **Status:** Open
- **Constitution source:** GAP — no controlling Constitution clause
- **Decision needed:** Approve age/residency eligibility, identity/KYC triggers, duplicate-account rules, sanctions/AML applicability, and country-specific exceptions.
- **Description:** The Constitution does not define minimum age, residency proof, duplicate-person rules, sanctions screening, KYC thresholds, or restricted-person policy.

### ODR-020 — Manual wallet adjustment governance

- **Status:** Open
- **Constitution source:** L2183–L2187; L2769–L2791
- **Decision needed:** Approve adjustment permissions, dual control, reason/evidence fields, thresholds, reversals, and user notification.
- **Description:** The API scope includes wallet adjustments and the ledger must trace financial changes, but maker-checker, reason codes, limits, and reversal policy are open.

### ODR-021 — Support service levels

- **Status:** Open
- **Constitution source:** L1873–L1877; L3407–L3425
- **Decision needed:** Approve response/resolution targets by priority, business hours, escalation, pause conditions, and disclosure wording.
- **Description:** Support response time is measured and estimated response time is displayed, but no SLA or escalation targets are defined.

### ODR-022 — Marketing consent and communication preferences

- **Status:** Open
- **Constitution source:** L3999–L4029; L4415–L4427
- **Decision needed:** Approve consent basis, opt-in/out, suppression, frequency caps, quiet hours, and country-specific marketing rules.
- **Description:** Marketing and retention email capabilities are required, but consent, suppression, frequency, and preference policy are not defined.

### ODR-023 — Audit and financial-history retention/immutability

- **Status:** Open
- **Constitution source:** L2233–L2235; L2313–L2325; L1407–L1443
- **Decision needed:** Approve append-only guarantees, correction model, retention, access, export, integrity verification, and legal-hold handling.
- **Description:** Audit and withdrawal histories should be immutable, but storage guarantees, retention, corrections, and privileged access are not specified.

### ODR-024 — Session, rate-limit, and abuse thresholds

- **Status:** Open
- **Constitution source:** L1451–L1479; L2867–L2887; L4431–L4443
- **Decision needed:** Approve session lifetimes, refresh/revocation, login/OTP/API thresholds, lockout behavior, exceptions, and monitoring alerts.
- **Description:** Secure sessions, rate limiting, brute-force protection, OTP limiting, and abuse detection are required but numeric policies are absent.

### ODR-025 — Account deletion, restoration, and anonymization

- **Status:** Open
- **Constitution source:** L1169–L1175; L2163
- **Decision needed:** Approve soft-delete duration, restoration authority, anonymization/deletion workflow, financial/audit exceptions, and user notices.
- **Description:** Soft deletion and restoration are required, but retention, anonymization, owner access, and irreversible deletion rules are not defined.

### ODR-026 — Leaderboard privacy and competition rules

- **Status:** Open
- **Constitution source:** L717–L747; L3367–L3381
- **Decision needed:** Approve privacy/opt-out, display-name rules, rank calculations, ties, exclusions, anti-fraud, seasonal prizes, and disputes.
- **Description:** Ranking methods and hidden-user controls are configurable, but opt-out, pseudonyms, ties, anti-gaming, prizes, and dispute rules are not defined.

### ODR-027 — Provider reconciliation fallback

- **Status:** Open
- **Constitution source:** L771–L781; L1367–L1383; L2807–L2825
- **Decision needed:** Approve polling/import/manual-evidence methods, matching keys, conflict rules, operator permissions, and audit evidence.
- **Description:** Status synchronization is required when supported, but the verified reconciliation process when provider callbacks are absent or disputed is undefined.


## DDR — Derived Decision / Architecture Proposal Register

Every item below is labelled **DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL** and is excluded from the REQ total.

### DDR-001 — Immutable reward-lot ledger

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L611–L649; L2167–L2187
- **Proposal:** Model each earning as an immutable reward lot with append-only ledger postings and derived balance buckets rather than mutable aggregate balances.
- **Approval/evidence needed:** Architecture review, accounting invariants, reversal model, and performance proof.

### DDR-002 — Event-driven earning state machine

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L665–L711; L2191–L2209
- **Proposal:** Use an explicit state machine for Pending, Validated, Mature, Withdrawable, Paid, Reversed, and exceptional states, with guarded transitions and recorded causes.
- **Approval/evidence needed:** Owner approval of transition matrix and provider-specific rules.

### DDR-003 — Provider adapter contract

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L1351–L1363; L2677; L2795–L2803
- **Proposal:** Define a stable provider adapter interface with capability flags, normalized survey/status payloads, credential isolation, and certification tests.
- **Approval/evidence needed:** Architecture approval and at least two provider proof-of-concept adapters.

### DDR-004 — Webhook inbox and idempotency store

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L2807–L2825
- **Proposal:** Persist verified webhook envelopes before processing, enforce provider/event idempotency keys, and retain retry/audit history.
- **Approval/evidence needed:** Threat review, schema approval, replay policy, and provider verification tests.

### DDR-005 — Policy engine for RBAC and Limit Templates

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L1181–L1281; L2635; L2791
- **Proposal:** Centralize role permissions, account-state restrictions, and Limit Template overrides in one deny-by-default authorization policy evaluator.
- **Approval/evidence needed:** Security architecture approval and policy-conflict test matrix.

### DDR-006 — Versioned configuration registry

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L1285–L1315; L1827–L1851; L5095–L5113
- **Proposal:** Store business settings as typed, versioned, effective-dated configuration with validation, change approval, rollback, and audit history.
- **Approval/evidence needed:** Architecture and owner approval of scope, rollout semantics, and emergency-change process.

### DDR-007 — Tamper-evident audit log

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L1407–L1443; L2313–L2325
- **Proposal:** Use append-only audit events with integrity chaining or equivalent tamper-evidence, protected access, export, and retention enforcement.
- **Approval/evidence needed:** Security/compliance review and integrity-verification test.

### DDR-008 — Transactional outbox and resilient job processing

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L1905–L1923; L2829–L2845; L4463–L4491
- **Proposal:** Use a transactional outbox for state-change notifications and jobs, plus retries, backoff, dead-letter handling, deduplication, and operator replay.
- **Approval/evidence needed:** Architecture approval and failure/recovery test evidence.

### DDR-009 — Contract-first API specification

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L2559–L2585; L2893–L2913; L2957–L2979
- **Proposal:** Use a versioned OpenAPI contract as the single API documentation/test-generation source with standard envelopes and error schemas.
- **Approval/evidence needed:** API architecture approval and CI contract-drift enforcement proof.

### DDR-010 — Modular-monolith initial topology

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L1673–L1741; L4201–L4205; L4735–L4743
- **Proposal:** Begin with a modular monolith whose domain boundaries can be extracted later, avoiding premature distributed-system complexity while preserving API contracts.
- **Approval/evidence needed:** Backend architecture comparison and explicit owner approval.

### DDR-011 — Unified observability correlation

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L2935–L2953; L4575–L4623
- **Proposal:** Propagate correlation IDs across requests, jobs, provider calls, audit events, and financial transactions, with structured logs, metrics, traces, and alerts.
- **Approval/evidence needed:** Observability design approval, privacy review, and incident drill.

### DDR-012 — Retention and erasure policy engine

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L2337–L2353; L4623
- **Proposal:** Implement category-based retention, legal hold, anonymization, deletion jobs, and evidence reports from an approved policy table.
- **Approval/evidence needed:** Legal/owner approval and end-to-end deletion/hold tests.

### DDR-013 — FX-rate snapshot service

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L417–L427; L799–L805
- **Proposal:** Store the source, timestamp, rate, base currency, quote currency, and rounding policy used for each displayed local-currency estimate.
- **Approval/evidence needed:** Finance/owner approval and source reliability evidence.

### DDR-014 — Idempotent withdrawal orchestration

- **Label:** DERIVED PROPOSAL — REQUIRES ARCHITECTURE OR OWNER APPROVAL
- **Status:** Open
- **Constitution drivers:** L811–L839; L2213–L2235; L2681–L2695
- **Proposal:** Use an idempotency key, reservation/hold posting, provider attempt log, reconciliation state, and safe retry rules for each withdrawal.
- **Approval/evidence needed:** Finance/security architecture approval and duplicate-payment prevention tests.


## EFE — External Fact Requiring Evidence Register

### EFE-001 — Provider contracts and integration specifications

- **Status:** Open
- **Constitution driver:** L549; L751–L781; L1351–L1363; L2795–L2825
- **Fact to verify:** Current provider agreements, API/webhook documentation, status semantics, validation evidence, settlement terms, reversals, country/device rules, and data-use limits must be verified.
- **Required evidence:** Provider-issued current contracts and technical documentation, retained with version/date and approval record.

### EFE-002 — Withdrawal-provider availability and terms

- **Status:** Open
- **Constitution driver:** L815–L823; L2681–L2695
- **Fact to verify:** Country availability, currencies, fees, settlement, reserves, transaction limits, API capability, dispute handling, and prohibited use for PayPal, Virtual Visa, crypto, or alternatives require current evidence.
- **Required evidence:** Official provider documentation and signed commercial/compliance terms.

### EFE-003 — Target-market legal and privacy obligations

- **Status:** Open
- **Constitution driver:** L337–L369; L2163; L2337–L2353; L3627–L3667
- **Fact to verify:** Privacy, cookies, consumer disclosures, promotions, age/consent, marketing communications, data rights, retention, taxation, and rewards-platform rules vary by launch market.
- **Required evidence:** Qualified legal analysis by jurisdiction with dated sources and applicability matrix.

### EFE-004 — Cloud and managed-service pricing/limits

- **Status:** Open
- **Constitution driver:** L4225–L4281; L4343–L4395
- **Fact to verify:** Free tiers, quotas, pricing, SLA, region availability, lock-in, migration tools, and service limits are time-sensitive external facts.
- **Required evidence:** Current official vendor documentation and dated cost/limit comparison.

### EFE-005 — Email deliverability and provider terms

- **Status:** Open
- **Constitution driver:** L1387–L1403; L4399–L4427
- **Fact to verify:** Free limits, deliverability, API quality, sending-domain requirements, suppression handling, regional availability, and marketing restrictions require verification.
- **Required evidence:** Official provider documentation, current pricing, deliverability test, and acceptable-use review.

### EFE-006 — SMS/OTP provider coverage and regulation

- **Status:** Open
- **Constitution driver:** L451–L453; L4431–L4459
- **Fact to verify:** SMS coverage, sender registration, cost, delivery, fraud controls, privacy terms, and verification-service availability vary by country.
- **Required evidence:** Official provider coverage/pricing plus country-specific messaging and consent review.

### EFE-007 — Foreign-exchange data source

- **Status:** Open
- **Constitution driver:** L417–L427; L799–L805
- **Fact to verify:** Accuracy, licensing, update frequency, outage policy, and attribution requirements of the chosen FX source require current evidence.
- **Required evidence:** Official data-provider terms, SLA/limits, accuracy test, and finance approval.

### EFE-008 — Accessibility conformance baseline

- **Status:** Open
- **Constitution driver:** L1807–L1823; L3453–L3469
- **Fact to verify:** The Constitution requires accessibility best practices but does not name a conformance standard or level.
- **Required evidence:** Current authoritative accessibility standard, approved conformance level, and legal applicability review.

### EFE-009 — Core Web Vitals thresholds

- **Status:** Open
- **Constitution driver:** L995–L1013
- **Fact to verify:** “Excellent Core Web Vitals” requires current metric definitions and threshold evidence.
- **Required evidence:** Current official web performance definitions, field-measurement method, and approved budgets.

### EFE-010 — Payments, crypto, KYC, AML, and sanctions applicability

- **Status:** Open
- **Constitution driver:** L815–L823; L5225–L5243
- **Fact to verify:** Withdrawal methods and target countries may trigger identity, payments, virtual-asset, sanctions, tax, or AML obligations.
- **Required evidence:** Qualified legal/compliance opinion and provider-specific onboarding requirements.

### EFE-011 — Data residency, backup, and cross-border transfer constraints

- **Status:** Open
- **Constitution driver:** L4285–L4305; L4627–L4663
- **Fact to verify:** Hosting regions, storage, logs, backups, disaster recovery, and cross-border transfers may be constrained by target-market law and vendor terms.
- **Required evidence:** Legal applicability matrix plus official vendor region, encryption, replication, and transfer documentation.

### EFE-012 — Current application-security standards and threat data

- **Status:** Open
- **Constitution driver:** L1447–L1485; L2867–L2889; L4557–L4571
- **Fact to verify:** Security controls, abuse limits, dependency risks, and secure-development practices require current authoritative baselines.
- **Required evidence:** Current authoritative security standards, threat model, dependency advisories, and control mapping.


## OCR — Owner Clarification Register

### OCR-001 — Pending-to-Validated is event-driven

- **Status:** Binding owner clarification
- **Constitution relationship:** GAP — no controlling Constitution clause
- **Clarification:** Pending → Validated requires provider confirmation or verified reconciliation. Elapsed time alone never validates a provider transaction.
- **Notes:** Constitution L669–L693 defines the lifecycle sequence only; it does not state this trigger. No Constitution citation is fabricated.

### OCR-002 — No global maturity or hold period

- **Status:** Binding owner clarification
- **Constitution relationship:** GAP — no controlling Constitution clause
- **Clarification:** Validated → Mature may depend on provider-specific settlement and risk rules; Mature → Withdrawable requires cleared-funds confirmation and configured risk conditions. No single global hold period is assumed.
- **Notes:** This is a binding owner clarification recorded outside the Constitution and is excluded from the formal REQ total.

### OCR-003 — Canonical citation discipline

- **Status:** Binding owner clarification
- **Constitution relationship:** GAP — no controlling Constitution clause
- **Clarification:** Every Constitution citation uses verified exact canonical line ranges, with each non-contiguous range recorded separately.
- **Notes:** This is a remediation governance rule, not a product requirement and not Constitution wording.


## Mechanical integrity audit

| Check | Result | Details |
|---|---|---|
| Canonical source identity | PASS | {"lines":5337,"words":8313,"bytes":65976,"sha256":"53ff6b78255a979ed635ed113fb812b8ece5a7ed10933ad84773c9412d0f08f1"} |
| Atomic requirement IDs are unique | PASS | 1392 records |
| Atomic source summaries are unique | PASS | 1392 normalized summaries |
| All parent IDs exist | PASS | 97 structural parents |
| All required fields populated | PASS | 19 required fields |
| Modalities valid | PASS |  |
| Delivery targets valid | PASS |  |
| Citations resolve inside canonical file | PASS |  |
| Per-row source digests are valid SHA-256 values | PASS |  |
| Every REQ citation stays within its declared Constitution Part | PASS |  |
| Every REQ citation stays inside its structural parent source span | PASS |  |
| All Parts 1–10 represented | PASS |  |
| All detected Constitution headings are mapped | PASS | 192 headings checked |
| Governance register IDs unique | PASS |  |
| Part totals reconcile to the formal REQ total | PASS | 1392 REQs |
| Modality totals reconcile to the formal REQ total | PASS | 1392 REQs |
| Classification totals reconcile to the formal REQ total | PASS | 1392 REQs |
| Requirement type totals reconcile to the formal REQ total | PASS | 1392 REQs |
| Delivery target totals reconcile to the formal REQ total | PASS | 1392 REQs |
| Responsible layer totals reconcile to the formal REQ total | PASS | 1392 REQs |

## Section coverage audit

- **L3 — PROJECT TITLE:** Covered (REQ-001)
- **L9 — AI MASTER INSTRUCTION:** Covered (REQ-001)
- **L17 — CEO:** Covered (REQ-001)
- **L19 — CTO:** Covered (REQ-001)
- **L69 — YOUR PRIMARY OBJECTIVE:** Covered (REQ-001)
- **L127 — IMPORTANT WORKFLOW:** Covered (REQ-002)
- **L275 — CMS:** Covered (REQ-002)
- **L305 — BUSINESS SUMMARY:** Covered (REQ-003)
- **L337 — TARGET COUNTRIES:** Covered (REQ-003)
- **L373 — PLATFORM LANGUAGE:** Covered (REQ-004)
- **L401 — CURRENCY SYSTEM:** Covered (REQ-005)
- **L405 — USD:** Covered (REQ-005)
- **L421 — USD:** Covered (REQ-005)
- **L431 — USER REGISTRATION:** Covered (REQ-006)
- **L457 — USER ACCOUNT STATUS:** Covered (REQ-007)
- **L481 — PRODUCT PHILOSOPHY:** Covered (REQ-008)
- **L497 — PRODUCT DESIGN PRINCIPLES:** Covered (REQ-008)
- **L531 — HOMEPAGE:** Covered (REQ-009)
- **L567 — USER DASHBOARD:** Covered (REQ-010)
- **L611 — WALLET SYSTEM:** Covered (REQ-011)
- **L665 — BALANCE MATURITY SYSTEM:** Covered (REQ-012)
- **L709 — USD:** Covered (REQ-012)
- **L717 — LEADERBOARD SYSTEM:** Covered (REQ-013)
- **L751 — SURVEY EXPERIENCE:** Covered (REQ-014)
- **L785 — REWARD POINT SYSTEM:** Covered (REQ-015)
- **L803 — USD:** Covered (REQ-015)
- **L811 — WITHDRAWAL SYSTEM:** Covered (REQ-016)
- **L843 — NOTIFICATION CENTER:** Covered (REQ-017)
- **L879 — SUPPORT CENTER:** Covered (REQ-018)
- **L907 — BLOG SYSTEM:** Covered (REQ-019)
- **L913 — SEO:** Covered (REQ-019)
- **L961 — SEO REQUIREMENTS:** Covered (REQ-020)
- **L995 — PERFORMANCE TARGETS:** Covered (REQ-021)
- **L1059 — SUPER ADMIN ERP:** Covered (REQ-022)
- **L1071 — ADMIN DASHBOARD:** Covered (REQ-022)
- **L1133 — USER MANAGEMENT:** Covered (REQ-023)
- **L1181 — ACCOUNT MODERATION:** Covered (REQ-024)
- **L1201 — LIMIT TEMPLATE SYSTEM:** Covered (REQ-025)
- **L1259 — ROLE MANAGEMENT:** Covered (REQ-026)
- **L1285 — SYSTEM SETTINGS:** Covered (REQ-027)
- **L1319 — CONTENT MANAGEMENT SYSTEM (CMS):** Covered (REQ-028)
- **L1329 — FAQ:** Covered (REQ-028)
- **L1351 — PROVIDER INTEGRATION FRAMEWORK:** Covered (REQ-029)
- **L1367 — API MANAGEMENT:** Covered (REQ-030)
- **L1387 — EMAIL SYSTEM:** Covered (REQ-031)
- **L1407 — AUDIT LOGGING:** Covered (REQ-032)
- **L1447 — SECURITY:** Covered (REQ-033)
- **L1489 — DATABASE ARCHITECTURE:** Covered (REQ-034)
- **L1515 — BACKEND ARCHITECTURE:** Covered (REQ-035)
- **L1541 — FRONTEND ARCHITECTURE:** Covered (REQ-035)
- **L1561 — PROJECT DOCUMENTATION:** Covered (REQ-036)
- **L1595 — INTERACTIVE DEVELOPMENT ROADMAP:** Covered (REQ-036)
- **L1617 — QUALITY STANDARD:** Covered (REQ-037)
- **L1645 — CORE PHILOSOPHY:** Covered (REQ-038)
- **L1673 — ENGINEERING PRINCIPLES:** Covered (REQ-038)
- **L1701 — PROJECT STRUCTURE:** Covered (REQ-039)
- **L1721 — CMS:** Covered (REQ-039)
- **L1745 — DEVELOPMENT STANDARDS:** Covered (REQ-040)
- **L1767 — USER EXPERIENCE STANDARDS:** Covered (REQ-040)
- **L1787 — PERFORMANCE GOALS:** Covered (REQ-041)
- **L1807 — ACCESSIBILITY:** Covered (REQ-041)
- **L1827 — CONFIGURATION PHILOSOPHY:** Covered (REQ-042)
- **L1855 — ANALYTICS:** Covered (REQ-043)
- **L1887 — ERROR HANDLING:** Covered (REQ-044)
- **L1905 — BACKGROUND PROCESSING:** Covered (REQ-044)
- **L1927 — RELEASE MANAGEMENT:** Covered (REQ-045)
- **L1955 — BACKUP & RECOVERY:** Covered (REQ-045)
- **L1975 — CONTINUOUS IMPROVEMENT:** Covered (REQ-045)
- **L1995 — FINAL DIRECTIVE TO THE AI:** Covered (REQ-046)
- **L2037 — DATABASE PHILOSOPHY:** Covered (REQ-047)
- **L2053 — DATABASE OBJECTIVES:** Covered (REQ-047)
- **L2079 — DATABASE DESIGN PRINCIPLES:** Covered (REQ-048)
- **L2097 — DATABASE DOCUMENTATION:** Covered (REQ-048)
- **L2123 — CORE BUSINESS DOMAINS:** Covered (REQ-049)
- **L2337 — DATA RETENTION:** Covered (REQ-055)
- **L2357 — MIGRATIONS:** Covered (REQ-055)
- **L2371 — SEED DATA:** Covered (REQ-055)
- **L2391 — INDEXING STRATEGY:** Covered (REQ-056)
- **L2413 — SCALABILITY:** Covered (REQ-056)
- **L2431 — DATA SECURITY:** Covered (REQ-056)
- **L2451 — REPORTING:** Covered (REQ-057)
- **L2471 — FINAL DATABASE DELIVERABLES:** Covered (REQ-057)
- **L2511 — API PHILOSOPHY:** Covered (REQ-058)
- **L2537 — API OBJECTIVES:** Covered (REQ-058)
- **L2559 — API DESIGN PRINCIPLES:** Covered (REQ-058)
- **L2589 — API VERSIONING:** Covered (REQ-058)
- **L2795 — PROVIDER INTEGRATION LAYER:** Covered (REQ-063)
- **L2807 — WEBHOOK ARCHITECTURE:** Covered (REQ-063)
- **L2829 — BACKGROUND PROCESSING:** Covered (REQ-064)
- **L2849 — ERROR HANDLING:** Covered (REQ-064)
- **L2867 — API SECURITY:** Covered (REQ-065)
- **L2893 — API DOCUMENTATION:** Covered (REQ-065)
- **L2917 — TESTING STRATEGY:** Covered (REQ-065)
- **L2935 — OBSERVABILITY:** Covered (REQ-065)
- **L2957 — FINAL API DELIVERABLES:** Covered (REQ-066)
- **L2997 — DESIGN PHILOSOPHY:** Covered (REQ-067)
- **L3023 — DESIGN LANGUAGE:** Covered (REQ-067)
- **L3061 — DESIGN PRINCIPLES:** Covered (REQ-067)
- **L3085 — BRAND IDENTITY:** Covered (REQ-068)
- **L3111 — COLOR SYSTEM:** Covered (REQ-068)
- **L3149 — TYPOGRAPHY:** Covered (REQ-068)
- **L3167 — GRID SYSTEM:** Covered (REQ-068)
- **L3187 — ICONOGRAPHY:** Covered (REQ-068)
- **L3203 — BUTTON SYSTEM:** Covered (REQ-069)
- **L3237 — FORM SYSTEM:** Covered (REQ-069)
- **L3257 — CARD SYSTEM:** Covered (REQ-069)
- **L3289 — DASHBOARD UX:** Covered (REQ-070)
- **L3315 — SURVEY EXPERIENCE:** Covered (REQ-070)
- **L3339 — WALLET EXPERIENCE:** Covered (REQ-070)
- **L3347 — USD:** Covered (REQ-070)
- **L3367 — LEADERBOARD EXPERIENCE:** Covered (REQ-070)
- **L3385 — PROFILE PAGE:** Covered (REQ-070)
- **L3407 — SUPPORT EXPERIENCE:** Covered (REQ-071)
- **L3429 — ADMIN DESIGN:** Covered (REQ-071)
- **L3453 — DESIGN ACCESSIBILITY:** Covered (REQ-072)
- **L3473 — MICROINTERACTIONS:** Covered (REQ-072)
- **L3493 — EMPTY STATES:** Covered (REQ-072)
- **L3507 — ERROR PAGES:** Covered (REQ-072)
- **L3531 — FINAL UI DELIVERABLES:** Covered (REQ-073)
- **L3569 — GROWTH PHILOSOPHY:** Covered (REQ-074)
- **L3595 — BRAND POSITIONING:** Covered (REQ-074)
- **L3627 — TARGET AUDIENCE:** Covered (REQ-074)
- **L3649 — UAE:** Covered (REQ-074)
- **L3671 — LAUNCH STRATEGY:** Covered (REQ-075)
- **L3679 — PHASE 1 — FOUNDATION:** Covered (REQ-075)
- **L3705 — PHASE 2 — CONTENT ENGINE:** Covered (REQ-075)
- **L3725 — CONTENT MARKETING STRATEGY:** Covered (REQ-075)
- **L3791 — YOUTUBE STRATEGY:** Covered (REQ-076)
- **L3849 — SHORT-FORM VIDEO STRATEGY:** Covered (REQ-076)
- **L3875 — SOCIAL MEDIA STRATEGY:** Covered (REQ-076)
- **L3903 — SOCIAL MEDIA OPERATING SYSTEM:** Covered (REQ-076)
- **L3921 — SEO FOUNDATION:** Covered (REQ-077)
- **L3949 — ON-PAGE SEO:** Covered (REQ-077)
- **L3967 — BLOG SEO ENGINE:** Covered (REQ-077)
- **L3999 — EMAIL MARKETING SYSTEM:** Covered (REQ-078)
- **L4033 — REFERRAL SYSTEM (FUTURE READY):** Covered (REQ-078)
- **L4053 — USER RETENTION STRATEGY:** Covered (REQ-078)
- **L4075 — ANALYTICS & GROWTH METRICS:** Covered (REQ-079)
- **L4117 — PAID ADVERTISING STRATEGY:** Covered (REQ-079)
- **L4147 — COMMUNITY BUILDING:** Covered (REQ-080)
- **L4165 — MARKETING DELIVERABLES:** Covered (REQ-080)
- **L4199 — INFRASTRUCTURE PHILOSOPHY:** Covered (REQ-081)
- **L4225 — INFRASTRUCTURE STRATEGY:** Covered (REQ-081)
- **L4253 — FREE-FIRST APPROACH:** Covered (REQ-081)
- **L4285 — CLOUD ARCHITECTURE REQUIREMENTS:** Covered (REQ-082)
- **L4309 — BACKEND INFRASTRUCTURE:** Covered (REQ-082)
- **L4343 — DATABASE INFRASTRUCTURE:** Covered (REQ-083)
- **L4375 — STORAGE ARCHITECTURE:** Covered (REQ-083)
- **L4399 — EMAIL INFRASTRUCTURE:** Covered (REQ-084)
- **L4431 — OTP INFRASTRUCTURE:** Covered (REQ-084)
- **L4449 — SMS OTP:** Covered (REQ-084)
- **L4463 — BACKGROUND JOB ARCHITECTURE:** Covered (REQ-085)
- **L4495 — ENVIRONMENT MANAGEMENT:** Covered (REQ-085)
- **L4521 — VERSION CONTROL:** Covered (REQ-086)
- **L4539 — CI/CD PIPELINE:** Covered (REQ-086)
- **L4557 — SECURITY OPERATIONS:** Covered (REQ-087)
- **L4575 — MONITORING & OBSERVABILITY:** Covered (REQ-087)
- **L4589 — CPU:** Covered (REQ-087)
- **L4609 — LOGGING STRATEGY:** Covered (REQ-087)
- **L4627 — BACKUP STRATEGY:** Covered (REQ-088)
- **L4651 — DISASTER RECOVERY:** Covered (REQ-088)
- **L4667 — SCALING STRATEGY:** Covered (REQ-088)
- **L4693 — COST OPTIMIZATION:** Covered (REQ-089)
- **L4709 — DEPLOYMENT DOCUMENTATION:** Covered (REQ-089)
- **L4735 — FINAL INFRASTRUCTURE DIRECTIVE:** Covered (REQ-090)
- **L4757 — ROLE OF THE AI:** Covered (REQ-091)
- **L4787 — MASTER EXECUTION RULE:** Covered (REQ-091)
- **L4799 — STEP 1 — BUSINESS ANALYSIS:** Covered (REQ-092)
- **L4825 — STEP 2 — PRODUCT DEFINITION:** Covered (REQ-092)
- **L4853 — STEP 3 — SYSTEM DESIGN:** Covered (REQ-092)
- **L4877 — STEP 4 — UI/UX DESIGN:** Covered (REQ-092)
- **L4895 — STEP 5 — DEVELOPMENT ROADMAP:** Covered (REQ-093)
- **L4933 — DEVELOPMENT WORKFLOW:** Covered (REQ-093)
- **L4939 — PHASE 1 — FOUNDATION:** Covered (REQ-093)
- **L4955 — PHASE 2 — USER PLATFORM:** Covered (REQ-093)
- **L4973 — PHASE 3 — REWARDS ENGINE:** Covered (REQ-093)
- **L4989 — PHASE 4 — SURVEY SYSTEM:** Covered (REQ-093)
- **L5003 — PHASE 5 — WITHDRAWAL SYSTEM:** Covered (REQ-093)
- **L5017 — PHASE 6 — ADMIN ERP:** Covered (REQ-093)
- **L5037 — PHASE 7 — GROWTH SYSTEM:** Covered (REQ-093)
- **L5053 — PHASE 8 — OPTIMIZATION:** Covered (REQ-093)
- **L5067 — CODE QUALITY REQUIREMENTS:** Covered (REQ-094)
- **L5095 — BUSINESS RULE CONFIGURATION:** Covered (REQ-094)
- **L5117 — TESTING REQUIREMENTS:** Covered (REQ-094)
- **L5143 — DOCUMENTATION REQUIREMENTS:** Covered (REQ-095)
- **L5179 — README:** Covered (REQ-095)
- **L5189 — SUPER ADMIN PRINCIPLE:** Covered (REQ-096)
- **L5225 — SECURITY PRINCIPLE:** Covered (REQ-096)
- **L5247 — AI SELF-REVIEW RULE:** Covered (REQ-097)
- **L5271 — COMMUNICATION STYLE:** Covered (REQ-097)
- **L5293 — FINAL PROJECT VISION:** Covered (REQ-097)
- **L5311 — FINAL COMMAND TO AI:** Covered (REQ-097)

## Change log from the rejected predecessor

- This is a fresh canonical extraction; it does not patch or preserve the rejected 116-entry numbering scheme.
- Structural parents and counted atomic children are now distinguished explicitly.
- Exact canonical source excerpts and per-row excerpt digests are generated mechanically from the verified source file.
- ODR, DDR, EFE, and owner clarifications are separate from the formal REQ total.
- Frontend-owned clauses remain traceable as `Frontend handoff` records; this backend/compliance pass does not select or implement the frontend architecture.
- The previous Notion draft was not used as an extraction source and no claim is made that its entries were complete or correct.

## Review gate

This extraction is not approved merely because its mechanical checks pass. It must undergo independent semantic review, including spot-checking source summaries and acceptance criteria against the cited canonical lines. No Phase 1 implementation is authorized by this artifact.
