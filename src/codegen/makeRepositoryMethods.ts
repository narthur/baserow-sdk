import { Table } from "../codegen.js";

export default function makeRepositoryMethods(tables: Table[]): string {
  return tables
    .map(({ id, name }) => {
      return `    public async getMany${name}<T extends ${name}Row>(options: ListRowsOptions = {}): Promise<T[]> {
      return this.getMany<T, ${name}RowType, Repository>(${id}, ${name}Row, options);
    }

    public async getOne${name}<T extends ${name}Row>(id: number, options: GetRowOptions = {}): Promise<T> {
        const row = await this.sdk.getRow<${name}RowType>(${id}, id, options);
        const rowClass = this.getRowClass(${id}) || ${name}Row;
        return new rowClass({ tableId: ${id}, rowId: row.id, row, sdk: this.sdk, repository: this }) as T;
    }
`;
    })
    .join("\n");
}
