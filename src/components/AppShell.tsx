import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { api } from "../api/endpoints";
import type { Capability } from "../api/types";
import { useApiResource } from "../hooks/useApiResource";
import { ErrorNotice } from "./AsyncStates";
import { useSessionContext } from "../session/SessionProvider";

export interface NavItem {
  route: string;
  label: string;
  requiredCapability: Capability;
  feature?: string;
}

export const NAV_REGISTRY: readonly NavItem[] = [
  { route: "/app", label: "Dashboard", requiredCapability: "dashboard.read" },
  {
    route: "/app/surveys",
    label: "Surveys",
    requiredCapability: "survey.read",
    feature: "surveys",
  },
  {
    route: "/app/wallet",
    label: "Wallet",
    requiredCapability: "wallet.read",
    feature: "wallet",
  },
  {
    route: "/app/withdrawals",
    label: "Withdrawals",
    requiredCapability: "withdrawal.read",
    feature: "withdrawals",
  },
  {
    route: "/app/leaderboards",
    label: "Leaderboards",
    requiredCapability: "leaderboard.read",
    feature: "leaderboards",
  },
  {
    route: "/app/notifications",
    label: "Notifications",
    requiredCapability: "notification.read",
  },
  {
    route: "/app/support",
    label: "Support Center",
    requiredCapability: "support.read",
    feature: "support",
  },
  {
    route: "/app/profile",
    label: "Profile & preferences",
    requiredCapability: "profile.read",
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
    route: "/app/admin/support",
    label: "Support queue",
    requiredCapability: "admin.support.read",
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
  {
    route: "/app/admin/content",
    label: "Content studio",
    requiredCapability: "admin.content.read",
  },
  {
    route: "/app/admin/providers",
    label: "Providers",
    requiredCapability: "admin.providers.read",
  },
  {
    route: "/app/admin/payout-methods",
    label: "Payout methods",
    requiredCapability: "admin.withdrawal_methods.manage",
  },
  {
    route: "/app/admin/countries",
    label: "Countries",
    requiredCapability: "admin.countries.manage",
  },
  {
    route: "/app/admin/settings",
    label: "Platform settings",
    requiredCapability: "admin.settings.read",
  },
  {
    route: "/app/admin/roles",
    label: "Roles & access",
    requiredCapability: "admin.roles.read",
  },
  {
    route: "/app/admin/limit-templates",
    label: "Limit templates",
    requiredCapability: "admin.limit_templates.manage",
  },
  {
    route: "/app/admin/jobs",
    label: "Background jobs",
    requiredCapability: "admin.jobs.read",
  },
  {
    route: "/app/admin/analytics",
    label: "Analytics",
    requiredCapability: "admin.reports.read",
  },
  {
    route: "/app/admin/system-health",
    label: "System health",
    requiredCapability: "admin.security.read",
  },
  {
    route: "/app/admin/communications",
    label: "Communications",
    requiredCapability: "admin.notifications.manage",
  },
  {
    route: "/app/admin/leaderboards",
    label: "Leaderboards",
    requiredCapability: "admin.leaderboards.manage",
  },
] as const;

export function visibleNavItems(
  items: readonly NavItem[],
  capabilities: readonly string[],
  features?: Readonly<Record<string, boolean>>,
): NavItem[] {
  return items.filter(
    (item) =>
      capabilities.includes(item.requiredCapability) &&
      (!item.feature || features?.[item.feature] !== false),
  );
}

export function AppShell() {
  const { state, clear } = useSessionContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutError, setLogoutError] = useState<unknown>(null);
  const navigate = useNavigate();
  const publicSettings = useApiResource(() => api.content.settings());

  if (state.status !== "authenticated") return null;
  const items = visibleNavItems(
    NAV_REGISTRY,
    state.session.capabilities,
    publicSettings.state.status === "success"
      ? publicSettings.state.data.features
      : undefined,
  );

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
