import { updateDatabaseTableRow } from "../__generated__/baserow";
import { getConfig } from "../configStore";
import { limit } from "../limit";

export type UpdateRowOptions = {
  clientSessionId?: string;
  clientUndoRedoActionGroupId?: string;
  userFieldNames?: boolean;
};

export async function updateRow<T>(
  tableId: number,
  rowId: number,
  input: Record<string, unknown>,
  options: UpdateRowOptions = {},
): Promise<T> {
  const { status, data } = await limit(() =>
    updateDatabaseTableRow(rowId, tableId, input, options, getConfig()),
  );

  if (status !== 200) {
    console.dir(data, {
      depth: null,
    });
    throw new Error(`Failed to execute action: ${status}`);
  }

  return data as T;
}
