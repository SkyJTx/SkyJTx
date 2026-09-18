import type { StandardSchemaV1, StandardSchemaResult, ValidationResult, ValidationIssue } from "../types/type-validator";
import { coercePrimitive } from "./coercion";
import { validateData } from "./validator-adapter";

/**
 * Error thrown when schema validation fails during parse.
 */
export class SchemaValidationError extends Error {
  public readonly issues: ReadonlyArray<ValidationIssue>;

  public constructor(issues: ReadonlyArray<ValidationIssue>) {
    super(`Validation failed: ${issues.map((i) => i.message).join("; ")}`);
    this.name = "SchemaValidationError";
    this.issues = issues;
  }
}

/**
 * Standard Schema issue representation.
 */
export type StandardSchemaIssue = {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
};

/**
 * Normalizes an object type with optional keys for undefined fields.
 */
export type CleanObjectShape<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
} & {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
};

/**
 * Derives the validated output type from a schema shape dictionary.
 */
export type InferShape<Shape> = CleanObjectShape<{
  [K in keyof Shape]: Shape[K] extends BuiltinSchema<infer O, unknown> ? O : unknown;
}>;

/**
 * Extracts the output type from an arbitrary schema.
 */
export type InferOutputFromSchema<S> = S extends BuiltinSchema<infer O, unknown> ? O : unknown;

/**
 * Derives the tuple output type from an array of schema descriptors.
 */
export type InferTuple<T extends readonly BuiltinSchema<unknown, unknown>[]> = {
  [K in keyof T]: T[K] extends BuiltinSchema<infer O, unknown> ? O : never;
};

/**
 * Derives the union output type from an array of schema descriptors.
 */
export type InferUnion<T extends readonly BuiltinSchema<unknown, unknown>[]> =
  T[number] extends BuiltinSchema<infer O, unknown> ? O : never;

/**
 * Built-in schema descriptor implementing Standard Schema V1.
 */
export interface BuiltinSchema<Output = unknown, Input = unknown> extends StandardSchemaV1<Input, Output> {
  readonly "~standard": {
    readonly version: 1;
    readonly vendor: "skyjt";
    readonly validate: (value: unknown) => StandardSchemaResult<Output>;
    readonly types?: {
      readonly input: Input;
      readonly output: Output;
    };
  };
  encode(value?: unknown): unknown;
  parse(value: unknown): Output;
  safeParse(value: unknown): ValidationResult<Output>;
  optional(): BuiltinSchema<Output | undefined, Input>;
  nullable(): BuiltinSchema<Output | null, Input>;
  nullish(): BuiltinSchema<Output | null | undefined, Input>;
  default(val: Output): BuiltinSchema<Output, Input>;
  refine(check: (val: Output) => boolean, message?: string): BuiltinSchema<Output, Input>;
  transform<Next>(
    transformer: ((val: Output) => Next) | { decode: (val: Output) => Next; encode?: (val: Next) => unknown },
    encodeFn?: (val: Next) => unknown,
  ): BuiltinSchema<Next, Input>;
}

/**
 * Built-in string schema descriptor with pattern and format constraints.
 */
export interface BuiltinStringSchema extends BuiltinSchema<string, unknown> {
  pattern(regex: RegExp, message?: string): BuiltinStringSchema;
  regex(regex: RegExp, message?: string): BuiltinStringSchema;
  min(length: number, message?: string): BuiltinStringSchema;
  max(length: number, message?: string): BuiltinStringSchema;
  length(length: number, message?: string): BuiltinStringSchema;
  email(message?: string): BuiltinStringSchema;
  uuid(message?: string): BuiltinStringSchema;
  url(message?: string): BuiltinStringSchema;
  numeric(message?: string): BuiltinStringSchema;
}

/**
 * Built-in object schema descriptor with shape combinators.
 */
