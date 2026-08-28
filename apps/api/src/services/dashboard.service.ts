import { desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";

export const getRecentTransactions = async () => {
  const result = db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(5);
  return result;
};
