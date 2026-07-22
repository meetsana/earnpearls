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
  child._label = label;
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

  // Determine if email worker should run
  const mailMailer = deploymentEnvironment.MAIL_MAILER || "smtp";
  const isLogMailer = mailMailer === "log";
  const hasSmtpUrl = Boolean(deploymentEnvironment.SMTP_URL);
  const shouldRunEmailWorker = !isLogMailer && hasSmtpUrl;

  if (isLogMailer) {
    console.log("[staging] MAIL_MAILER=log → email worker disabled");
  } else if (!hasSmtpUrl) {
    console.warn("[staging] SMTP_URL not set → email worker disabled (real emails will not be sent)");
  }

  // Run migrations
  await runOnce(
    "database migration",
    "dist/db/migrate.js",
    deploymentEnvironment,
  );

  // Seed admin if both seed variables exist
  const shouldSeed = requirePair(
    deploymentEnvironment,
    "SEED_ADMIN_EMAIL",
    "SEED_ADMIN_PASSWORD",
  );
  if (shouldSeed) {
    await runOnce("staging seed", "dist/db/seed.js", deploymentEnvironment);
  }

  // Prepare runtime environment: remove seed variables
  const runtimeEnvironment = { ...deploymentEnvironment };
  delete runtimeEnvironment.SEED_ADMIN_EMAIL;
  delete runtimeEnvironment.SEED_ADMIN_PASSWORD;
  delete runtimeEnvironment.SEED_ADMIN_COUNTRY;

  // API environment: we can keep SMTP_URL; API uses configured mailer
  const apiEnvironment = { ...runtimeEnvironment };

  // Start API
  const api = runProcess("API", "dist/server.js", apiEnvironment);

  // Start email worker conditionally
  let email = null;
  if (shouldRunEmailWorker) {
    email = runProcess(
      "email worker",
      "dist/workers/email.js",
      runtimeEnvironment,
    );
  } else {
    console.log("[staging] email worker not started (skipped)");
  }

  // Set up termination signal
  const signal = new Promise((resolve) => {
    process.once("SIGTERM", () =>
      resolve({ label: "supervisor", signal: "SIGTERM" }),
    );
    process.once("SIGINT", () =>
      resolve({ label: "supervisor", signal: "SIGINT" }),
    );
  });

  // Wait for first exit
  const processes = [api];
  if (email) processes.push(email);
  const exitPromises = processes.map(p => waitForExit(p._label, p));
  const firstExit = await Promise.race([...exitPromises, signal]);

  const expectedSignal = firstExit.label === "supervisor";
  process.stderr.write(
    `[staging] ${firstExit.label} requested shutdown (${firstExit.signal ?? `exit ${String(firstExit.code)}`})\n`,
  );

  // Terminate all processes
  for (const child of processes) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
    }
  }

  // Force kill after timeout
  const force = setTimeout(() => {
    for (const child of processes) {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill("SIGKILL");
      }
    }
  }, 10_000);
  force.unref();

  await Promise.allSettled(processes.map(p => waitForExit(p._label, p)));
  clearTimeout(force);

  process.exitCode = expectedSignal ? 0 : 1;
}

main().catch((error) => {
  process.stderr.write(
    `[staging] startup failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exitCode = 1;
});
