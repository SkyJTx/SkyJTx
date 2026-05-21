import { createContext, useContext } from "solid-js";
import { useReactive } from "@skyjt/signals-solid";
import { isServer } from "solid-js/web";
import { unwrap } from "solid-js/store";
import type { StoreInitializer } from "./types";

declare global {
  interface Window {
    __STORE_LIB_REGISTRY__: Record<string, any>;
  }
}

export const StoreRegistryContext = createContext<Map<string, any>>();

export function defineStore<T extends object>(
  name: string,
  storeInitalizer: () => T,
): StoreInitializer<T> {
  return () => {
    const registry = useContext(StoreRegistryContext);

    if (!registry) {
      throw new Error(
        `[store-lib] Store "${name}" must be used within a <StoresProvider>`,
      );
    }

    if (!registry.has(name)) {
      const store = storeInitalizer();
      if (
        !isServer &&
        typeof window !== "undefined" &&
        window.__STORE_LIB_REGISTRY__ &&
        window.__STORE_LIB_REGISTRY__[name]
      ) {
        Object.assign(store, window.__STORE_LIB_REGISTRY__[name]);
      }

      registry.set(name, store);
    }

    const store = registry.get(name) as T;
    return useReactive(store);
  };
}

export function extractStoreState<T extends object>(store: T): T {
  const raw = unwrap(store);
  const seen = new WeakMap();

  function recursiveExtract(value: any): any {
    if (value === null || typeof value !== "object") {
      return value;
    }

    if (value.constructor !== Object && value.constructor !== Array) {
      return value;
    }

    if (seen.has(value)) {
      return seen.get(value);
    }

    const isArray = Array.isArray(value);
    const cleanValue: any = isArray ? [] : {};
    seen.set(value, cleanValue);

    const keys = Reflect.ownKeys(value);

    for (const key of keys) {
      if (isArray && key === "length") continue;

      const descriptor = Object.getOwnPropertyDescriptor(value, key);

      if (!descriptor) continue;

      if (descriptor.get || descriptor.set) continue;
      if (typeof descriptor.value === "function") continue;
      if (!descriptor.enumerable) continue;

      if (typeof descriptor.value === "object" && descriptor.value !== null) {
        cleanValue[key] = recursiveExtract(descriptor.value);
      } else {
        cleanValue[key] = descriptor.value;
      }
    }

    return cleanValue;
  }

  return recursiveExtract(raw) as T;
}
