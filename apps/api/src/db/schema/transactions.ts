import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  amount: integer("amount").notNull(),
  category: varchar("category", { length: 150 }).notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
