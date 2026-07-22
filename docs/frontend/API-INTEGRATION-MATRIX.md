# Frontend API Integration Matrix

All paths are relative to `/v1`. The canonical machine contract is
`docs/api/openapi.json`; `src/api/endpoints.ts` is the only browser request registry.
Authenticated requests include cookies and mutations forward the session CSRF token.

| Frontend area | API groups | Authority / special rule |
| --- | --- | --- |
| Public/auth | content settings/countries/pages/blog/FAQ; register/verify/login/reset/session | public schemas; recovery is enumeration-safe |
| Dashboard | dashboard aggregate | `dashboard.read`, verified email; effective feature settings |
| Profile/security | user profile/preferences/activity/password; auth sessions/logout | profile/security capabilities and CSRF |
| Surveys | list/detail/history/start | feature + survey capabilities; start is CSRF-protected |
| Wallet | summary and cursor transactions | feature + `wallet.read`; exact integer strings |
| Withdrawals | methods/history/create | dual safety switches; CSRF + stable idempotency key |
| Notifications | cursor list/count/status/mark-all | preference-aware notification capabilities |
| Support | categories/tickets/detail/create/reply | feature, owner scope, verified email, CSRF |
| Leaderboards | definitions/current/history | feature + read capability |
| Admin users/access | dashboard/users/detail/export/state/session/reset/roles/Limit Templates | granular admin capabilities, reason, audit |
| Admin finance | withdrawals/reconciliation/wallet settlement/payout methods | evidence, state machine, independent kill switches |
| Admin platform | settings/countries/providers/jobs/security/sync/analytics/audit | capability, safe config validation, audit |
| Admin experience | support, CMS/blog/FAQ, announcements/broadcasts/email templates, leaderboards | versioning/preferences/jobs and audited mutations |

The endpoint registry preserves trailing slashes where contracted, encodes path/query values,
does not invent client request IDs, and automatically retries no mutation. Withdrawal retries
reuse an idempotency key only for an identical body.

## Canonical errors

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human-readable message",
    "requestId": "server-request-id",
    "details": "optional safe context"
  }
}
```

The UI distinguishes validation, unauthenticated, denied, missing/disabled, conflict,
rate-limit, offline/network, and server errors. Production may omit `details`; raw stack,
SQL, secret, token, and payout destination never appear.

## Contract synchronization

```bash
npm run typecheck
npm run test:web
npm run openapi:generate
git diff --exit-code -- docs/api/openapi.json
```

Any API route/schema change must update TypeBox, endpoint/type projection, consuming screen,
tests, and relevant product/manual documentation in the same release.
