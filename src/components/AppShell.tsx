import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { api } from "../api/endpoints";
import type { Capability } from "../api/types";
import { ErrorNotice } from "./AsyncStates";
import { useSessionContext } from "../session/SessionProvider";

export interface NavItem {
  route: string;
  label: string;
  requiredCapability: Capability;
}

export const NAV_REGISTRY: readonly NavItem[] = [
  { route: "/app", label: "Dashboard", requiredCapability: "dashboard.read" },
  {
    route: "/app/surveys",
    label: "Surveys",
    requiredCapability: "survey.read",
  },
  { route: "/app/wallet", label: "Wallet", requiredCapability: "wallet.read" },
  {
    route: "/app/withdrawals",
    label: "Withdrawals",
    requiredCapability: "withdrawal.read",
  },
  {
    route: "/app/security",
    label: "Security",
    requiredCapability: "security.sessions.manage",
  },
  {
    route: "/app/admin",
    label: "Admin dashboard",
    requiredCapability: "admin.dashboard.read",
  },
  {
    route: "/app/admin/users",
    label: "User moderation",
    requiredCapability: "admin.users.read",
  },
  {
    route: "/app/admin/withdrawals",
    label: "Withdrawal review",
    requiredCapability: "admin.withdrawals.read",
  },
  {
    route: "/app/admin/reconciliation",
    label: "Reconciliation",
    requiredCapability: "admin.surveys.reconcile",
  },
  {
    route: "/app/admin/audit-log",
    label: "Audit log",
    requiredCapability: "admin.audit.read",
  },
] as const;

export function visibleNavItems(
  items: readonly NavItem[],
  capabilities: readonly string[],
): NavItem[] {
  return items.filter((item) => capabilities.includes(item.requiredCapability));
}

export function AppShell() {
  const { state, clear } = useSessionContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<unknown>(null);
  const navigate = useNavigate();

  if (state.status !== "authenticated") return null;
  const items = visibleNavItems(NAV_REGISTRY, state.session.capabilities);

  async function logout() {
    setLogoutError(null);
    try {
      await api.auth.logout();
      clear();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(error);
    }
  }

  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header">
        <a className="brand" href="/app" aria-label="EarnPearls dashboard">
          <span className="brand-mark" aria-hidden="true">
            ◆
          </span>
          <span>EarnPearls</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button>
        <div className="account-summary">
          <span>{state.session.user.displayName}</span>
          <button
            className="button button--ghost"
            type="button"
            onClick={() => void logout()}
          >
            Sign out
          </button>
        </div>
      </header>
      <aside
        className={menuOpen ? "app-sidebar app-sidebar--open" : "app-sidebar"}
      >
        <nav id="primary-navigation" aria-label="Primary navigation">
          <ul>
            {items.map((item) => (
              <li key={item.route}>
                <NavLink
                  to={item.route}
                  end={item.route === "/app" || item.route === "/app/admin"}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <p className="sidebar-note">Your Time. Your Rewards.</p>
      </aside>
      <main id="main-content" className="app-main">
        {logoutError ? <ErrorNotice error={logoutError} /> : null}
        <Outlet />
      </main>
    </div>
  );
}
