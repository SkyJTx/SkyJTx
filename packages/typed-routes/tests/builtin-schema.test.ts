import { describe, it, expect } from "vitest";
import { schema } from "../src/schema/builtin";
import { validateData } from "../src/schema/validator-adapter";

describe("Built-in Schema Primitives and Formatting", () => {
  it("validates string schemas and formatting constraints", () => {
    const emailSchema = schema.string().email();
    expect(emailSchema["~standard"].validate("user@example.com")).toEqual({ value: "user@example.com" });
    const invalidEmail = emailSchema["~standard"].validate("not-an-email");
    expect("issues" in invalidEmail && invalidEmail.issues).toBeTruthy();

    const minMaxSchema = schema.string().min(3).max(6);
    expect(minMaxSchema["~standard"].validate("font")).toEqual({ value: "font" });
    expect("issues" in minMaxSchema["~standard"].validate("hi")).toBeTruthy();
    expect("issues" in minMaxSchema["~standard"].validate("too-long-text")).toBeTruthy();

    const uuidSchema = schema.string().uuid();
    expect(uuidSchema["~standard"].validate("123e4567-e89b-12d3-a456-426614174000")).toEqual({
      value: "123e4567-e89b-12d3-a456-426614174000",
    });
    expect("issues" in uuidSchema["~standard"].validate("invalid-uuid")).toBeTruthy();

    const patternSchema = schema.string().pattern(/^[A-Z]{3}$/);
    expect(patternSchema["~standard"].validate("XYZ")).toEqual({ value: "XYZ" });
    expect("issues" in patternSchema["~standard"].validate("xyz")).toBeTruthy();
  });

  it("validates numeric strings and coerced numbers", () => {
    const numericStrSchema = schema.numeric();
    expect(numericStrSchema["~standard"].validate("12345")).toEqual({ value: "12345" });
    expect(numericStrSchema["~standard"].validate("-99.5")).toEqual({ value: "-99.5" });
    expect("issues" in numericStrSchema["~standard"].validate("abc")).toBeTruthy();

    const numericCoercedSchema = schema.numeric({ coerce: true });
    expect(numericCoercedSchema["~standard"].validate("12345")).toEqual({ value: 12345 });
    expect(numericCoercedSchema["~standard"].validate("-42.5")).toEqual({ value: -42.5 });

    const strNumericSchema = schema.string().numeric();
    expect(strNumericSchema["~standard"].validate("500")).toEqual({ value: "500" });
    expect("issues" in strNumericSchema["~standard"].validate("500px")).toBeTruthy();
  });

  it("validates and coerces bigints", () => {
    const bigintSchema = schema.bigint();
    expect(bigintSchema["~standard"].validate(9007199254740991n)).toEqual({ value: 9007199254740991n });
    expect(bigintSchema["~standard"].validate("9007199254740991")).toEqual({ value: 9007199254740991n });
    expect(bigintSchema["~standard"].validate(42)).toEqual({ value: 42n });
    expect("issues" in bigintSchema["~standard"].validate("not-a-bigint")).toBeTruthy();
    expect(bigintSchema.encode(123n)).toBe("123");
  });

  it("validates and coerces dates", () => {
    const dateSchema = schema.date();
    const now = new Date();
    expect(dateSchema["~standard"].validate(now)).toEqual({ value: now });

    const isoDateStr = "2026-09-18T10:00:00.000Z";
    const parsedDateRes = dateSchema["~standard"].validate(isoDateStr);
    expect("value" in parsedDateRes && parsedDateRes.value instanceof Date).toBe(true);
    if ("value" in parsedDateRes) {
      expect(parsedDateRes.value.toISOString()).toBe(isoDateStr);
      expect(dateSchema.encode(parsedDateRes.value)).toBe(isoDateStr);
    }

    const timestampRes = dateSchema["~standard"].validate(1789728000000);
    expect("value" in timestampRes && timestampRes.value instanceof Date).toBe(true);

    expect("issues" in dateSchema["~standard"].validate("invalid-date-string")).toBeTruthy();
  });

  it("validates literal schemas", () => {
    const litString = schema.literal("admin");
    expect(litString["~standard"].validate("admin")).toEqual({ value: "admin" });
    expect("issues" in litString["~standard"].validate("guest")).toBeTruthy();

    const litNumber = schema.literal(42);
    expect(litNumber["~standard"].validate(42)).toEqual({ value: 42 });
    expect(litNumber["~standard"].validate("42")).toEqual({ value: 42 });
    expect("issues" in litNumber["~standard"].validate(43)).toBeTruthy();
  });

  it("validates null, undefined, and unknown schemas", () => {
    const nullSchema = schema.null();
    expect(nullSchema["~standard"].validate(null)).toEqual({ value: null });
    expect(nullSchema["~standard"].validate("null")).toEqual({ value: null });
    expect("issues" in nullSchema["~standard"].validate("abc")).toBeTruthy();

    const undefinedSchema = schema.undefined();
    expect(undefinedSchema["~standard"].validate(undefined)).toEqual({ value: undefined });
    expect(undefinedSchema["~standard"].validate("undefined")).toEqual({ value: undefined });
    expect("issues" in undefinedSchema["~standard"].validate("abc")).toBeTruthy();

    const unknownSchema = schema.unknown();
    expect(unknownSchema["~standard"].validate({ custom: 123 })).toEqual({ value: { custom: 123 } });
    expect(unknownSchema["~standard"].validate("anything")).toEqual({ value: "anything" });
  });

  it("validates optional, nullable, and nullish modifiers", () => {
    const optChained = schema.string().optional();
    expect(optChained["~standard"].validate(undefined)).toEqual({ value: undefined });
    expect(optChained["~standard"].validate(null)).toEqual({ value: undefined });
    expect(optChained["~standard"].validate("")).toEqual({ value: undefined });
    expect(optChained["~standard"].validate("hello")).toEqual({ value: "hello" });

    const optStandalone = schema.optional(schema.number());
    expect(optStandalone["~standard"].validate(undefined)).toEqual({ value: undefined });
    expect(optStandalone["~standard"].validate("")).toEqual({ value: undefined });
    expect(optStandalone["~standard"].validate("10")).toEqual({ value: 10 });

    const nullableSchema = schema.string().nullable();
    expect(nullableSchema["~standard"].validate(null)).toEqual({ value: null });
    expect(nullableSchema["~standard"].validate("null")).toEqual({ value: null });
    expect(nullableSchema["~standard"].validate("test")).toEqual({ value: "test" });

    const nullishSchema = schema.number().nullish();
    expect(nullishSchema["~standard"].validate(null)).toEqual({ value: undefined });
    expect(nullishSchema["~standard"].validate(undefined)).toEqual({ value: undefined });
    expect(nullishSchema["~standard"].validate("")).toEqual({ value: undefined });
    expect(nullishSchema["~standard"].validate("42")).toEqual({ value: 42 });
  });

  it("validates custom schemas and refinements", () => {
    const positiveInt = schema.number().refine((val) => val > 0, "Must be positive");
    expect(positiveInt["~standard"].validate("5")).toEqual({ value: 5 });
    const negativeRes = positiveInt["~standard"].validate("-5");
    expect("issues" in negativeRes && negativeRes.issues?.[0]?.message).toBe("Must be positive");

    const customSchema = schema.custom<string>((val) => typeof val === "string" && val.startsWith("font_"));
    expect(customSchema["~standard"].validate("font_meropide")).toEqual({ value: "font_meropide" });
    expect("issues" in customSchema["~standard"].validate("other")).toBeTruthy();
  });
});

