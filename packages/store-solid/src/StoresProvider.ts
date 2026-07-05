import { ParentComponent, createComponent } from "solid-js";
import { isServer, useAssets, Dynamic } from "solid-js/web";
import { extractStoreState, StoreRegistryContext } from "./core";
import { serialize } from "seroval";

/**
 * Props for the StoresProvider component.
 */
interface StoresProviderProps {
  nonce?: string;
}

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
