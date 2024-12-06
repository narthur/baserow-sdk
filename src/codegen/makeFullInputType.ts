import { Table } from "../codegen.js";
import { ListFieldsResponse } from "../index.js";
import { getInputType } from "./getInputType.js";

export default function makeFullInputType(
  fields: ListFieldsResponse,
  _tables: Table[],
): string {
  let typeDef = `{\n`;

  typeDef += '  "id": number;\n';
  typeDef += '  "order": string;\n';

  fields.forEach((field) => {
    if (!field.read_only) {
      typeDef += `  "${field.name}": ${getInputType(field)};\n`;
    }
  });

  typeDef += `}`;

  return typeDef;
}