export interface BuiltinObjectSchema<Shape extends Record<string, BuiltinSchema<unknown, unknown>>>
  extends BuiltinSchema<InferShape<Shape>, unknown> {
  readonly shape: Shape;
  extend<NewShape extends Record<string, BuiltinSchema<unknown, unknown>>>(
    newShape: NewShape,
  ): BuiltinObjectSchema<Shape & NewShape>;
  partial(): BuiltinObjectSchema<{
    [K in keyof Shape]: BuiltinSchema<InferOutputFromSchema<Shape[K]> | undefined, unknown>;
  }>;
  pick<Keys extends readonly (keyof Shape)[]>(
    keys: Keys,
  ): BuiltinObjectSchema<Pick<Shape, Keys[number]>>;
  omit<Keys extends readonly (keyof Shape)[]>(
    keys: Keys,
  ): BuiltinObjectSchema<Omit<Shape, Keys[number]>>;
}

/**
 * Type contract for the top-level schema builder factory.
 */
export interface SchemaFactory {
  string(): BuiltinStringSchema;
  number(): BuiltinSchema<number, unknown>;
  numeric(options: { coerce: true }): BuiltinSchema<number, unknown>;
  numeric(options?: { coerce?: false }): BuiltinSchema<string, unknown>;
  numeric(options?: { coerce?: boolean }): BuiltinSchema<string | number, unknown>;
  boolean(): BuiltinSchema<boolean, unknown>;
  bigint(): BuiltinSchema<bigint, unknown>;
  date(): BuiltinSchema<Date, unknown>;
  literal<const T extends string | number | boolean | bigint | symbol | null | undefined>(
    value: T,
  ): BuiltinSchema<T, unknown>;
  null(): BuiltinSchema<null, unknown>;
  undefined(): BuiltinSchema<undefined, unknown>;
  unknown(): BuiltinSchema<unknown, unknown>;
  optional<T, I>(innerSchema: BuiltinSchema<T, I>): BuiltinSchema<T | undefined, I>;
  nullable<T, I>(innerSchema: BuiltinSchema<T, I>): BuiltinSchema<T | null, I>;
  nullish<T, I>(innerSchema: BuiltinSchema<T, I>): BuiltinSchema<T | null | undefined, I>;
  custom<Output>(
    validateFn: (val: unknown) => boolean | StandardSchemaResult<Output>,
    message?: string,
  ): BuiltinSchema<Output, unknown>;
  enum<const T extends readonly string[]>(values: T): BuiltinSchema<T[number], unknown>;
  array<Item>(itemSchema: BuiltinSchema<Item, unknown>): BuiltinSchema<Item[], unknown>;
  tuple<const T extends readonly BuiltinSchema<unknown, unknown>[]>(
    schemas: T,
  ): BuiltinSchema<InferTuple<T>, unknown>;
  tuple<const T extends readonly BuiltinSchema<unknown, unknown>[]>(
    ...schemas: T
  ): BuiltinSchema<InferTuple<T>, unknown>;
  record<Key extends string, Value>(
    keySchema: BuiltinSchema<Key, unknown>,
    valueSchema: BuiltinSchema<Value, unknown>,
  ): BuiltinSchema<Record<Key, Value>, unknown>;
  record<Value>(
    valueSchema: BuiltinSchema<Value, unknown>,
  ): BuiltinSchema<Record<string, Value>, unknown>;
  union<const T extends readonly BuiltinSchema<unknown, unknown>[]>(
    schemas: T,
  ): BuiltinSchema<InferUnion<T>, unknown>;
  union<const T extends readonly BuiltinSchema<unknown, unknown>[]>(
    ...schemas: T
  ): BuiltinSchema<InferUnion<T>, unknown>;
  intersection<A, B>(
    schemaA: BuiltinSchema<A, unknown>,
    schemaB: BuiltinSchema<B, unknown>,
  ): BuiltinSchema<A & B, unknown>;
  object<Shape extends Record<string, BuiltinSchema<unknown, unknown>>>(
    shape: Shape,
  ): BuiltinObjectSchema<Shape>;
}

