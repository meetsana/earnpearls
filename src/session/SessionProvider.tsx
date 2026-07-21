import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { ApiFailure } from "../api/client";
import { api } from "../api/endpoints";
import type { Capability, SessionResponse } from "../api/types";

export type SessionState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "error"; error: unknown }
  | { status: "authenticated"; session: SessionResponse };

interface SessionContextValue {
  state: SessionState;
  refresh: () => Promise<void>;
  clear: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: "loading" });

  const refresh = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const session = await api.auth.session();
      setState({ status: "authenticated", session });
    } catch (error) {
      if (
        error instanceof ApiFailure &&
        error.error.kind === "unauthenticated"
      ) {
        setState({ status: "unauthenticated" });
      } else {
        setState({ status: "error", error });
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      refresh,
      clear: () => setState({ status: "unauthenticated" }),
    }),
    [refresh, state],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext(): SessionContextValue {
  const value = useContext(SessionContext);
  if (value === null)
    throw new Error("useSessionContext must be used inside SessionProvider");
  return value;
}

export function useSession(): SessionState {
  return useSessionContext().state;
}

export function useHasCapability(): (capability: Capability) => boolean {
  const state = useSession();
  return useCallback(
    (capability: Capability) =>
      state.status === "authenticated" &&
      state.session.capabilities.includes(capability),
    [state],
  );
}
