import { FieldDefinition } from "../index.js";
import { Row } from "../row.js";

export function parseField(field: FieldDefinition, value: unknown, row?: Row): unknown {
  if (field.type === "number") {
    return typeof value === "string" ? parseFloat(value) : value;
  }
  
  if (field.type === "date" || field.type === "created_on") {
    return new Date(value as string);
  }

  if (field.type === "boolean") {
    return value === "true";
  }

  if (field.type === "password") {
    return !!value;
  }

  if (field.type === "link_row" && row && field.link_row_table_id) {
    return row.getLinkedRows(field.link_row_table_id, field.name, Row);
  }

  if (field.type === "array" || field.array_formula_type) {
    if ((field.array_formula_type || field.type) === "number") {
      return (value as string[]).map(parseFloat);
    }
    return value;
  }

  return value;
}
