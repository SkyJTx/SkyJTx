import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";
import type {
  Computed,
  EffectManager,
  Signal,
  WritableComputed,
} from "./types";

let createRoot!: typeof import("solid-js").createRoot;
let useComputed!: typeof import("./core").useComputed;
let useEffect!: typeof import("./core").useEffect;
let useReactive!: typeof import("./core").useReactive;
let useSignal!: typeof import("./core").useSignal;
let useWatch!: typeof import("./core").useWatch;

beforeAll(async () => {
  // Bun resolves `solid-js` to the server build by default, where `createEffect` is a no-op.
  // For unit tests of reactivity primitives we want Solid's client runtime.
  mock.module("solid-js", () => import("solid-js/dist/solid.js"));
  mock.module("solid-js/store", () => import("solid-js/store/dist/store.js"));

  ({ createRoot } = await import("solid-js"));

  const core = (await import(
    new URL("./core.ts", import.meta.url).href + "?client-solid"
  )) as typeof import("./core");

  ({ useComputed, useEffect, useReactive, useSignal, useWatch } = core);
});

afterAll(() => {
  mock.restore();
});

const flush = (): Promise<void> =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });

describe("reactivity helpers", () => {
  test("useSignal exposes the signal tuple and getters", () => {
    createRoot((dispose) => {
      const count = useSignal(1);

      expect(count()).toBe(1);
      expect(count.value).toBe(1);
      expect(count.peek()).toBe(1);

      count.value = 2;
      expect(count()).toBe(2);

      const [getCount, setCount] = count;
      setCount(3);
      expect(getCount()).toBe(3);

      dispose();
    });
  });

  test("useComputed derives values and supports writable computed values", async () => {
    let dispose = () => {};
    let count!: Signal<number>;
    let double!: Computed<number>;
    let writableDouble!: WritableComputed<number>;
    const observed: number[] = [];

    createRoot((rootDispose) => {
      dispose = rootDispose;
      count = useSignal(2);
      double = useComputed(() => count.value * 2);

      writableDouble = useComputed({
        getter: () => count.value * 2,
        setter: (value: number) => {
          count.value = value / 2;
        },
      });

      useEffect(() => {
        observed.push(double.value);
      });
    });

    try {
      await flush();
      expect(observed).toEqual([4]);
      expect(double()).toBe(4);
      expect(double.value).toBe(4);
      expect(double.peek()).toBe(4);

      count.value = 5;
      await flush();
      expect(observed).toEqual([4, 10]);
      expect(double()).toBe(10);
      expect(writableDouble.value).toBe(10);

      writableDouble.value = 18;
      await flush();
      expect(observed).toEqual([4, 10, 18]);
      expect(count.value).toBe(9);
      expect(double.value).toBe(18);

      const [getWritableDouble, setWritableDouble] = writableDouble;
      setWritableDouble(24);
      await flush();
      expect(observed).toEqual([4, 10, 18, 24]);
      expect(count.value).toBe(12);
      expect(getWritableDouble()).toBe(24);
    } finally {
      dispose();
    }
  });

  test("useEffect reruns on dependency changes and supports pause resume and stop", async () => {
    let dispose = () => {};
    let count!: Signal<number>;
    let manager!: EffectManager;
    const events: string[] = [];

    createRoot((rootDispose) => {
      dispose = rootDispose;
      count = useSignal(0);
      manager = useEffect(() => {
        const current = count.value;
        events.push(`effect:${current}`);

        return () => {
          events.push(`cleanup:${current}`);
        };
      });
    });

    try {
      await flush();
      expect(events).toEqual(["effect:0"]);

      count.value = 1;
      await flush();
      expect(events).toEqual(["effect:0", "cleanup:0", "effect:1"]);

      manager.pause();
      await flush();
      expect(events).toEqual([
        "effect:0",
        "cleanup:0",
        "effect:1",
        "cleanup:1",
      ]);

      manager.resume();
      await flush();
      expect(events).toEqual([
        "effect:0",
        "cleanup:0",
        "effect:1",
        "cleanup:1",
        "effect:1",
      ]);

      count.value = 2;
      await flush();
      expect(events).toEqual([
        "effect:0",
        "cleanup:0",
        "effect:1",
        "cleanup:1",
        "effect:1",
        "cleanup:1",
        "effect:2",
      ]);

      manager.stop();
      expect(events).toEqual([
        "effect:0",
        "cleanup:0",
        "effect:1",
        "cleanup:1",
        "effect:1",
        "cleanup:1",
        "effect:2",
        "cleanup:2",
      ]);

      count.value = 3;
      await flush();
      expect(events).toEqual([
        "effect:0",
        "cleanup:0",
        "effect:1",
        "cleanup:1",
        "effect:1",
        "cleanup:1",
        "effect:2",
        "cleanup:2",
      ]);
    } finally {
      dispose();
    }
  });

  test("useEffect resume does not replay the latest value when nothing changed while paused", async () => {
    let dispose = () => {};
    let count!: Signal<number>;
    let manager!: EffectManager;
    const events: string[] = [];

    createRoot((rootDispose) => {
      dispose = rootDispose;
      count = useSignal(0);
      manager = useEffect(() => {
        events.push(`effect:${count.value}`);
      });
    });

    try {
      await flush();
      expect(events).toEqual(["effect:0"]);

      count.value = 1;
      await flush();
      expect(events).toEqual(["effect:0", "effect:1"]);

      manager.pause();
      await flush();
      expect(events).toEqual(["effect:0", "effect:1"]);

      manager.resume();
      await flush();
      expect(events).toEqual(["effect:0", "effect:1", "effect:1"]);

      count.value = 2;
      await flush();
      expect(events).toEqual(["effect:0", "effect:1", "effect:1", "effect:2"]);
    } finally {
      dispose();
    }
  });

  test("useReactive updates effects when state changes", async () => {
    let dispose = () => {};
    let state!: {
      count: number;
      label: string;
    };
    const snapshots: string[] = [];

    createRoot((rootDispose) => {
      dispose = rootDispose;
      state = useReactive({
        count: 1,
        label: "a",
      });

      useEffect(() => {
        snapshots.push(`${state.count}:${state.label}`);
      });
    });

    try {
      await flush();
      expect(snapshots).toEqual(["1:a"]);

      state.count = 2;
      await flush();
      expect(snapshots).toEqual(["1:a", "2:a"]);

      state.label = "b";
      await flush();
      expect(snapshots).toEqual(["1:a", "2:a", "2:b"]);
    } finally {
      dispose();
    }
  });

  test("useWatch only reacts to the watched source", async () => {
    let dispose = () => {};
    let count!: Signal<number>;
    let label!: Signal<string>;
    const events: string[] = [];

    createRoot((rootDispose) => {
      dispose = rootDispose;
      count = useSignal(1);
      label = useSignal("a");

      useWatch(
        () => count.value,
        ({ value, prev }) => {
          events.push(`${prev}->${value}`);
          void label.value;
        },
      );
    });

    try {
      await flush();
      expect(events).toEqual([]);

      count.value = 2;
      await flush();
      expect(events).toEqual(["1->2"]);

      label.value = "b";
      await flush();
      expect(events).toEqual(["1->2"]);

      count.value = 3;
      await flush();
      expect(events).toEqual(["1->2", "2->3"]);
    } finally {
      dispose();
    }
  });

  test("useEffect and useWatch react correctly to useReactive object properties", async () => {
    let dispose = () => {};
    const effectLogs: string[] = [];
    const watchLogs: string[] = [];

    let state!: {
      x: number;
      y: number;
    };

    createRoot((rootDispose) => {
      dispose = rootDispose;

      state = useReactive({
        x: 0,
        y: 0,
      });

      // useEffect tracking reactive object
      useEffect(() => {
        effectLogs.push(`Coords: ${state.x}, ${state.y}`);
      });

      // useWatch tracking computed property from reactive object
      useWatch(
        () => state.x + state.y,
        ({ value, prev }) => {
          watchLogs.push(`Sum: ${prev} -> ${value}`);
        },
      );
    });

    try {
      await flush();
      // useEffect starts immediately, useWatch does not.
      expect(effectLogs).toEqual(["Coords: 0, 0"]);
      expect(watchLogs).toEqual([]);

      // Update x
      state.x = 5;
      await flush();
      expect(effectLogs).toEqual(["Coords: 0, 0", "Coords: 5, 0"]);
      expect(watchLogs).toEqual(["Sum: 0 -> 5"]);

      // Update both - assuming batched or sequential
      state.y = 10;
      await flush();
      expect(effectLogs).toEqual([
        "Coords: 0, 0",
        "Coords: 5, 0",
        "Coords: 5, 10",
      ]);
      expect(watchLogs).toEqual(["Sum: 0 -> 5", "Sum: 5 -> 15"]);
    } finally {
      dispose();
    }
  });
});
