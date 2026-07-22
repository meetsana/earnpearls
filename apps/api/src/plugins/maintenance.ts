import fp from "fastify-plugin";

import { AppError } from "../lib/errors.js";

export const maintenancePlugin = fp(async (app) => {
  let cachedUntil = 0;
  let maintenance = { enabled: false, message: "" };

  async function readMaintenance() {
    if (Date.now() < cachedUntil) return maintenance;
    const result = await app.db.query<{
      value: { enabled?: boolean; message?: string };
    }>("SELECT value FROM system_settings WHERE key='maintenance'");
    const value = result.rows[0]?.value;
    maintenance = {
      enabled: value?.enabled === true,
      message:
        typeof value?.message === "string"
          ? value.message
          : "EarnPearls is temporarily unavailable.",
    };
    cachedUntil = Date.now() + 10_000;
    return maintenance;
  }

  app.addHook("onRequest", async (request) => {
    const path = request.url.split("?", 1)[0] ?? request.url;
    if (!path.startsWith("/v1/")) return;
    const exempt =
      path === "/v1/content/settings" ||
      path.startsWith("/v1/admin/") ||
      (path.startsWith("/v1/auth/") && path !== "/v1/auth/register");
    if (exempt) return;
    const state = await readMaintenance();
    if (state.enabled) {
      throw new AppError(503, "MAINTENANCE_MODE", state.message);
    }
  });
});
