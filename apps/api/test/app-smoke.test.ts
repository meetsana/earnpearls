import { afterEach, describe, expect, it } from "vitest";

import { buildApp } from "../src/app.js";

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

  it("registers the MVP API surface in OpenAPI", async () => {
    const app = await buildApp();
    apps.push(app);
    await app.ready();
    const document = app.swagger() as { paths?: Record<string, unknown> };
    const paths = Object.keys(document.paths ?? {});
    expect(paths).toContain("/auth/register");
    expect(paths).toContain("/dashboard/");
    expect(paths).toContain("/wallet/");
    expect(paths).toContain("/surveys/");
    expect(paths).toContain("/withdrawals/");
    expect(paths).toContain("/admin/dashboard");
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
