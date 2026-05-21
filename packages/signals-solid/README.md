# @skyjt/signals-solid

SolidJS signal helpers with a Vue-like API on top of Solid primitives.

## Install

```bash
npm install @skyjt/signals-solid
```

## Usage

```ts
import { useSignal, useComputed, useReactive } from "@skyjt/signals-solid";

const count = useSignal(0);
count.value = 1;

const double = useComputed(() => count.value * 2);

const state = useReactive({ name: "Sky" });
state.name = "JT";
```

## License

Apache-2.0
