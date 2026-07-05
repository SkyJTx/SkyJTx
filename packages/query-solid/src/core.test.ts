import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";

let createComponent!: typeof import("solid-js").createComponent;
let createRoot!: typeof import("solid-js").createRoot;
let createSignal!: typeof import("solid-js").createSignal;

let QueryClient!: typeof import("./core").QueryClient;
let QueryClientContext!: typeof import("./core").QueryClientContext;
let useSolidMutation!: typeof import("./core").useSolidMutation;
let useSolidQuery!: typeof import("./core").useSolidQuery;
let hashKey!: typeof import("./core").hashKey;

beforeAll(async () => {
  // Query-solid's SSR boundary checks are based on `isServer`.
  // In unit tests we treat the runtime as client-like.
  mock.module("solid-js/web", () => ({
    isServer: false,
    useAssets: () => undefined,
    Dynamic: () => null,
  }));

  ({ createComponent, createRoot, createSignal } = await import("solid-js"));

  const core = (await import(
    new URL("./core.ts", import.meta.url).href + "?client-solid"
  )) as typeof import("./core");

  ({ QueryClient, QueryClientContext, useSolidMutation, useSolidQuery, hashKey } = core);
});

afterAll(() => {
  mock.restore();
});

const flush = (): Promise<void> =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

const defer = <T>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject,
  };
};

