import { ParentComponent, createComponent } from "solid-js";
import { isServer, useAssets, Dynamic } from "solid-js/web";
import { extractStoreState, StoreRegistryContext } from "./core";
import { unwrap } from "solid-js/store";
import { serialize } from "seroval";

export const StoresProvider: ParentComponent = (props) => {
  const registry = new Map<string, any>();

  if (isServer) {
    // useAssets ensures this code waits for all lazy routes and
    // Suspense boundaries to finish rendering before it executes
    useAssets(() => {
      const rawState: Record<string, any> = {};

      for (const [key, value] of registry.entries()) {
        rawState[key] = extractStoreState(value);
      }

      const serializedJS = serialize(rawState);

      return createComponent(Dynamic, {
        component: "script",
        id: "store-hydration",
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
