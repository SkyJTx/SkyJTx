import {
  createContext,
  useContext,
  createSignal,
  createResource,
  createEffect,
  onCleanup,
} from "solid-js";
import { isServer } from "solid-js/web";
import { useReactive } from "@skyjt/signals-solid";
import type {
  UseMutationOptions,
  UseQueryOptions,
  UseQueryOptionsWithInitialData,
  UseQueryOptionsWithoutInitialData,
  UseQueryResult,
} from "./types";

declare global {
  interface Window {
    __QUERY_LIB_REGISTRY__: Record<string, any>;
  }
}

export interface CacheEntry<T = any> {
  data: T;
  updatedAt: number;
  gcTimeout?: any;
  gcTime?: number;
}

export function stableStringify(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto === null || proto === Object.prototype) {
      const sortedKeys = Object.keys(value).sort();
      return `{${sortedKeys.map((k) => `"${k}":${stableStringify(value[k])}`).join(",")}}`;
    }
    return JSON.stringify(value);
  }

  return JSON.stringify(value);
}

export function hashKey(key: any): string {
  if (typeof key === "string") return key;
  return stableStringify(key);
}

export class QueryClient {
  public cache = new Map<string, CacheEntry>();
  public initialData = new Map<string, any>();
  public inFlightPromises = new Map<string, Promise<any>>();
  public observers = new Map<string, Set<() => void>>();
  public staleTime: number;
  public gcTime: number;

  constructor(options?: { staleTime?: number; gcTime?: number }) {
    this.staleTime = options?.staleTime ?? 0;
    this.gcTime = options?.gcTime ?? 5 * 60 * 1000;

    if (
      !isServer &&
      typeof window !== "undefined" &&
      window.__QUERY_LIB_REGISTRY__
    ) {
      this.initialData = new Map(Object.entries(window.__QUERY_LIB_REGISTRY__));
    }
  }

  getInitialData(key: string) {
    return this.initialData.get(key);
  }

  setCache(key: string, data: any, gcTime?: number) {
    const existing = this.cache.get(key);
    if (existing?.gcTimeout) {
      clearTimeout(existing.gcTimeout);
    }

    const time = gcTime ?? existing?.gcTime ?? this.gcTime;
    const observersCount = this.observers.get(key)?.size ?? 0;
    let gcTimeout: any = undefined;

    if (observersCount === 0 && time !== Infinity) {
      gcTimeout = setTimeout(() => {
        this.cache.delete(key);
      }, time);
    }

    this.cache.set(key, {
      data,
      updatedAt: Date.now(),
      gcTimeout,
      gcTime,
    });
  }

  getCache(key: string) {
    return this.cache.get(key)?.data;
  }

  getCacheEntry(key: string) {
    return this.cache.get(key);
  }

  addObserver(key: string, onUpdate: () => void) {
    let list = this.observers.get(key);
    if (!list) {
      list = new Set();
      this.observers.set(key, list);
    }
    list.add(onUpdate);

    const entry = this.cache.get(key);
    if (entry && entry.gcTimeout) {
      clearTimeout(entry.gcTimeout);
      entry.gcTimeout = undefined;
    }
  }

  removeObserver(key: string, onUpdate: () => void) {
    const list = this.observers.get(key);
    if (list) {
      list.delete(onUpdate);
      if (list.size === 0) {
        this.observers.delete(key);
        const entry = this.cache.get(key);
        if (entry) {
          if (entry.gcTimeout) clearTimeout(entry.gcTimeout);
          const time = entry.gcTime ?? this.gcTime;
          if (time !== Infinity) {
            entry.gcTimeout = setTimeout(() => {
              this.cache.delete(key);
            }, time);
          }
        }
      }
    }
  }

  invalidateQueries(key: string[] | string) {
    const keyStr = hashKey(key);
    const entry = this.cache.get(keyStr);
    if (entry) {
      entry.updatedAt = 0;
    }

    const keyObservers = this.observers.get(keyStr);
    if (keyObservers) {
      for (const refetch of keyObservers) {
        refetch();
      }
    }
  }

  extractState() {
    const raw: Record<string, any> = {};
    for (const [key, val] of this.cache.entries()) {
      raw[key] = val.data;
    }
    return raw;
  }
}

export const QueryClientContext = createContext<QueryClient>();

