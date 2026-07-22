import fp from "fastify-plugin";

import { AppError } from "../lib/errors.js";

const routeFeatures = [
  { prefix: "/v1/surveys", feature: "surveys" },
  { prefix: "/v1/wallet", feature: "wallet" },
  { prefix: "/v1/withdrawals", feature: "withdrawals" },
  { prefix: "/v1/leaderboards", feature: "leaderboards" },
  { prefix: "/v1/support", feature: "support" },
  { prefix: "/v1/content/blog", feature: "blog" },
] as const;

export const featureFlagPlugin = fp(async (app) => {
  let cachedUntil = 0;
  let features: Record<string, boolean> = {};

  async function readFeatures(): Promise<Record<string, boolean>> {
    if (Date.now() < cachedUntil) return features;
    const result = await app.db.query<{ key: string; value: unknown }>(
      `SELECT key, value FROM system_settings
       WHERE key = ANY($1::TEXT[])`,
      [["features", "leaderboards", "support", "content"]],
    );
    const settings = new Map(result.rows.map((row) => [row.key, row.value]));
    const value = settings.get("features");
    const configured =
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? (value as Record<string, boolean>)
        : {};
    const settingEnabled = (key: string, field: string) => {
      const candidate = settings.get(key);
      return (
        typeof candidate === "object" &&
        candidate !== null &&
        !Array.isArray(candidate) &&
        (candidate as Record<string, unknown>)[field] === true
      );
    };
    features = {
      ...configured,
      leaderboards:
        configured.leaderboards === true &&
        settingEnabled("leaderboards", "enabled"),
      support:
        configured.support === true && settingEnabled("support", "enabled"),
      blog:
        configured.blog === true && settingEnabled("content", "blogEnabled"),
    };
    cachedUntil = Date.now() + 10_000;
    return features;
  }

  app.addHook("onRequest", async (request) => {
    const path = request.url.split("?", 1)[0] ?? request.url;
    if (
      path.startsWith("/v1/admin/") ||
      path.startsWith("/v1/surveys/providers/")
    ) {
      return;
    }
    const mapping = routeFeatures.find(
      ({ prefix }) => path === prefix || path.startsWith(`${prefix}/`),
    );
    if (!mapping) return;
    const state = await readFeatures();
    if (state[mapping.feature] !== true) {
      throw new AppError(
        404,
        "FEATURE_UNAVAILABLE",
        "This feature is not currently available.",
      );
    }
  });
});
