# Frontend Change Log

## Contract integration — 2026-07-22

- Consolidated the initial frontend scaffold into the repository-owned application.
- Replaced 12 contract placeholders with the canonical contract.
- Corrected session, user, money, wallet, survey, withdrawal, dashboard, admin, cursor,
  and error payloads.
- Removed the unsupported client-generated `X-Request-Id` header.
- Corrected withdrawal history from a guessed cursor page to the contracted array.
- Added all public authentication endpoints and session-management endpoints.
- Preserved exact trailing slashes for dashboard, wallet, survey, and withdrawal collections.
- Replaced the inactive hard-coded showcase entry point with the contract-integrated SPA.
- Added capability-gated member and admin navigation/routes; reserved capabilities do not
  generate invented endpoints.
- Added responsive design, accessible states/forms/tables, exact-money helpers, CSRF,
  canonical errors, and stable withdrawal idempotency behavior.
- Added frontend tests, architecture, API matrix, and QA evidence.

The unreferenced JSX/CSS prototype and its invented sample balances, surveys, providers,
leaderboard, and payment controls were removed when the TypeScript application became the
single maintained frontend.