/**
 * Internal constructor producing Standard Schema compliant schema descriptors.
 */
function createBuiltinSchema<Output, Input = unknown>(
  validateFn: (value: unknown) => StandardSchemaResult<Output>,
  encodeFn?: (value: Output) => unknown,
): BuiltinSchema<Output, Input> {
  const schemaInstance: BuiltinSchema<Output, Input> = {
    "~standard": {
      version: 1,
      vendor: "skyjt",
      validate: (v: unknown) => validateFn(v),
      types: {} as { input: Input; output: Output },
    },
    encode(value?: unknown): unknown {
      if (encodeFn && value !== undefined) {
        return encodeFn(value as Output);
      }
      return value;
    },
    safeParse(value: unknown): ValidationResult<Output> {
      return validateData(schemaInstance, value);
    },
    parse(value: unknown): Output {
      const result = schemaInstance.safeParse(value);
      if (!result.success) {
        throw new SchemaValidationError(result.issues);
      }
      return result.data;
    },
    optional() {
      return createBuiltinSchema<Output | undefined, Input>(
        (val) => {
          if (val === undefined || val === null || val === "") {
            return { value: undefined };
          }
          return validateFn(val);
        },
        (val) => {
          if (val === undefined) {
            return undefined;
          }
          return schemaInstance.encode(val);
        },
      );
    },
    nullable() {
      return createBuiltinSchema<Output | null, Input>(
        (val) => {
          if (val === null || val === "null") {
            return { value: null };
          }
          return validateFn(val);
        },
        (val) => {
          if (val === null) {
            return null;
          }
          return schemaInstance.encode(val);
        },
      );
    },
    nullish() {
      return createBuiltinSchema<Output | null | undefined, Input>(
        (val) => {
          if (val === undefined || val === null || val === "" || val === "null" || val === "undefined") {
            return { value: undefined };
          }
          return validateFn(val);
        },
        (val) => {
          if (val === undefined || val === null) {
            return undefined;
          }
          return schemaInstance.encode(val);
        },
      );
    },
    default(defaultValue: Output) {
      return createBuiltinSchema<Output, Input>(
        (val) => {
          if (val === undefined || val === null || val === "") {
            return { value: defaultValue };
          }
          return validateFn(val);
        },
        (val) => schemaInstance.encode(val),
      );
    },
    refine(check: (val: Output) => boolean, message?: string) {
      return createBuiltinSchema<Output, Input>(
        (val) => {
          const res = validateFn(val);
          if ("issues" in res && res.issues) {
            return res;
          }
          if ("value" in res) {
            if (!check(res.value)) {
              return { issues: [{ message: message ?? "Validation failed refinement" }] };
            }
            return res;
          }
          return res;
        },
        (val) => schemaInstance.encode(val),
      );
    },
    transform<Next>(
      transformer: ((val: Output) => Next) | { decode: (val: Output) => Next; encode?: (val: Next) => unknown },
      explicitEncode?: (val: Next) => unknown,
    ): BuiltinSchema<Next, Input> {
      const decodeFn = typeof transformer === "function" ? transformer : transformer.decode;
      const customEncode =
        typeof transformer === "object" && transformer.encode ? transformer.encode : explicitEncode;

      return createBuiltinSchema<Next, Input>(
        (val) => {
          const res = validateFn(val);
          if ("issues" in res && res.issues) {
            return res;
          }
          if ("value" in res) {
            try {
              return { value: decodeFn(res.value) };
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err);
              return { issues: [{ message }] };
            }
          }
          return res;
        },
        (val: Next) => {
          if (customEncode) {
            const intermediate = customEncode(val);
            return schemaInstance.encode(intermediate);
          }
          return val;
        },
      );
    },
  };
  return schemaInstance;
}

/**
 * Creates string schema with string-specific constraints.
 */
