# Security Policy

EarnPearls handles authentication and financial-like reward records. Do not report
vulnerabilities in public issues.

## Reporting

Send a private report to the repository owner through GitHub's private vulnerability
reporting feature. Include reproduction steps, affected endpoints, impact, and any
suggested mitigation. Do not include real credentials, payout destinations, provider
secrets, or personal data.

## Supported versions

Only the latest commit on the active production branch is supported during MVP
development. No branch is a production release until its deployment and security
gates are explicitly approved.

## Baseline controls

- Secrets are supplied through environment variables or a deployment secret manager.
- Passwords use memory-hard scrypt with a separate application pepper.
- Sessions are opaque, revocable, expiry-bound, and stored in HttpOnly cookies.
- State-changing authenticated requests require a session-bound CSRF token.
- Wallet entries, wallet events, audit logs, security events, and account-state events
  are append-only at the database layer.
- Payout destinations are encrypted with AES-256-GCM and separately masked for display.
- Provider events and withdrawal requests are idempotent.
- Production configuration rejects placeholder secrets, non-TLS database connections,
  and HTTP frontend origins. The email worker refuses to start without SMTP delivery.
