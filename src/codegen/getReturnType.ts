import { Table } from "../codegen.js";
import { FieldDefinition } from "../index.js";
import { getForeignTable } from "./getForeignTable.js";
import { getRawType } from "./getRawType.js";
import { toCamelCase } from "./toCamelCase.js";

export function getReturnType(field: FieldDefinition, tables: Table[]): string {
  if (field.type === "date" || field.formula_type === "date") {
    return "Date";
  }

  if (field.type === "link_row") {
    const foreignTable = getForeignTable(field, tables);
    return `Promise<${toCamelCase(foreignTable.name, true)}Row[]>`;
  }

  if (field.type === "single_select") {
    if (!field.select_options) {
      throw new Error(
        `Field ${field.name} is a single_select but has no select_options`,
      );
    }
    const options = [
      ...field.select_options.map((option) => `"${option.value}"`),
      "undefined",
    ];
    return options.join(" | ");
  }

  if (field.type === "number" || field.formula_type === "number") {
    return "number";
  }

  if (field.type === "lookup" && field.formula_type === "array") {
    const allFields = tables.flatMap((t) => t.fields);
    const foreignField = allFields.find((f) => f.id === field.target_field_id);

    if (!foreignField) {
      throw new Error("foreignField not found");
    }

    return `(${getReturnType(foreignField, tables)})[]`.replace(
      " | undefined",
      "",
    );
  }

  return getRawType(field);
}
