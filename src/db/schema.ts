import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  name: varchar({ length: 255 }).notNull().primaryKey(),
  code: varchar({ length: 255 }).notNull().unique(),
});

export const dumpTable = pgTable("dump", {
  id: uuid().defaultRandom().primaryKey(),
  content: text().notNull(),
  codes: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().defaultNow(),
});
