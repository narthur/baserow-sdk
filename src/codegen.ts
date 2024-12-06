import { BaserowSdk, ListFieldsResponse } from "./index.js";
import fs from "fs";
import makeFullRawType from "./codegen/makeFullRawType.js";
import makeFullInputType from "./codegen/makeFullInputType.js";
import makeModelMethods from "./codegen/makeModelMethods.js";
import path from "path";
import { getConfig } from "./getConfig.js";
import makeRepositoryMethods from "./codegen/makeRepositoryMethods.js";
import makeFullParsedType from "./codegen/makeFullParsedType.js";

export type Table = { id: number; name: string; fields: ListFieldsResponse };

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default async function main({
  isDev = false,
}: {
  isDev: boolean;
}): Promise<void> {
  const config = getConfig();

  const outDir = config.config
    ? path.join(path.dirname(config.config), config.outDir)
    : config.outDir;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sdk = new BaserowSdk(String(config.databaseToken));

  const tables: Table[] = await Promise.all(
    Object.entries(config.tables).map(async ([name, id]) => {
      return {
        name,
        id,
        fields: await sdk.listFields(id),
      };
    }),
  );

  fs.writeFileSync(`${outDir}/tables.json`, JSON.stringify(tables, null, 2));

  tables.map((table) => {
    if (isDev) console.dir(table, { depth: null });
    const tableName = table.name;
    const fields = table.fields;
    const foreignTables = fields
      .filter((f) => !!f.link_row_table_id && f.link_row_table_id !== table.id)
      .map((f) => tables.find((table) => table.id === f.link_row_table_id))
      .filter((t) => !!t);

    const modelImports = isDev
      ? `import { BaserowSdk, Row, FieldValue } from '${__dirname}/index.js'`
      : "import { BaserowSdk, Row, FieldValue } from 'baserow-sdk'";
    const typeDef = `export type ${tableName}RowType = ${makeFullRawType(fields)}
export type ${tableName}ParsedType = ${makeFullParsedType(fields, tables)}
export type ${tableName}InputType = ${makeFullInputType(fields, tables)}

${modelImports}
import { Repository } from "./Repository.js";
${foreignTables
  .map((t) => {
    return `import { ${t?.name}Row } from "./${t?.name}.js";`;
  })
  .join("\n")}

export class ${tableName}Row extends Row<${tableName}RowType, ${tableName}ParsedType, Repository> {
  protected repository: Repository;
  constructor(options: {
    tableId: number;
    rowId: number;
    row: ${tableName}RowType;
    sdk: BaserowSdk;
    repository: Repository;
  }) {
    super(options);
    this.repository = options.repository;
  }
${makeModelMethods(table.id, tables)}
}`;

    fs.writeFileSync(`${outDir}/${tableName}.ts`, typeDef);
  });

  const factoryImport = isDev
    ? `import { Factory } from '${__dirname}/factory.js'`
    : "import { Factory } from 'baserow-sdk'";

  const indexImports = isDev
    ? `import { ListRowsOptions, GetRowOptions } from '${__dirname}/index.js'`
    : `import { ListRowsOptions, GetRowOptions } from 'baserow-sdk'`;

  const factoryCode = `${factoryImport}
${indexImports}
${Object.keys(config.tables)
  .map(
    (tableName) =>
      `import { ${tableName}Row, ${tableName}RowType } from './${tableName}.js';`,
  )
  .join("\n")}

export class Repository extends Factory {
${makeRepositoryMethods(tables)}
}`;

  fs.writeFileSync(`${outDir}/Repository.ts`, factoryCode);
}
