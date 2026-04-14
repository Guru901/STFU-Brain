import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  name: varchar({ length: 255 }).notNull().primaryKey(),
  code: varchar({ length: 255 }).notNull().unique(),
});
