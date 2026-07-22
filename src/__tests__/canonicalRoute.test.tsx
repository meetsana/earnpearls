import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { CanonicalIndexRedirect } from "../App";

describe("canonical public route", () => {
  it("redirects /index.html to the home route", async () => {
    render(
      <MemoryRouter initialEntries={["/index.html"]}>
        <Routes>
          <Route path="/index.html" element={<CanonicalIndexRedirect />} />
          <Route path="/" element={<h1>EarnPearls home</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "EarnPearls home" }),
    ).toBeVisible();
  });
});
