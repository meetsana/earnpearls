import { buildApp } from "./app.js";

const app = await buildApp();

async function shutdown(signal: string): Promise<void> {
  app.log.info({ signal }, "shutdown requested");
  const force = setTimeout(() => process.exit(1), 10_000);
  force.unref();
  await app.close();
  process.exit(0);
}

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));

try {
  await app.listen({ host: app.config.host, port: app.config.port });
} catch (error) {
  app.log.fatal({ err: error }, "server startup failed");
  await app.close();
  process.exit(1);
}
