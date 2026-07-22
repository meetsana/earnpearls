import { spawn } from "node:child_process";

const apiDirectory = "/app/apps/api";

function runProcess(label, script, environment) {
  const child = spawn(process.execPath, [script], {
    cwd: apiDirectory,
    env: environment,
    stdio: "inherit",
  });
  child.on("error", (error) => {
    process.stderr.write(
      `[staging] ${label} failed to start: ${error.message}\n`,
    );
  });
  return child;
}

function waitForExit(label, child) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve({
      label,
      code: child.exitCode,
      signal: child.signalCode,
    });
  }
  return new Promise((resolve) => {
    child.once("exit", (code, signal) => resolve({ label, code, signal }));
    child.once("error", () => resolve({ label, code: 1, signal: null }));
  });
}

async function runOnce(label, script, environment) {
  const child = runProcess(label, script, environment);
  const result = await waitForExit(label, child);
  if (result.code !== 0) {
    throw new Error(
      `${label} failed (${result.signal ?? `exit ${String(result.code)}`})`,
    );
  }
}

async function main() {
  const env = { ...process.env };

  // Run migrations
  await runOnce("database migration", "dist/db/migrate.js", env);

  // Seed admin if both seed variables exist
  if (env.SEED_ADMIN_EMAIL && env.SEED_ADMIN_PASSWORD) {
    await runOnce("staging seed", "dist/db/seed.js", env);
  }

  // Remove seed variables from runtime environment
  const runtimeEnv = { ...env };
  delete runtimeEnv.SEED_ADMIN_EMAIL;
  delete runtimeEnv.SEED_ADMIN_PASSWORD;
  delete runtimeEnv.SEED_ADMIN_COUNTRY;

  // Start API only (no email worker)
  const api = runProcess("API", "dist/server.js", runtimeEnv);

  // Wait for termination signal
  const signal = new Promise((resolve) => {
    process.once("SIGTERM", () =>
      resolve({ label: "supervisor", signal: "SIGTERM" }),
    );
    process.once("SIGINT", () =>
      resolve({ label: "supervisor", signal: "SIGINT" }),
    );
  });

  const exit = await Promise.race([waitForExit("API", api), signal]);

  if (exit.label !== "supervisor") {
    process.stderr.write(
      `[staging] API exited (${exit.signal ?? `exit ${String(exit.code)}`})\n`,
    );
    process.exitCode = 1;
  } else {
    process.exitCode = 0;
  }

  // Terminate API if still running
  if (api.exitCode === null && api.signalCode === null) {
    api.kill("SIGTERM");
  }
}

main().catch((error) => {
  process.stderr.write(`[staging] startup failed: ${error.message}\n`);
  process.exitCode = 1;
});
