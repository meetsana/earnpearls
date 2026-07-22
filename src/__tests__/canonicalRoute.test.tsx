import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";

import {
  CanonicalAdminRedirect,
  CanonicalDashboardRedirect,
  CanonicalIndexRedirect,
} from "../App";
import { resolvePostLoginPath } from "../routes/public";

function LocationEcho() {
  const location = useLocation();
  return (
    <output>{`${location.pathname}${location.search}${location.hash}`}</output>
  );
}

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

  it("redirects /dashboard to the protected dashboard", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<CanonicalDashboardRedirect />} />
          <Route path="/app" element={<h1>Member dashboard</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Member dashboard" }),
    ).toBeVisible();
  });

  it("redirects /admin to the protected admin application", async () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin/*" element={<CanonicalAdminRedirect />} />
          <Route path="/app/admin" element={<h1>Administrator dashboard</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("heading", { name: "Administrator dashboard" }),
    ).toBeVisible();
  });

  it("preserves an admin subpath, query, and fragment", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/users?status=limited#results"]}>
        <Routes>
          <Route path="/admin/*" element={<CanonicalAdminRedirect />} />
          <Route path="/app/admin/users" element={<LocationEcho />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("/app/admin/users?status=limited#results"),
    ).toBeVisible();
  });

  it("restores only protected same-origin paths after login", () => {
    expect(resolvePostLoginPath({ returnTo: "/app/admin" })).toBe("/app/admin");
    expect(resolvePostLoginPath({ returnTo: "https://example.com" })).toBe(
      "/app",
    );
    expect(resolvePostLoginPath({ returnTo: "//example.com/app" })).toBe(
      "/app",
    );
  });
});
