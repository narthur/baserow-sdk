import rc from "rc";
import { BaserowSdk } from "./index.js";
import z from "zod";
import fs from "fs";
import makeType from "./codegen/makeType.js";
import makeClassMethods from "./codegen/makeClassMethods.js";

export default async function main(): Promise<void> {
  const raw = rc("baserow");
  const config = z
    .object({
      url: z.string(),
      tables: z.record(z.string(), z.number()),
      databaseToken: z.string(),
    })
    .parse(raw);

  console.log("Hello from codegen.ts");
  console.dir(config);

  if (!config.databaseToken) {
    throw new Error("Missing databaseToken in .baserowrc");
  }

  if (!fs.existsSync("./__generated__")) {
    fs.mkdirSync("./__generated__");
  }

  const sdk = new BaserowSdk(String(config.databaseToken));

  await Promise.all(
    Object.entries(config.tables).map(async ([tableName, tableId]) => {
      const fields = await sdk.listFields(tableId);
      console.log(tableName);
      console.log(tableId);
      console.log(fields);

      //TODO: this may not be correct for all generated files
      const typeDef = `export type ${tableName}RowType = ${makeType(fields)}

import { Base } from "../src/base.ts";

export class ${tableName}Row extends Base<${tableName}RowType> {
  ${makeClassMethods(fields)}
}`;

      fs.writeFileSync(`./__generated__/${tableName}.ts`, typeDef);
    }),
  );

  // console.dir(tables);
}
