import { ParentComponent, createComponent } from "solid-js";
import { isServer, useAssets, Dynamic } from "solid-js/web";
import { QueryClientContext, QueryClient } from "./core";
import { serialize } from "seroval";

/**
 * Props for the {@link QueriesProvider} component.
 */
interface QueriesProviderProps {
  /**
   * The query client instance to manage and provide to the application.
   * If not specified, a new `QueryClient` instance will be created.
   */
  client?: QueryClient;

  /**
   * Optional security nonce value to be injected into the hydration `<script>` tag.
   */
  nonce?: string;
}

/**
 * Context Provider component that wraps your application to manage reactive queries.
 *
 * During server-side rendering (SSR), it extracts the current query cache state,
 * serializes it using `seroval`, and injects a hydration script into the page assets.
 * On the client side, defined queries will automatically hydrate from this serialized state.
 *
 * @param props - Component props including optional client and nonce.
 */
export const QueriesProvider: ParentComponent<QueriesProviderProps> = (
  props,
) => {
  const client = props.client ?? new QueryClient();

  if (isServer) {
    useAssets(() => {
      const rawState = client.extractState();
      const serializedJS = serialize(rawState);

      return createComponent(Dynamic, {
        component: "script",
        id: "query-hydration",
        ...(props.nonce ? { nonce: props.nonce } : {}),
        innerHTML: `window.__QUERY_LIB_REGISTRY__ = ${serializedJS};`,
      });
    });
  }

  return createComponent(QueryClientContext.Provider, {
    value: client,
    get children() {
      return props.children;
    },
  });
};

