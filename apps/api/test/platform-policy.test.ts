import { describe, expect, it } from "vitest";

import { validateSettingValue } from "../src/modules/admin/platform-service.js";

describe("platform setting policy", () => {
  it("accepts exact, policy-safe configuration shapes", () => {
    expect(() =>
      validateSettingValue("points_per_usd", { value: "1000" }),
    ).not.toThrow();
    expect(() =>
      validateSettingValue("currency_display", {
        base: "USD",
        localEstimatesEnabled: true,
        rates: { GBP: "0.781234", EUR: "0.920000" },
        asOf: "2026-07-22T00:00:00.000Z",
      }),
    ).not.toThrow();
  });

  it("preserves country, currency, storage, and retention safeguards", () => {
    expect(() =>
      validateSettingValue("registration", {
        enabled: true,
        requireCountryEnabled: false,
      }),
    ).toThrow(/Country launch enforcement/);
    expect(() =>
      validateSettingValue("currency_display", {
        base: "EUR",
        localEstimatesEnabled: false,
      }),
    ).toThrow(/USD is the accounting source/);
    expect(() =>
      validateSettingValue("support", {
        enabled: true,
        attachmentsEnabled: true,
        maxOpenTicketsPerUser: 5,
      }),
    ).toThrow(/object storage/);
    expect(() =>
      validateSettingValue("data_retention", {
        expiredSessionsDays: 0,
        deletedNotificationsDays: 30,
        sentEmailDays: 90,
      }),
    ).toThrow(/1 to 3650/);
  });
});
