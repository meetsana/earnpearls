import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
const scryptParameters = Object.freeze({
  N: 32_768,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
});

function deriveScrypt(
  password: string,
  salt: Buffer,
  keyLength: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(
      password,
      salt,
      keyLength,
      scryptParameters,
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      },
    );
  });
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function hashIp(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value, "utf8").digest("hex");
}

export async function hashPassword(
  password: string,
  pepper: string,
): Promise<string> {
  const salt = randomBytes(16);
  const derived = await deriveScrypt(`${password}${pepper}`, salt, 64);
  return [
    "scrypt",
    `N=${scryptParameters.N},r=${scryptParameters.r},p=${scryptParameters.p}`,
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  encoded: string,
  pepper: string,
): Promise<boolean> {
  const [algorithm, parameters, saltEncoded, hashEncoded] = encoded.split("$");
  if (algorithm !== "scrypt" || !parameters || !saltEncoded || !hashEncoded)
    return false;
  const parsed = Object.fromEntries(
    parameters.split(",").map((item) => item.split("=")),
  );
  const N = Number(parsed.N);
  const r = Number(parsed.r);
  const p = Number(parsed.p);
  if (
    N !== scryptParameters.N ||
    r !== scryptParameters.r ||
    p !== scryptParameters.p
  )
    return false;

  const salt = Buffer.from(saltEncoded, "base64url");
  const expected = Buffer.from(hashEncoded, "base64url");
  const actual = await deriveScrypt(
    `${password}${pepper}`,
    salt,
    expected.length,
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function encryptSensitive(plaintext: string, key: Buffer): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}

export function decryptSensitive(encoded: string, key: Buffer): string {
  const [version, ivEncoded, tagEncoded, ciphertextEncoded] =
    encoded.split(".");
  if (version !== "v1" || !ivEncoded || !tagEncoded || !ciphertextEncoded) {
    throw new Error("Unsupported ciphertext format");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(ivEncoded, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextEncoded, "base64url")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}

export function maskDestination(destination: string): string {
  const atIndex = destination.indexOf("@");
  if (atIndex > 1) {
    const local = destination.slice(0, atIndex);
    const domain = destination.slice(atIndex);
    return `${local[0]}***${local.at(-1)}${domain}`;
  }
  const compact = destination.replace(/\s+/g, "");
  if (compact.length <= 4) return "*".repeat(compact.length);
  return `${"*".repeat(Math.min(8, compact.length - 4))}${compact.slice(-4)}`;
}
