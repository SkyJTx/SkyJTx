# @skyjt/store-solid

SolidJS store utilities with SSR hydration support.

## Install

```bash
npm install @skyjt/store-solid
```

## Usage

```tsx
import { StoresProvider, defineStore } from "@skyjt/store-solid";

const useCounter = defineStore("counter", () => ({ count: 0 }));

function App() {
  return (
    <StoresProvider>
      <Counter />
    </StoresProvider>
  );
}

function Counter() {
  const state = useCounter();
  return (
    <button onClick={() => (state.count += 1)}>
      Count: {state.count}
    </button>
  );
}
```

## License

Apache-2.0
