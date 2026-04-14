import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  pgEnum,
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

export const taskPriority = pgEnum("priority", ["low", "routine", "high"]);

export const taskTable = pgTable("task", {
  id: uuid().defaultRandom().primaryKey(),
  content: text().notNull(),
  priority: taskPriority().notNull().default("low"),
  codes: varchar({ length: 255 }).notNull().unique(),
  extraContext: text(),
  createdAt: timestamp().defaultNow(),
});