describe("Built-in Compound Schemas and Combinators", () => {
  it("validates tuples with fixed length and individual item schemas", () => {
    const tupleSchema = schema.tuple(schema.string(), schema.number());
    expect(tupleSchema["~standard"].validate(["order", "100"])).toEqual({ value: ["order", 100] });

    const wrongLengthRes = tupleSchema["~standard"].validate(["order"]);
    expect("issues" in wrongLengthRes && wrongLengthRes.issues).toBeTruthy();

    const notArrayRes = tupleSchema["~standard"].validate("not-an-array");
    expect("issues" in notArrayRes && notArrayRes.issues).toBeTruthy();

    expect(tupleSchema.encode(["item", 42])).toEqual(["item", 42]);
  });

  it("validates records with dynamic keys and values", () => {
    const recordSchema = schema.record(schema.number());
    expect(recordSchema["~standard"].validate({ a: "1", b: 2 })).toEqual({ value: { a: 1, b: 2 } });
    expect("issues" in recordSchema["~standard"].validate("not-an-object")).toBeTruthy();

    const keyedRecord = schema.record(schema.string().min(2), schema.boolean());
    expect(keyedRecord["~standard"].validate({ ok: "true", yes: true })).toEqual({ value: { ok: true, yes: true } });
    expect("issues" in keyedRecord["~standard"].validate({ x: "true" })).toBeTruthy();
  });

  it("validates unions across multiple schemas", () => {
    const unionSchema = schema.union(schema.number(), schema.boolean());
    expect(unionSchema["~standard"].validate("123")).toEqual({ value: 123 });
    expect(unionSchema["~standard"].validate("true")).toEqual({ value: true });
    expect("issues" in unionSchema["~standard"].validate("not-num-or-bool")).toBeTruthy();
  });

  it("validates intersections and merges shape outputs", () => {
    const firstPart = schema.object({ id: schema.number() });
    const secondPart = schema.object({ name: schema.string() });
    const intersectionSchema = schema.intersection(firstPart, secondPart);

    const validRes = intersectionSchema["~standard"].validate({ id: "10", name: "Wriothesley" });
    expect(validRes).toEqual({ value: { id: 10, name: "Wriothesley" } });

    const invalidRes = intersectionSchema["~standard"].validate({ id: "not-a-number", name: "Wriothesley" });
    expect("issues" in invalidRes && invalidRes.issues).toBeTruthy();
  });

  it("supports object combinators extend, partial, pick, and omit", () => {
    const baseUser = schema.object({
      id: schema.number(),
      name: schema.string(),
      role: schema.enum(["admin", "user"] as const),
    });

    const extended = baseUser.extend({
      department: schema.string(),
    });
    expect(extended["~standard"].validate({ id: "1", name: "Duke", role: "admin", department: "Fortress" })).toEqual({
      value: { id: 1, name: "Duke", role: "admin", department: "Fortress" },
    });

    const picked = baseUser.pick(["id", "name"]);
    expect(picked["~standard"].validate({ id: "2", name: "Sigewinne" })).toEqual({
      value: { id: 2, name: "Sigewinne" },
    });

    const omitted = baseUser.omit(["role"]);
    expect(omitted["~standard"].validate({ id: "3", name: "Clorinde" })).toEqual({
      value: { id: 3, name: "Clorinde" },
    });

    const partialUser = baseUser.partial();
    expect(partialUser["~standard"].validate({})).toEqual({
      value: { id: undefined, name: undefined, role: undefined },
    });
    expect(partialUser["~standard"].validate({ id: "5" })).toEqual({
      value: { id: 5, name: undefined, role: undefined },
    });
  });
});

