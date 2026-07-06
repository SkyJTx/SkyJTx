# @skyjt/signals-solid

SolidJS signal helpers providing a Vue-like API (`ref` and `computed` equivalents) on top of Solid's fine-grained reactivity primitives.

## Features

- **Vue-like API**: Access and modify signal state using `.value` properties, or call them directly as getters.
- **Destructurable Tuple Support**: Seamlessly destructure writable signals and computed properties as standard Solid-style `[getter, setter]` tuples.
- **Deep Reactivity**: Wrap complex objects and arrays into fully reactive structures using `useReactive` (powered by Solid's `createMutable`).
- **Pausable Effects**: Complete control over effect execution lifecycle with `useEffect` (pause, resume, and stop).
- **Flexible Watchers**: Watch reactive expressions and invoke callbacks only when the evaluated value changes, with support for custom equality checks.
- **Type Guard Utilities**: Convenient helper functions to inspect runtime types (`isSignal`, `isComputed`, `isWritableComputed`, etc.).

## Install

```bash
npm install @skyjt/signals-solid
# or
bun add @skyjt/signals-solid
```

## Usage

### Writable Signals (`useSignal`)

Create a signal with a reactive `.value` getter/setter. It can also be called as a function getter or destructured as a tuple.

```ts
import { useSignal } from "@skyjt/signals-solid";

// 1. Property access (.value)
const count = useSignal(0);
console.log(count.value); // 0
count.value = 1; // triggers reactivity

// 2. Direct function call
console.log(count()); // 1

// 3. Tuple destructuring
const [getCount, setCount] = useSignal(0);
setCount(10);
console.log(getCount()); // 10
```

### Computed Values (`useComputed`)

Create derived read-only or writable computed values.

```ts
import { useSignal, useComputed } from "@skyjt/signals-solid";

const count = useSignal(5);

// Read-only computed
const double = useComputed(() => count.value * 2);
console.log(double.value); // 10

// Writable computed (getter/setter object)
const doubleWritable = useComputed({
  getter: () => count.value * 2,
  setter: (val) => {
    count.value = val / 2;
  }
});

doubleWritable.value = 20;
console.log(count.value); // 10
```

### Deep Reactive Objects (`useReactive`)

Make objects and arrays deeply reactive without breaking property assignments.

```ts
import { useReactive } from "@skyjt/signals-solid";

const state = useReactive({
  user: {
    name: "Sky",
    age: 25
  },
  tags: ["developer"]
});

// Mutate nested properties directly
state.user.name = "JT";
state.tags.push("admin");
```

### Lifecycle-Controlled Effects (`useEffect`)

Run side effects and manage their execution (pause, resume, stop).

```ts
import { useSignal, useEffect } from "@skyjt/signals-solid";

const count = useSignal(0);

const effect = useEffect(() => {
  console.log("Count is now:", count.value);
  
  return () => {
    console.log("Cleanup previous execution");
  };
});

count.value = 1; // Logs: "Count is now: 1"

effect.pause();
count.value = 2; // Nothing logged (paused)

effect.resume(); // Effect resumes execution

effect.stop(); // Stops effect permanently and runs cleanup
```

### Watchers (`useWatch`)

Watch reactive sources and run callbacks on changes.

```ts
import { useSignal, useWatch } from "@skyjt/signals-solid";

const count = useSignal(0);

useWatch(
  () => count.value,
  ({ value, prev }) => {
    console.log(`Count changed from ${prev} to ${value}`);
  }
);

count.value = 5; // Logs: "Count changed from 0 to 5"
```

## License

Apache-2.0