function createBuiltinStringSchema(
  baseValidate: (value: unknown) => StandardSchemaResult<string>,
  encodeFn?: (value: string) => unknown,
): BuiltinStringSchema {
  const makeStringSchema = (
    validateFn: (value: unknown) => StandardSchemaResult<string>,
    enc?: (value: string) => unknown,
  ): BuiltinStringSchema => {
    const inner = createBuiltinSchema<string, unknown>(validateFn, enc);
    const result: BuiltinStringSchema = {
      ...inner,
      pattern(regex: RegExp, message?: string): BuiltinStringSchema {
        return makeStringSchema(
          (v) => {
            const r = validateFn(v);
            if ("issues" in r && r.issues) {
              return r;
            }
            if ("value" in r) {
              if (!regex.test(r.value)) {
                return { issues: [{ message: message ?? `String does not match pattern ${String(regex)}` }] };
              }
              return r;
            }
            return r;
          },
          enc,
        );
      },
      regex(regex: RegExp, message?: string): BuiltinStringSchema {
        return this.pattern(regex, message);
      },
      min(length: number, message?: string): BuiltinStringSchema {
        return makeStringSchema(
          (v) => {
            const r = validateFn(v);
            if ("issues" in r && r.issues) {
              return r;
            }
            if ("value" in r) {
              if (r.value.length < length) {
                return { issues: [{ message: message ?? `String must contain at least ${length} character(s)` }] };
              }
              return r;
            }
            return r;
          },
          enc,
        );
      },
      max(length: number, message?: string): BuiltinStringSchema {
        return makeStringSchema(
          (v) => {
            const r = validateFn(v);
            if ("issues" in r && r.issues) {
              return r;
            }
            if ("value" in r) {
              if (r.value.length > length) {
                return { issues: [{ message: message ?? `String must contain at most ${length} character(s)` }] };
              }
              return r;
            }
            return r;
          },
          enc,
        );
      },
      length(length: number, message?: string): BuiltinStringSchema {
        return makeStringSchema(
          (v) => {
            const r = validateFn(v);
            if ("issues" in r && r.issues) {
              return r;
            }
            if ("value" in r) {
              if (r.value.length !== length) {
                return { issues: [{ message: message ?? `String must be exactly ${length} character(s)` }] };
              }
              return r;
            }
            return r;
          },
          enc,
        );
      },
      email(message?: string): BuiltinStringSchema {
        return this.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message ?? "Invalid email format");
      },
      uuid(message?: string): BuiltinStringSchema {
        return this.pattern(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
          message ?? "Invalid UUID format",
        );
      },
      url(message?: string): BuiltinStringSchema {
        return this.pattern(/^https?:\/\/.+/i, message ?? "Invalid URL format");
      },
      numeric(message?: string): BuiltinStringSchema {
        return this.pattern(/^-?\d+(\.\d+)?$/, message ?? "Invalid numeric string format");
      },
    };
    return result;
  };

  return makeStringSchema(baseValidate, encodeFn);
}

/**
 * Creates object schema with shape combinators.
 */
