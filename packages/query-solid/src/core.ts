import {
  createContext,
  useContext,
  createSignal,
  createResource,
} from "solid-js";
import { isServer } from "solid-js/web";
import { useReactive } from "@skyjtx/signals-solid";

declare global {
  interface Window {
    __QUERY_LIB_REGISTRY__: Record<string, any>;
  }
}

export class QueryClient {
  public cache = new Map<string, any>();
  public initialData = new Map<string, any>();

  constructor() {
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

  setCache(key: string, data: any) {
    this.cache.set(key, data);
  }

  getCache(key: string) {
    return this.cache.get(key);
  }

  extractState() {
    const raw: Record<string, any> = {};
    for (const [key, val] of this.cache.entries()) {
      raw[key] = val;
    }
    return raw;
  }
}

export const QueryClientContext = createContext<QueryClient>();

export type UseQueryOptions<TData, TError = unknown> = {
  queryKey: string[] | (() => string[]) | string | (() => string);
  queryFn: () => Promise<TData>;
  enabled?: boolean | (() => boolean);
  initialData?: TData | (() => TData);
};

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
    return Array.isArray(k) ? JSON.stringify(k) : k;
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
      const key = keyObj as string;
      const existing = client.getCache(key);
      if (existing !== undefined) return existing as TData;

      const p = client.getInitialData(key);
      if (p !== undefined) {
        client.initialData.delete(key);
        client.setCache(key, p);
        return p as TData;
      }

      const res = await options.queryFn();
      client.setCache(key, res);
      return res;
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
  });
}

export type UseMutationOptions<TVariables, TData, TError = unknown> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
  ) => void;
};

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
