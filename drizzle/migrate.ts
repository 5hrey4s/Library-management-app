import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import { Appenv } from "@/read-env";

async function main() {
  const migrateClient = mysql.createPool(Appenv.DATABASE_URL);
  const db = drizzle(migrateClient);
  await migrate(db, {
    migrationsFolder:
      "/home/shreyas/cc-5/cc5-ds-algorithms/Library-management/Library-Management-System/src/drizzle/migrations",
  });
  await migrateClient.end();
}

main();
