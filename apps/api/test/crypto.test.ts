import { describe, expect, it } from "vitest";

import {
  decryptSensitive,
  encryptSensitive,
  hashPassword,
  maskDestination,
  randomToken,
  verifyPassword,
} from "../src/lib/crypto.js";

describe("security primitives", () => {
  it("hashes passwords with a random salt and verifies them", async () => {
    const first = await hashPassword(
      "correct horse battery staple",
      "test-pepper",
    );
    const second = await hashPassword(
      "correct horse battery staple",
      "test-pepper",
    );
    expect(first).not.toBe(second);
    await expect(
      verifyPassword("correct horse battery staple", first, "test-pepper"),
    ).resolves.toBe(true);
    await expect(
      verifyPassword("wrong password", first, "test-pepper"),
    ).resolves.toBe(false);
  });

  it("encrypts sensitive destinations using authenticated encryption", () => {
    const key = Buffer.alloc(32, 7);
    const encrypted = encryptSensitive("person@example.com", key);
    expect(encrypted).not.toContain("person@example.com");
    expect(decryptSensitive(encrypted, key)).toBe("person@example.com");
    expect(() => decryptSensitive(`${encrypted}broken`, key)).toThrow();
  });

  it("uses high entropy tokens and masks payout destinations", () => {
    expect(randomToken()).toHaveLength(43);
    expect(maskDestination("person@example.com")).toBe("p***n@example.com");
    expect(maskDestination("+1 555 123 4567")).toMatch(/4567$/);
  });
});
