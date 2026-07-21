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
});
