import c from "./client.js";

export * from "./row.js";
export * from "./factory.js";
export * from "./types.js";

export type AddRowOptions = {
  user_field_names?: boolean;
  before?: number;
};

export type GetRowOptions = {
  user_field_names?: boolean;
};

export type ListRowsOptions = {
  page?: number;
  size?: number;
  user_field_names?: boolean;
  search?: string;
  order_by?: string;
  filters?: Record<string, unknown>;
  filter_type?: string;
  include?: string;
  exclude?: string;
  view_id?: number;
  [key: string]: unknown;
};

export type ListRowsResponse<T> = {
  count: number;
  next: null | string;
  previous: null | string;
  results: T[];
};

export type UpdateRowOptions = {
  user_field_names?: boolean;
};

export type FieldDefinition = {
  id: number;
  table_id: number;
  name: string;
  order: number;
  type: string;
  primary: boolean;
  read_only: boolean;
  array_formula_type?: string;
  formula_type?: string;
  link_row_table_id?: number;
  link_row_related_field_id?: number;
  select_options?: { id: number; value: string; color: string }[];
  through_field_id?: number;
  target_field_id?: number;
};

export type ListFieldsResponse = Array<FieldDefinition>;

export type ListDatabaseTablesResponse = Array<{
  id: number;
  name: string;
  order: number;
  database_id: number;
}>;

export class BaserowSdk {
  constructor(databaseToken: string) {
    c.defaults.headers.common["Authorization"] = `Token ${databaseToken}`;
  }

  public async addRow<
    T extends Record<string, unknown>,
    R extends Record<string, unknown>,
  >(tableId: number, input: T, options: AddRowOptions = {}): Promise<R> {
    const { data } = await c.post<R>(
      `/database/rows/table/${tableId}/`,
      input,
      { params: options },
    );
    return data;
  }

  public async getRow<T extends Record<string, unknown>>(
    tableId: number,
    rowId: number,
    options: GetRowOptions = {},
  ): Promise<T> {
    if (!Number.isFinite(rowId)) {
      throw new Error("Invalid row ID");
    }
    const { data } = await c.get<T>(
      `/database/rows/table/${tableId}/${rowId}/`,
      { params: options },
    );
    return data;
  }

  public async listRows<T extends Record<string, unknown>>(
    tableId: number,
    options: ListRowsOptions = {},
  ): Promise<ListRowsResponse<T>> {
    const { data } = await c.get<ListRowsResponse<T>>(
      `/database/rows/table/${tableId}/`,
      {
        params: options,
      },
    );
    return data;
  }

  public async updateRow<
    T extends Record<string, unknown>,
    R extends Record<string, unknown>,
  >(
    tableId: number,
    rowId: number,
    input: T,
    options: UpdateRowOptions = {},
  ): Promise<R> {
    const { data } = await c.patch<R>(
      `/database/rows/table/${tableId}/${rowId}/`,
      input,
      { params: options },
    );
    return data;
  }

  public async listFields(tableId: number): Promise<ListFieldsResponse> {
    const { data } = await c.get<ListFieldsResponse>(
      `/database/fields/table/${tableId}/`,
    );
    return data;
  }

  public async deleteRow(tableId: number, rowId: number): Promise<void> {
    await c.delete(`/database/rows/table/${tableId}/${rowId}/`);
  }
}
