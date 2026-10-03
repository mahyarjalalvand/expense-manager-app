import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";
import type { Transaction } from "../types/transaction.js";
import { categories } from "../db/schema/categories.js";

const getUserBalance = async (userId: string) => {
  const result = await db
    .select({
      income: sql<number>`
    COALESCE(
      SUM(
        CASE
          WHEN ${transactions.type} = 'income'
          THEN ${transactions.amount}
          ELSE 0
        END
      ),
      0
    )
  `,
      expenses: sql<number>`
      COALESCE(
        SUM(
          CASE
            WHEN ${transactions.type} = 'expense'
            THEN ${transactions.amount}
            ELSE 0
          END
        ),
        0
      )
    `,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId));
  const income = Number(result[0].income);
  const expense = Number(result[0].expenses);
  return income - expense;
};

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
    return {
      success: false as const,
      reason: "CATEGORY_NOT_FOUND" as const,
    };
  }
  if (data.type === "expense") {
    const balance = await getUserBalance(userId);
    if (data.amount > balance) {
      return {
        success: false as const,
        reason: "INSUFFICIENT_BALANCE" as const,
      };
    }
  }

  const result = await db
    .insert(transactions)
    .values({
      ...data,
      userId,
    })
    .returning();
  return {
    success: true as const,
    transaction: result[0],
  };
};

export const updateTransaction = async (data: Partial<Transaction>, id: string, userId: string) => {
  const currentTransaction = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));

  if (!currentTransaction[0]) {
    return {
      success: false as const,
      reason: "TRANSACTION_NOT_FOUND" as const,
    };
  }
  const current = currentTransaction[0];

  const newType = data.type ?? current.type;
  const newAmount = data.amount ?? current.amount;

  if (newType === "expense") {
    const balance = await getUserBalance(userId);

    const availabelBalance = current.type === "expense" ? balance + current.amount : balance;

    if (newAmount > availabelBalance) {
      return {
        success: false as const,
        reason: "INSUFFICIENT_BALANCE" as const,
      };
    }
  }

  const result = await db
    .update(transactions)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();
  return {
    success: true as const,
    transactions: result[0],
  };
};

export const deleteTransaction = async (id: string, userId: string) => {
  const result = await db
    .delete(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
    .returning();
  return result[0];
};