describe("Bidirectional Codec and Universal Adapter Interoperability", () => {
  it("supports bidirectional decode and encode transformations", () => {
    const dateCodec = schema.string().transform({
      decode: (val: string) => new Date(val),
      encode: (val: Date) => val.toISOString(),
    });

    const isoString = "2026-09-18T10:00:00.000Z";
    const decoded = dateCodec["~standard"].validate(isoString);
    expect("value" in decoded && decoded.value instanceof Date).toBe(true);

    if ("value" in decoded) {
      expect(dateCodec.encode(decoded.value)).toBe(isoString);
    }
  });

  it("interoperates seamlessly with validateData in routing contexts", () => {
    const routeSchema = schema.object({
      id: schema.numeric({ coerce: true }),
      active: schema.boolean().optional(),
      filter: schema.string().min(2).optional(),
      created: schema.date(),
    });

    const result = validateData(routeSchema, {
      id: "99",
      active: "true",
      filter: "meropide",
      created: "2026-09-18T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe(99);
      expect(result.data.active).toBe(true);
      expect(result.data.filter).toBe("meropide");
      expect(result.data.created instanceof Date).toBe(true);
    }
  });
  it("promotes types automatically via discriminated union on success", () => {
    const userSchema = schema.object({
      id: schema.number(),
      name: schema.string(),
    });

    const successResult = validateData(userSchema, { id: "1", name: "Duke" });
    if (successResult.success) {
      const data: { id: number; name: string } = successResult.data;
      expect(data.id).toBe(1);
      expect(data.name).toBe("Duke");
    } else {
      expect.fail("Expected validation to succeed");
    }

    const failureResult = validateData(userSchema, { id: "invalid", name: "Duke" });
    if (!failureResult.success) {
      expect(failureResult.issues.length).toBeGreaterThan(0);
      expect(failureResult.issues[0]?.path).toBe("id");
    } else {
      expect.fail("Expected validation to fail");
    }
  });

  it("supports schema.safeParse with discriminated result", () => {
    const ageSchema = schema.number().refine((n) => n >= 18, "Must be adult");

    const validSafe = ageSchema.safeParse("25");
    expect(validSafe.success).toBe(true);
    if (validSafe.success) {
      const val: number = validSafe.data;
      expect(val).toBe(25);
    }

    const invalidSafe = ageSchema.safeParse("15");
    expect(invalidSafe.success).toBe(false);
    if (!invalidSafe.success) {
      expect(invalidSafe.issues[0]?.message).toBe("Must be adult");
    }
  });

  it("supports schema.parse returning data or throwing SchemaValidationError", () => {
    const idSchema = schema.number();
    expect(idSchema.parse("500")).toBe(500);

    expect(() => idSchema.parse("not-a-number")).toThrowError(/Validation failed/);
  });
});
