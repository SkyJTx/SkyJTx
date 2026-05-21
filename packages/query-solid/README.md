# @skyjtx/query-solid

SolidJS query utilities with SSR hydration support.

## Install

```bash
npm install @skyjtx/query-solid
```

## Usage

```tsx
import { QueriesProvider, QueryClient, useSolidQuery } from "@skyjtx/query-solid";

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

## License

Apache-2.0
