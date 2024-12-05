import { ListFieldsResponse } from "../index.js";
import { getRawType } from "./getRawType.js";

export default function makeFullRawType(fields: ListFieldsResponse): string {
  let typeDef = `{\n`;

  typeDef += '  "id": number;\n';
  typeDef += '  "order": string;\n';

  fields.forEach((field) => {
    typeDef += `  "${field.name}": ${getRawType(field)};\n`;
  });

  typeDef += `}`;

  return typeDef;
}
