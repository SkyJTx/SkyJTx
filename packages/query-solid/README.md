# @skyjt/query-solid

SolidJS query utilities with SSR hydration support, cache lifecycle management, request deduplication, and cache invalidation.

## Install

```bash
npm install @skyjt/query-solid
```

## Usage

```tsx
import { QueriesProvider, QueryClient, useSolidQuery } from "@skyjt/query-solid";

const client = new QueryClient();

function App() {
  return (
    <QueriesProvider client={client}>
      <Users />
    </QueriesProvider>
  );
}

function Users() {
  const query = useSolidQuery({
    queryKey: ["users"],
    queryFn: async () => fetch("/api/users").then((r) => r.json()),
  });

  return <pre>{JSON.stringify(query.data, null, 2)}</pre>;
}
```

## Features

### Cache Lifecycle & Memory Management

`useSolidQuery` supports cache freshness (`staleTime`) and automatic garbage collection (`gcTime`).

* **`staleTime`**: The duration in milliseconds that data remains fresh. While fresh, queries will resolve directly from the cache without refetching. Defaults to `0` (always stale, refetching on mount/key changes).
* **`gcTime`**: The duration in milliseconds that unused/unobserved query data remains in the cache. When a query is no longer observed by any component, a timer starts. If no observer mounts for that key before the timer expires, the cache entry is deleted to prevent memory leaks. Defaults to `300000` (5 minutes).

```tsx
const query = useSolidQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
  staleTime: 10000, // Keep fresh for 10 seconds
  gcTime: 60000,    // Keep in cache for 60 seconds after unobserving
});
```

### Request Deduplication

Simultaneous calls to `useSolidQuery` with the identical key (e.g. from multiple mounting components at the exact same time) are automatically batched. Only a single network request/promise is executed, and its resolved result is shared across all observing components.

### Global Cache Invalidation

Sync mutation states and query keys by invalidating queries. Triggering `client.invalidateQueries(key)` marks the cache entry as stale and triggers automatic, reactive refetches for any active observers.

```tsx
import { useSolidMutation, useSolidQuery, QueryClientContext } from "@skyjt/query-solid";
import { useContext } from "solid-js";

function EditUserProfile() {
  const client = useContext(QueryClientContext)!;

  const mutation = useSolidMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidate and trigger refetch for active user profiles
      client.invalidateQueries(["user", "profile"]);
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: "New Name" })}>
      Update Profile
    </button>
  );
}
```

### Deterministic Query Keys

Query keys containing objects are stringified deterministically. The keys of plain objects are sorted alphabetically before serialization. Order of properties does not matter, ensuring you do not get duplicate cache entries for equivalent keys.

```tsx
// These two queries will share the same cache entry and trigger a single request
const queryA = useSolidQuery({ queryKey: ["user", { id: 1, type: "admin" }], queryFn });
const queryB = useSolidQuery({ queryKey: ["user", { type: "admin", id: 1 }], queryFn });
```

## License

Apache-2.0