export function useSolidQuery<TData, TError = unknown>(
  options: UseQueryOptionsWithInitialData<TData, TError>,
): UseQueryResult<TData, TError, true>;

export function useSolidQuery<TData, TError = unknown>(
  options: UseQueryOptionsWithoutInitialData<TData, TError>,
): UseQueryResult<TData, TError, false>;

export function useSolidQuery<TData, TError = unknown>(
  options: UseQueryOptions<TData, TError>,
) {
  const client = useContext(QueryClientContext);
  if (!client) {
    throw new Error(
      "[query-solid] useSolidQuery must be used within a <QueriesProvider>",
    );
  }

  const getKeyString = () => {
    const k =
      typeof options.queryKey === "function"
        ? options.queryKey()
        : options.queryKey;
    return hashKey(k);
  };

  const getEnabled = () => {
    if (options.enabled === undefined) return true;
    return typeof options.enabled === "function"
      ? options.enabled()
      : options.enabled;
  };

  const [data, { mutate, refetch }] = createResource<TData, string | false>(
    () => {
      const enabled = getEnabled();
      if (!enabled) return false;
      return getKeyString();
    },
    async (keyObj) => {
      if (typeof keyObj !== "string") {
        throw new Error("Invalid query key");
      }
      const key = keyObj;

      const cached = client.getCacheEntry(key);
      const staleTime = options.staleTime ?? client.staleTime;
      if (cached !== undefined) {
        const isFresh = Date.now() - cached.updatedAt < staleTime;
        if (isFresh) {
          return cached.data as TData;
        }
      }

      const p = client.getInitialData(key);
      if (p !== undefined) {
        client.initialData.delete(key);
        client.setCache(key, p, options.gcTime);
        return p as TData;
      }

      let promise = client.inFlightPromises.get(key);
      if (!promise) {
        promise = options.queryFn().then((res) => {
          client.setCache(key, res, options.gcTime);
          return res;
        }).finally(() => {
          client.inFlightPromises.delete(key);
        });
        client.inFlightPromises.set(key, promise);
      }

      return promise;
    },
    {
      initialValue: (() => {
        const key = getKeyString();
        const init = client.getInitialData(key) ?? client.getCache(key);
        if (init !== undefined) return init as TData;
        if (options.initialData !== undefined) {
          const defaultInit =
            typeof options.initialData === "function"
              ? (options.initialData as () => TData)()
              : options.initialData;
          return defaultInit;
        }
        return undefined;
      })(),
    },
  );

  createEffect(() => {
    const key = getKeyString();
    if (!key) return;

    client.addObserver(key, refetch);

    onCleanup(() => {
      client.removeObserver(key, refetch);
    });
  });

  return useReactive({
    get data() {
      return data();
    },
    get isLoading() {
      return data.loading;
    },
    get isError() {
      return data.error !== undefined;
    },
    get error() {
      return data.error as TError | undefined;
    },
    get isSuccess() {
      return !data.loading && data.error === undefined && data() !== undefined;
    },
    refetch,
    mutate,
  }) as UseQueryResult<TData, TError, false | true>;
}

export function useSolidMutation<TVariables, TData, TError = unknown>(
  options: UseMutationOptions<TVariables, TData, TError>,
) {
  const [isPending, setPending] = createSignal(false);
  const [error, setError] = createSignal<TError | null>(null);
  const [data, setData] = createSignal<TData | undefined>(undefined);

  const mutateAsync = async (variables: TVariables) => {
    setPending(true);
    setError(null);
    try {
      const res = await options.mutationFn(variables);
      setData(() => res);
      options.onSuccess?.(res, variables);
      options.onSettled?.(res, null, variables);
      return res;
    } catch (e: any) {
      setError(e);
      options.onError?.(e, variables);
      options.onSettled?.(undefined, e, variables);
      throw e;
    } finally {
      setPending(false);
    }
  };

  const mutate = (variables: TVariables) => {
    mutateAsync(variables).catch(() => {});
  };

  return useReactive({
    mutate,
    mutateAsync,
    get isPending() {
      return isPending();
    },
    get error() {
      return error();
    },
    get data() {
      return data();
    },
    get isError() {
      return error() !== null;
    },
    get isSuccess() {
      return data() !== undefined;
    },
  });
}
