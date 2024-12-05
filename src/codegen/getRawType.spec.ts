import { describe, it, expect } from "vitest";
import { getRawType } from "./getRawType.js";
import f from "../test/fixtures/fieldDefinition.js";

describe("getRawType", () => {
  it("runs", () => {
    expect(getRawType(f({ type: "text" }))).toBe("string");
  });

  it("supports unwrapping link_row", () => {
    expect(getRawType(f({ type: "link_row" }), { unwrap: true })).toBe(
      "string[]",
    );
  });

  it("supports unwrapping single_select", () => {
    expect(
      getRawType(
        f({
          type: "single_select",

          select_options: [
            {
              id: 1,
              value: "the_option_name",
              color: "red",
            },
          ],
        }),
        { unwrap: true },
      ),
    ).toBe('("the_option_name" | undefined)');
  });

  it("includes undefined in single_select type when wrapped", () => {
    expect(
      getRawType(
        f({
          type: "single_select",
          select_options: [
            {
              id: 1,
              value: "the_option_name",
              color: "red",
            },
          ],
        }),
      ),
    ).toContain("undefined");
  });

  it("only includes undefined once in unwrapped single_select type", () => {
    expect(
      getRawType(
        f({
          type: "single_select",
          select_options: [
            {
              id: 1,
              value: "option_1",
              color: "red",
            },
            {
              id: 2,
              value: "option_2",
              color: "green",
            },
          ],
        }),
        { unwrap: true },
      ),
    ).not.toMatch(/undefined.*undefined/);
  });

  it("only includes undefined once in wrapped single_select type", () => {
    expect(
      getRawType(
        f({
          type: "single_select",
          select_options: [
            {
              id: 1,
              value: "option_1",
              color: "red",
            },
            {
              id: 2,
              value: "option_2",
              color: "green",
            },
          ],
        }),
      ),
    ).not.toMatch(/undefined.*undefined/);
  });
});
