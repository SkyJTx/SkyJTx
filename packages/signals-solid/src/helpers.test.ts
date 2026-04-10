import { describe, expect, test } from "bun:test";
import { createRoot } from "solid-js";
import { useComputed, useSignal } from "./core";
import type { Computed, Signal, WritableComputed } from "./types";
import {
  isCallable,
  isComputed,
  isEffectManager,
  isObject,
  isSignal,
  isWritableComputed,
} from "./helpers";

describe("reactivity helper predicates", () => {
  test("isCallable and isObject classify callable values", () => {
    const callable = () => undefined;
    const plainObject = {};

    expect(isCallable(callable)).toBe(true);
    expect(isCallable(plainObject)).toBe(false);
    expect(isObject(plainObject)).toBe(true);
    expect(isObject(callable)).toBe(true);
    expect(isObject(null)).toBe(false);
  });

  test("isSignal, isComputed, and isWritableComputed recognize reactive values", () => {
    let dispose = () => {};
    let signal!: Signal<number>;
    let computed!: Computed<number>;
    let writableComputed!: WritableComputed<number>;

    createRoot((rootDispose) => {
      dispose = rootDispose;
      signal = useSignal(1);
      computed = useComputed(() => signal.value * 2);
      writableComputed = useComputed({
        getter: () => signal.value * 3,
        setter: (value: number) => {
          signal.value = value / 3;
        },
      });
    });

    try {
      expect(isObject(signal)).toBe(true);
      expect(isCallable(signal)).toBe(true);
      expect(isSignal(signal)).toBe(true);
      expect(isComputed(signal)).toBe(false);
      expect(isWritableComputed(signal)).toBe(true);

      expect(isObject(computed)).toBe(true);
      expect(isCallable(computed)).toBe(true);
      expect(isComputed(computed)).toBe(true);
      expect(isSignal(computed)).toBe(false);
      expect(isWritableComputed(computed)).toBe(false);

      expect(isObject(writableComputed)).toBe(true);
      expect(isCallable(writableComputed)).toBe(true);
      expect(isSignal(writableComputed)).toBe(true);
      expect(isComputed(writableComputed)).toBe(false);
      expect(isWritableComputed(writableComputed)).toBe(true);
    } finally {
      dispose();
    }
  });

  test("isEffectManager accepts stop pause and resume methods", () => {
    const manager = {
      stop() {},
      pause() {},
      resume() {},
    };

    expect(isEffectManager(manager)).toBe(true);
    expect(isEffectManager({ stop() {}, pause() {} })).toBe(false);
  });
});
