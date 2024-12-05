import { Table } from "../codegen.js";
import { ListFieldsResponse } from "../index.js";
import { getReturnType } from "./getReturnType.js";

export default function makeFullRawType(
  fields: ListFieldsResponse,
  tables: Table[],
): string {
  let typeDef = `{\n`;

  typeDef += '  "id": number;\n';
  typeDef += '  "order": number;\n';

  fields.forEach((field) => {
    typeDef += `  "${field.name}": ${getReturnType(field, tables)};\n`;
  });

  typeDef += `}`;

  return typeDef;
}
