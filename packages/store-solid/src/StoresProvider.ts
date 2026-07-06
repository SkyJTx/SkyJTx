import { ParentComponent, createComponent } from "solid-js";
import { isServer, useAssets, Dynamic } from "solid-js/web";
import { extractStoreState, StoreRegistryContext } from "./core";
import { serialize } from "seroval";

/**
 * Props for the {@link StoresProvider} component.
 */
interface StoresProviderProps {
  /**
   * Optional security nonce value to be injected into the hydration `<script>` tag.
   */
  nonce?: string;
}

/**
 * Context Provider component that wraps your application to manage global reactive stores.
 *
 * During server-side rendering (SSR), it automatically collects the state of all active
 * stores, serializes them using `seroval`, and injects a hydration script into the page assets.
 * On the client side, defined stores will automatically merge and hydrate from this serialized state.
 *
 * @param props - Component props including children and optional nonce.
 */
export const StoresProvider: ParentComponent<StoresProviderProps> = (props) => {
  const registry = new Map<string, any>();

  if (isServer) {
    useAssets(() => {
      const rawState: Record<string, any> = {};

      for (const [key, value] of registry.entries()) {
        rawState[key] = extractStoreState(value);
      }

      const serializedJS = serialize(rawState);

      return createComponent(Dynamic, {
        component: "script",
        id: "store-hydration",
        ...(props.nonce ? { nonce: props.nonce } : {}),
        innerHTML: `window.__STORE_LIB_REGISTRY__ = ${serializedJS};`,
      });
    });
  }

  return createComponent(StoreRegistryContext.Provider, {
    value: registry,
    get children() {
      return props.children;
    },
  });
};
