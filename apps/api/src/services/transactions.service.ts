import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";
import type { Transaction } from "../types/transaction.js";

export const getTransactions = async (page: number, limit: number, type: Transaction["type"] | "all", userId: string) => {
  const offset = (page - 1) * limit;

  const whereCondition = type === "all" ? eq(transactions.userId, userId) : and(eq(transactions.type, type), eq(transactions.userId, userId));

  const data = await db.select().from(transactions).where(whereCondition).orderBy(desc(transactions.createdAt)).limit(limit).offset(offset);
  const res = await db.select({ count: count() }).from(transactions).where(whereCondition);

  const total = res[0].count;
  const totalPages = Math.ceil(total / limit);

  return { data, pagination: { page, limit, total, totalPages } };
};

export const getTransactionById = async (id: string) => {
  const result = await db.select().from(transactions).where(eq(transactions.id, id));
  return result[0];
};

export const createTransaction = async (data: Transaction) => {
  const result = await db
    .insert(transactions)
    .values({
      title: data.title,
      amount: data.amount,
      category: data.category,
      type: data.type,
    })
    .returning();
  return result[0];
};

export const updateTransaction = async (data: Partial<Transaction>, id: string) => {
  const result = await db
    .update(transactions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(transactions.id, id))
    .returning();
  return result[0];
};

export const deleteTransaction = async (id: string) => {
  const result = await db.delete(transactions).where(eq(transactions.id, id)).returning();
  return result[0];
};
