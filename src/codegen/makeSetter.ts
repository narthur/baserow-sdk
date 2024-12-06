import { FieldDefinition } from "../index.js";
import { getInputType } from "./getInputType.js";
import { toCamelCase } from "./toCamelCase.js";

export function makeSetter(field: FieldDefinition): string {
  const fn = toCamelCase(`set ${field.name}`);
  const it = getInputType(field);
  const bd = `return this.setField("${field.name}", value);`;

  return `\n  public ${fn}(value: ${it}): Promise<void> {\n    ${bd}\n  }`;
}