function createBuiltinObjectSchema<Shape extends Record<string, BuiltinSchema<unknown, unknown>>>(
  shape: Shape,
): BuiltinObjectSchema<Shape> {
  const validateObj = (val: unknown): StandardSchemaResult<InferShape<Shape>> => {
    if (typeof val !== "object" || val === null || Array.isArray(val)) {
      return { issues: [{ message: `Expected object, received ${typeof val}` }] };
    }

    const input = val as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    const issues: StandardSchemaIssue[] = [];

    for (const [key, fieldSchema] of Object.entries(shape)) {
      const fieldVal = input[key];
      const res = fieldSchema["~standard"].validate(fieldVal);
      if ("issues" in res && res.issues) {
        for (const issue of res.issues) {
          issues.push({ message: issue.message, path: [key] });
        }
      } else if ("value" in res) {
        output[key] = res.value;
      }
    }

    if (issues.length > 0) {
      return { issues };
    }
    return { value: output as InferShape<Shape> };
  };

  const encodeObj = (val: InferShape<Shape>): unknown => {
    if (typeof val !== "object" || val === null) {
      return val;
    }
    const inputRec = val as Record<string, unknown>;
    const encoded: Record<string, unknown> = {};
    for (const [key, fieldSchema] of Object.entries(shape)) {
      if (key in inputRec && inputRec[key] !== undefined) {
        encoded[key] = fieldSchema.encode(inputRec[key]);
      }
    }
    return encoded;
  };

  const base = createBuiltinSchema<InferShape<Shape>, unknown>(validateObj, encodeObj);

  const objectSchema: BuiltinObjectSchema<Shape> = {
    ...base,
    shape,
    extend<NewShape extends Record<string, BuiltinSchema<unknown, unknown>>>(newShape: NewShape) {
      return createBuiltinObjectSchema({
        ...shape,
        ...newShape,
      });
    },
    partial() {
      const partialShape: Record<string, BuiltinSchema<unknown, unknown>> = {};
      for (const [key, s] of Object.entries(shape)) {
        partialShape[key] = s.optional();
      }
      return createBuiltinObjectSchema(
        partialShape as {
          [K in keyof Shape]: BuiltinSchema<InferOutputFromSchema<Shape[K]> | undefined, unknown>;
        },
      );
    },
    pick<Keys extends readonly (keyof Shape)[]>(keys: Keys) {
      const pickedShape: Record<string, BuiltinSchema<unknown, unknown>> = {};
      const keySet = new Set(keys);
      for (const [key, s] of Object.entries(shape)) {
        if (keySet.has(key as keyof Shape)) {
          pickedShape[key] = s;
        }
      }
      return createBuiltinObjectSchema(pickedShape as Pick<Shape, Keys[number]>);
    },
    omit<Keys extends readonly (keyof Shape)[]>(keys: Keys) {
      const omittedShape: Record<string, BuiltinSchema<unknown, unknown>> = {};
      const keySet = new Set(keys);
      for (const [key, s] of Object.entries(shape)) {
        if (!keySet.has(key as keyof Shape)) {
          omittedShape[key] = s;
        }
      }
      return createBuiltinObjectSchema(omittedShape as Omit<Shape, Keys[number]>);
    },
  };

  return objectSchema;
}

/**
 * Built-in schema constructors with automatic primitive coercion and Standard Schema compliance.
 */
