import { describe, expect, it } from "vitest";

import { canTransitionWalletBucket } from "../src/modules/wallet/service.js";

describe("wallet lifecycle state machine", () => {
  it("permits only explicit lifecycle transitions", () => {
    expect(canTransitionWalletBucket("pending", "validated")).toBe(true);
    expect(canTransitionWalletBucket("validated", "mature")).toBe(true);
    expect(canTransitionWalletBucket("mature", "withdrawable")).toBe(true);
    expect(canTransitionWalletBucket("withdrawable", "reserved")).toBe(true);
    expect(canTransitionWalletBucket("reserved", "paid")).toBe(true);
  });

  it("prohibits time-skipping and paid-state reuse", () => {
    expect(canTransitionWalletBucket("pending", "mature")).toBe(false);
    expect(canTransitionWalletBucket("pending", "withdrawable")).toBe(false);
    expect(canTransitionWalletBucket("validated", "withdrawable")).toBe(false);
    expect(canTransitionWalletBucket("paid", "withdrawable")).toBe(false);
  });

  it("supports explicit rejection and reversal paths", () => {
    expect(canTransitionWalletBucket("pending", "rejected")).toBe(true);
    expect(canTransitionWalletBucket("validated", "rejected")).toBe(true);
    expect(canTransitionWalletBucket("reserved", "withdrawable")).toBe(true);
    expect(canTransitionWalletBucket("paid", "reversed")).toBe(true);
  });
});
