import { MemoOptions, SignalOptions } from "solid-js";
import { Getter, Computed, Signal, Value, WritableComputed, Cleanup, Callback, EffectManager, GetterSetter } from "./types";
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
export declare function useSignal<T>(value: Value<T>, options?: SignalOptions<T>): Signal<T>;
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
export declare function useComputed<T>(getOrSet: GetterSetter<T>, options?: MemoOptions<T>): WritableComputed<T>;
export declare function useComputed<T>(getOrSet: Getter<T>, options?: MemoOptions<T>): Computed<T>;
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
export declare function useReactive<T extends object>(initializer: Getter<T>, options?: {
    name?: string;
}): Value<T>;
export declare function useReactive<T extends object>(initializer: Value<T>, options?: {
    name?: string;
}): Value<T>;
export declare function useEffect<T = void>(effect: Callback<void, Cleanup<T> | T>, options?: {
    name?: string;
}): EffectManager;
export declare function useWatch<T, Q = void>(source: Getter<T>, effect: Callback<{
    value: T;
    prev: T;
}, Cleanup<Q> | Q>, options?: {
    name?: string;
    equals?: (current: T, previous: T) => boolean;
}): EffectManager;
//# sourceMappingURL=core.d.ts.map