import { BaserowConfig, getConfig } from "./getConfig.js";
import { BaserowSdk, ListFieldsResponse, RowClass } from "./index.js";
import { Row, RowType } from "./row.js";
import fs from "fs";

type TableDefinition = {
  id: number;
  name: string;
  fields: ListFieldsResponse;
};
export class Factory {
  public readonly config: BaserowConfig;
  public readonly tables: TableDefinition[];

  protected sdk: BaserowSdk;
  protected classes: Map<number, RowClass<RowType, Factory>> = new Map();

  constructor() {
    this.config = getConfig();
    if (!this.config.databaseToken) {
      throw new Error("Missing database token in configuration");
    }
    this.sdk = new BaserowSdk(this.config.databaseToken);
    this.tables = JSON.parse(
      fs.readFileSync(`${this.config.outDir}/tables.json`, "utf-8"),
    ) as TableDefinition[];
  }

  protected registerRowClass<T extends RowType, R extends Factory>(
    tableId: number,
    rowClass: RowClass<T, R>,
  ): void {
    this.classes.set(tableId, rowClass as RowClass<RowType, Factory>);
  }

  protected getRowClass<T extends RowType, R extends Factory>(
    tableId: number,
  ): RowClass<T, R> | undefined {
    return this.classes.get(tableId) as RowClass<T, R> | undefined;
  }

  private async getAll<R extends RowType>(
    tableId: number,
    options: Record<string, unknown> & { page?: number } = {},
    accumulator: R[] = [],
  ): Promise<R[]> {
    const { page = 1 } = options;
    const { results, next } = await this.sdk.listRows<R>(tableId, {
      ...options,
      page,
    });
    accumulator.push(...results);
    if (!next) {
      return accumulator;
    }
    return this.getAll(tableId, { ...options, page: page + 1 }, accumulator);
  }

  private createRows<T extends Row, R extends RowType, F extends Factory>(
    tableId: number,
    defaultClass: RowClass<R, F>,
    rows: R[],
  ): T[] {
    const rowClass = this.getRowClass(tableId) || defaultClass;
    return rows.map(
      (row) =>
        new rowClass({
          tableId,
          rowId: row.id,
          row,
          sdk: this.sdk,
          repository: this as unknown as F,
        }),
    ) as T[];
  }

  public async getMany<T extends Row, R extends RowType, F extends Factory>(
    tableId: number,
    defaultClass: RowClass<R, F>,
    options: Record<string, unknown> = {},
  ): Promise<T[]> {
    const shouldGetAll = options.page === undefined;
    const results = shouldGetAll
      ? await this.getAll<R>(tableId, options)
      : (await this.sdk.listRows<R>(tableId, options)).results;

    return this.createRows(tableId, defaultClass, results);
  }
}