describe("@skyjt/query-solid", () => {
  test("useSolidQuery throws when used without a <QueriesProvider>", () => {
    createRoot((dispose) => {
      try {
        expect(() =>
          useSolidQuery({
            queryKey: "user",
            queryFn: async () => ({ id: "1" }),
          }),
        ).toThrow(
          "[query-solid] useSolidQuery must be used within a <QueriesProvider>",
        );
      } finally {
        dispose();
      }
    });
  });

  test("useSolidQuery success resolves data and caches result", async () => {
    let dispose = () => {};
    const client = new QueryClient();
    const deferred = defer<{ id: string }>();

    let query: any;
    let queryCalls = 0;

    createRoot((rootDispose) => {
      dispose = rootDispose;

      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          query = useSolidQuery({
            queryKey: "user:1",
            queryFn: async () => {
              queryCalls += 1;
              return deferred.promise;
            },
          });

          return null;
        },
      });
    });

    try {
      await flush();

      expect(queryCalls).toBe(1);
      expect(query.isLoading).toBe(true);
      expect(query.isError).toBe(false);
      expect(query.isSuccess).toBe(false);
      expect(query.data).toBeUndefined();

      const payload = { id: "1" };
      deferred.resolve(payload);

      await flush();
      await flush();

      expect(queryCalls).toBe(1);
      expect(query.isLoading).toBe(false);
      expect(query.isError).toBe(false);
      expect(query.isSuccess).toBe(true);
      expect(query.data).toEqual(payload);
      expect(client.getCache("user:1")).toEqual(payload);
    } finally {
      dispose();
    }
  });

  test("useSolidQuery failure exposes error", async () => {
    let dispose = () => {};
    const client = new QueryClient();
    const deferred = defer<never>();

    let query: any;

    createRoot((rootDispose) => {
      dispose = rootDispose;

      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          query = useSolidQuery({
            queryKey: "user:404",
            queryFn: async () => deferred.promise,
          });

          return null;
        },
      });
    });

    try {
      await flush();
      expect(query.isLoading).toBe(true);

      const err = new Error("User not found");
      deferred.reject(err);

      await flush();
      await flush();

      expect(query.isLoading).toBe(false);
      expect(query.isSuccess).toBe(false);
      expect(query.isError).toBe(true);
      expect(String(query.error)).toContain("User not found");
    } finally {
      dispose();
    }
  });

  test("queryKey can be reactive and caches per key", async () => {
    let dispose = () => {};
    const client = new QueryClient();

    let setUserId!: (value: string) => void;
    let query: any;
    let calls = 0;

    const key = (id: string) => JSON.stringify(["user", id]);

    createRoot((rootDispose) => {
      dispose = rootDispose;
      const [userId, setId] = createSignal("1");
      setUserId = setId;

      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          query = useSolidQuery({
            queryKey: () => ["user", userId()],
            queryFn: async () => {
              calls += 1;
              return { id: userId(), call: calls };
            },
            staleTime: 5000,
          });

          return null;
        },
      });
    });

    try {
      await flush();
      await flush();

      expect(calls).toBe(1);
      expect(query.isSuccess).toBe(true);
      expect(query.data).toEqual({ id: "1", call: 1 });
      expect(client.getCache(key("1"))).toEqual({ id: "1", call: 1 });

      setUserId("2");
      await flush();
      await flush();

      expect(calls).toBe(2);
      expect(query.data).toEqual({ id: "2", call: 2 });
      expect(client.getCache(key("2"))).toEqual({ id: "2", call: 2 });

      // Switching back to an existing key should reuse cache.
      setUserId("1");
      await flush();
      await flush();

      expect(calls).toBe(2);
      expect(query.data).toEqual({ id: "1", call: 1 });
    } finally {
      dispose();
    }
  });

  test("client hydration: uses window.__QUERY_LIB_REGISTRY__ and does not call queryFn", async () => {
    const originalWindow = (globalThis as any).window;

    try {
      const hydratedKey = JSON.stringify(["user", "7"]);
      const hydratedValue = {
        id: "7",
        name: "Hydrated",
      };

      (globalThis as any).window = {
        __QUERY_LIB_REGISTRY__: {
          [hydratedKey]: hydratedValue,
        },
      };

      let dispose = () => {};
      const client = new QueryClient();
      let query: any;
      let queryCalls = 0;

      createRoot((rootDispose) => {
        dispose = rootDispose;

        createComponent(QueryClientContext.Provider, {
          value: client,
          get children() {
            query = useSolidQuery({
              queryKey: () => ["user", "7"],
              queryFn: async () => {
                queryCalls += 1;
                return {
                  id: "7",
                  name: "Fetched",
                };
              },
            });

            return null;
          },
        });
      });

      try {
        await flush();
        await flush();

        expect(queryCalls).toBe(0);
        expect(query.isSuccess).toBe(true);
        expect(query.data).toEqual(hydratedValue);
        expect(client.getCache(hydratedKey)).toEqual(hydratedValue);
      } finally {
        dispose();
      }
    } finally {
      if (originalWindow === undefined) {
        delete (globalThis as any).window;
      } else {
        (globalThis as any).window = originalWindow;
      }
    }
  });

  test("useSolidQuery narrows data when initialData is provided", () => {
    let dispose = () => {};
    const client = new QueryClient();

    createRoot((rootDispose) => {
      dispose = rootDispose;

      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          const query = useSolidQuery({
            queryKey: "typed:seeded",
            queryFn: async () => ({ id: "1" }),
            initialData: { id: "seed" },
          });

          const typedData: { id: string } = query.data;
          void typedData;

          return null;
        },
      });
    });

    dispose();
  });

  test("useSolidMutation success updates state and calls callbacks", async () => {
    let dispose = () => {};
    const deferred = defer<{ ok: boolean }>();

    const events: string[] = [];
    let mutation: any;

    createRoot((rootDispose) => {
      dispose = rootDispose;

      mutation = useSolidMutation<{ id: number }, { ok: boolean }>({
        mutationFn: async (variables) => {
          events.push(`fn:${variables.id}`);
          return deferred.promise;
        },
        onSuccess(data, variables) {
          events.push(`success:${String(data.ok)}:${variables.id}`);
        },
        onError(error, variables) {
          events.push(`error:${String(error)}:${variables.id}`);
        },
        onSettled(data, error, variables) {
          events.push(
            `settled:${String(data?.ok)}:${error ? "err" : "null"}:${variables.id}`,
          );
        },
      });
    });

    try {
      const pending = mutation.mutateAsync({ id: 1 });

      expect(mutation.isPending).toBe(true);
      expect(mutation.isError).toBe(false);

      deferred.resolve({ ok: true });
      await pending;
      await flush();

      expect(mutation.isPending).toBe(false);
      expect(mutation.isError).toBe(false);
      expect(mutation.isSuccess).toBe(true);
      expect(mutation.data).toEqual({ ok: true });
      expect(events).toEqual(["fn:1", "success:true:1", "settled:true:null:1"]);
    } finally {
      dispose();
    }
  });

  test("useSolidMutation failure updates error and calls callbacks", async () => {
    let dispose = () => {};
    const deferred = defer<never>();

    const events: string[] = [];
    let mutation: any;

    createRoot((rootDispose) => {
      dispose = rootDispose;

      mutation = useSolidMutation<{ id: number }, { ok: boolean }, Error>({
        mutationFn: async (variables) => {
          events.push(`fn:${variables.id}`);
          return deferred.promise;
        },
        onSuccess(data, variables) {
          events.push(`success:${String(data.ok)}:${variables.id}`);
        },
        onError(error, variables) {
          events.push(`error:${error.message}:${variables.id}`);
        },
        onSettled(data, error, variables) {
          events.push(
            `settled:${String(data?.ok)}:${error ? "err" : "null"}:${variables.id}`,
          );
        },
      });
    });

    try {
      const pending = mutation.mutateAsync({ id: 2 });
      expect(mutation.isPending).toBe(true);

      const err = new Error("Boom");
      deferred.reject(err);

      let thrown: unknown;
      try {
        await pending;
      } catch (e) {
        thrown = e;
      }

      expect(thrown).toBe(err);
      expect(mutation.isPending).toBe(false);
      expect(mutation.isSuccess).toBe(false);
      expect(mutation.isError).toBe(true);
      expect(mutation.error).toBe(err);

      expect(events).toEqual([
        "fn:2",
        "error:Boom:2",
        "settled:undefined:err:2",
      ]);
    } finally {
      dispose();
    }
  });

  test("staleTime determines when queryFn is executed again", async () => {
    let dispose = () => {};
    const client = new QueryClient({ staleTime: 50 });
    let query: any;
    let calls = 0;

    createRoot((rootDispose) => {
      dispose = rootDispose;
      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          query = useSolidQuery({
            queryKey: "stale-test",
            queryFn: async () => {
              calls += 1;
              return { calls };
            },
          });
          return null;
        },
      });
    });

    try {
      await flush();
      await flush();
      expect(calls).toBe(1);

      // Check immediately - should be fresh, so calls should still be 1
      await query.refetch();
      await flush();
      expect(calls).toBe(1);

      // Wait for staleTime (50ms) to pass
      await new Promise((r) => setTimeout(r, 60));
      await query.refetch();
      await flush();
      expect(calls).toBe(2);
    } finally {
      dispose();
    }
  });

  test("gcTime automatically deletes unused entries from cache", async () => {
    let dispose = () => {};
    const client = new QueryClient({ gcTime: 30 });
    let calls = 0;

    createRoot((rootDispose) => {
      dispose = rootDispose;
      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          useSolidQuery({
            queryKey: "gc-test",
            queryFn: async () => {
              calls += 1;
              return "data";
            },
          });
          return null;
        },
      });
    });

    try {
      await flush();
      await flush();
      expect(calls).toBe(1);
      expect(client.getCache("gc-test")).toBe("data");

      // Unmount the component to trigger GC timer
      dispose();

      // Wait 15ms - should still be in cache (gcTime is 30ms)
      await new Promise((r) => setTimeout(r, 15));
      expect(client.getCache("gc-test")).toBe("data");

      // Wait remaining time - should be deleted from cache
      await new Promise((r) => setTimeout(r, 25));
      expect(client.getCache("gc-test")).toBeUndefined();
    } finally {
      // already disposed
    }
  });

  test("request deduplication batches multiple concurrent queries", async () => {
    let dispose = () => {};
    const client = new QueryClient();
    const deferred = defer<string>();
    let calls = 0;

    let query1: any;
    let query2: any;

    createRoot((rootDispose) => {
      dispose = rootDispose;
      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          query1 = useSolidQuery({
            queryKey: "dedup-test",
            queryFn: async () => {
              calls += 1;
              return deferred.promise;
            },
          });
          query2 = useSolidQuery({
            queryKey: "dedup-test",
            queryFn: async () => {
              calls += 1;
              return deferred.promise;
            },
          });
          return null;
        },
      });
    });

    try {
      await flush();
      expect(calls).toBe(1); // Only 1 queryFn call instead of 2

      deferred.resolve("result");
      await flush();
      await flush();

      expect(query1.data).toBe("result");
      expect(query2.data).toBe("result");
    } finally {
      dispose();
    }
  });

  test("invalidateQueries marks cache stale and refetches active observers", async () => {
    let dispose = () => {};
    const client = new QueryClient({ staleTime: 10000 });
    let calls = 0;
    let query: any;

    createRoot((rootDispose) => {
      dispose = rootDispose;
      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          query = useSolidQuery({
            queryKey: "invalidate-test",
            queryFn: async () => {
              calls += 1;
              return `count:${calls}`;
            },
          });
          return null;
        },
      });
    });

    try {
      await flush();
      await flush();
      expect(calls).toBe(1);

      // Invalidate the query key
      client.invalidateQueries("invalidate-test");
      await flush();
      await flush();

      // Active observer should be refetched automatically
      expect(calls).toBe(2);
      expect(query.data).toBe("count:2");
    } finally {
      dispose();
    }
  });

  test("deterministic query keys handle object sorting", () => {
    const client = new QueryClient();
    client.setCache(hashKey(["users", { a: 1, b: 2 }]), "data");

    // Switching key order should still retrieve from cache
    const key1 = ["users", { b: 2, a: 1 }];
    const clientEntry = client.getCache(hashKey(key1));
    expect(clientEntry).toBe("data");

    // Now let's test useSolidQuery using deterministic keys
    let dispose = () => {};
    let query: any;
    let calls = 0;

    createRoot((rootDispose) => {
      dispose = rootDispose;
      createComponent(QueryClientContext.Provider, {
        value: client,
        get children() {
          query = useSolidQuery({
            queryKey: () => ["users", { b: 2, a: 1 }],
            queryFn: async () => {
              calls += 1;
              return "fetched-data";
            },
            staleTime: 10000,
          });
          return null;
        },
      });
    });

    try {
      // Should find the value "data" in the cache since keys sort to the same string
      expect(query.data).toBe("data");
      expect(calls).toBe(0);
    } finally {
      dispose();
    }
  });
});
