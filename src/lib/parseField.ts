import { FieldDefinition } from "../index.js";

export function parseField(field: FieldDefinition, value: unknown): unknown {
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

  if (field.type === "array" || field.array_formula_type) {
    if ((field.array_formula_type || field.type) === "number") {
      return (value as string[]).map(parseFloat);
    }
    return value;
  }

  return value;
}
