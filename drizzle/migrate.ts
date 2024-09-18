// import mysql from "mysql2/promise";
// import { migrate } from "drizzle-orm/mysql2/migrator";
// // import { drizzle } from "drizzle-orm/mysql2";
// import { Appenv } from "@/read-env";
// import "@/drizzle/envConfig";
// import { drizzle } from "drizzle-orm/vercel-postgres";
// import { sql } from "@vercel/postgres";
// import * as schema from "./schema";
// export const db = drizzle(sql, { schema });

// async function main() {
//   const migrateClient = mysql.createPool(Appenv.DATABASE_URL);

//   await migrate(db, {
//     migrationsFolder:
//       "/home/shreyas/cc-5/cc5-ds-algorithms/Library-management/Library-Management-System/src/drizzle/migrations",
//   });
//   await migrateClient.end();
// }

// main();
