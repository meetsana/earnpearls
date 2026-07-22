import { afterEach, describe, expect, it } from "vitest";

import { buildApp } from "../src/app.js";
import type { Database } from "../src/db/database.js";

process.env.LOG_LEVEL = "silent";

describe("API shell", () => {
  const apps: Awaited<ReturnType<typeof buildApp>>[] = [];

  afterEach(async () => {
    await Promise.all(apps.splice(0).map((app) => app.close()));
  });

  it("serves liveness without touching the database", async () => {
    const app = await buildApp();
    apps.push(app);
    const response = await app.inject({ method: "GET", url: "/health/live" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });

  it("registers the complete Version 1 API surface in OpenAPI", async () => {
    const app = await buildApp();
    apps.push(app);
    await app.ready();
    const document = app.swagger() as { paths?: Record<string, unknown> };
    const paths = Object.keys(document.paths ?? {});
    for (const path of [
      "/auth/register",
      "/dashboard/",
      "/wallet/",
      "/surveys/",
      "/withdrawals/",
      "/users/me",
      "/notifications/",
      "/leaderboards/",
      "/support/tickets",
      "/content/blog",
      "/content/sitemap.xml",
      "/admin/dashboard",
      "/admin/users/{userId}",
      "/admin/settings",
      "/admin/providers",
      "/admin/jobs",
      "/admin/support/tickets",
      "/admin/content/pages",
      "/admin/analytics",
      "/admin/security-events",
      "/admin/notifications/broadcast",
      "/admin/email-templates",
      "/admin/withdrawal-methods",
      "/admin/leaderboards",
    ]) {
      expect(paths).toContain(path);
    }
  });

  it("enforces maintenance before protected feature handlers", async () => {
    const database = {
      query: async (text: string) => ({
        rows: text.includes("key='maintenance'")
          ? [
              {
                value: {
                  enabled: true,
                  message: "Scheduled maintenance is active.",
                },
              },
            ]
          : [],
      }),
      close: async () => undefined,
    } as unknown as Database;
    const app = await buildApp({ database });
    apps.push(app);
    const response = await app.inject({ method: "GET", url: "/v1/wallet/" });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      error: { code: "MAINTENANCE_MODE" },
    });
  });

  it("denies direct API access when a feature is disabled", async () => {
    const database = {
      query: async (text: string) => ({
        rows: text.includes("key='maintenance'")
          ? [{ value: { enabled: false, message: "Available" } }]
          : text.includes("key='features'")
            ? [{ value: { surveys: false } }]
            : [],
      }),
      close: async () => undefined,
    } as unknown as Database;
    const app = await buildApp({ database });
    apps.push(app);
    const response = await app.inject({ method: "GET", url: "/v1/surveys/" });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: { code: "FEATURE_UNAVAILABLE" },
    });
  });

  it("returns a stable error envelope for unknown routes", async () => {
    const app = await buildApp();
    apps.push(app);
    const response = await app.inject({ method: "GET", url: "/missing" });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: { code: "ROUTE_NOT_FOUND" },
    });
  });
});
