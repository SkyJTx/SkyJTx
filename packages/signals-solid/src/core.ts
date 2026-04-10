import {
  createEffect,
  createMemo,
  createRoot,
  createSignal,
  MemoOptions,
  SignalOptions,
  untrack,
} from "solid-js";
import {
  Getter,
  Computed,
  Initializer,
  Signal,
  Value,
  WritableComputed,
  Cleanup,
  Callback,
  EffectManager,
  GetterSetter,
  EffectAction,
} from "./types";
import { createMutable, unwrap } from "solid-js/store";
import { isCallable } from "./helpers";

/**
 * Creates a reactive signal that can be used in Solid.js components.
 * @param initializer - The initial value or a function that returns the initial value for the signal.
 * @param options - Optional configuration for the signal, such as equality checks or debugging options.
 * @returns A signal that can be accessed and updated reactively.
 * @example
 * const count = useSignal(0);
 * useEffect(() => {
 *   console.log("Track:", count.value); // Output: 0
 * });
 * useEffect(() => {
 *   console.log("Peek:", count.peek()); // Output: 0
 * });
 * count.value = 1; // Updates the signal value and triggers reactive updates
 * // Output:
 * // "Track: 1" (reactive update)
 * // "Peek: 0" (it doesn't even log because peek does not trigger reactive updates)
 */
export function useSignal<T>(
  value: Value<T>,
  options?: SignalOptions<T>,
): Signal<T>;
export function useSignal<T>(
  value: Value<T>,
  options?: SignalOptions<T>,
): Signal<T> {
  const unwrapped = unwrap(value);
  const [signal, setSignal] = createSignal(unwrapped, options);
  return Object.defineProperties(() => signal(), {
    value: {
      get() {
        return signal();
      },
      set(value: T) {
        setSignal(() => {
          return value;
        });
      },
      enumerable: true,
      configurable: true,
    },
    peek: {
      value: () => untrack(signal),
      enumerable: true,
      configurable: true,
    },
    [Symbol.iterator]: {
      value: function* () {
        yield signal;
        yield setSignal;
      },
      enumerable: false,
      configurable: true,
    },
  }) as Signal<T>;
}

/**
 * Creates a computed value that stays in sync with its dependencies.
 *
 * When a setter is provided, the computed becomes writable and can also be
 * destructured as a tuple: `[value, setValue]`.
 *
 * @example
 * const count = useSignal(0);
 * const double = useComputed(() => count.value * 2);
 *
 * const double2 = useComputed(
 *   () => count.value * 2,
 *   (value) => {
 *     count.value = value / 2;
 *   },
 * );
 * const [double3, setDouble3] = useComputed(
 *   () => count.value * 2,
 *   (value) => {
 *     count.value = value / 2;
 *   },
 * );
 */
export function useComputed<T>(
  getOrSet: Getter<T>,
  options?: MemoOptions<T>,
): Computed<T>;
export function useComputed<T>(
  getOrSet: GetterSetter<T>,
  options?: MemoOptions<T>,
): WritableComputed<T>;
export function useComputed<T>(
  getOrSet: Getter<T> | GetterSetter<T>,
  options?: MemoOptions<T>,
): Computed<T> | WritableComputed<T> {
  const getter = isCallable(getOrSet) ? getOrSet : getOrSet.getter;
  const setter = isCallable(getOrSet) ? undefined : getOrSet.setter;
  const memo = createMemo(getter, options);
  const computed = () => memo();

  if (setter) {
    return Object.defineProperties(computed, {
      value: {
        get() {
          return memo();
        },
        set(value: T) {
          setter(value);
        },
        enumerable: true,
        configurable: true,
      },
      peek: {
        value: () => untrack(memo),
        enumerable: true,
        configurable: true,
      },
      [Symbol.iterator]: {
        value: function* () {
          yield memo;
          yield setter;
        },
        enumerable: false,
        configurable: true,
      },
    }) as WritableComputed<T>;
  }

  return Object.defineProperties(computed, {
    value: {
      get() {
        return memo();
      },
      enumerable: true,
      configurable: true,
    },
    peek: {
      value: () => untrack(memo),
      enumerable: true,
      configurable: true,
    },
  }) as Computed<T>;
}

/**
 * Creates a reactive object that can be used in Solid.js components.
 * @param initializer - The initial value or a function that returns the initial value for the reactive object.
 * @returns A reactive object that can be accessed and updated reactively.
 * @example
 * const state = useReactive({ count: 0 });
 * useEffect(() => {
 *   console.log("First:", state.count); // Output: 0
 * });
 * state.count = 1; // Updates the reactive object and triggers reactive updates
 * // Output:
 * // "1" (reactive update)
 *
 * const { count } = state;
 * useEffect(() => {
 *   console.log("Second:", count); // Output: 1
 * });
 * state.count = 2; // Updates the reactive object and triggers reactive updates
 * // Output:
 * // First: 2 (reactive update)
 * // No output for the second effect because destructuring breaks reactivity.
 *
 * count++; // Cannot update and will not trigger reactive updates because destructuring breaks reactivity.
 */
export function useReactive<T extends object>(
  initializer: Value<T>,
  options?: {
    name?: string;
  },
): Value<T>;
export function useReactive<T extends object>(
  initializer: Getter<T>,
  options?: {
    name?: string;
  },
): Value<T>;
export function useReactive<T extends object>(
  initializer: Initializer<T>,
  options?: {
    name?: string;
  },
): Value<T> {
  const value = isCallable(initializer) ? initializer() : initializer;
  const upwrapped = unwrap(value);
  const state = createMutable(upwrapped, options);
  return state;
}

export function useEffect<T = void>(
  effect: Callback<void, Cleanup<T> | T>,
  options?: {
    name?: string;
  },
): EffectManager {
  let stopped = false;
  let paused = false;
  let dispose = () => {};
  let cleanup: Cleanup<T> | undefined;
  const action = useSignal<EffectAction | undefined>(undefined);

  const runCleanup = () => {
    if (!isCallable(cleanup)) {
      return;
    }

    const currentCleanup = cleanup;
    cleanup = undefined;
    currentCleanup();
  };

  createRoot((rootDispose) => {
    dispose = () => {
      rootDispose();
      runCleanup();
    };

    createEffect(
      () => {
        if (action() === "pause") {
          runCleanup();
          return;
        }

        runCleanup();

        const nextCleanup = effect();

        if (isCallable(nextCleanup)) {
          cleanup = nextCleanup;
        }
      },
      undefined,
      options,
    );
  });

  return {
    action: useComputed(action),
    stop() {
      if (stopped) {
        return;
      }
      stopped = true;
      dispose();
    },
    pause() {
      if (stopped || paused) {
        return;
      }

      paused = true;
      action.value = "pause";
    },
    resume() {
      if (stopped || !paused) {
        return;
      }

      paused = false;
      action.value = "resume";
    },
  };
}

export function useWatch<T, Q = void>(
  source: Getter<T>,
  effect: Callback<{ value: T; prev: T }, Cleanup<Q> | Q>,
  options?: {
    name?: string;
    equals?: (current: T, previous: T) => boolean;
  },
): EffectManager {
  let previous = untrack(source);
  let initialized = false;

  return useEffect(() => {
    const current = source();
    if (!initialized) {
      initialized = true;
      previous = current;
      return;
    }

    if (options?.equals?.(current, previous) ?? current === previous) {
      return;
    }

    const cleanup = untrack(() => effect({ value: current, prev: previous }));
    previous = current;

    return cleanup;
  }, options);
}
