import { describe, it, expect } from "vitest";
import makeFullRawType from "./makeFullRawType.js";
import f from "../test/fixtures/fieldDefinition.js";

describe("makeType", () => {
  it("returns string for type text", () => {
    expect(
      makeFullRawType([
        f({
          type: "text",
        }),
      ]),
    ).toContain("string");
  });

  it("returns number for type number", () => {
    expect(
      makeFullRawType([
        f({
          type: "number",
        }),
      ]),
    ).toContain("number | string");
  });

  it("returns string for type long text", () => {
    expect(
      makeFullRawType([
        f({
          type: "long_text",
        }),
      ]),
    ).toContain("string");
  });

  it("handles formula type string", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "text",
        }),
      ]),
    ).toContain("string");
  });

  it("handles formula type number", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "number",
        }),
      ]),
    ).toContain("number");
  });

  it("handles formula type boolean", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "boolean",
        }),
      ]),
    ).toContain("boolean");
  });

  it("handles formula type array string", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "array",
          array_formula_type: "text",
        }),
      ]),
    ).toContain("(string)[]");
  });

  it("handles formula type array number", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "array",
          array_formula_type: "number",
        }),
      ]),
    ).toContain("(number | string)[]");
  });

  it("handles formula type array boolean", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "array",
          array_formula_type: "boolean",
        }),
      ]),
    ).toContain("(boolean)[]");
  });

  it("quotes field names", () => {
    expect(
      makeFullRawType([
        f({
          name: "the_field_name",
        }),
      ]),
    ).toContain('"the_field_name"');
  });

  it("used unknown for default type", () => {
    expect(
      makeFullRawType([
        f({
          type: "fake_type",
        }),
      ]),
    ).toContain("unknown");
  });

  it("uses default type for unknown formula type", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "fake_type",
        }),
      ]),
    ).toContain("unknown");
  });

  it("uses default type for unknown array formula type", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "array",
          array_formula_type: "fake_type",
        }),
      ]),
    ).toContain("unknown");
  });

  it("handles rollup type number", () => {
    expect(
      makeFullRawType([
        f({
          type: "rollup",
          formula_type: "number",
        }),
      ]),
    ).toContain("number");
  });

  it("handles rollup type string", () => {
    expect(
      makeFullRawType([
        f({
          type: "rollup",
          formula_type: "text",
        }),
      ]),
    ).toContain("string");
  });

  it("handles formula type button", () => {
    expect(
      makeFullRawType([
        f({
          type: "formula",
          formula_type: "button",
        }),
      ]),
    ).toContain("string");
  });

  it("handles rollup type array string", () => {
    expect(
      makeFullRawType([
        f({
          type: "rollup",
          formula_type: "array",
          array_formula_type: "text",
        }),
      ]),
    ).toContain("(string)[]");
  });

  it("handles rollup type array number", () => {
    expect(
      makeFullRawType([
        f({
          type: "rollup",
          formula_type: "array",
          array_formula_type: "number",
        }),
      ]),
    ).toContain("(number | string)[]");
  });

  it("handles link row", () => {
    expect(
      makeFullRawType([
        f({
          type: "link_row",
        }),
      ]),
    ).toContain('{ "id": number, "value": string }[]');
  });

  it("handles lookup type array number", () => {
    expect(
      makeFullRawType([
        f({
          type: "lookup",
          formula_type: "array",
          array_formula_type: "number",
        }),
      ]),
    ).toContain("(number | string)[]");
  });

  it("handles rollup type date", () => {
    expect(
      makeFullRawType([
        f({
          type: "rollup",
          formula_type: "date",
        }),
      ]),
    ).toContain("string");
  });

  it("includes id", () => {
    expect(makeFullRawType([])).toContain("id");
  });

  it("includes order", () => {
    expect(makeFullRawType([])).toContain("order");
  });
});
