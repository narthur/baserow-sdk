import { describe, it, expect } from "vitest";
import makeModelMethods from "./makeModelMethods.js";
import f from "../test/fixtures/fieldDefinition.js";
import { ListFieldsResponse } from "../index.js";

function run(fields: ListFieldsResponse = []): string {
  return makeModelMethods(1, [{ id: 1, name: "the_table_name", fields }]);
}

describe("makeModelMethods", () => {
  it("returns empty string for empty fields", () => {
    expect(run()).toBe("");
  });

  it("returns string for single field", () => {
    expect(
      run([
        f({
          name: "the_field_name",
        }),
      ]),
    ).toContain("the_field_name");
  });

  it("returns string for multiple fields", () => {
    expect(
      run([
        f({
          name: "the_field_name",
        }),
        f({
          name: "the_field_name2",
        }),
      ]),
    ).toContain("the_field_name2");
  });

  it("handles field names with spaces", () => {
    expect(
      run([
        f({
          name: "the field name",
        }),
      ]),
    ).toContain("getTheFieldName");
  });

  it("handles field names with spaces in setter", () => {
    expect(
      run([
        f({
          name: "the field name",
        }),
      ]),
    ).toContain("setTheFieldName");
  });

  it("sets return type", () => {
    expect(
      run([
        f({
          name: "the_field_name",
          type: "text",
        }),
      ]),
    ).toContain("(): string");
  });

  it("uses mapped type for value arg", () => {
    expect(
      run([
        f({
          name: "the_field_name",
          type: "text",
        }),
      ]),
    ).toContain("value: string");
  });

  it("handles emoji field name", () => {
    expect(
      run([
        f({
          name: "🔥",
        }),
      ]),
    ).toContain("getFire()");
  });

  it("handles lookup types", () => {
    expect(
      run([
        f({
          name: "the_field_name",
          type: "lookup",
          formula_type: "number",
        }),
      ]),
    ).toContain("number");
  });

  it("parses numbers", () => {
    expect(
      run([
        f({
          name: "the_field_name",
          type: "number",
        }),
      ]),
    ).toContain("parseFloat");
  });

  it("does not create setter for read-only field", () => {
    expect(
      run([
        f({
          name: "the_field_name",
          read_only: true,
        }),
      ]),
    ).not.toContain("setTheFieldName");
  });

  it("accepts id array for link_row setters", () => {
    expect(
      makeModelMethods(1, [
        {
          id: 1,
          name: "the_table_name",
          fields: [f({ type: "link_row", link_row_table_id: 2 })],
        },
        { id: 2, name: "the_foreign_table_name", fields: [] },
      ]),
    ).toContain("value: number[]");
  });

  it("properly set link row getter return type", () => {
    expect(
      makeModelMethods(1, [
        {
          id: 1,
          name: "the_table_name",
          fields: [f({ type: "link_row", link_row_table_id: 2 })],
        },
        { id: 2, name: "the_foreign_table_name", fields: [] },
      ]),
    ).toContain("TheForeignTableNameRow[]");
  });

  it("returns Date object for date fields", () => {
    expect(
      run([
        f({
          name: "the_field_name",
          type: "date",
        }),
      ]),
    ).toContain("Date");
  });

  it("returns Date object for date rollups", () => {
    expect(
      run([
        f({
          name: "the_field_name",
          type: "rollup",
          formula_type: "date",
        }),
      ]),
    ).toContain("Date");
  });
});
