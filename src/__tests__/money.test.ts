import { describe, expect, it } from "vitest";

import {
  addIntegerStrings,
  compareIntegerStrings,
  formatIntegerString,
  isPositiveIntegerString,
  pointsToUsdParts,
  toBigInt,
} from "../lib/money";

describe("exact money helpers", () => {
  it("preserves values beyond Number.MAX_SAFE_INTEGER", () => {
    const value = "9007199254740993";
    expect(toBigInt(value).toString()).toBe(value);
    expect(formatIntegerString(value)).toBe("9,007,199,254,740,993");
  });

  it("adds and compares without Number conversion", () => {
    expect(addIntegerStrings("9007199254740991", "2")).toBe("9007199254740993");
    expect(compareIntegerStrings("10", "9")).toBe(1);
    expect(compareIntegerStrings("-1", "0")).toBe(-1);
    expect(compareIntegerStrings("42", "42")).toBe(0);
  });

  it("rejects non-integer strings", () => {
    for (const value of ["1.5", "1e3", "", "12,000", "NaN", " 12"]) {
      expect(() => toBigInt(value)).toThrow();
    }
  });

  it("recognizes only positive withdrawal point strings", () => {
    expect(isPositiveIntegerString("1")).toBe(true);
    expect(isPositiveIntegerString("0001")).toBe(false);
    expect(isPositiveIntegerString("0")).toBe(false);
    expect(isPositiveIntegerString("-1")).toBe(false);
  });

  it("uses the API-supplied conversion ratio", () => {
    expect(pointsToUsdParts("2500", "800")).toEqual({
      usdWhole: "3",
      remainderPoints: "100",
    });
  });
});
