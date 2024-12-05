import { it, describe, expect } from "vitest";
import parsers from "./parseField.js";

describe("parsers", () => {
  const tests: [keyof typeof parsers, any, unknown][] = [
    ["number", "1", 1],
    ["text", "val", "val"],
    ["long_text", "val", "val"],
    ["date", "2020-01-01", new Date("2020-01-01")],
    ["email", "contact@example.com", "contact@example.com"],
    ["password", null, false],
    ["created_on", "2020-01-01", new Date("2020-01-01")],
    ["url", "https://example.com", "https://example.com"],
  ];

  it.each(tests)(
    "parses field of type %s value %j to %j",
    (type, value, expected) => {
      expect(parsers[type].parse(value)).toEqual(expected);
    },
  );
});

// TODO:
// array
// boolean
// button
// formula
// link_row
// lookup
// rollup
// single_select
// url
// uuid
