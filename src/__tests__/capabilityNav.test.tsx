import { describe, expect, it } from "vitest";

import {
  NAV_REGISTRY,
  visibleNavItems,
  type NavItem,
} from "../components/AppShell";

describe("capability-aware navigation", () => {
  it("includes only routes with an exact capability match", () => {
    const visible = visibleNavItems(NAV_REGISTRY, [
      "dashboard.read",
      "wallet.read",
    ]);
    expect(visible.map((item) => item.route)).toEqual(["/app", "/app/wallet"]);
  });

  it("keeps unavailable modules absent rather than disabled", () => {
    expect(visibleNavItems(NAV_REGISTRY, [])).toEqual([]);
  });

  it("does not translate legacy colon capabilities", () => {
    expect(visibleNavItems(NAV_REGISTRY, ["wallet:view"])).toEqual([]);
  });

  it("does not infer admin access from labels or identity", () => {
    const item: NavItem = {
      route: "/app/admin",
      label: "Admin",
      requiredCapability: "admin.dashboard.read",
    };
    expect(visibleNavItems([item], ["dashboard.read"])).toEqual([]);
  });
});