export const schema: SchemaFactory = {
  string(): BuiltinStringSchema {
    return createBuiltinStringSchema((val) => {
      if (typeof val === "string") {
        return { value: val };
      }
      if (val !== undefined && val !== null) {
        return { value: String(val) };
      }
      return { issues: [{ message: `Expected string, received ${typeof val}` }] };
    });
  },

  number(): BuiltinSchema<number, unknown> {
    return createBuiltinSchema<number, unknown>(
      (val) => {
        const coerced = coercePrimitive(val);
        if (typeof coerced === "number" && !Number.isNaN(coerced)) {
          return { value: coerced };
        }
        return { issues: [{ message: `Expected number, received ${typeof val}` }] };
      },
      (val) => val,
    );
  },

  numeric: ((options?: { coerce?: boolean }): BuiltinSchema<string | number, unknown> => {
    const shouldCoerce = options?.coerce ?? false;
    return createBuiltinSchema<string | number, unknown>(
      (val) => {
        const strVal = typeof val === "number" ? String(val) : typeof val === "string" ? val.trim() : null;
        if (strVal !== null && /^-?\d+(\.\d+)?$/.test(strVal)) {
          return { value: shouldCoerce ? Number(strVal) : strVal };
        }
        return { issues: [{ message: `Expected numeric string, received ${String(val)}` }] };
      },
      (val) => (typeof val === "number" ? val : String(val)),
    );
  }) as SchemaFactory["numeric"],

  boolean(): BuiltinSchema<boolean, unknown> {
    return createBuiltinSchema<boolean, unknown>(
      (val) => {
        const coerced = coercePrimitive(val);
        if (typeof coerced === "boolean") {
          return { value: coerced };
        }
        return { issues: [{ message: `Expected boolean, received ${typeof val}` }] };
      },
      (val) => val,
    );
  },

  bigint(): BuiltinSchema<bigint, unknown> {
    return createBuiltinSchema<bigint, unknown>(
      (val) => {
        if (typeof val === "bigint") {
          return { value: val };
        }
        if (typeof val === "number" && Number.isInteger(val)) {
          return { value: BigInt(val) };
        }
        if (typeof val === "string" && val.trim() !== "") {
          try {
            return { value: BigInt(val.trim()) };
          } catch {
            return { issues: [{ message: `Expected bigint, received ${String(val)}` }] };
          }
        }
        return { issues: [{ message: `Expected bigint, received ${typeof val}` }] };
      },
      (val) => val.toString(),
    );
  },

  date(): BuiltinSchema<Date, unknown> {
    return createBuiltinSchema<Date, unknown>(
      (val) => {
        if (val instanceof Date && !Number.isNaN(val.getTime())) {
          return { value: val };
        }
        if (typeof val === "string" || typeof val === "number") {
          const coerced =
            typeof val === "string" && !Number.isNaN(Number(val)) && val.trim() !== ""
              ? Number(val)
              : val;
          const d = new Date(coerced);
          if (!Number.isNaN(d.getTime())) {
            return { value: d };
          }
        }
        return { issues: [{ message: `Expected valid Date, received ${String(val)}` }] };
      },
      (val) => val.toISOString(),
    );
  },

  literal<const T extends string | number | boolean | bigint | symbol | null | undefined>(
    literalValue: T,
  ): BuiltinSchema<T, unknown> {
    return createBuiltinSchema<T, unknown>(
      (val) => {
        if (val === literalValue) {
          return { value: literalValue };
        }
        const coerced = coercePrimitive(val);
        if (coerced === literalValue) {
          return { value: literalValue };
        }
        if (typeof literalValue === "bigint" && (typeof val === "string" || typeof val === "number")) {
          try {
            if (BigInt(val) === literalValue) {
              return { value: literalValue };
            }
          } catch {
            // Ignore parse failure
          }
        }
        return { issues: [{ message: `Expected literal ${String(literalValue)}, received ${String(val)}` }] };
      },
      (val) => val,
    );
  },

  null(): BuiltinSchema<null, unknown> {
    return createBuiltinSchema<null, unknown>(
      (val) => {
        if (val === null || val === "null") {
          return { value: null };
        }
        return { issues: [{ message: `Expected null, received ${typeof val}` }] };
      },
      () => null,
    );
  },

  undefined(): BuiltinSchema<undefined, unknown> {
    return createBuiltinSchema<undefined, unknown>(
      (val) => {
        if (val === undefined || val === "undefined") {
          return { value: undefined };
        }
        return { issues: [{ message: `Expected undefined, received ${typeof val}` }] };
      },
      () => undefined,
    );
  },

  unknown(): BuiltinSchema<unknown, unknown> {
    return createBuiltinSchema<unknown, unknown>(
      (val) => ({ value: val }),
      (val) => val,
    );
  },

  optional<T, I>(innerSchema: BuiltinSchema<T, I>): BuiltinSchema<T | undefined, I> {
    return innerSchema.optional();
  },

  nullable<T, I>(innerSchema: BuiltinSchema<T, I>): BuiltinSchema<T | null, I> {
    return innerSchema.nullable();
  },

  nullish<T, I>(innerSchema: BuiltinSchema<T, I>): BuiltinSchema<T | null | undefined, I> {
    return innerSchema.nullish();
  },

  custom<Output>(
    validateFn: (val: unknown) => boolean | StandardSchemaResult<Output>,
    message?: string,
  ): BuiltinSchema<Output, unknown> {
    return createBuiltinSchema<Output, unknown>(
      (val) => {
        const res = validateFn(val);
        if (typeof res === "boolean") {
          return res
            ? { value: val as Output }
            : { issues: [{ message: message ?? "Custom validation failed" }] };
        }
        return res;
      },
      (val) => val,
    );
  },

  enum<const T extends readonly string[]>(values: T): BuiltinSchema<T[number], unknown> {
    const allowed = new Set(values);
    return createBuiltinSchema<T[number], unknown>(
      (val) => {
        if (typeof val === "string" && allowed.has(val as T[number])) {
          return { value: val as T[number] };
        }
        return { issues: [{ message: `Expected one of [${values.join(", ")}], received ${String(val)}` }] };
      },
      (val) => val,
    );
  },

  array<Item>(itemSchema: BuiltinSchema<Item, unknown>): BuiltinSchema<Item[], unknown> {
    return createBuiltinSchema<Item[], unknown>(
      (val) => {
        const arr = Array.isArray(val) ? val : [val];
        const items: Item[] = [];
        const issues: StandardSchemaIssue[] = [];

        for (let i = 0; i < arr.length; i++) {
          const res = itemSchema["~standard"].validate(arr[i]);
          if ("issues" in res && res.issues) {
            for (const issue of res.issues) {
              issues.push({ message: issue.message, path: [i] });
            }
          } else if ("value" in res) {
            items.push(res.value);
          }
        }

        if (issues.length > 0) {
          return { issues };
        }
        return { value: items };
      },
      (items) => items.map((it) => itemSchema.encode(it)),
    );
  },

  tuple<const T extends readonly BuiltinSchema<unknown, unknown>[]>(
    ...args: [T] | T
  ): BuiltinSchema<InferTuple<T>, unknown> {
    const schemas: readonly BuiltinSchema<unknown, unknown>[] =
      args.length === 1 && Array.isArray(args[0])
        ? (args[0] as readonly BuiltinSchema<unknown, unknown>[])
        : (args as unknown as readonly BuiltinSchema<unknown, unknown>[]);

    return createBuiltinSchema<InferTuple<T>, unknown>(
      (val) => {
        if (!Array.isArray(val)) {
          return { issues: [{ message: `Expected array for tuple, received ${typeof val}` }] };
        }
        if (val.length !== schemas.length) {
          return {
            issues: [{ message: `Expected tuple of length ${schemas.length}, received ${val.length}` }],
          };
        }
        const tupleValues: unknown[] = [];
        const issues: StandardSchemaIssue[] = [];

        for (let i = 0; i < schemas.length; i++) {
          const itemRes = schemas[i]["~standard"].validate(val[i]);
          if ("issues" in itemRes && itemRes.issues) {
            for (const issue of itemRes.issues) {
              issues.push({ message: issue.message, path: [i] });
            }
          } else if ("value" in itemRes) {
            tupleValues.push(itemRes.value);
          }
        }

        if (issues.length > 0) {
          return { issues };
        }
        return { value: tupleValues as InferTuple<T> };
      },
      (tupleVal) => {
        const arr = tupleVal as unknown as readonly unknown[];
        return arr.map((item, idx) => {
          const s = schemas[idx];
          return s ? s.encode(item) : item;
        });
      },
    );
  },

  record(
    first: BuiltinSchema<unknown, unknown>,
    second?: BuiltinSchema<unknown, unknown>,
  ): BuiltinSchema<Record<string, unknown>, unknown> {
    const keySchema = second ? (first as BuiltinSchema<string, unknown>) : undefined;
    const valueSchema = second ? second : first;

    return createBuiltinSchema<Record<string, unknown>, unknown>(
      (val) => {
        if (typeof val !== "object" || val === null || Array.isArray(val)) {
          return { issues: [{ message: `Expected record object, received ${typeof val}` }] };
        }
        const input = val as Record<string, unknown>;
        const output: Record<string, unknown> = {};
        const issues: StandardSchemaIssue[] = [];

        for (const [k, v] of Object.entries(input)) {
          if (keySchema) {
            const keyRes = keySchema["~standard"].validate(k);
            if ("issues" in keyRes && keyRes.issues) {
              for (const issue of keyRes.issues) {
                issues.push({ message: issue.message, path: [k] });
              }
            }
          }
          const valRes = valueSchema["~standard"].validate(v);
          if ("issues" in valRes && valRes.issues) {
            for (const issue of valRes.issues) {
              issues.push({ message: issue.message, path: [k] });
            }
          } else if ("value" in valRes) {
            output[k] = valRes.value;
          }
        }

        if (issues.length > 0) {
          return { issues };
        }
        return { value: output };
      },
      (rec) => {
        const encoded: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(rec)) {
          encoded[k] = valueSchema.encode(v);
        }
        return encoded;
      },
    );
  },

  union<const T extends readonly BuiltinSchema<unknown, unknown>[]>(
    ...args: [T] | T
  ): BuiltinSchema<InferUnion<T>, unknown> {
    const schemas: readonly BuiltinSchema<unknown, unknown>[] =
      args.length === 1 && Array.isArray(args[0])
        ? (args[0] as readonly BuiltinSchema<unknown, unknown>[])
        : (args as unknown as readonly BuiltinSchema<unknown, unknown>[]);

    return createBuiltinSchema<InferUnion<T>, unknown>(
      (val) => {
        const allIssues: StandardSchemaIssue[] = [];
        for (const s of schemas) {
          const res = s["~standard"].validate(val);
          if ("value" in res && !("issues" in res && res.issues)) {
            return { value: res.value as InferUnion<T> };
          }
          if ("issues" in res && res.issues) {
            allIssues.push(...res.issues);
          }
        }
        return {
          issues: [
            {
              message: `Invalid input: does not match any union member (${schemas.length} tested)`,
            },
            ...allIssues,
          ],
        };
      },
      (val) => {
        for (const s of schemas) {
          const res = s["~standard"].validate(val);
          if ("value" in res && !("issues" in res && res.issues)) {
            return s.encode(res.value);
          }
        }
        return val;
      },
    );
  },

  intersection<A, B>(
    schemaA: BuiltinSchema<A, unknown>,
    schemaB: BuiltinSchema<B, unknown>,
  ): BuiltinSchema<A & B, unknown> {
    return createBuiltinSchema<A & B, unknown>(
      (val) => {
        const resA = schemaA["~standard"].validate(val);
        if ("issues" in resA && resA.issues) {
          return resA;
        }
        const resB = schemaB["~standard"].validate(val);
        if ("issues" in resB && resB.issues) {
          return resB;
        }
        if ("value" in resA && "value" in resB) {
          const aVal = resA.value;
          const bVal = resB.value;
          if (
            typeof aVal === "object" &&
            aVal !== null &&
            !Array.isArray(aVal) &&
            typeof bVal === "object" &&
            bVal !== null &&
            !Array.isArray(bVal)
          ) {
            return { value: { ...aVal, ...bVal } as A & B };
          }
          return { value: bVal as A & B };
        }
        return { issues: [{ message: "Intersection validation failed" }] };
      },
      (val) => {
        const encA = schemaA.encode(val);
        const encB = schemaB.encode(val);
        if (
          typeof encA === "object" &&
          encA !== null &&
          !Array.isArray(encA) &&
          typeof encB === "object" &&
          encB !== null &&
          !Array.isArray(encB)
        ) {
          return { ...encA, ...encB };
        }
        return encB;
      },
    );
  },

  object<Shape extends Record<string, BuiltinSchema<unknown, unknown>>>(
    shape: Shape,
  ): BuiltinObjectSchema<Shape> {
    return createBuiltinObjectSchema(shape);
  },
};