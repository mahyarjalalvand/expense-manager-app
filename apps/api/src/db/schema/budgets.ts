import { integer, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    amount: integer("amount").notNull(),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique("budgets_user_year_month_unique").on(table.userId, table.year, table.month)],
);
