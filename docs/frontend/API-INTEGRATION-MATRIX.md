# Frontend API Integration Matrix

All paths below are relative to `/v1`. Authenticated requests use
`credentials: "include"`. Authenticated mutations forward the exact
`ep_session_csrf` cookie value as `X-CSRF-Token`.

| Method | Path | Frontend consumer | Capability / special rule |
| --- | --- | --- | --- |
| POST | `/auth/register` | Registration | Public; 12-character minimum password |
| POST | `/auth/login` | Login | Public; refresh session after cookie issue |
| POST | `/auth/verify-email` | Email verification | Public token flow |
| POST | `/auth/password-reset/request` | Forgot password | Public, enumeration-safe message |
| POST | `/auth/password-reset/confirm` | Reset password | Public token flow |
| GET | `/auth/session` | Session provider | Cookie auth; capabilities used verbatim |
| GET | `/auth/sessions` | Security | `security.sessions.manage` |
| DELETE | `/auth/sessions/{sessionId}` | Security | CSRF; `security.sessions.manage` |
| POST | `/auth/logout` | App shell | CSRF |
| POST | `/auth/logout-all` | Security | CSRF |
| GET | `/dashboard/` | Dashboard | `dashboard.read`; verified email |
| GET | `/wallet/` | Wallet, withdrawals | `wallet.read`; verified email |
| GET | `/wallet/transactions?cursor&limit` | Wallet history | Cursor page; limit 1–100 |
| GET | `/surveys/` | Survey list | `survey.read`; array response |
| POST | `/surveys/{surveyId}/start` | Survey start | CSRF; `survey.start`; 201 response |
| GET | `/withdrawals/methods` | Withdrawal availability | `withdrawal.read`; may be empty |
| GET | `/withdrawals/` | Withdrawal history | Array response—not cursor paginated |
| POST | `/withdrawals/` | Withdrawal request | CSRF; `withdrawal.create`; `Idempotency-Key` 16–200 chars |
| GET | `/admin/dashboard` | Admin dashboard | `admin.dashboard.read` |
| GET | `/admin/users?search&status&limit` | User moderation | `admin.users.read` |
| PATCH | `/admin/users/{userId}/account-state` | User moderation action | CSRF; `admin.users.moderate`; reason required |
| GET | `/admin/withdrawals?status&limit` | Withdrawal review | `admin.withdrawals.read` |
| POST | `/admin/withdrawals/{id}/{approve\|reject\|mark-paid}` | Withdrawal decision | CSRF; `admin.withdrawals.review`; reason required |
| POST | `/admin/participations/{id}/{validate\|reject}` | Survey reconciliation | CSRF; `admin.surveys.reconcile`; provider evidence required |
| POST | `/admin/wallet-transactions/{id}/{mark-mature\|mark-withdrawable}` | Wallet settlement | CSRF; `admin.wallet.settle`; evidence required |
| GET | `/admin/audit-logs?action&limit` | Audit log | `admin.audit.read` |

The typed registry also covers limit-template read/create/update/clone operations for a
future screen. It does not expose provider, settings, profile-edit, or wallet-adjust
operations because those routes do not exist in the current OpenAPI contract.

## Canonical errors

Every API failure is parsed from:

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human-readable message",
    "requestId": "server-request-id",
    "details": "optional"
  }
}
```

The UI distinguishes 400, 401, 403, 404, 409, 429, network, and 5xx categories while
preserving the server message and request ID. Validation `details` remain `unknown`
because production intentionally may omit them.
