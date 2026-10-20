import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { budgets } from "../db/schema/budgets.js";
import type { CreateBudget } from "../schemas/budgets.js";
import { transactions } from "../db/schema/transactions.js";
import { getMonthDateRange } from "../utils/getMonthDateRange.js";

export type CreateBudgetResult =
  | {
      success: true;
      budget: typeof budgets.$inferSelect;
    }
  | {
      success: false;
      reason: "BUDGET_ALREADY_EXISTS";
    }
  | {
      success: false;
      reason: "BUDGET_EXCEEDS_INCOME";
      budgetAmount: number;
      monthlyIncome: number;
    };

export type GetMonthlyBudgetResult =
  | {
      success: true;
      budget: typeof budgets.$inferSelect;
      spent: number;
      remaining: number;
      percentageUsed: number;
    }
  | {
      success: false;
      reason: "BUDGET_NOT_FOUND";
    };

export const getMonthlyBudgetResult = async (userId: string, year: number, month: number): Promise<GetMonthlyBudgetResult> => {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.year, year), eq(budgets.month, month)))
    .limit(1);

  if (!budget) {
    return {
      success: false,
      reason: "BUDGET_NOT_FOUND",
    };
  }

  const { endDate, startDate } = getMonthDateRange(year, month);

  const [expenseResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${transactions.amount}) , 0)`,
    })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), eq(transactions.type, "expense"), gte(transactions.createdAt, startDate), lt(transactions.createdAt, endDate)));

  const spent = Number(expenseResult.total);
  const remaining = budget.amount - spent;
  const percentageUsed = (spent / budget.amount) * 100;

  return {
    success: true,
    budget,
    spent,
    remaining,
    percentageUsed: Number(percentageUsed.toFixed(2)),
  };
};

export const createBudget = async (userId: string, data: CreateBudget, confirmIncomeMismatch = false): Promise<CreateBudgetResult> => {
  const existingBudget = await db
    .select({ id: budgets.id })
    .from(budgets)
    .where(and(eq(budgets.userId, userId), eq(budgets.year, data.year), eq(budgets.month, data.month)))
    .limit(1);

  if (existingBudget.length > 0) {
    return {
      success: false,
      reason: "BUDGET_ALREADY_EXISTS",
    };
  }

  const { endDate, startDate } = getMonthDateRange(data.year, data.month);

  const [incomeResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), eq(transactions.type, "income"), gte(transactions.createdAt, startDate), lt(transactions.createdAt, endDate)));

  const monthlyIncome = Number(incomeResult.total);

  if (data.amount > monthlyIncome && !confirmIncomeMismatch) {
    return {
      success: false,
      reason: "BUDGET_EXCEEDS_INCOME",
      budgetAmount: data.amount,
      monthlyIncome,
    };
  }

  try {
    const [budget] = await db
      .insert(budgets)
      .values({
        userId,
        name: data.name,
        amount: data.amount,
        year: data.year,
        month: data.month,
      })
      .returning();

    return {
      success: true,
      budget,
    };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return {
        success: false,
        reason: "BUDGET_ALREADY_EXISTS",
      };
    }
    throw error;
  }
};
