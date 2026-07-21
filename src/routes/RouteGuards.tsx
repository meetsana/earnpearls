import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import type { Capability } from "../api/types";
import { ErrorNotice, LoadingState } from "../components/AsyncStates";
import { useSessionContext } from "../session/SessionProvider";
import { AccessDenied } from "./system";

export function RequireAuthentication({ children }: { children: ReactNode }) {
  const { state, refresh } = useSessionContext();

  if (state.status === "loading")
    return <LoadingState label="Checking your session" />;
  if (state.status === "unauthenticated")
    return <Navigate to="/login" replace />;
  if (state.status === "error")
    return <ErrorNotice error={state.error} onRetry={refresh} />;
  return <>{children}</>;
}

export function RequireCapability({
  capability,
  children,
}: {
  capability: Capability;
  children: ReactNode;
}) {
  const { state } = useSessionContext();
  if (state.status !== "authenticated") return null;
  if (!state.session.capabilities.includes(capability)) return <AccessDenied />;
  return <>{children}</>;
}
