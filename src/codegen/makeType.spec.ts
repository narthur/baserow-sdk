import { describe, it, expect } from "vitest";
import makeType from "./makeType";
import f from "../test/fixtures/fieldDefinition";

describe("makeType", () => {
  it("returns string for type text", () => {
    expect(
      makeType([
        f({
          type: "text",
        }),
      ]),
    ).toContain("string");
  });

  it("returns number for type number", () => {
    expect(
      makeType([
        f({
          type: "number",
        }),
      ]),
    ).toContain("number | string");
  });

  it("returns bool for type single select", () => {
    expect(
      makeType([
        f({
          type: "single_select",
        }),
      ]),
    ).toContain("boolean");
  });

  it("returns string for type long text", () => {
    expect(
      makeType([
        f({
          type: "long_text",
        }),
      ]),
    ).toContain("string");
  });

  it("handles formula type string", () => {
    expect(
      makeType([
        f({
          type: "formula",
          formula_type: "text",
        }),
      ]),
    ).toContain("string");
  });

  it("handles formula type number", () => {
    expect(
      makeType([
        f({
          type: "formula",
          formula_type: "number",
        }),
      ]),
    ).toContain("number");
  });

  it("handles formula type boolean", () => {
    expect(
      makeType([
        f({
          type: "formula",
          formula_type: "boolean",
        }),
      ]),
    ).toContain("boolean");
  });

  it("handles formula type array string", () => {
    expect(
      makeType([
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
      makeType([
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
      makeType([
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
      makeType([
        f({
          name: "the_field_name",
        }),
      ]),
    ).toContain('"the_field_name"');
  });

  it("used unknown for default type", () => {
    expect(
      makeType([
        f({
          type: "fake_type",
        }),
      ]),
    ).toContain("unknown");
  });

  it("uses default type for unknown formula type", () => {
    expect(
      makeType([
        f({
          type: "formula",
          formula_type: "fake_type",
        }),
      ]),
    ).toContain("unknown");
  });

  it("uses default type for unknown array formula type", () => {
    expect(
      makeType([
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
      makeType([
        f({
          type: "rollup",
          formula_type: "number",
        }),
      ]),
    ).toContain("number");
  });

  it("handles rollup type string", () => {
    expect(
      makeType([
        f({
          type: "rollup",
          formula_type: "text",
        }),
      ]),
    ).toContain("string");
  });

  it("handles formula type button", () => {
    expect(
      makeType([
        f({
          type: "formula",
          formula_type: "button",
        }),
      ]),
    ).toContain("string");
  });

  it("handles rollup type array string", () => {
    expect(
      makeType([
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
      makeType([
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
      makeType([
        f({
          type: "link_row",
        }),
      ]),
    ).toContain('{ "id": number, "value": string }[]');
  });

  it("handles lookup type array number", () => {
    expect(
      makeType([
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
      makeType([
        f({
          type: "rollup",
          formula_type: "date",
        }),
      ]),
    ).toContain("string");
  });

  it("includes id", () => {
    expect(makeType([])).toContain("id");
  });

  it("includes order", () => {
    expect(makeType([])).toContain("order");
  });
});
