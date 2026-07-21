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

function requirePair(environment, left, right) {
  const hasLeft = Boolean(environment[left]);
  const hasRight = Boolean(environment[right]);
  if (hasLeft !== hasRight) {
    throw new Error(`${left} and ${right} must be supplied together`);
  }
  return hasLeft && hasRight;
}

async function main() {
  const deploymentEnvironment = { ...process.env };
  if (!deploymentEnvironment.SMTP_URL) {
    throw new Error("SMTP_URL is required for staging email verification");
  }

  await runOnce(
    "database migration",
    "dist/db/migrate.js",
    deploymentEnvironment,
  );

  const shouldSeed = requirePair(
    deploymentEnvironment,
    "SEED_ADMIN_EMAIL",
    "SEED_ADMIN_PASSWORD",
  );
  if (shouldSeed) {
    await runOnce("staging seed", "dist/db/seed.js", deploymentEnvironment);
  }

  const runtimeEnvironment = { ...deploymentEnvironment };
  delete runtimeEnvironment.SEED_ADMIN_EMAIL;
  delete runtimeEnvironment.SEED_ADMIN_PASSWORD;
  delete runtimeEnvironment.SEED_ADMIN_COUNTRY;

  const apiEnvironment = { ...runtimeEnvironment };
  delete apiEnvironment.SMTP_URL;

  const api = runProcess("API", "dist/server.js", apiEnvironment);
  const email = runProcess(
    "email worker",
    "dist/workers/email.js",
    runtimeEnvironment,
  );
  const signal = new Promise((resolve) => {
    process.once("SIGTERM", () =>
      resolve({ label: "supervisor", signal: "SIGTERM" }),
    );
    process.once("SIGINT", () =>
      resolve({ label: "supervisor", signal: "SIGINT" }),
    );
  });
  const firstExit = await Promise.race([
    waitForExit("API", api),
    waitForExit("email worker", email),
    signal,
  ]);

  const expectedSignal = firstExit.label === "supervisor";
  process.stderr.write(
    `[staging] ${firstExit.label} requested shutdown (${firstExit.signal ?? `exit ${String(firstExit.code)}`})\n`,
  );
  for (const child of [api, email]) {
    if (child.exitCode === null && child.signalCode === null)
      child.kill("SIGTERM");
  }

  const force = setTimeout(() => {
    for (const child of [api, email]) {
      if (child.exitCode === null && child.signalCode === null)
        child.kill("SIGKILL");
    }
  }, 10_000);
  force.unref();
  await Promise.allSettled([
    waitForExit("API", api),
    waitForExit("email worker", email),
  ]);
  clearTimeout(force);
  process.exitCode = expectedSignal ? 0 : 1;
}

main().catch((error) => {
  process.stderr.write(
    `[staging] startup failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
