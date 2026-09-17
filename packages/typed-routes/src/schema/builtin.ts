import type { StandardSchemaV1, StandardSchemaResult } from "../types/type-validator";
import { coercePrimitive } from "./coercion";

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
  optional(): BuiltinSchema<Output | undefined, Input>;
  default(val: Output): BuiltinSchema<Output, Input>;
}

function createBuiltinSchema<Output, Input = unknown>(
  validateFn: (value: unknown) => StandardSchemaResult<Output>,
): BuiltinSchema<Output, Input> {
  const schema: BuiltinSchema<Output, Input> = {
    "~standard": {
      version: 1,
      vendor: "skyjt",
      validate: (v: unknown) => validateFn(v),
      types: {} as { input: Input; output: Output },
    },
    optional() {
      return createBuiltinSchema<Output | undefined, Input>((val) => {
        if (val === undefined || val === null || val === "") {
          return { value: undefined };
        }
        return validateFn(val);
      });
    },
    default(defaultValue: Output) {
      return createBuiltinSchema<Output, Input>((val) => {
        if (val === undefined || val === null || val === "") {
          return { value: defaultValue };
        }
        return validateFn(val);
      });
    },
  };
  return schema;
}

/**
 * Built-in schema constructors with automatic primitive coercion.
 */
export const schema = {
  string(): BuiltinSchema<string, unknown> {
    return createBuiltinSchema<string, unknown>((val) => {
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
    return createBuiltinSchema<number, unknown>((val) => {
      const coerced = coercePrimitive(val);
      if (typeof coerced === "number" && !Number.isNaN(coerced)) {
        return { value: coerced };
      }
      return { issues: [{ message: `Expected number, received ${typeof val}` }] };
    });
  },

  boolean(): BuiltinSchema<boolean, unknown> {
    return createBuiltinSchema<boolean, unknown>((val) => {
      const coerced = coercePrimitive(val);
      if (typeof coerced === "boolean") {
        return { value: coerced };
      }
      return { issues: [{ message: `Expected boolean, received ${typeof val}` }] };
    });
  },

  enum<const T extends readonly string[]>(values: T): BuiltinSchema<T[number], unknown> {
    const allowed = new Set(values);
    return createBuiltinSchema<T[number], unknown>((val) => {
      if (typeof val === "string" && allowed.has(val as T[number])) {
        return { value: val as T[number] };
      }
      return { issues: [{ message: `Expected one of [${values.join(", ")}], received ${String(val)}` }] };
    });
  },

  array<Item>(itemSchema: BuiltinSchema<Item, unknown>): BuiltinSchema<Item[], unknown> {
    return createBuiltinSchema<Item[], unknown>((val) => {
      const arr = Array.isArray(val) ? val : [val];
      const items: Item[] = [];
      const issues: Array<{ message: string; path?: PropertyKey[] }> = [];

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
    });
  },

  object<Shape extends Record<string, BuiltinSchema<unknown, unknown>>>(
    shape: Shape,
  ): BuiltinSchema<InferShape<Shape>, unknown> {
    return createBuiltinSchema<InferShape<Shape>, unknown>((val) => {
      if (typeof val !== "object" || val === null) {
        return { issues: [{ message: `Expected object, received ${typeof val}` }] };
      }

      const input = val as Record<string, unknown>;
      const output: Record<string, unknown> = {};
      const issues: Array<{ message: string; path?: PropertyKey[] }> = [];

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
    });
  },
};
