# @skyjt/store-solid

A lightweight, high-performance global state management library for SolidJS with built-in Server-Side Rendering (SSR) hydration support.

## Features

- **Global Store Definition**: Easily declare global reactive stores with `defineStore` using a simple setup function.
- **Auto-Hydration**: Seamlessly hydrates server-serialized store state on the client side, avoiding hydration mismatches.
- **Deep Nesting Support**: Integrates with `@skyjt/signals-solid` to provide deep reactivity out of the box.
- **Reference Preservation**: Safely deep-merges hydrated state into existing store definitions without breaking nested references.
- **State Clean Extraction**: Utility `extractStoreState` automatically strips away methods, getters, and non-enumerable properties before serialization.
- **TypeScript Support**: Full, robust TypeScript types for store state and store initializers.

## Install

```bash
npm install @skyjt/store-solid
# or
bun add @skyjt/store-solid
```

## Usage

### 1. Defining a Store

Create a store by calling `defineStore` with a unique key and an initializer function that returns the state.

```ts
// stores/counter.ts
import { defineStore } from "@skyjt/store-solid";

export const useCounterStore = defineStore("counter", () => {
  return {
    count: 0,
    nested: {
      value: "hello"
    },
    increment() {
      this.count++;
    }
  };
});
```

### 2. Wrapping the Application

Wrap your application tree in `<StoresProvider>` to supply the store context registry.

```tsx
// index.tsx
import { render } from "solid-js/web";
import { StoresProvider } from "@skyjt/store-solid";
import App from "./App";

render(
  () => (
    <StoresProvider>
      <App />
    </StoresProvider>
  ),
  document.getElementById("root")!
);
```

### 3. Using the Store in Components

Call the store hook inside your component to access and mutate the reactive state directly.

```tsx
// Counter.tsx
import { useCounterStore } from "./stores/counter";

export default function Counter() {
  const state = useCounterStore();

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Nested: {state.nested.value}</p>
      <button onClick={() => state.increment()}>Increment</button>
      <button onClick={() => (state.nested.value = "world")}>Change Text</button>
    </div>
  );
}
```

### SSR and Hydration

When using `<StoresProvider>` on the server, it automatically extracts and serializes all active stores via `seroval` and embeds them into a script tag (`window.__STORE_LIB_REGISTRY__`). On client load, `defineStore` checks this registry and deep-merges the state automatically.

## License

Apache-2.0
