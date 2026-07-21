import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { WithdrawalMethodsPanel } from "../routes/app";
import { Home } from "../routes/public";

describe("core screen accessibility", () => {
  it("has no detectable violations on the public home screen", async () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("renders a truthful accessible withdrawal-disabled state", async () => {
    const { container, getByRole } = render(
      <WithdrawalMethodsPanel methods={[]} />,
    );
    expect(
      getByRole("heading", { name: "Withdrawals are not available yet" }),
    ).toBeVisible();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("labels configured demo payout methods without enabling them", async () => {
    const { container, getByText, queryByLabelText } = render(
      <WithdrawalMethodsPanel
        methods={[
          {
            code: "demo_paypal",
            displayName: "PayPal (demo only)",
            enabled: false,
            minimum: {
              points: "5000",
              usdMicros: "5000000",
              usd: "5.000000",
            },
            fee: { points: "0", usdMicros: "0", usd: "0.000000" },
            supportedForUser: true,
          },
        ]}
      />,
    );
    expect(
      getByText("Withdrawals are disabled in this environment."),
    ).toBeVisible();
    expect(getByText("disabled")).toBeVisible();
    expect(queryByLabelText(/destination/i)).not.toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });
});
