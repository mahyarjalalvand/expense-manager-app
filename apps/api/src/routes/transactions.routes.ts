import { Hono } from "hono";
import type { Transaction } from "../types/transaction.js";
import { db } from "../db/index.js";
import { transactions } from "../db/schema/transactions.js";
import { eq } from "drizzle-orm";

const transactionsRoutes = new Hono();

transactionsRoutes.get("/", async (c) => {
  const result = await db.select().from(transactions);
  return c.json(result);
});

transactionsRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(transactions).where(eq(transactions.id, id));

  const transaction = result[0];
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  return c.json(transaction);
});

transactionsRoutes.post("/", async (c) => {
  const body = await c.req.json<Transaction>();

  const result = await db
    .insert(transactions)
    .values({
      title: body.title,
      amount: body.amount,
      category: body.category,
      type: body.type,
    })
    .returning();

  return c.json(result[0], 201);
});

transactionsRoutes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Partial<Transaction>>();

  const result = await db
    .update(transactions)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(transactions.id, id))
    .returning();
  const transaction = result[0];
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }

  return c.json(transaction);
});

transactionsRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.delete(transactions).where(eq(transactions.id, id)).returning();
  const transaction = result[0];
  if (!transaction) {
    return c.json({ message: "Transaction not found" }, 404);
  }
  return c.json(transaction);
});

export default transactionsRoutes;
