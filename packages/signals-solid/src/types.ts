export type Value<T> = T;
export type Getter<T> = () => T;
export type Setter<T> = (value: T) => void;
export type GetterSetter<T> = {
  getter: Getter<T>;
  setter: Setter<T>;
};
export type Modifier<T> = (prev: T) => T;
export type Callback<T = void, Q = void> = (value: T) => Q;

export type Initializer<T> = Value<T> | Getter<T>;

export type ValueObject<T> = { value: T };
export type ReadonlyValueObject<T> = { readonly value: T };
export type Peeker<T> = { peek: Getter<T> };
export type SignalTuple<T> = readonly [get: Getter<T>, set: Setter<T>];

export type Cleanup<T = void> = Callback<void, T>;

export type ReadonlySignal<T> = Getter<T> & ReadonlyValueObject<T> & Peeker<T>;
export type WritableSignal<T> = Getter<T> &
  ValueObject<T> &
  Peeker<T> &
  SignalTuple<T>;

export type Signal<T> = WritableSignal<T>;
export type Computed<T> = ReadonlySignal<T>;
export type WritableComputed<T> = WritableSignal<T>;
export type Reactive<T> = Value<T>;
export type EffectManager = {
  action: Computed<EffectAction | undefined>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};
export type EffectAction = "pause" | "resume";
