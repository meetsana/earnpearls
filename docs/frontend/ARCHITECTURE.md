# Frontend Architecture and Route Map

## Overview

The active frontend is a React 18, TypeScript, React Router, and Vite single-page
application. It consumes only the canonical `/v1` API. The server owns identity,
capabilities, financial state, survey availability, payout availability, and every
state transition.

The implementation is maintained directly in this repository and reconciled against:

- `packages/contracts/src/index.ts`
- `docs/api/openapi.json`
- the Fastify route schemas that generate the OpenAPI document

No unresolved contract placeholder remains in active frontend code.

## Boundaries

| Boundary | Responsibility |
| --- | --- |
| `src/api/client.ts` | Cookie credentials, CSRF, JSON, canonical error envelopes, and zero automatic retries |
| `src/api/endpoints.ts` | Every consumed path, method, query, body, response, and idempotency header |
| `src/api/types.ts` | Frontend projections of canonical TypeBox/OpenAPI payloads |
| `src/session/SessionProvider.tsx` | Session loading and server-returned capabilities |
| `src/components/AppShell.tsx` | Capability-filtered navigation and authenticated layout |
| `src/lib/money.ts` | Exact integer-string validation and `BigInt` calculations |
| `src/routes/*` | Public, member, admin, and system screens |

Components do not call `fetch` directly. The client does not send `X-Request-Id`,
because the backend CORS contract does not accept it; support references come from the
server's nested error envelope.

## Route map

The implementation includes public auth/CMS/blog/FAQ routes; member dashboard, survey,
wallet, withdrawal, notification, leaderboard, support, profile, and security routes; and
the full capability-gated administrator operations surface. The maintained route/action/
capability table is in `docs/product/PRODUCT-BLUEPRINT.md`; exact API operations are generated
in `docs/api/openapi.json`.

`/dashboard` and `/admin/*` are canonical public entry aliases for `/app` and
`/app/admin/*`. They enter the same authentication and capability guards; the aliases
do not grant administrative access.

## Financial and mutation safety

- Point and micro-dollar values remain strings until parsed by `BigInt` helpers.
- USD display uses the API's exact six-decimal `usd` string.
- Wallet and withdrawal states are rendered verbatim and never simulated.
- Local-currency conversion remains absent while the API returns `null`.
- Mutations are never automatically retried.
- Identical withdrawal retries reuse the same idempotency key; a changed body receives
  a new key.
- Provider names appear only when a wallet transaction includes `providerLabel`.

## Deployment model

Vite proxies `/v1` to `http://127.0.0.1:3001` only in local development. A deployed
build expects the frontend and `/v1` reverse proxy on the same trusted origin. Browser
history fallback must route unknown non-API paths to `index.html`.
