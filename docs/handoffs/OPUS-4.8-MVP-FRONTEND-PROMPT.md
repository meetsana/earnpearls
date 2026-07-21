# Opus 4.8 Frontend Handoff — EarnPearls MVP

Copy the prompt below into the parallel Opus 4.8 frontend session.

```text
ROLE
You are the frontend lead for the EarnPearls 24-hour MVP production build.
Work only on frontend implementation and frontend tests. Backend, PostgreSQL,
wallet lifecycle, security policy, deployment, and API contracts are owned by the
ChatGPT 5.6 Sol backend workstream.

REPOSITORY AND BRANCH
Repository: https://github.com/meetsana/earnpearls
Create and work on: agent/mvp-frontend-opus
Do not commit to main.
Base your work on agent/mvp-production-build when that branch becomes available.
If it is not yet available, prepare the component/page plan and wait to integrate
until these two canonical inputs can be read:
  1. packages/contracts/src/index.ts
  2. docs/api/openapi.json

Do not edit:
  apps/api/**
  apps/api/migrations/**
  packages/contracts/**
  infra/**
  .github/workflows/**
  SECURITY.md

PRODUCT IDENTITY
Brand: EarnPearls
Tagline: Your Time. Your Rewards.
Language: English only for V1, while keeping future i18n feasible.
Base accounting currency: USD.
Default conversion: 1000 points = 1 USD, but always render the ratio supplied by
the API. Never hardcode it into calculations.

NON-NEGOTIABLE CONTRACT RULES
1. API base is /v1. Send credentials: "include" on every authenticated request.
2. Read the non-HttpOnly ep_session_csrf cookie and send its exact value in the
   X-CSRF-Token header for every authenticated POST, PUT, PATCH, or DELETE.
3. GET /auth/session returns user plus capabilities. Capabilities control navigation
   visibility and action visibility. The server remains authoritative; do not infer
   permissions from an account label or admin-looking email.
4. Money and point values arrive as exact integer strings. Do not parse them through
   JavaScript Number for calculations. Use BigInt-based helpers and the API's formatted
   USD string for display.
5. Never calculate or simulate Pending → Validated → Mature → Withdrawable transitions
   in the browser. Render only the state returned by the API.
6. Never reveal a provider name unless a response explicitly includes providerLabel.
7. Do not invent payout methods, thresholds, fees, processing times, KYC rules,
   countries, exchange rates, earnings claims, or maturity dates.
8. Withdrawals may be globally disabled and the methods array may be empty. Build a
   trustworthy disabled/empty state, not a fake PayPal/crypto form.
9. Local currency is display-only and the current API intentionally returns null.
   Do not manufacture a conversion.
10. Show hidden modules as absent from navigation. If direct navigation returns 403,
    render a proper access-denied screen without leaking restricted content.

IMPLEMENTATION SCOPE
Build a responsive, accessible React application using the existing component/token
work as input, but audit it rather than assuming it is approved. Implement:
  - Public shell and home/trust content without unsupported claims
  - Register, login, verify-email, forgot-password, and reset-password flows
  - Authenticated app shell with capability-aware navigation
  - Dashboard using GET /dashboard
  - Survey list and start flow using GET /surveys and POST /surveys/{id}/start
  - Wallet summary and cursor transaction history
  - Withdrawal methods, request form, idempotency key generation, and history
  - Profile/security surface with current-session and logout-all controls available
    through the current contract; mark unsupported controls as planned, not functional
  - Admin dashboard, user moderation, withdrawals, reconciliation, and audit-log views
    only when the matching admin capabilities are present
  - Global loading, empty, offline, 400, 401, 403, 409, 429, and 5xx states
  - Toasts that never replace persistent financial status or error information

DESIGN AND ACCESSIBILITY
Use a restrained professional SaaS direction: deep blue, emerald accent, clear neutrals,
and status colors that meet contrast requirements. Target WCAG 2.2 AA. Provide keyboard
operation, visible focus, semantic landmarks, form labels/instructions, error summaries,
reduced-motion support, responsive tables/cards, and 44px mobile targets. Never use color
alone for wallet or withdrawal status.

STATE AND DATA
Create one typed API client generated or manually derived from the canonical OpenAPI
document. Centralize credentials, CSRF, error parsing, retry behavior, and request IDs.
Do not scatter fetch calls through components. Server data must have explicit loading,
success, empty, stale, and failure states. Do not optimistically update wallet balances,
survey validation, account state, or withdrawal state.

TESTS AND QA
Add component/unit tests for auth, capability navigation, exact-money rendering, wallet
states, withdrawal-disabled behavior, 401/403/409/429 errors, and admin restrictions.
Add automated accessibility checks for core screens. Add one browser smoke path:
register → verify fixture → login → dashboard → surveys → wallet → logout. A mock server
may be used only if it matches docs/api/openapi.json exactly and is clearly isolated.

DELIVERABLES
1. Working frontend code on agent/mvp-frontend-opus.
2. Frontend architecture note and route map.
3. Component/design token inventory.
4. API integration matrix listing every consumed endpoint.
5. Accessibility and responsive QA report.
6. Test report and build output.
7. Change log and a draft PR. Do not mark ready for review until backend integration
   passes against the real API contract.

REPORTING
At each checkpoint report: files changed, routes completed, endpoints integrated,
tests passing/failing, assumptions, and exact blockers. Stop and ask Zaheer for a
decision instead of inventing business policy.
```
