import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DependencyList,
} from "react";

export type ResourceState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: unknown };

export function useApiResource<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  dependencies: DependencyList = [],
) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<ResourceState<T>>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    loaderRef
      .current(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setState({ status: "error", error });
      });
    return () => controller.abort();
    // dependencies are controlled by the caller; loader is read through a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, reloadKey]);

  const reload = useCallback(() => setReloadKey((value) => value + 1), []);
  return { state, reload };
}
