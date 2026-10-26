/**
 * Discriminated result tuple representing either successful data or a scoped error.
 * Destructuring `const [data, error] = result`:
 * - `if (error)` narrows `error` to `E` and `data` to `undefined`.
 * - In the continuation branch, `data` is narrowed to `T` and `error` is `undefined`.
 */
export type Result<T, E = Error> =
  | readonly [data: T, error: undefined]
  | readonly [data: undefined, error: E];

export function ok<T>(data: T): Result<T, never> {
  return [data, undefined] as const;
}

export function err<E>(error: E): Result<never, E> {
  return [undefined, error] as const;
}