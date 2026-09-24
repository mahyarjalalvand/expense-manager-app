import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { categories } from "../db/schema/categories.js";
import type { CreateCategory, UpdateCategory } from "../schemas/categories.js";
import { transactions } from "../db/schema/transactions.js";
import { CategoryInUseError } from "../errors/category.js";

export const getCategories = async (userId: string) => {
  return db.select().from(categories).where(eq(categories.userId, userId));
};

export const createCategory = async (userId: string, data: CreateCategory) => {
  const result = await db.insert(categories).values({ userId, name: data.name, icon: data.icon, color: data.color }).returning();
  return result[0];
};

export const updateCategory = async (userId: string, categoryId: string, data: UpdateCategory) => {
  const result = await db
    .update(categories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .returning();

  return result[0];
};

export const deleteCategory = async (categoryId: string, userId: string) => {
  const transaction = await db.select({ id: transactions.id }).from(transactions).where(eq(transactions.categoryId, categoryId));
  if (transaction.length > 0) {
    throw new CategoryInUseError();
  }
  const result = await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .returning();
  return result[0];
};
