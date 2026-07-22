import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import type { ReactNode } from "react";

import { AppShell } from "./components/AppShell";
import { api } from "./api/endpoints";
import { useApiResource } from "./hooks/useApiResource";
import { SessionProvider } from "./session/SessionProvider";
import {
  AdminAuditLog,
  AdminDashboard,
  AdminReconciliation,
  AdminUsers,
  AdminWithdrawals,
} from "./routes/admin";
import { AdminContent } from "./routes/admin-content";
import {
  AdminAnalytics,
  AdminCommunications,
  AdminLeaderboards,
  AdminSystemHealth,
} from "./routes/admin-insights";
import {
  AdminCountries,
  AdminJobs,
  AdminLimitTemplates,
  AdminProviders,
  AdminRoles,
  AdminSettings,
  AdminSupport,
  AdminSupportDetail,
  AdminUserDetail,
  AdminWithdrawalMethods,
} from "./routes/admin-operations";
import { Dashboard, Profile, Surveys, Wallet, Withdrawals } from "./routes/app";
import { RequireAuthentication, RequireCapability } from "./routes/RouteGuards";
import {
  ForgotPassword,
  Home,
  Login,
  Register,
  ResetPassword,
  VerifyEmail,
} from "./routes/public";
import {
  BlogIndex,
  BlogPostPage,
  FaqPage,
  PublicPage,
} from "./routes/public-content";
import { FeatureUnavailable, Maintenance, NotFound } from "./routes/system";
import {
  AccountProfile,
  Leaderboards,
  Notifications,
  SupportCenter,
  SupportTicketDetail,
} from "./routes/user-platform";

export function CanonicalIndexRedirect() {
  return <Navigate replace to="/" />;
}

export function CanonicalDashboardRedirect() {
  return <Navigate replace to="/app" />;
}

export function CanonicalAdminRedirect() {
  const { pathname, search, hash } = useLocation();
  const subpath = pathname.slice("/admin".length);

  return <Navigate replace to={`/app/admin${subpath}${search}${hash}`} />;
}

function PlatformGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const settings = useApiResource(() => api.content.settings());
  const administrativePath =
    location.pathname === "/login" ||
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/") ||
    location.pathname === "/app/admin" ||
    location.pathname.startsWith("/app/admin/");
  const feature = location.pathname.startsWith("/app/surveys")
    ? "surveys"
    : location.pathname.startsWith("/app/wallet")
      ? "wallet"
      : location.pathname.startsWith("/app/withdrawals")
        ? "withdrawals"
        : location.pathname.startsWith("/app/leaderboards")
          ? "leaderboards"
          : location.pathname.startsWith("/app/support")
            ? "support"
            : location.pathname.startsWith("/blog")
              ? "blog"
              : null;
  if (
    settings.state.status === "success" &&
    settings.state.data.maintenance.enabled &&
    !administrativePath
  ) {
    return <Maintenance message={settings.state.data.maintenance.message} />;
  }
  if (
    settings.state.status === "success" &&
    feature &&
    settings.state.data.features[feature] === false &&
    !administrativePath
  ) {
    return <FeatureUnavailable />;
  }
  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <PlatformGate>
          <Routes>
            <Route path="/index.html" element={<CanonicalIndexRedirect />} />
            <Route path="/dashboard" element={<CanonicalDashboardRedirect />} />
            <Route path="/admin/*" element={<CanonicalAdminRedirect />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/faq" element={<FaqPage />} />
            {["about", "contact", "privacy", "terms", "cookies"].map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<PublicPage />} />
            ))}

            <Route
              path="/app"
              element={
                <RequireAuthentication>
                  <AppShell />
                </RequireAuthentication>
              }
            >
              <Route
                index
                element={
                  <RequireCapability capability="dashboard.read">
                    <Dashboard />
                  </RequireCapability>
                }
              />
              <Route
                path="surveys"
                element={
                  <RequireCapability capability="survey.read">
                    <Surveys />
                  </RequireCapability>
                }
              />
              <Route
                path="wallet"
                element={
                  <RequireCapability capability="wallet.read">
                    <Wallet />
                  </RequireCapability>
                }
              />
              <Route
                path="withdrawals"
                element={
                  <RequireCapability capability="withdrawal.read">
                    <Withdrawals />
                  </RequireCapability>
                }
              />
              <Route
                path="security"
                element={
                  <RequireCapability capability="security.sessions.manage">
                    <Profile />
                  </RequireCapability>
                }
              />
              <Route
                path="profile"
                element={
                  <RequireCapability capability="profile.read">
                    <AccountProfile />
                  </RequireCapability>
                }
              />
              <Route
                path="notifications"
                element={
                  <RequireCapability capability="notification.read">
                    <Notifications />
                  </RequireCapability>
                }
              />
              <Route
                path="leaderboards"
                element={
                  <RequireCapability capability="leaderboard.read">
                    <Leaderboards />
                  </RequireCapability>
                }
              />
              <Route
                path="support"
                element={
                  <RequireCapability capability="support.read">
                    <SupportCenter />
                  </RequireCapability>
                }
              />
              <Route
                path="support/:ticketId"
                element={
                  <RequireCapability capability="support.read">
                    <SupportTicketDetail />
                  </RequireCapability>
                }
              />
              <Route
                path="admin"
                element={
                  <RequireCapability capability="admin.dashboard.read">
                    <AdminDashboard />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/users"
                element={
                  <RequireCapability capability="admin.users.read">
                    <AdminUsers />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/users/:userId"
                element={
                  <RequireCapability capability="admin.users.read">
                    <AdminUserDetail />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/withdrawals"
                element={
                  <RequireCapability capability="admin.withdrawals.read">
                    <AdminWithdrawals />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/reconciliation"
                element={
                  <RequireCapability capability="admin.surveys.reconcile">
                    <AdminReconciliation />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/audit-log"
                element={
                  <RequireCapability capability="admin.audit.read">
                    <AdminAuditLog />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/support"
                element={
                  <RequireCapability capability="admin.support.read">
                    <AdminSupport />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/support/:ticketId"
                element={
                  <RequireCapability capability="admin.support.read">
                    <AdminSupportDetail />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/content"
                element={
                  <RequireCapability capability="admin.content.read">
                    <AdminContent />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/providers"
                element={
                  <RequireCapability capability="admin.providers.read">
                    <AdminProviders />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/payout-methods"
                element={
                  <RequireCapability capability="admin.withdrawal_methods.manage">
                    <AdminWithdrawalMethods />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/countries"
                element={
                  <RequireCapability capability="admin.countries.manage">
                    <AdminCountries />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/settings"
                element={
                  <RequireCapability capability="admin.settings.read">
                    <AdminSettings />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/roles"
                element={
                  <RequireCapability capability="admin.roles.read">
                    <AdminRoles />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/limit-templates"
                element={
                  <RequireCapability capability="admin.limit_templates.manage">
                    <AdminLimitTemplates />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/jobs"
                element={
                  <RequireCapability capability="admin.jobs.read">
                    <AdminJobs />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/analytics"
                element={
                  <RequireCapability capability="admin.reports.read">
                    <AdminAnalytics />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/system-health"
                element={
                  <RequireCapability capability="admin.security.read">
                    <AdminSystemHealth />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/communications"
                element={
                  <RequireCapability capability="admin.notifications.manage">
                    <AdminCommunications />
                  </RequireCapability>
                }
              />
              <Route
                path="admin/leaderboards"
                element={
                  <RequireCapability capability="admin.leaderboards.manage">
                    <AdminLeaderboards />
                  </RequireCapability>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PlatformGate>
      </SessionProvider>
    </BrowserRouter>
  );
}
