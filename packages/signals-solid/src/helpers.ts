import {
  Computed,
  EffectManager,
  Signal,
  WritableComputed,
} from "./types";

/**
 * Check if a value is callable (i.e., a function).
 * @param value - The value to check.
 * @returns True if the value is callable, false otherwise.
 */
export function isCallable(value: any): value is Function {
  return typeof value === "function";
}

/**
 * Check if a value is an object (and not null).
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export function isObject(value: any): value is object {
  return (
    value !== null && (typeof value === "object" || typeof value === "function")
  );
}

/**
 * Check if a value is a Signal.
 * - Is an object
 * - Is callable (signal is a function)
 * - Has a "value" property
 * - The "value" property is enumerable
 * - The "value" property has a getter and setter
 * - Has a "peek" method
 * - Is iterable as a getter/setter tuple
 *
 * @param value - The value to check.
 * @returns True if the value is a Signal, false otherwise.
 */
export function isSignal(value: any): value is Signal<any> {
  const isCallableSignal =
    isCallable(value) && "value" in value && "peek" in value;
  const hasEnumerableValueProp =
    Object.getOwnPropertyDescriptor(value, "value")?.enumerable === true;
  const hasGetterAndSetter =
    hasEnumerableValueProp &&
    Object.getOwnPropertyDescriptor(value, "value")?.get !== undefined &&
    Object.getOwnPropertyDescriptor(value, "value")?.set !== undefined;
  const isUnpackedTuple = isCallable((value as any)[Symbol.iterator]);
  return (
    isObject(value) && isCallableSignal && hasGetterAndSetter && isUnpackedTuple
  );
}

/**
 * Check if a value is a Computed or WritableComputed.
 * - Is an object
 * - Is callable
 * - Has a "value" property
 * - The "value" property is enumerable
 * - Has a "peek" method
 * - Does not have a setter on the "value" property
 * - Does not expose the tuple iterator
 *
 * @param value - The value to check.
 * @returns True if the value is a Computed or WritableComputed, false otherwise.
 */
export function isComputed(value: any): value is Computed<any> {
  const isCallableComputed =
    isCallable(value) && "value" in value && "peek" in value;
  const hasEnumerableValueProp =
    Object.getOwnPropertyDescriptor(value, "value")?.enumerable === true;
  const hasGetterOnly =
    hasEnumerableValueProp &&
    Object.getOwnPropertyDescriptor(value, "value")?.get !== undefined &&
    Object.getOwnPropertyDescriptor(value, "value")?.set === undefined;
  const isNotUnpackedTuple = !isCallable((value as any)[Symbol.iterator]);
  return (
    isObject(value) && isCallableComputed && hasGetterOnly && isNotUnpackedTuple
  );
}

/**
 * Check if a value is a WritableComputed.
 * - Is an object
 * - Is callable
 * - Has a "value" property
 * - The "value" property is enumerable
 * - Has a "peek" method
 * - Has a setter on the "value" property
 * - Iterable as a getter/setter tuple
 *
 * @param value - The value to check.
 * @returns True if the value is a WritableComputed, false otherwise.
 */
export function isWritableComputed(value: any): value is WritableComputed<any> {
  const isCallableComputed =
    isCallable(value) && "value" in value && "peek" in value;
  const hasEnumerableValueProp =
    Object.getOwnPropertyDescriptor(value, "value")?.enumerable === true;
  const hasGetterAndSetter =
    hasEnumerableValueProp &&
    Object.getOwnPropertyDescriptor(value, "value")?.get !== undefined &&
    Object.getOwnPropertyDescriptor(value, "value")?.set !== undefined;
  const isUnpackedTuple = isCallable((value as any)[Symbol.iterator]);
  return (
    isObject(value) &&
    isCallableComputed &&
    hasGetterAndSetter &&
    isUnpackedTuple
  );
}

export function isEffectManager(value: any): value is EffectManager {
  return (
    isObject(value) &&
    "stop" in value &&
    "pause" in value &&
    "resume" in value &&
    isCallable(value.stop) &&
    isCallable(value.pause) &&
    isCallable(value.resume)
  );
}
