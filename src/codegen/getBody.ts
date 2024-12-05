import { Table } from "../codegen.js";
import { FieldDefinition } from "../index.js";
import { getForeignTable } from "./getForeignTable.js";
import { getRawType } from "./getRawType.js";

export function getBody(field: FieldDefinition, tables: Table[]): string {
  const rawType = getRawType(field, { unwrap: true });
  const query = `this.getField("${field.name}")`;

  if (field.type === "number" || field.formula_type === "number") {
    return `return parseFloat(String(${query}));`;
  }

  if (field.array_formula_type === "number") {
    return `return ${query}.map((v) => parseFloat(String(v)));`;
  }

  if (field.type === "lookup" && field.formula_type === "array") {
    const allFields = tables.flatMap((t) => t.fields);
    const foreignField = allFields.find((f) => f.id === field.target_field_id);

    if (!foreignField) {
      throw new Error("foreignField not found");
    }

    const rt = `(${getRawType(foreignField, { unwrap: true })})[]`.replace(
      " | undefined",
      "",
    );

    return `return this.getField("${field.name}")`;
  }

  if (field.type === "link_row") {
    const foreignTable = getForeignTable(field, tables);
    const tableId = field.link_row_table_id;
    const fieldId = field.link_row_related_field_id;
    const foreignField = foreignTable.fields.find((f) => f.id === fieldId);
    const fieldName = foreignField?.name;
    const className = `${foreignTable.name}Row`;
    return `return this.getLinkedRows(${tableId}, "${fieldName}", ${className});`;
  }

  if (field.type === "date" || field.formula_type === "date") {
    return `return new Date(${query});`;
  }

  return `return ${query};`;
}
