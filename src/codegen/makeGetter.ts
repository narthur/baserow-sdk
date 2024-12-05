import { Table } from "../codegen.js";
import { FieldDefinition, ListFieldsResponse } from "../index.js";
import { getRawType } from "./getRawType.js";
import { toCamelCase } from "./toCamelCase.js";

function getForeignTable(field: FieldDefinition, tables: Table[]): Table {
  if (!field.link_row_table_id) {
    throw new Error("link_row_table_id is missing");
  }
  const foreignTable = tables.find((t) => field.link_row_table_id === t.id);
  if (!foreignTable) {
    console.warn("tables", tables);
    console.warn("field", field);
    throw new Error("foreign table not found");
  }
  return foreignTable;
}

function getReturnType(field: FieldDefinition, tables: Table[]): string {
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

function getBody(field: FieldDefinition, tables: Table[]): string {
  const rawType = getRawType(field, { unwrap: true });
  const query = `this.getField<${rawType}>("${field.name}")`;

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

    return `return this.getField<${rt}>("${field.name}")`;
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

export function makeGetter(
  field: FieldDefinition,
  tables: { id: number; name: string; fields: ListFieldsResponse }[],
): string {
  const fn = toCamelCase(`get ${field.name}`);
  const rt = getReturnType(field, tables);
  const bd = getBody(field, tables);

  return `\n  public ${fn}(): ${rt} {\n    ${bd}\n  }`;
}
