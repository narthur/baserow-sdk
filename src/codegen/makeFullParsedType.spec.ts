import { describe, it, expect } from "vitest";
import makeFullParsedType from "./makeFullParsedType.js";
import f from "../test/fixtures/fieldDefinition.js";
import { Table } from "../codegen.js";

const tables: Table[] = [];

describe("makeFullParsedType", () => {
  it("uses number for order type", () => {
    expect(makeFullParsedType([], tables)).toContain(`"order": number`);
  });

  it("uses return types", () => {
    expect(
      makeFullParsedType(
        [
          f({
            type: "number",
          }),
        ],
        tables,
      ),
    ).toContain(`"the_field_name": number;`);
  });
});
