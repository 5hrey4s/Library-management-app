// import { defineConfig } from "drizzle-kit";
// import { Appenv } from "./read-env";

// export default defineConfig({
//   schema:
//     "/home/shreyas/cc-5/cc5-ds-algorithms/library-management-app/library/drizzle/schema.ts",
//   out: "/home/shreyas/cc-5/cc5-ds-algorithms/library-management-app/library/drizzle/migrations",
//   dialect: "mysql",
//   dbCredentials: {
//     url: Appenv.POSTGRES_URL,
//   },
//   verbose: true,
//   strict: true,
// });

import "@/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";
import { Appenv } from "./read-env";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Appenv.POSTGRES_URL,
  },
});