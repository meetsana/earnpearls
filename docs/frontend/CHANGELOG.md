# Frontend Change Log

## Contract integration — 2026-07-22

- Recovered all 22 Fable 5 scaffold files from their Notion page mirrors.
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

The original JSX/CSS prototype files remain in the repository as unreferenced visual
reference material. They are not imported by the production entry point and their sample
balances, surveys, providers, leaderboard, and profile controls cannot reach users.
