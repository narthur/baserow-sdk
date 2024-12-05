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
          {
            id: 2,
            value: "the_option_name_2",
            color: "blue",
          },
        ],
      },
      `"the_option_name" | "the_option_name_2"`,
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

  it("handles lookup type array single_select", () => {
    expect(
      makeGetter(
        f({
          type: "lookup",
          formula_type: "array",
          array_formula_type: "single_select",
          target_field_id: 4,
        }),
        [
          {
            id: 3,
            name: "table_name",
            fields: [
              f({
                id: 4,
                type: "single_select",
                select_options: [
                  {
                    id: 1,
                    value: "the_option_name",
                    color: "red",
                  },
                ],
              }),
            ],
          },
        ],
      ),
    ).toContain("the_option_name");
  });

  it("returns lookup array as arrays", () => {
    expect(
      makeGetter(
        f({
          type: "lookup",
          formula_type: "array",
          array_formula_type: "single_select",
          target_field_id: 4,
        }),
        [
          {
            id: 3,
            name: "table_name",
            fields: [
              f({
                id: 4,
                type: "single_select",
                select_options: [
                  {
                    id: 1,
                    value: "the_option_name",
                    color: "red",
                  },
                ],
              }),
            ],
          },
        ],
      ),
    ).toContain('("the_option_name")[]');
  });

  it("includes undefined in type for single_select", () => {
    expect(
      run({
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
        ],
      }),
    ).toContain("| undefined");
  });

  it("coerces number for lookup array number", () => {
    expect(
      run({
        type: "lookup",
        formula_type: "array",
        array_formula_type: "number",
        target_field_id: 2,
      }),
    ).toContain("parseFloat");
  });
});
