import { createDatabaseTableRow } from "../__generated__/baserow";
import { config } from "../configStore";

export type AddRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  before?: number;
  userFieldNames?: boolean;
};

export async function addRow<T>(
  tableId: number,
  input: Record<string, unknown>,
  options: AddRowOptions = {},
): Promise<T> {
  const { status, data } = await createDatabaseTableRow(
    tableId,
    input,
    options,
    config,
  );

  if (status !== 200) {
    console.dir(data, {
      depth: null,
    });
    throw new Error(`Failed to execute action: ${status}`);
  }

  return data as T;
}
