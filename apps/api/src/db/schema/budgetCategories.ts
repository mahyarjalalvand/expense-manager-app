import { integer, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { budgets } from "./budgets.js";
import { categories } from "./categories.js";

export const bugetCategories = pgTable(
  "budget_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    budgetId: uuid("budget_id")
      .notNull()
      .references(() => budgets.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique("budget_categories_budget_category_unique").on(table.budgetId, table.categoryId)],
);
