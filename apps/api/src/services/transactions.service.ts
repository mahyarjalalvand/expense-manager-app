import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";

export const getTransactions = async () => {
  return db.select().from(transactions);
};

export const getTransactionById = async (id: string) => {
  const result = await db.select().from(transactions).where(eq(transactions.id, id));
  return result[0];
};
