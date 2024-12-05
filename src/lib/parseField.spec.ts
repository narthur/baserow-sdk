import { it, describe, expect } from "vitest";
import { parseField } from "./parseField.js";
import f from "../test/fixtures/fieldDefinition.js";

describe("parseField", () => {
  it("parses number fields", () => {
    expect(parseField(f({ type: "number" }), "1")).toBe(1);
  });

  it("parses text fields", () => {
    expect(parseField(f({ type: "text" }), "val")).toBe("val");
  });

  it("parses long text fields", () => {
    expect(parseField(f({ type: "long_text" }), "val")).toBe("val");
  });

  it("parses date fields", () => {
    expect(parseField(f({ type: "date" }), "2020-01-01")).toEqual(new Date("2020-01-01"));
  });

  it("parses email fields", () => {
    expect(parseField(f({ type: "email" }), "contact@example.com")).toBe("contact@example.com");
  });

  it("parses password fields", () => {
    expect(parseField(f({ type: "password" }), null)).toBe(false);
  });

  it("parses created_on fields", () => {
    expect(parseField(f({ type: "created_on" }), "2020-01-01")).toEqual(new Date("2020-01-01"));
  });

  it("parses url fields", () => {
    expect(parseField(f({ type: "url" }), "https://example.com")).toBe("https://example.com");
  });

  it("parses boolean fields", () => {
    expect(parseField(f({ type: "boolean" }), "true")).toBe(true);
  });

  it("parses array fields with numbers", () => {
    expect(parseField(f({ type: "array", array_formula_type: "number" }), ["1", "2"])).toEqual([1, 2]);
  });
});
