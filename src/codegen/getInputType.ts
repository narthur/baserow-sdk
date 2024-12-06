import { FieldDefinition } from "../index.js";
import { getRawType } from "./getRawType.js";

export function getInputType(field: FieldDefinition): string {
  if (field.type === "link_row") {
    return "number[]";
  }

  return getRawType(field);
}
