import { describe, expect, it } from "vitest";

import {
  formatUsdMicros,
  pointsToUsdMicros,
  toMoney,
} from "../src/lib/money.js";

describe("money representation", () => {
  it("formats USD micros without floating point arithmetic", () => {
    expect(formatUsdMicros(1_234_567n)).toBe("1.234567");
    expect(formatUsdMicros(-5n)).toBe("-0.000005");
    expect(toMoney(1_000n, 1_000_000n)).toEqual({
      points: "1000",
      usdMicros: "1000000",
      usd: "1.000000",
    });
  });

  it("converts points deterministically using the configured ratio", () => {
    expect(pointsToUsdMicros(250n, 1_000n)).toBe(250_000n);
    expect(() => pointsToUsdMicros(1n, 0n)).toThrow(
      "pointsPerUsd must be positive",
    );
  });
});
