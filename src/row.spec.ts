import { Factory } from "./factory.js";
import { Row, RowType } from "./row.js";
import { describe, it, expect, vi } from "vitest";
import f from "./test/fixtures/fieldDefinition.js";

class MyRow extends Row {
  public async doSomething(): Promise<Row<RowType, Factory>[]> {
    return this.getLinkedRows(1, "the_field", MyRow);
  }
}

describe("Row", () => {
  it("should do something", async () => {
    const getMany = vi.fn();

    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1" },
      sdk: {} as any,
      repository: {
        getMany,
      } as any,
    });

    await row.doSomething();

    expect(getMany).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        filters: expect.objectContaining({
          filters: expect.arrayContaining([
            expect.objectContaining({
              field: "the_field",
            }),
          ]),
        }),
      }),
    );
  });

  it("unwraps FieldValue", () => {
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: { id: 1, value: "1" } },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "number" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toBe(1);
  });

  it("unwraps FieldValue in array", () => {
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: [{ id: 1, value: "1" }] },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [
              f({
                name: "the_field",
                formula_type: "array",
                array_formula_type: "number",
              }),
            ],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toEqual([1]);
  });

  it("coerces number to number", () => {
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: "1" },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "number" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toBe(1);
  });

  it("handles boolean field type", () => {
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: "true" },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "boolean" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toBe(true);
  });

  it("handles numeric field type", () => {
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: "1" },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "number" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toBe(1);
  });

  it("handles array field type", () => {
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: ["1", "2", "3"] },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "array", array_formula_type: "number" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toEqual([1, 2, 3]);
  });

  it("handles date field type", () => {
    const dateStr = "2024-03-19T15:30:00.000Z";
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: dateStr },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "date" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toEqual(new Date(dateStr));
  });

  it("handles email field type", () => {
    const email = "test@example.com";
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: email },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "email" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toBe(email);
  });

  it("handles url field type", () => {
    const url = "https://example.com";
    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1", the_field: url },
      sdk: {} as any,
      repository: {
        tables: [
          {
            id: 1,
            fields: [f({ name: "the_field", type: "url" })],
          },
        ],
      } as any,
    });

    expect(row.getField("the_field")).toBe(url);
  });
});
