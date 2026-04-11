import { ParentComponent, createComponent } from "solid-js";
import { isServer, useAssets, Dynamic } from "solid-js/web";
import { QueryClientContext, QueryClient } from "./core";
import { serialize } from "seroval";

export const QueriesProvider: ParentComponent<{ client?: QueryClient }> = (
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
