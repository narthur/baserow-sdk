import { Factory } from "./factory.js";
import { ParsedType, Row, RowOptions, RowType } from "./row.js";

export type FieldValue<T> =
  | T
  | { id: number; value: T }
  | { ids: Record<string, number>; value: T };

export interface RowClass<
  R extends RowType = RowType,
  P extends ParsedType = ParsedType,
  F extends Factory = Factory,
> {
  new (options: RowOptions<R, F>): Row<R, P, F>;
}
