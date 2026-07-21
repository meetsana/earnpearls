import type { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health/live", { schema: { tags: ["Health"] } }, async () => ({
    status: "ok",
  }));
  app.get(
    "/health/ready",
    { schema: { tags: ["Health"] } },
    async (_request, reply) => {
      const database = await app.db.ready();
      if (!database)
        return reply
          .code(503)
          .send({ status: "not_ready", checks: { database: false } });
      return { status: "ready", checks: { database: true } };
    },
  );
};
