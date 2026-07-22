import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/AppShell";
import { SessionProvider } from "./session/SessionProvider";
import {
  AdminAuditLog,
  AdminDashboard,
  AdminReconciliation,
  AdminUsers,
  AdminWithdrawals,
} from "./routes/admin";
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
import { NotFound } from "./routes/system";

export function CanonicalIndexRedirect() {
  return <Navigate replace to="/" />;
}

export function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/index.html" element={<CanonicalIndexRedirect />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
