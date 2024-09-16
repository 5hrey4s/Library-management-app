import { defineConfig } from "drizzle-kit";
import { Appenv } from "./read-env";

export default defineConfig({
  schema:
    "/home/shreyas/cc-5/cc5-ds-algorithms/library-management-app/library/drizzle/schema.ts",
  out: "/home/shreyas/cc-5/cc5-ds-algorithms/library-management-app/library/drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: Appenv.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
