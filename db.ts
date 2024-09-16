"use server";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { Appenv } from "./read-env";
const pool = mysql.createPool(Appenv.DATABASE_URL);
const db = drizzle(pool);
