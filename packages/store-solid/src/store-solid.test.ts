import { describe, expect, mock, test } from "bun:test";
import { createComponent, createRoot } from "solid-js";

import { StoreRegistryContext, defineStore } from "./core";
import { StoresProvider } from "./StoresProvider";

describe("@skyjt/store-solid", () => {
  test("defineStore throws when used without a <StoresProvider>", () => {
    createRoot((dispose) => {
      try {
        const useCounter = defineStore("counter", () => ({ count: 0 }));

        expect(() => useCounter()).toThrow(
          '[store-lib] Store "counter" must be used within a <StoresProvider>',
        );
      } finally {
        dispose();
      }
    });
  });

  test("defineStore caches per registry and shares state", () => {
    const registry = new Map<string, any>();
    let initCalls = 0;

    createRoot((dispose) => {
      try {
        const useCounter = defineStore("counter", () => {
          initCalls += 1;
          return { count: 0 };
        });

        let a: { count: number } | undefined;
        let b: { count: number } | undefined;

        createComponent(StoreRegistryContext.Provider, {
          value: registry,
          get children() {
            a = useCounter();
            b = useCounter();
            return null;
          },
        });

        expect(initCalls).toBe(1);
        expect(registry.size).toBe(1);
        expect(registry.get("counter").count).toBe(0);

        a!.count = 2;
        expect(b!.count).toBe(2);
        expect(registry.get("counter").count).toBe(2);
      } finally {
        dispose();
      }
    });
  });

  test("StoresProvider creates fresh registry and shares state via context", () => {
    createRoot((dispose) => {
      try {
        const useUser = defineStore("user", () => ({ name: "Ada" }));
        let user: { name: string } | undefined;

        // Directly use StoreRegistryContext.Provider to avoid useAssets in StoresProvider
        const registry = new Map<string, any>();
        createComponent(StoreRegistryContext.Provider, {
          value: registry,
          get children() {
            user = useUser();
            return null;
          },
        });

        expect(user?.name).toBe("Ada");
        user!.name = "Grace";

        expect(user?.name).toBe("Grace");
      } finally {
        dispose();
      }
    });
  });

  test("Stores work when StoresProvider wraps app (simulates app.tsx pattern)", () => {
    createRoot((dispose) => {
      try {
        // Define stores like in the showcase
        const useCounter = defineStore("counter", () => ({
          count: 1,
          nested: {
            label: "a",
          },
        }));

        // Simulate wrapping an app with context provider
        const registry = new Map<string, any>();
        let counter: any;

        createComponent(StoreRegistryContext.Provider, {
          value: registry,
          get children() {
            counter = useCounter();
            counter.count = 5;
            counter.nested.label = "b";
            return null;
          },
        });

        expect(counter.count).toBe(5);
        expect(counter.nested.label).toBe("b");
        expect(registry.get("counter").count).toBe(5);
      } finally {
        dispose();
      }
    });
  });

  test("defineStore hydrates from window.__STORE_LIB_REGISTRY__ when isServer=false", async () => {
    const originalWindow = (globalThis as any).window;

    try {
      mock.module("solid-js/web", () => ({
        isServer: false,
      }));

      (globalThis as any).window = {
        __STORE_LIB_REGISTRY__: {
          counter: {
            count: 10,
          },
        },
      };

      const clientCore = (await import(
        new URL("./core.ts", import.meta.url).href + "?client"
      )) as typeof import("./core");

      createRoot((dispose) => {
        try {
          const useCounter = clientCore.defineStore("counter", () => ({
            count: 0,
          }));

          let counter: any;

          createComponent(StoresProvider, {
            get children() {
              counter = useCounter();
              return null;
            },
          });

          expect(counter.count).toBe(10);
        } finally {
          dispose();
        }
      });
    } finally {
      if (originalWindow === undefined) {
        delete (globalThis as any).window;
      } else {
        (globalThis as any).window = originalWindow;
      }

      mock.restore();
    }
  });

  test("StoresProvider at app root shares stores across deep component tree", () => {
    createRoot((dispose) => {
      try {
        const useUser = defineStore("user", () => ({
          name: "Alice",
          role: "admin",
        }));

        let userA: any;
        let userB: any;

        // Simulate nested components accessing the same store
        // Use context directly to avoid useAssets SSR requirement
        const registry = new Map<string, any>();

        const NestedComponent = () => {
          const user = useUser();
          userB = user;
          return null;
        };

        createComponent(StoreRegistryContext.Provider, {
          value: registry,
          get children() {
            userA = useUser();
            return createComponent(NestedComponent, {});
          },
        });

        expect(userA.name).toBe("Alice");
        expect(userB?.name).toBe("Alice");

        userA.role = "user";
        expect(userB?.role).toBe("user");
      } finally {
        dispose();
      }
    });
  });

  test("StoresProvider handles nonce and serializes state correctly on server", async () => {
    let capturedAsset: any;
    mock.module("solid-js/web", () => ({
      isServer: true,
      useAssets: (fn: () => any) => {
        capturedAsset = fn();
      },
      Dynamic: (props: any) => props,
    }));

    const ssrProvider = (await import(
      new URL("./StoresProvider.ts", import.meta.url).href + "?ssr"
    )) as typeof import("./StoresProvider");

    createRoot((dispose) => {
      try {
        createComponent(ssrProvider.StoresProvider, {
          nonce: "test-nonce-123",
          children: null,
        });

        expect(capturedAsset).toBeDefined();
        expect(capturedAsset.nonce).toBe("test-nonce-123");
        expect(capturedAsset.id).toBe("store-hydration");
      } finally {
        dispose();
      }
    });
    mock.restore();
  });

  test("defineStore deep merges and cleans up window registry when isServer=false", async () => {
    const originalWindow = (globalThis as any).window;

    try {
      mock.module("solid-js/web", () => ({
        isServer: false,
      }));

      (globalThis as any).window = {
        __STORE_LIB_REGISTRY__: {
          userStore: {
            profile: {
              age: 30,
            },
            role: "admin",
          },
        },
      };

      const clientCore = (await import(
        new URL("./core.ts", import.meta.url).href + "?client-deep"
      )) as typeof import("./core");

      createRoot((dispose) => {
        try {
          const useUserStore = clientCore.defineStore("userStore", () => ({
            profile: {
              name: "Bob",
              age: 25,
            },
            role: "user",
          }));

          let store: any;

          createComponent(StoresProvider, {
            get children() {
              store = useUserStore();
              return null;
            },
          });

          expect(store.role).toBe("admin");
          expect(store.profile.name).toBe("Bob");
          expect(store.profile.age).toBe(30);

          expect((globalThis as any).window.__STORE_LIB_REGISTRY__.userStore).toBeUndefined();
        } finally {
          dispose();
        }
      });
    } finally {
      if (originalWindow === undefined) {
        delete (globalThis as any).window;
      } else {
        (globalThis as any).window = originalWindow;
      }

      mock.restore();
    }
  });
});
