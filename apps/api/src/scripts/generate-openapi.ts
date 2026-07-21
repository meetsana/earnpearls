import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { buildApp } from "../app.js";

const app = await buildApp();
try {
  await app.ready();
  const output = resolve(process.cwd(), "../../docs/api/openapi.json");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(
    output,
    `${JSON.stringify(app.swagger(), null, 2)}\n`,
    "utf8",
  );
  process.stdout.write(`${output}\n`);
} finally {
  await app.close();
}
