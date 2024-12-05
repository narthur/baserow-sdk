import { Table } from "../codegen.js";
import { FieldDefinition } from "../index.js";

export function getForeignTable(
  field: FieldDefinition,
  tables: Table[],
): Table {
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
