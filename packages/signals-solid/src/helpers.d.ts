import { Computed, EffectManager, Signal, WritableComputed } from "./types";
/**
 * Check if a value is callable (i.e., a function).
 * @param value - The value to check.
 * @returns True if the value is callable, false otherwise.
 */
export declare function isCallable(value: any): value is Function;
/**
 * Check if a value is an object (and not null).
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export declare function isObject(value: any): value is object;
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
export declare function isSignal(value: any): value is Signal<any>;
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
export declare function isComputed(value: any): value is Computed<any>;
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
export declare function isWritableComputed(value: any): value is WritableComputed<any>;
export declare function isEffectManager(value: any): value is EffectManager;
//# sourceMappingURL=helpers.d.ts.map