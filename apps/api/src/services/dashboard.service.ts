import { and, desc, gte, lt, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";
import { formatDateKey } from "../utils/formatDate.js";
import type { DateRange } from "../schemas/dateRange.js";
import { getDateRange } from "../utils/getDateRange.js";

export const getDashboard = async (range: DateRange) => {
  const { startDate, endDate } = getDateRange(range);
  const result = await db
    .select({
      income: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END),0)`,
      expenses: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END),0)`,
    })
    .from(transactions)
    .where(and(gte(transactions.createdAt, startDate), lt(transactions.createdAt, endDate)));

  const incomeExpenseByDay = await db
    .select({
      date: sql<string>`DATE_TRUNC('day' , ${transactions.createdAt})`,
      income: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`,
      expense: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`,
    })
    .from(transactions)
    .where(and(gte(transactions.createdAt, startDate), lt(transactions.createdAt, endDate)))
    .groupBy(sql`DATE_TRUNC('day', ${transactions.createdAt})`)
    .orderBy(sql`DATE_TRUNC('day' , ${transactions.createdAt})`);

  const { expenses, income } = result[0];

  const incomeNumber = Number(income);
  const expenseNumber = Number(expenses);

  const dailyDate = incomeExpenseByDay.map((item) => ({
    date: item.date.slice(0, 10),
    income: Number(item.income),
    expense: Number(item.expense),
  }));

  const dailyDateMap = new Map(dailyDate.map((item) => [item.date, item]));

  const completeDailyDate = [];
  for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
    const dateKey = formatDateKey(date);
    const data = dailyDateMap.get(dateKey);

    completeDailyDate.push({
      date: dateKey,
      income: data?.income ?? 0,
      expense: data?.expense ?? 0,
    });
  }

  const recentTransactions = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(5);

  return { summary: { expenses: expenseNumber, income: incomeNumber, balance: incomeNumber - expenseNumber }, dailyData: completeDailyDate, recentTransactions };
};
