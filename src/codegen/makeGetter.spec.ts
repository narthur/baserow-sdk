import { describe, it, expect } from "vitest";
import f from "../test/fixtures/fieldDefinition.js";
import { makeGetter } from "./makeGetter.js";
import { FieldDefinition } from "../index.js";

function run(field: Partial<FieldDefinition> = {}): string {
  return makeGetter(f(field), [
    {
      id: 1,
      name: "table_name",
      fields: [
        {
          id: 2,
          name: "field_name",
          table_id: 0,
          order: 0,
          type: "",
          primary: false,
          read_only: false,
        },
      ],
    },
  ]);
}

describe("makeGetter", () => {
  it.each([
    [{ type: "text" }, "string"],
    [{ type: "number" }, "number"],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
        ],
      },
      "the_option_name",
    ],
    [{ type: "date" }, ": Date"],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
        ],
      },
      `: "the_option_name"`,
    ],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
        ],
      },
      `<({ id: 1, value: "the_option_name", color: "red" })>`,
    ],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
          {
            id: 2,
            value: "the_option_name_2",
            color: "blue",
          },
        ],
      },
      `<({ id: 1, value: "the_option_name", color: "red" } | { id: 2, value: "the_option_name_2", color: "blue" })>`,
    ],
    [{ type: "number" }, `: number {`],
    [
      {
        type: "rollup",
        formula_type: "number",
      },
      `: number {`,
    ],
    [
      {
        type: "rollup",
        formula_type: "number",
      },
      `parseFloat(`,
    ],
    [
      {
        type: "link_row",
        link_row_table_id: 1,
        link_row_related_field_id: 2,
      },
      "this.getLinkedRows",
    ],
    [
      {
        type: "link_row",
        link_row_table_id: 1,
        link_row_related_field_id: 2,
      },
      `"field_name"`,
    ],
    [
      {
        type: "number",
      },
      "parseFloat(String(",
    ],
  ])("%s => `%s`", (field, expected) => {
    expect(run(field)).toContain(expected);
  });
});
