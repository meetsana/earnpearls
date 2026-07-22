# EarnPearls API Guide

The canonical machine contract is [openapi.json](openapi.json). It is generated from the
Fastify TypeBox route schemas:

```bash
npm run openapi:generate
git diff --exit-code -- docs/api/openapi.json
```

## Base and conventions

- API prefix: `/v1`
- Health: `/health/live`, `/health/ready`
- JSON request/response except CSV export and XML sitemap
- ISO 8601 UTC timestamps
- UUID identifiers
- point/USD-micro integers represented as decimal strings
- browser authentication through opaque cookies
- no automatic mutation retry without an idempotency contract

## Authentication and CSRF

Login issues `ep_session` (HttpOnly) and `ep_session_csrf` cookies. Authenticated
state-changing requests must send the exact CSRF cookie value in `X-CSRF-Token`. GET/HEAD
requests do not mutate. Provider webhook routes use their signature contract instead of a
member session.

`GET /v1/auth/session` is authoritative for current user, capabilities, and CSRF state.
Clients must not infer roles or invent absent capabilities.

## Error envelope

```json
{
  "error": {
    "code": "FEATURE_UNAVAILABLE",
    "message": "This feature is currently unavailable.",
    "requestId": "request-correlation-id",
    "details": {}
  }
}
```

`details` is optional and contains only safe validation context. Typical statuses: 400
validation, 401 unauthenticated, 403 denied/CSRF, 404 missing or hidden feature, 409 state
conflict/idempotency, 429 rate limit, 503 maintenance/readiness, 500 unexpected error.
Stack traces, SQL, tokens, secrets, and encrypted values are never returned.

## Idempotency

Withdrawal creation requires an `Idempotency-Key`. The same user/key/request returns the
stored response; a different payload conflicts. Provider events use provider/external event
uniqueness and signature validation. Jobs use type/deduplication keys for recurring work.

## Resource groups

| Group | Representative endpoints |
| --- | --- |
| Auth | register, verify, login/logout, session(s), reset |
| Users | profile, preferences, password, activity |
| Dashboard | aggregate member overview |
| Surveys | list/detail/history/start, provider webhook |
| Wallet | summary and cursor transaction history |
| Withdrawals | methods, list, idempotent request |
| Notifications | cursor list, count, status, mark-all-read |
| Support | categories, tickets, detail, create/reply |
| Content | settings, countries, pages, blog, FAQ, sitemap |
| Leaderboards | definitions, current ranking, history |
| Admin | users, ledger, withdrawals, settings, countries, roles, providers, jobs, content, support, analytics, communications, templates, leaderboards, audit/security |

Use the OpenAPI file for exact methods, paths, schemas, and status codes.

## Pagination and filtering

Chronological high-volume member lists use opaque cursors. Admin screens use explicit
bounded limits and filters. Cursors are not database IDs alone and must be treated as opaque.
Every maximum is enforced server-side; clients should not request unbounded exports except
the audited administrator CSV endpoint.

## Provider integration checklist

Before implementing an adapter:

1. Record contract, sandbox, countries, identifiers, signature algorithm, replay window,
   event states, reversal semantics, reward precision, launch requirements, and owner.
2. Add adapter code to the explicit registry; database configuration alone cannot enable it.
3. Verify raw bytes/signature before parsing trusted fields.
4. Normalize only documented events and reject unknown/inconsistent amounts.
5. Use durable provider event idempotency and immutable evidence.
6. Add fixture/unit/integration tests including replay, bad signature, amount mismatch,
   out-of-order event, reversal, timeout, and provider outage.
7. Expose sanitized health/sync evidence and a disable switch.
8. Keep provider disabled until security/product/operations approval is recorded.

## Client rules

- call only relative `/v1` paths in the browser;
- use `credentials: include` and the canonical API client;
- preserve integer strings and use `BigInt` helpers where arithmetic is required;
- never log cookies, CSRF, password/token, provider secret, or payout destination;
- honor `Retry-After` and show a helpful rate-limit state;
- do not turn a 404 hidden feature into an alternate unauthorized path.

## Versioning

Version 1 uses `/v1`. Additive response fields are allowed when schemas/clients tolerate
them. Breaking changes require `/v2` or a documented migration window. Database and API
versioning are separate; an API release must remain compatible with its rollout schema.

## Local exploration

With `ENABLE_SWAGGER=true`, open `http://localhost:3001/documentation`. Never expose Swagger
publicly in production without a separate access decision. Example health request:

```bash
curl --fail http://localhost:3001/health/ready
```
