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

/**
 * Represents an entry in the query cache.
 *
 * @template T - The type of data stored in this cache entry.
 */
export interface CacheEntry<T = any> {
  /** The cached data value. */
  data: T;
  /** Timestamp when this entry was last updated. */
  updatedAt: number;
  /** Timeout ID for garbage collection scheduling. */
  gcTimeout?: any;
  /** The duration in milliseconds before this cache entry is garbage collected. */
  gcTime?: number;
}

/**
 * Produces a stable, deterministic string representation of any value.
 * Objects will have their keys sorted alphabetically.
 *
 * @param value - The value to stringify.
 * @returns A deterministic string representation of the value.
 */
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

/**
 * Hashes/serializes a query key into a consistent string representation.
 * If the key is already a string, it returns the string directly.
 * Otherwise, it uses {@link stableStringify}.
 *
 * @param key - The query key to hash.
 * @returns A string representation of the query key.
 */
export function hashKey(key: any): string {
  if (typeof key === "string") return key;
  return stableStringify(key);
}

/**
 * The core client class that manages cache entries, active query promises, and observers.
 * Provides APIs to interact with the cache directly and triggers refetching on cache invalidation.
 */
export class QueryClient {
  /** The primary storage map for query cache entries. */
  public cache = new Map<string, CacheEntry>();
  /** Store for hydrated initial data received from server-side rendering. */
  public initialData = new Map<string, any>();
  /** Map of in-flight fetch promises to deduplicate concurrent requests. */
  public inFlightPromises = new Map<string, Promise<any>>();
  /** Map of observers listening to updates for specific query keys. */
  public observers = new Map<string, Set<() => void>>();
  /** Default duration in milliseconds before cached data is considered stale. */
  public staleTime: number;
  /** Default duration in milliseconds before inactive cache entries are garbage collected. */
  public gcTime: number;

  /**
   * Creates an instance of QueryClient.
   *
   * @param options - Configuration options for the client.
   * @param options.staleTime - Default duration in milliseconds before data is considered stale. Defaults to 0.
   * @param options.gcTime - Default duration in milliseconds before inactive cache entries are deleted. Defaults to 5 minutes.
   */
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

  /**
   * Retrieves the initial state/data for a key (usually from SSR hydration) and removes it from initialData storage.
   *
   * @param key - The hashed query key.
   * @returns The initial data if available, or undefined.
   */
  getInitialData(key: string) {
    return this.initialData.get(key);
  }

  /**
   * Stores data in the query cache and sets up garbage collection timeouts if there are no active observers.
   *
   * @param key - The hashed query key.
   * @param data - The data to store.
   * @param gcTime - Custom garbage collection duration for this specific cache entry.
   */
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

  /**
   * Retrieves the cached data for a key.
   *
   * @param key - The hashed query key.
   * @returns The cached data if found, or undefined.
   */
  getCache(key: string) {
    return this.cache.get(key)?.data;
  }

  /**
   * Retrieves the raw cache entry object for a key, including metadata like updatedAt.
   *
   * @param key - The hashed query key.
   * @returns The cache entry object if found, or undefined.
   */
  getCacheEntry(key: string) {
    return this.cache.get(key);
  }

  /**
   * Registers an observer callback for a query key. Clears any pending garbage collection timeout.
   *
   * @param key - The hashed query key.
   * @param onUpdate - Callback function triggered when query data is modified or invalidated.
   */
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

  /**
   * Unregisters an observer callback. Schedules garbage collection if no observers remain.
   *
   * @param key - The hashed query key.
   * @param onUpdate - The callback function to unregister.
   */
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

  /**
   * Invalidates cached queries matching the query key. Marks the cached entry as stale
   * and triggers registered observers to perform a refetch.
   *
   * @param key - The query key or array key to invalidate.
   */
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

  /**
   * Extracts all cached data into a plain JSON-serializable record of key-data pairs.
   * Typically used during server-side rendering (SSR) to serialize the client state.
   *
   * @returns A plain object mapping query key hashes to cached data.
   */
  extractState() {
    const raw: Record<string, any> = {};
    for (const [key, val] of this.cache.entries()) {
      raw[key] = val.data;
    }
    return raw;
  }
}

/**
 * React Context containing the {@link QueryClient} instance.
 */
export const QueryClientContext = createContext<QueryClient>();

/**
 * Hook to execute and subscribe to a reactive query with initial data options.
 *
 * @template TData - The expected response data type.
 * @template TError - The expected error type.
 * @param options - Configuration options requiring an initialData field.
 * @returns A reactive query result containing data, loading state, and helper functions.
 */
export function useSolidQuery<TData, TError = unknown>(
  options: UseQueryOptionsWithInitialData<TData, TError>,
): UseQueryResult<TData, TError, true>;

/**
 * Hook to execute and subscribe to a reactive query without initial data options.
 *
 * @template TData - The expected response data type.
 * @template TError - The expected error type.
 * @param options - Configuration options where initialData is undefined or omitted.
 * @returns A reactive query result containing data, loading state, and helper functions.
 */
export function useSolidQuery<TData, TError = unknown>(
  options: UseQueryOptionsWithoutInitialData<TData, TError>,
): UseQueryResult<TData, TError, false>;

/**
 * Main implementation of the useSolidQuery hook.
 * Resolves the query client from context, initializes state using Solid's createResource,
 * and maintains observers to automatically refetch when invalidation occurs.
 *
 * @template TData - The expected response data type.
 * @template TError - The expected error type.
 * @param options - Configuration options for the query.
 * @returns A reactive query object.
 * @throws Error if called outside a `<QueriesProvider>` context.
 */
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

/**
 * Hook to manage asynchronous mutations (create, update, delete requests).
 *
 * @template TVariables - The variables type accepted by the mutation function.
 * @template TData - The expected result data type.
 * @template TError - The expected error type.
 * @param options - Configuration options containing the mutation function and event callbacks.
 * @returns A reactive mutation object containing triggers (mutate, mutateAsync) and status flags.
 */
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

