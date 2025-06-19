import { describe, expect, test } from "bun:test";
import sb from "./schema-builder";

describe("string", () => {
  test("integration", () => {
    const schema = sb
      .string()
      .trim()
      .min(2, "should be a string of length at least 2")
      .regex(/^[a-z]+$/, "should be a string of lowercase letters only");
    expect(schema.parse(" abc  ")).toBe("abc");
    expect(() => schema.parse("1")).toThrow("should be a string of length at least 2");
    expect(() => schema.parse("  1   ")).toThrow("should be a string of length at least 2");
    expect(() => schema.parse("123")).toThrow("should be a string of lowercase letters only");
  });
  test("constructor", () => {
    const schema = sb.string();
    expect(schema.parse("hello")).toBe("hello");
    expect(() => schema.parse(53)).toThrowError();
  });
  test("constructor with message", () => {
    const schema = sb.string({ message: "should be a string" });
    expect(() => schema.parse(53)).toThrow("should be a string");
  });
  test("min", () => {
    const schema = sb.string().min(2);
    expect(() => schema.parse(53)).toThrowError();
    expect(schema.parse("abc")).toBe("abc");
    expect(schema.parse("ab")).toBe("ab");
    expect(() => schema.parse("a")).toThrowError();
  });
  test("min with message", () => {
    const schema = sb.string().min(1, "should not be an empty string");

    expect(() => schema.parse("")).toThrow("should not be an empty string");
  });
  test("max", () => {
    const schema = sb.string().max(2);
    expect(() => schema.parse(53)).toThrowError();
    expect(schema.parse("a")).toBe("a");
    expect(schema.parse("ab")).toBe("ab");
    expect(() => schema.parse("abc")).toThrowError();
  });
  test("max with message", () => {
    const schema = sb.string().max(2, "should be a string of length at most 2");
    expect(() => schema.parse("abcde")).toThrow("should be a string of length at most 2");
  });
  test("regex", () => {
    const schema = sb.string().regex(/^[a-z]+$/);
    expect(schema.parse("abc")).toBe("abc");
    expect(() => schema.parse("123")).toThrowError();
  });
  test("regex with message", () => {
    const schema = sb.string().regex(/^[a-z]+$/, "should be a string of lowercase letters only");
    expect(() => schema.parse("ABC")).toThrow("should be a string of lowercase letters only");
  });
});
describe("number", () => {
  test("integration", () => {
    const schema = sb.number({ cast: true }).integer().min(2).max(5);
    expect(schema.parse("3")).toBe(3);
    expect(schema.parse(2)).toBe(2);
    expect(schema.parse(5)).toBe(5);
    expect(() => schema.parse(1)).toThrow();
    expect(() => schema.parse(6)).toThrow();
  });

  test("cast", () => {
    {
      const schema = sb.number();
      expect(() => schema.parse("3")).toThrow();
    }
    {
      const schema = sb.number({ cast: true });
      expect(schema.parse("3")).toBe(3);
    }
  });

  test("min", () => {
    const schema = sb.number().min(2);
    expect(schema.parse(2)).toBe(2);
    expect(() => schema.parse(1)).toThrow();
  });
  test("max", () => {
    const schema = sb.number().max(5);
    expect(schema.parse(5)).toBe(5);
    expect(() => schema.parse(6)).toThrow();
  });
});

describe("object", () => {
  test("integration", () => {
    const schema = sb.object({ name: sb.string().min(1, "A"), age: sb.number().min(0, "B") });
    expect(() => schema.parse({ name: "Yang" })).toThrow();
    expect(() => schema.parse({ name: "", age: 0 })).toThrowError("A");
    expect(() => schema.parse({ name: "Yang", age: -1 })).toThrowError("B");
    expect(schema.parse({ name: "Yang", age: 53 })).toStrictEqual({ name: "Yang", age: 53 });
    expect(schema.parse({ name: "Yang", age: 53, cut: 53 })).toStrictEqual({ name: "Yang", age: 53 });
  });
  test("nested", () => {
    const schema = sb.object({
      user: sb.object({ name: sb.string().min(1, "A"), age: sb.number().min(0, "B") }),
    });
    expect(() => schema.parse({ user: { name: "Yang" } })).toThrow();
    expect(() => schema.parse({ user: { name: "", age: 0 } })).toThrowError("A");
    expect(() => schema.parse({ user: { name: "Yang", age: -1 } })).toThrowError("B");
    expect(schema.parse({ user: { name: "Yang", age: 53 } })).toStrictEqual({ user: { name: "Yang", age: 53 } });
  });
});
