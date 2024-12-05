import { FieldDefinition } from "../index.js";
import { mapPrimitive } from "./mapPrimitive.js";

export function getRawType(
  field: FieldDefinition,
  { unwrap }: { unwrap?: boolean } = {},
): string {
  if (field.type === "link_row") {
    if (unwrap) return "string[]";
    return '{ "id": number, "value": string }[]';
  }

  if (["rollup", "formula", "lookup"].includes(field.type)) {
    switch (field.formula_type) {
      case "array":
        return `(${mapPrimitive(field.array_formula_type)})[]`;
      default:
        return mapPrimitive(field.formula_type);
    }
  }

  if (field.type === "single_select") {
    if (!field.select_options) {
      throw new Error(
        `Field ${field.name} is a single_select but has no select_options`,
      );
    }

    const options = field.select_options
      .map((option) => {
        if (unwrap) return `"${option.value}"`;
        return `{ id: ${option.id}, value: "${option.value}", color: "${option.color}" }`;
      })
      .join(" | ");

    return `(${options} | undefined)`;
  }

  return mapPrimitive(field.type);
}
