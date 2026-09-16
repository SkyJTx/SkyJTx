import { describe, it, expect } from "vitest";
import { z } from "zod";
import * as v from "valibot";
import { Type } from "@sinclair/typebox";
import { validateData } from "../src/schema/validator-adapter";
import { schema } from "../src/schema/builtin";

describe("Universal Validator Adapter", () => {
  it("validates and coerces using built-in schema", () => {
    const userSchema = schema.object({
      id: schema.number(),
      active: schema.boolean(),
      role: schema.enum(["admin", "user"] as const),
    });

    const result = validateData(userSchema, {
      id: "123",
      active: "true",
      role: "admin",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 123,
      active: true,
      role: "admin",
    });
  });

  it("validates and coerces using Zod with auto-coercion fallback", () => {
    const zodSchema = z.object({
      id: z.number(),
      count: z.number(),
    });

    const result = validateData(zodSchema, {
      id: "42",
      count: 10,
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 42,
      count: 10,
    });
  });

  it("validates and coerces using Valibot via Standard Schema", () => {
    const valibotSchema = v.object({
      id: v.number(),
      enabled: v.boolean(),
    });

    const result = validateData(valibotSchema, {
      id: "99",
      enabled: "false",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 99,
      enabled: false,
    });
  });

  it("validates and coerces using TypeBox", () => {
    const typeboxSchema = Type.Object({
      id: Type.Integer(),
      name: Type.String(),
    });

    const result = validateData(typeboxSchema, {
      id: "777",
      name: "Duke",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 777,
      name: "Duke",
    });
  });

  it("validates using custom parser function", () => {
    const customParser = (raw: Record<string, unknown>) => {
      const num = Number(raw.id);
      if (Number.isNaN(num)) {
        throw new Error("Invalid id");
      }
      return { id: num };
    };

    const successRes = validateData(customParser, { id: "50" });
    expect(successRes.success).toBe(true);
    expect(successRes.data).toEqual({ id: 50 });

    const failRes = validateData(customParser, { id: "not-a-number" });
    expect(failRes.success).toBe(false);
  });
});
