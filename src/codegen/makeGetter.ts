import { FieldDefinition, ListFieldsResponse } from "../index.js";
import { getBody } from "./getBody.js";
import { getReturnType } from "./getReturnType.js";
import { toCamelCase } from "./toCamelCase.js";

export function makeGetter(
  field: FieldDefinition,
  tables: { id: number; name: string; fields: ListFieldsResponse }[],
): string {
  const fn = toCamelCase(`get ${field.name}`);
  const rt = getReturnType(field, tables);
  const bd = getBody(field, tables);

  return `\n  public ${fn}(): ${rt} {\n    ${bd}\n  }`;
}
