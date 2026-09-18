import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";
import type { Transaction } from "../types/transaction.js";
import { categories } from "../db/schema/categories.js";

export const getTransactions = async (page: number, limit: number, type: Transaction["type"] | "all", userId: string) => {
  const offset = (page - 1) * limit;

  const whereCondition = type === "all" ? eq(transactions.userId, userId) : and(eq(transactions.type, type), eq(transactions.userId, userId));

  const data = await db
    .select({
      id: transactions.id,
      title: transactions.title,
      type: transactions.type,
      amount: transactions.amount,
      categoryId: transactions.categoryId,
      createdAt: transactions.createdAt,
      category: {
        id: categories.id,
        name: categories.name,
        icon: categories.icon,
        color: categories.color,
      },
    })
    .from(transactions)
    .innerJoin(categories, and(eq(transactions.categoryId, categories.id), eq(categories.userId, userId)))
    .where(whereCondition)
    .orderBy(desc(transactions.createdAt))
    .limit(limit)
    .offset(offset);
  const res = await db.select({ count: count() }).from(transactions).where(whereCondition);

  const total = res[0].count;
  const totalPages = Math.ceil(total / limit);

  return { data, pagination: { page, limit, total, totalPages } };
};

export const getTransactionById = async (id: string, userId: string) => {
  const result = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
  return result[0];
};

export const createTransaction = async (data: Transaction, userId: string) => {
  const category = await db
    .select()
    .from(categories)
    .where(and(eq(categories.userId, userId), eq(categories.id, data.categoryId)));
  if (!category[0]) {
    return null;
  }
  const result = await db
    .insert(transactions)
    .values({
      ...data,
      userId,
    })
    .returning();
  return result[0];
};

export const updateTransaction = async (data: Partial<Transaction>, id: string, userId: string) => {
  const result = await db
    .update(transactions)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();
  return result[0];
};

export const deleteTransaction = async (id: string) => {
  const result = await db.delete(transactions).where(eq(transactions.id, id)).returning();
  return result[0];
};
