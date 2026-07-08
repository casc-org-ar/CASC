import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only after client-side hydration. `useSyncExternalStore` returns the
 * server snapshot (false) during SSR and the client snapshot (true) after
 * mount — the React-blessed way to gate client-only rendering (e.g.
 * `createPortal`) without a setState-in-effect, which the hooks lint rules
 * flag as a cascading render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
