# Frontend QA Report

## Automated gates

Run from repository root:

```bash
npm run typecheck:web
npm run test:web
npm run build:web
```

The frontend suite covers:

- integer values beyond `Number.MAX_SAFE_INTEGER`;
- exact addition, comparison, grouping, positive-withdrawal validation, and a
  deliberately non-1000 points-per-USD ratio;
- CSRF cookie parsing with encoded values, embedded `=`, and delimiter variants;
- cookie credentials, exact CSRF forwarding, canonical idempotency header, absence of
  the unsupported `X-Request-Id` request header, nested API errors, and no mutation retry;
- exact trailing-slash paths and wallet cursor encoding;
- dot-notation capability matching, absent restricted navigation, and rejection of
  legacy colon syntax;
- a truthful withdrawal-disabled state;
- automated `axe-core` scans of the public home and withdrawal-disabled surfaces.

## Accessibility implementation

- Semantic header, navigation, main, section, form, table, definition-list, and time elements.
- Skip links on public and authenticated layouts.
- Visible focus rings and 44-pixel minimum interactive targets.
- Form labels, help text, persistent errors, status announcements, and disabled states.
- Status uses text plus a visual marker; color is never the sole signal.
- Responsive navigation, grids, forms, and horizontally scrollable data tables.
- Reduced-motion handling for transitions and the loading indicator.

Target: WCAG 2.2 AA. Automated tests are a regression gate, not a substitute for
manual keyboard, screen-reader, zoom, and contrast review before production.

## Required staging checks

1. Run register → email fixture → login → dashboard → surveys → wallet → logout against
   a real staging database and SMTP fixture.
2. Verify cookie `Secure`, `HttpOnly`, `SameSite`, expiry, rotation, and deletion in the
   deployed HTTPS environment.
3. Verify direct 401/403 navigation, 409 idempotency conflict, 429 rate limit, and 5xx
   request-ID presentation through a controlled staging fixture.
4. Exercise keyboard-only use at 320 px, 768 px, and desktop widths; test 200% browser zoom.
5. Run VoiceOver/NVDA on auth, wallet, withdrawal, and admin-decision flows.
6. Verify SPA history fallback and same-origin `/v1` reverse proxy configuration.
7. Confirm real provider launch URLs satisfy the deployment CSP/navigation policy.

## Deliberate production gates

Real survey providers and payout methods remain disabled. Therefore no UI test invents
provider names, methods, fees, minimums, maturity dates, or local-currency conversions.
