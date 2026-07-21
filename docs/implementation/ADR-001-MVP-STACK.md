# ADR-001 — MVP Runtime and Architecture

Status: **Provisional implementation decision — owner-authorized 24-hour build**

Date: 2026-07-21

## Decision

Build the first production-oriented vertical slice as a TypeScript modular monolith
using Fastify and PostgreSQL. Retain React/Vite as the frontend direction, connect it
through a generated OpenAPI contract and the shared `@earnpearls/contracts` package,
and deploy the backend as vendor-neutral containers.

## Why this option

- It aligns with the existing JavaScript/React repository and enables shared contracts.
- Fastify provides schema validation, structured logging, lifecycle hooks, rate limits,
  security headers, and OpenAPI without a large framework runtime.
- PostgreSQL provides the transactions, row locking, constraints, JSONB, arrays, and
  append-only enforcement needed by the wallet and audit domains.
- A modular monolith minimizes 24-hour delivery risk while keeping Auth, Wallet,
  Surveys, Withdrawals, Admin, and provider adapters as explicit module boundaries.
- Docker keeps hosting selection open and provides a migration path from a low-cost
  managed container/database combination to larger infrastructure.

## Alternatives deferred

- Laravel remains viable but would split the repository across two language ecosystems
  and slow shared-contract delivery for this build.
- Serverless functions were not selected as the initial runtime because wallet and
  withdrawal workflows benefit from ordinary PostgreSQL transactions and predictable
  connection/worker behavior.
- Microservices were rejected for the MVP because they would add deployment, tracing,
  consistency, and operational overhead before there is traffic evidence.

## Boundaries

This ADR does not select a hosting vendor, production region, provider, payout method,
KYC trigger, maturity schedule, backup policy, or business threshold. Those settings
remain disabled or configurable pending their owner decisions.
