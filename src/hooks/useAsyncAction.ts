import { useCallback, useState } from "react";

export type ActionState<T> =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; data: T }
  | { status: "error"; error: unknown };

export function useAsyncAction<T>() {
  const [state, setState] = useState<ActionState<T>>({ status: "idle" });

  const run = useCallback(
    async (operation: () => Promise<T>): Promise<T | null> => {
      setState({ status: "submitting" });
      try {
        const data = await operation();
        setState({ status: "success", data });
        return data;
      } catch (error) {
        setState({ status: "error", error });
        return null;
      }
    },
    [],
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);
  return { state, run, reset };
}
