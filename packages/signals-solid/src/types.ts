/**
 * Represents a raw value of type T.
 */
export type Value<T> = T;

/**
 * A getter function that returns a value of type T.
 */
export type Getter<T> = () => T;

/**
 * A setter function that updates a value of type T.
 */
export type Setter<T> = (value: T) => void;

/**
 * An object containing both a getter and a setter function for type T.
 */
export type GetterSetter<T> = {
  getter: Getter<T>;
  setter: Setter<T>;
};

/**
 * A function that receives the previous state and returns the next state of type T.
 */
export type Modifier<T> = (prev: T) => T;

/**
 * A generic callback function representing a map or reaction.
 */
export type Callback<T = void, Q = void> = (value: T) => Q;

/**
 * An initializer that can either be a raw value of type T or a getter function returning T.
 */
export type Initializer<T> = Value<T> | Getter<T>;

/**
 * An object wrapping a mutable value property.
 */
export type ValueObject<T> = { value: T };

/**
 * An object wrapping a read-only value property.
 */
export type ReadonlyValueObject<T> = { readonly value: T };

/**
 * An object containing a `peek` function that retrieves the value without triggering reactivity.
 */
export type Peeker<T> = { peek: Getter<T> };

/**
 * A read-only tuple containing a getter and a setter for reactive state.
 */
export type SignalTuple<T> = readonly [get: Getter<T>, set: Setter<T>];

/**
 * A cleanup function executed when an effect runs again or is disposed.
 */
export type Cleanup<T = void> = Callback<void, T>;

/**
 * A read-only reactive signal representation.
 */
export type ReadonlySignal<T> = Getter<T> & ReadonlyValueObject<T> & Peeker<T>;

/**
 * A writable reactive signal representation.
 */
export type WritableSignal<T> = Getter<T> &
  ValueObject<T> &
  Peeker<T> &
  SignalTuple<T>;

/**
 * Alias for WritableSignal representing a reactive signal.
 */
export type Signal<T> = WritableSignal<T>;

/**
 * Alias for ReadonlySignal representing a read-only computed value.
 */
export type Computed<T> = ReadonlySignal<T>;

/**
 * Alias for WritableSignal representing a writable computed value.
 */
export type WritableComputed<T> = WritableSignal<T>;

/**
 * Represents a reactive object or value.
 */
export type Reactive<T> = Value<T>;

/**
 * Controls an active effect's execution lifecycle.
 */
export type EffectManager = {
  /**
   * The current action status of the effect, computed as pause or resume.
   */
  action: Computed<EffectAction | undefined>;
  /**
   * Disposes of the effect, stopping it permanently and running any cleanup.
   */
  stop: () => void;
  /**
   * Temporarily pauses the effect's reactivity.
   */
  pause: () => void;
  /**
   * Resumes the paused effect's reactivity.
   */
  resume: () => void;
};

/**
 * Actions that can be performed to control effect execution state.
 */
export type EffectAction = "pause" | "resume";

