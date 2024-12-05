import { vi } from "vitest";

vi.mock("./src/client");
vi.mock("./src/getConfig", () => ({
  getConfig: vi.fn(() => ({
    url: "the_baserow_url",
    tables: {},
    databaseToken: "the_database_token",
    outDir: "the_out_dir",
    config: "the_config",
  })),
}));
vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(() => "{}"),
  },
}));
