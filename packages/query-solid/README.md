# @skyjt/query-solid

SolidJS query utilities with built-in Server-Side Rendering (SSR) hydration support, cache lifecycle management, request deduplication, and cache invalidation.

## Features

- **Asynchronous State Management**: Easily manage fetching, caching, and updating asynchronous data in SolidJS.
- **Auto-Hydration**: Seamlessly hydrates server-serialized query cache state on the client side, avoiding hydration mismatches.
- **Request Deduplication**: Deduplicates in-flight promises to avoid duplicate requests for the same query key.
- **Cache Lifecycle & GC**: Configurable `staleTime` and `gcTime` options with automatic cache garbage collection for unused query keys.
- **Reactivity Support**: Seamless integration with SolidJS resources and `@skyjt/signals-solid` to provide automatic updates.
- **TypeScript Support**: Full, robust TypeScript types for queries, mutations, options, and results.

## Install

```bash
npm install @skyjt/query-solid
# or
bun add @skyjt/query-solid
```

## Usage

### 1. Creating a Query Client

Create a `QueryClient` instance to manage the query and mutation caches.

```ts
// queryClient.ts
import { QueryClient } from "@skyjt/query-solid";

export const queryClient = new QueryClient({
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
});
```

### 2. Wrapping the Application

Wrap your application tree in `<QueriesProvider>` and pass your query client instance.

```tsx
// index.tsx
import { render } from "solid-js/web";
import { QueriesProvider } from "@skyjt/query-solid";
import { queryClient } from "./queryClient";
import App from "./App";

render(
  () => (
    <QueriesProvider client={queryClient}>
      <App />
    </QueriesProvider>
  ),
  document.getElementById("root")!
);
```

### 3. Using Queries in Components

Use the `useSolidQuery` hook inside components to fetch and cache data.

```tsx
// Users.tsx
import { useSolidQuery } from "@skyjt/query-solid";

interface User {
  id: number;
  name: string;
}

export default function Users() {
  const query = useSolidQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      return res.json();
    },
  });

  return (
    <div>
      <Show when={query.isLoading}>
        <p>Loading...</p>
      </Show>
      <Show when={query.isError}>
        <p>Error: {String(query.error)}</p>
      </Show>
      <Show when={query.isSuccess}>
        <ul>
          <For each={query.data}>
            {(user) => <li>{user.name}</li>}
          </For>
        </ul>
        <button onClick={() => query.refetch()}>Refetch</button>
      </Show>
    </div>
  );
}
```

### 4. Performing Mutations

Use the `useSolidMutation` hook to perform side-effects like creating or updating data.

```tsx
// CreateUser.tsx
import { useSolidMutation } from "@skyjt/query-solid";
import { queryClient } from "./queryClient";

export default function CreateUser() {
  const mutation = useSolidMutation<string, { id: number; name: string }>({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <div>
      <Show when={mutation.isPending}>
        <p>Adding user...</p>
      </Show>
      <button onClick={() => mutation.mutate("John Doe")}>
        Add User
      </button>
    </div>
  );
}
```

## SSR and Hydration

When using `<QueriesProvider>` on the server, it automatically extracts the cached query state, serializes it using `seroval`, and embeds it into a script tag (`window.__QUERY_LIB_REGISTRY__`). On client load, the `QueryClient` checks this registry and initializes the cache automatically.

## License

Apache-2.0

